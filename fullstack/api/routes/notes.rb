class FocusTubeAPI < Sinatra::Base
  get '/api/notes' do
    protected!
    notes = current_user.notes_dataset
                        .join(:videos, id: :video_id)
                        .select(Sequel[:notes].*, :youtube_id)
                        .order(Sequel.desc(Sequel[:notes][:created_at]))
                        .all
    json_response(data: notes.map(&:values))
  end

  post '/api/notes' do
    protected!
    # Support both JSON body and form data
    data = if request.content_type == 'application/json'
             JSON.parse(request.body.read)
           else
             params
           end

    note = Note.new(
      user_id: current_user.id,
      video_id: data['video_id'],
      content: data['content'],
      timestamp_seconds: data['timestamp_seconds'].to_i
    )

    if note.valid?
      note.save
      
      # Initialize review for the note
      Review.create(
        note_id: note.id,
        user_id: current_user.id,
        next_review_at: (Time.now + 86400) # tomorrow
      )
      
      json_response(data: note.values, status: 201)
    else
      halt 400, json_response(error: { code: 'validation_error', details: note.errors.full_messages }, status: 400)
    end
  end

  patch '/api/notes/:id' do
    protected!
    note = current_user.notes_dataset.where(id: params[:id]).first
    halt 404 unless note
    
    data = if request.content_type == 'application/json'
             JSON.parse(request.body.read)
           else
             params
           end
           
    note.update(content: data['content']) if data['content']
    json_response(data: note.values)
  end

  delete '/api/notes/:id' do
    protected!
    note = current_user.notes_dataset.where(id: params[:id]).first
    halt 404 unless note
    
    note.destroy
    json_response(data: { message: 'Note deleted' })
  end
end
