require 'sequel'
require 'dotenv/load'
require 'libsql'

module DB
  def self.connection
    @connection ||= begin
      url = ENV['DATABASE_URL'] || 'sqlite://local.db'
      # Sequel handles libsql:// URLs via the sqlite adapter if configured correctly,
      # or via a specific libsql adapter if available.
      Sequel.connect(url)
    end
  end
end
