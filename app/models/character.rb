require 'json'

class Character < ActiveRecord::Base
  serialize :stats, JSON
  serialize :status, JSON
  serialize :vocabulary, JSON
  serialize :properties, JSON

  scope :slimes,  -> { where(:char_class => 'Slime') }
  scope :players, -> { where(:char_class => 'Player') }

  def self.generate_vocabulary(difficulty=3)


    case difficulty
    when 1
    when 2
      30.times.map{|itor|
        Faker::Lorem.words(rand(2) + 1)
      }.flatten
    when 3
      15.times.map{|itor|
        [ Faker::Address.city,
          Faker::Address.state,
          Faker::Company.catch_phrase
        ]
      }.flatten
    when 4
    when 5
    else
      15.times.map{|itor|
        [ Faker::Address.city,
          Faker::Address.state,
          Faker::Company.catch_phrase
        ]
      }.flatten
    end
    
  end

  # Return a json to send to the server and be converted into a game character
  # TODO: move this to a decorator
  def to_backbone
    self.to_json
  end
end
