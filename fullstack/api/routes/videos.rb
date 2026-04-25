class FocusTubeAPI < Sinatra::Base
  get '/api/videos' do
    protected!
    videos = current_user.videos_dataset.order(Sequel.desc(:created_at)).all
    json_response(data: videos.map(&:values))
  end

  post '/api/videos/import' do
    protected!
    url = params[:youtube_url]
    video_id = YoutubeMetadataService.parse_id(url)
    
    unless video_id
      halt 400, json_response(error: { code: 'invalid_url', message: 'Invalid YouTube URL' }, status: 400)
    end

    # Check if already imported
    video = Video.find(user_id: current_user.id, youtube_id: video_id)
    
    unless video
      metadata = YoutubeMetadataService.fetch(video_id)
      video = Video.create(
        user_id: current_user.id,
        youtube_id: video_id,
        title: metadata[:title],
        thumbnail_url: metadata[:thumbnail_url],
        duration_seconds: metadata[:duration],
        channel_name: metadata[:channel_name]
      )
    end

    json_response(data: video.values, status: 201)
  end

  get '/api/videos/:id' do
    protected!
    video = current_user.videos_dataset.where(id: params[:id]).first
    halt 404 unless video
    
    notes = video.notes_dataset.order(:timestamp_seconds).all
    json_response(data: {
      video: video.values,
      notes: notes.map(&:values)
    })
  end

  delete '/api/videos/:id' do
    protected!
    video = current_user.videos_dataset.where(id: params[:id]).first
    halt 404 unless video
    
    video.destroy
    json_response(data: { message: 'Video deleted' })
  end
end
