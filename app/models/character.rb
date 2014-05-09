require 'json'

class Character < ActiveRecord::Base
  serialize :stats, JSON
  serialize :status, JSON
  serialize :vocabulary, JSON
  serialize :properties, JSON

  # TODO: these relationships will eventually need to exist
  #has_many :skills
  #has_many :equipments

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
  # This should build the full character sheet into a single thing
  def to_backbone
    char_sheet.to_json
  end

  def char_sheet
    # Build the char sheet out of all the required bits
    # skills, equips, stats, etc.
    self #for now..
  end
end
