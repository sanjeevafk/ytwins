require 'sinatra/base'
require 'dotenv/load'
require 'json'
require 'rack/cors'
require 'rack/attack'

require_relative 'db/connection'
require_relative 'models/models'
require_relative 'services/spaced_repetition_service'
require_relative 'services/youtube_metadata_service'
require_relative 'services/youtube_api_service'

class FocusTubeAPI < Sinatra::Base
  get '/api/youtube/playlist' do
    protected!
    result = YoutubeApiService.fetch_playlist_videos(params[:url], current_user)
    if result[:error]
      halt 400, json_response(error: { code: 'youtube_error', message: result[:error] }, status: 400)
    end
    json_response(data: result)
  end

  configure :development do
    require 'sinatra/reloader'
    register Sinatra::Reloader
  end

  configure do
    set :session_secret, ENV['SESSION_SECRET'] || 'development_secret'
    # Use secure HTTP-only cookies
    use Rack::Session::Cookie, 
        key: 'focustube.session',
        path: '/',
        secret: ENV['SESSION_SECRET'] || 'development_secret',
        httponly: true,
        secure: ENV['RACK_ENV'] == 'production'

    # CORS configuration - though same-domain is preferred via vercel.json
    use Rack::Cors do
      allow do
        origins 'localhost:3000', '127.0.0.1:3000'
        resource '*', headers: :any, methods: [:get, :post, :put, :delete, :options], credentials: true
      end
    end

    # Lightweight Rate Limiting
    use Rack::Attack
    Rack::Attack.throttle('req/ip', limit: 300, period: 5.minutes) do |req|
      req.ip
    end
  end

  before do
    content_type :json
  end

  # Helpers for structured JSON and auth
  helpers do
    def json_response(data: nil, meta: {}, error: nil, status: 200)
      self.status status
      {
        data: data,
        meta: meta,
        error: error
      }.compact.to_json
    end

    def current_user
      @current_user ||= User[session[:user_id]] if session[:user_id]
    end

    def protected!
      unless current_user
        halt 401, json_response(error: { code: 'unauthorized', message: 'Authentication required' }, status: 401)
      end
    end
  end

  # Error handling
  error do
    e = env['sinatra.error']
    json_response(error: { code: 'server_error', message: e.message }, status: 500)
  end

  not_found do
    json_response(error: { code: 'not_found', message: 'Resource not found' }, status: 404)
  end

  # Keep-alive for UptimeRobot
  get '/api/keep-alive' do
    json_response(data: { status: 'ok', timestamp: Time.now.to_i })
  end

  # Stats
  get '/api/stats' do
    protected!
    json_response(data: {
      total_videos: Video.where(user_id: current_user.id).count,
      completed_videos: Video.where(user_id: current_user.id, completed: true).count,
      total_notes: Note.where(user_id: current_user.id).count,
      total_collections: Collection.where(user_id: current_user.id).count
    })
  end
end

# Load routes
require_relative 'routes/auth'
require_relative 'routes/videos'
require_relative 'routes/notes'
require_relative 'routes/collections'
require_relative 'routes/reviews'

# Mount routes (if using Sinatra::Base apps) or simply define them in the main app
# For simplicity, we will define them in classes that inherit from FocusTubeAPI
