require 'sequel'
require 'dotenv/load'

# Use local.db for development if DATABASE_URL is not set
db_url = ENV['DATABASE_URL'] || 'sqlite://local.db'
DB = Sequel.connect(db_url)

DB.create_table? :users do
  primary_key :id
  String :google_id, unique: true, null: false
  String :name
  String :email, unique: true, null: false
  String :avatar_url
  DateTime :created_at, default: Sequel::CURRENT_TIMESTAMP
end

DB.create_table? :videos do
  primary_key :id
  foreign_key :user_id, :users, on_delete: :cascade
  String :youtube_id, null: false
  String :title, null: false
  String :thumbnail_url
  Integer :duration_seconds
  String :channel_name
  Boolean :completed, default: false
  DateTime :last_watched_at
  DateTime :created_at, default: Sequel::CURRENT_TIMESTAMP
end

DB.create_table? :notes do
  primary_key :id
  foreign_key :user_id, :users, on_delete: :cascade
  foreign_key :video_id, :videos, on_delete: :cascade
  Text :content, null: false
  Integer :timestamp_seconds, null: false
  DateTime :created_at, default: Sequel::CURRENT_TIMESTAMP
  DateTime :updated_at, default: Sequel::CURRENT_TIMESTAMP
end

DB.create_table? :collections do
  primary_key :id
  foreign_key :user_id, :users, on_delete: :cascade
  String :name, null: false
  DateTime :created_at, default: Sequel::CURRENT_TIMESTAMP
end

DB.create_table? :collection_videos do
  primary_key :id
  foreign_key :collection_id, :collections, on_delete: :cascade
  foreign_key :video_id, :videos, on_delete: :cascade
end

DB.create_table? :reviews do
  primary_key :id
  foreign_key :note_id, :notes, on_delete: :cascade
  foreign_key :user_id, :users, on_delete: :cascade
  Float :ease_factor, default: 2.5
  Integer :interval_days, default: 1
  Integer :repetitions, default: 0
  DateTime :next_review_at
  DateTime :last_reviewed_at
end

puts "Database schema initialized."
