require 'net/http'
require 'json'

class YoutubeApiService
  API_BASE = "https://www.googleapis.com/youtube/v3"

  def self.fetch_playlist_videos(url, user = nil)
    api_key = ENV['YOUTUBE_API_KEY']
    return { error: 'YouTube API key is not configured' } unless api_key

    playlist_id = extract_playlist_id(url)
    if playlist_id
      videos_data = fetch_all_playlist_items(playlist_id, api_key)
      if user
        db_videos = videos_data.map do |v|
          video = Video.find_or_create(user_id: user.id, youtube_id: v[:id]) do |rv|
            rv.title = v[:title]
          end
          video.values.merge(id: video.youtube_id, db_id: video.id)
        end
        return { videos: db_videos }
      end
      return { videos: videos_data }
    end

    video_id = extract_video_id(url)
    if video_id
      video_data = fetch_video_details(video_id, api_key)
      if user
        video = Video.find_or_create(user_id: user.id, youtube_id: video_data[:id]) do |rv|
          rv.title = video_data[:title]
        end
        return { videos: [video.values.merge(id: video.youtube_id, db_id: video.id)] }
      end
      return { videos: [video_data] }
    end

    { error: 'Invalid YouTube URL' }
  end

  private

  def self.extract_playlist_id(url)
    patterns = [
      /[?&]list=([a-zA-Z0-9_-]+)/,
      /youtube\.com\/playlist\?list=([a-zA-Z0-9_-]+)/,
    ]
    patterns.each do |pattern|
      match = url.match(pattern)
      return match[1] if match
    end
    nil
  end

  def self.extract_video_id(url)
    patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
      /^([a-zA-Z0-9_-]{11})$/,
    ]
    patterns.each do |pattern|
      match = url.match(pattern)
      return match[1] if match
    end
    nil
  end

  def self.fetch_all_playlist_items(playlist_id, api_key)
    videos = []
    next_page_token = nil

    loop do
      params = {
        part: 'snippet',
        playlistId: playlist_id,
        maxResults: 50,
        key: api_key
      }
      params[:pageToken] = next_page_token if next_page_token

      uri = URI("#{API_BASE}/playlistItems")
      uri.query = URI.encode_www_form(params)
      
      response = Net::HTTP.get(uri)
      data = JSON.parse(response)
      
      if data['error']
        raise data['error']['message']
      end

      data['items'].each do |item|
        v_id = item.dig('snippet', 'resourceId', 'videoId')
        if v_id
          videos << {
            id: v_id,
            title: item.dig('snippet', 'title'),
            completed: false
          }
        end
      end

      next_page_token = data['nextPageToken']
      break unless next_page_token
    end

    videos
  end

  def self.fetch_video_details(video_id, api_key)
    params = {
      part: 'snippet',
      id: video_id,
      key: api_key
    }

    uri = URI("#{API_BASE}/videos")
    uri.query = URI.encode_www_form(params)
    
    response = Net::HTTP.get(uri)
    data = JSON.parse(response)
    
    if data['error']
      raise data['error']['message']
    end

    video = data['items'].first
    raise 'Video not found' unless video

    {
      id: video['id'],
      title: video.dig('snippet', 'title'),
      completed: false
    }
  end
end
