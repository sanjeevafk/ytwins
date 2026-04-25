require 'net/http'
require 'json'

class YoutubeMetadataService
  def self.fetch(video_id)
    begin
      uri = URI("https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=#{video_id}&format=json")
      response = Net::HTTP.get(uri)
      data = JSON.parse(response)
      {
        title: data['title'],
        thumbnail_url: data['thumbnail_url'],
        channel_name: data['author_name'],
        duration: 0 # OEmbed doesn't provide duration
      }
    rescue => e
      puts "Error fetching YouTube metadata: #{e.message}"
      {
        title: "Unknown Video",
        thumbnail_url: "https://img.youtube.com/vi/#{video_id}/maxresdefault.jpg",
        channel_name: "Unknown Channel",
        duration: 0
      }
    end
  end

  def self.parse_id(url)
    regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    match = url.match(regex)
    match[1] if match
  end
end
