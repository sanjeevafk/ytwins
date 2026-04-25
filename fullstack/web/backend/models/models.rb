require_relative '../db/connection'

Sequel::Model.plugin :validation_helpers
Sequel::Model.db = DB.connection

class User < Sequel::Model
  one_to_many :videos
  one_to_many :notes
  one_to_many :collections
  one_to_many :reviews

  def validate
    super
    validates_presence [:google_id, :email]
    validates_unique :google_id
    validates_unique :email
  end
end

class Video < Sequel::Model
  many_to_one :user
  one_to_many :notes
  many_to_many :collections, left_key: :video_id, right_key: :collection_id, join_table: :collection_videos

  def validate
    super
    validates_presence [:user_id, :youtube_id, :title]
  end
end

class Note < Sequel::Model
  many_to_one :user
  many_to_one :video
  one_to_one :review

  def validate
    super
    validates_presence [:user_id, :video_id, :content]
  end
end

class Collection < Sequel::Model
  many_to_one :user
  many_to_many :videos, left_key: :collection_id, right_key: :video_id, join_table: :collection_videos

  def validate
    super
    validates_presence [:user_id, :name]
  end
end

class Review < Sequel::Model
  many_to_one :note
  many_to_one :user

  def validate
    super
    validates_presence [:note_id, :user_id]
  end
end
