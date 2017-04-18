require 'json'

class Character < ActiveRecord::Base
  serialize :stats, JSON
  serialize :status, JSON
  serialize :properties, JSON

  has_many :skills
  # TODO: these relationships will eventually need to exist
  # has_many :equipments
  # has_many :texts

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
    #return self #for now..
    {
      :properties   => properties,
      :name         => name,
      #:skills       => skills_to_hash,
      :stats        => stats,
      :status       => status,
      :vocabulary   => get_vocabulary
    }
  end

  def get_vocabulary
    Text.all.sample.words
  end

  private

  def skills_to_hash
    s = {}
    skills.each do |skill|
      s[skill.name] = skill
    end
    s
  end
end
