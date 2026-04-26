require 'sequel'
require 'dotenv/load'

module DB
  def self.connection
    @connection ||= begin
      url = ENV['DATABASE_URL'] || 'sqlite://local.db'

      if url.start_with?('libsql://')
        # Turso / LibSQL remote database — requires auth token passed separately.
        # The libsql gem registers a :libsql Sequel adapter.
        require 'libsql'
        auth_token = ENV['DATABASE_AUTH_TOKEN']
        raise 'DATABASE_AUTH_TOKEN is required for libsql:// connections' unless auth_token

        Sequel.connect(
          adapter: 'libsql',
          database: url,
          auth_token: auth_token
        )
      else
        # Local SQLite (development fallback)
        Sequel.connect(url)
      end
    end
  end
end
