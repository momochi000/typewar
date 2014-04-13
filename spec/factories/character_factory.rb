require 'json'

FactoryGirl.define do
  factory :character do
    stats {{
      level: 1,
      str: 1,
      spd: 1,
      sta: 1, 
      dex: 1, 
      int: 1, 
      cha: 1, 
      wis: 1
    }}

    properties {{
      blunt:    0,
      slashing: 0,
      piercing: 0,
      fire:     0,
      earth:    0,
      water:    0,
      air:      0,
      light:    0,
      dark:     0,
      poison:   0,
      life:     0,
      death:    0
    }}
  end

  factory :easy_slime, :parent => :character do
    name { Faker::Name.name }
    char_class 'Slime'
    stats {{
      level: 1,
      str: rand(10),
      spd: rand(4),
      sta: rand(12), 
      dex: 2, 
      int: 0, 
      cha: 0, 
      wis: 0
    }}
    status {{
      hp: 5+rand(25)
    }}
    vocabulary { Character.generate_vocabulary }
  end

  factory :player_lv1, :parent => :character do
    name { Faker::Name.name }
    char_class 'Player'
    stats {{
      level: 1,
      str: rand(10),
      spd: rand(4),
      sta: rand(12), 
      dex: 2, 
      int: 0, 
      cha: 0, 
      wis: 0
    }}
    status {{
      hp: 5+rand(25)
    }}
    vocabulary { Character.generate_vocabulary }
  end

  #factory :medium_slime do
  #end
end
