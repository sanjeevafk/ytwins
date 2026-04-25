require 'sinatra/base'
require 'sinatra/reloader'
require 'sequel'
require 'omniauth-google-oauth2'
require 'dotenv/load'
require 'libsql'

class FocusTube < Sinatra::Base
  configure :development do
    register Sinatra::Reloader
  end

  configure do
    set :sessions, true
    set :session_secret, ENV['SESSION_SECRET'] || 'development_secret'
    set :erb, escape_html: true
    set :views, File.join(File.dirname(__FILE__), 'views')
    set :public_folder, File.join(File.dirname(__FILE__), 'public')
    
    use Rack::Protection, session_key: 'focus_tube_session'
    OmniAuth.config.allowed_request_methods = [:post, :get]
    OmniAuth.config.silence_get_warning = true
  end

  use OmniAuth::Builder do
    provider :google_oauth2, ENV['GOOGLE_CLIENT_ID'], ENV['GOOGLE_CLIENT_SECRET']
  end

  # DB connection
  def self.db
    @db ||= begin
      url = ENV['DATABASE_URL'] || 'sqlite://local.db'
      # For Sequel, libsql URL might need adjustment or a specific adapter
      # For now, we use the sqlite adapter
      Sequel.connect(url)
    end
  end

  def db
    self.class.db
  end

  get '/' do
    erb :index
  end

  get '/auth/google' do
    redirect '/auth/google_oauth2'
  end

  get '/auth/failure' do
    "Authentication failed: #{params[:message]}"
  end

  get '/auth/google_oauth2/callback' do
    auth = request.env['omniauth.auth']
    user_info = auth.info
    
    # Find or create user
    user = db[:users].where(google_id: auth.uid).first
    if user
      db[:users].where(id: user[:id]).update(
        name: user_info.name,
        email: user_info.email,
        avatar_url: user_info.image
      )
      user_id = user[:id]
    else
      user_id = db[:users].insert(
        google_id: auth.uid,
        name: user_info.name,
        email: user_info.email,
        avatar_url: user_info.image
      )
    end
    
    session[:user_id] = user_id
    redirect '/dashboard'
  end

  get '/logout' do
    session.clear
    redirect '/'
  end

  get '/dashboard' do
    protected!
    @user = current_user
    @videos = db[:videos].where(user_id: @user[:id]).order(Sequel.desc(:created_at)).all
    @collections = db[:collections].where(user_id: @user[:id]).all
    @due_count = db[:reviews].where(user_id: @user[:id]).where { next_review_at <= Time.now }.count
    erb :dashboard
  end

  post '/videos/import' do
    protected!
    url = params[:youtube_url]
    video_id = parse_youtube_id(url)
    
    unless video_id
      flash_error("Invalid YouTube URL")
      redirect '/dashboard'
    end

    # Check if already imported
    existing = db[:videos].where(user_id: session[:user_id], youtube_id: video_id).first
    if existing
      redirect "/videos/#{existing[:id]}"
    end

    # Fetch metadata
    metadata = fetch_youtube_metadata(video_id)
    
    video_id_db = db[:videos].insert(
      user_id: session[:user_id],
      youtube_id: video_id,
      title: metadata[:title],
      thumbnail_url: metadata[:thumbnail_url],
      duration_seconds: metadata[:duration],
      channel_name: metadata[:channel_name]
    )

    redirect "/videos/#{video_id_db}"
  end

  get '/videos/:id' do
    protected!
    @video = db[:videos].where(id: params[:id], user_id: session[:user_id]).first
    unless @video
      redirect '/dashboard'
    end
    @notes = db[:notes].where(video_id: @video[:id]).order(:timestamp_seconds).all
    @collections = db[:collections].where(user_id: session[:user_id]).all
    erb :watch
  end

  get '/collections' do
    protected!
    @collections = db[:collections].where(user_id: session[:user_id]).order(Sequel.desc(:created_at)).all
    erb :collections
  end

  post '/collections' do
    protected!
    db[:collections].insert(
      user_id: session[:user_id],
      name: params[:name]
    )
    redirect '/collections'
  end

  get '/collections/:id' do
    protected!
    @collection = db[:collections].where(id: params[:id], user_id: session[:user_id]).first
    unless @collection
      redirect '/dashboard'
    end
    @videos = db[:videos].where(id: db[:collection_videos].where(collection_id: @collection[:id]).select(:video_id)).all
    erb :collection_view
  end

  post '/collections/add_to_any' do
    protected!
    # Check if already in collection
    existing = db[:collection_videos].where(collection_id: params[:collection_id], video_id: params[:video_id]).first
    unless existing
      db[:collection_videos].insert(
        collection_id: params[:collection_id],
        video_id: params[:video_id]
      )
    end
    redirect "/videos/#{params[:video_id]}"
  end

  post '/notes' do
    protected!
    data = JSON.parse(request.body.read)
    
    note_id = db[:notes].insert(
      user_id: session[:user_id],
      video_id: data['video_id'],
      content: data['content'],
      timestamp_seconds: data['timestamp_seconds']
    )

    # Initialize review for the note
    db[:reviews].insert(
      note_id: note_id,
      user_id: session[:user_id],
      next_review_at: (Time.now + 86400).to_datetime # tomorrow
    )

    content_type :json
    { id: note_id, content: data['content'], timestamp_seconds: data['timestamp_seconds'].to_i }.to_json
  end

  get '/review' do
    protected!
    @due_reviews = db[:reviews].join(:notes, id: :note_id)
                             .where(Sequel[:reviews][:user_id] => session[:user_id])
                             .where { next_review_at <= Time.now }
                             .select(Sequel[:notes][:id], :content, :timestamp_seconds, :video_id, Sequel[:reviews][:id].as(:review_id))
                             .all
    
    if @due_reviews.empty?
      erb :review_empty
    else
      @current_review = @due_reviews.first
      @total_due = @due_reviews.count
      erb :review
    end
  end

  post '/review/:id' do
    protected!
    review = db[:reviews].where(id: params[:id], user_id: session[:user_id]).first
    unless review
      redirect '/dashboard'
    end

    quality = params[:quality].to_i # 1-5
    
    # SM-2 Simplified Algorithm
    ease = review[:ease_factor]
    interval = review[:interval_days]
    reps = review[:repetitions]

    if quality >= 3
      if reps == 0
        interval = 1
      elsif reps == 1
        interval = 6
      else
        interval = (interval * ease).round
      end
      reps += 1
      ease = ease + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
    else
      reps = 0
      interval = 1
      ease = [1.3, ease - 0.2].max
    end

    ease = [1.3, ease].max

    db[:reviews].where(id: review[:id]).update(
      ease_factor: ease,
      interval_days: interval,
      repetitions: reps,
      next_review_at: (Time.now + (interval * 86400)).to_datetime,
      last_reviewed_at: Time.now.to_datetime
    )

    redirect '/review'
  end

  # Helper for protected routes
  helpers do
    def protected!
      return if session[:user_id]
      redirect '/'
    end

    def current_user
      @current_user ||= db[:users].where(id: session[:user_id]).first if session[:user_id]
    end

    def format_timestamp(seconds)
      h = seconds / 3600
      m = (seconds % 3600) / 60
      s = seconds % 60
      if h > 0
        sprintf("%02d:%02d:%02d", h, m, s)
      else
        sprintf("%02d:%02d", m, s)
      end
    end

    def parse_youtube_id(url)
      regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
      match = url.match(regex)
      match[1] if match
    end

    def fetch_youtube_metadata(video_id)
      # For now, using OEmbed for basic info without API key
      # In a real app, use YouTube Data API with ENV['YOUTUBE_API_KEY']
      require 'net/http'
      require 'json'
      
      begin
        uri = URI("https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=#{video_id}&format=json")
        response = Net::HTTP.get(uri)
        data = JSON.parse(response)
        {
          title: data['title'],
          thumbnail_url: data['thumbnail_url'],
          channel_name: data['author_name'],
          duration: 0 # OEmbed doesn't provide duration, would need Data API for this
        }
      rescue
        {
          title: "Unknown Video",
          thumbnail_url: "https://img.youtube.com/vi/#{video_id}/maxresdefault.jpg",
          channel_name: "Unknown Channel",
          duration: 0
        }
      end
    end

    def flash_error(msg)
      # Simple flash implementation could be added here
    end
  end
end
