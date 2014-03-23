require 'json'

class Character < ActiveRecord::Base
  serialize :stats, JSON
  serialize :status, JSON
  serialize :vocabulary, JSON

  def self.generate_vocabulary
    15.times.map{|itor|
      [ Faker::Address.city,
        Faker::Address.state,
        Faker::Company.catch_phrase
      ]
    }.flatten
  end

  # Return a json to send to the server and be converted into a game character
  # TODO: move this to a decorator
  def to_backbone
    self.to_json
  end
end
