require 'rspec'
require 'rack/test'
require_relative '../services/spaced_repetition_service'

RSpec.configure do |config|
  config.include Rack::Test::Methods
  config.color = true
  config.formatter = :documentation
end
