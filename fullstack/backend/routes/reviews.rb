class FocusTubeAPI < Sinatra::Base
  get '/api/reviews/due' do
    protected!
    due_reviews = Review.join(:notes, id: :note_id)
                       .where(Sequel[:reviews][:user_id] => current_user.id)
                       .where { next_review_at <= Time.now }
                       .select(
                         Sequel[:notes][:id].as(:note_id), 
                         :content, 
                         :timestamp_seconds, 
                         :video_id, 
                         Sequel[:reviews][:id].as(:id),
                         :ease_factor,
                         :interval_days,
                         :repetitions
                       ).all

    json_response(data: due_reviews.map(&:values))
  end

  post '/api/reviews/:id/rate' do
    protected!
    review = current_user.reviews_dataset.where(id: params[:id]).first
    halt 404 unless review

    quality = params[:quality].to_i # 1-5
    
    updates = SpacedRepetitionService.calculate(
      quality, 
      review.ease_factor, 
      review.interval_days, 
      review.repetitions
    )

    review.update(updates.merge(last_reviewed_at: Time.now))

    json_response(data: review.values)
  end

  get '/api/reviews/stats' do
    protected!
    total = current_user.reviews_dataset.count
    due = current_user.reviews_dataset.where { next_review_at <= Time.now }.count
    
    json_response(data: {
      total_reviews: total,
      due_reviews: due,
      next_review: current_user.reviews_dataset.order(:next_review_at).first&.next_review_at
    })
  end
end
