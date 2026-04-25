class FocusTubeAPI < Sinatra::Base
  get '/api/collections' do
    protected!
    collections = current_user.collections_dataset.order(Sequel.desc(:created_at)).all
    json_response(data: collections.map(&:values))
  end

  post '/api/collections' do
    protected!
    collection = Collection.new(
      user_id: current_user.id,
      name: params[:name]
    )

    if collection.valid?
      collection.save
      json_response(data: collection.values, status: 201)
    else
      halt 400, json_response(error: { code: 'validation_error', details: collection.errors.full_messages }, status: 400)
    end
  end

  get '/api/collections/:id' do
    protected!
    collection = current_user.collections_dataset.where(id: params[:id]).first
    halt 404 unless collection
    
    videos = collection.videos
    json_response(data: {
      collection: collection.values,
      videos: videos.map(&:values)
    })
  end

  post '/api/collections/:id/add_video' do
    protected!
    collection = current_user.collections_dataset.where(id: params[:id]).first
    halt 404 unless collection
    
    video = Video[params[:video_id]]
    halt 404 unless video && video.user_id == current_user.id
    
    unless collection.videos_dataset.where(video_id: video.id).any?
      collection.add_video(video)
    end
    
    json_response(data: { message: 'Video added to collection' })
  end

  delete '/api/collections/:id' do
    protected!
    collection = current_user.collections_dataset.where(id: params[:id]).first
    halt 404 unless collection
    
    collection.destroy
    json_response(data: { message: 'Collection deleted' })
  end
end
