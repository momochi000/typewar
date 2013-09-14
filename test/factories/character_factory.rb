require 'json'

FactoryGirl.define do
  factory :character do
  end

  factory :easy_slime, :parent => :character do
    name { Faker::Name.name }
    char_class 'Slime'
    char_sheet {{
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

  factory :medium_slime do

  end

end
