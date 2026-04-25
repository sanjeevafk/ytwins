require 'omniauth-google-oauth2'

class FocusTubeAPI < Sinatra::Base
  use OmniAuth::Builder do
    provider :google_oauth2, ENV['GOOGLE_CLIENT_ID'], ENV['GOOGLE_CLIENT_SECRET']
  end

  get '/auth/google' do
    redirect '/auth/google_oauth2'
  end

  get '/auth/failure' do
    json_response(error: { code: 'auth_failed', message: params[:message] }, status: 401)
  end

  get '/auth/google_oauth2/callback' do
    auth = request.env['omniauth.auth']
    user_info = auth.info
    
    user = User.find_or_create(google_id: auth.uid) do |u|
      u.email = user_info.email
      u.name = user_info.name
      u.avatar_url = user_info.image
    end

    # Update info if user already existed
    user.update(
      name: user_info.name,
      email: user_info.email,
      avatar_url: user_info.image
    )
    
    session[:user_id] = user.id
    
    # Redirect to frontend app
    redirect "#{ENV['FRONTEND_URL'] || 'http://localhost:3000'}/app"
  end

  get '/api/me' do
    protected!
    json_response(data: current_user.values)
  end

  get '/api/logout' do
    session.clear
    json_response(data: { message: 'Logged out successfully' })
  end
end
