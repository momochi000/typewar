FactoryGirl.define do 
  factory :text do
    content { Faker::Lorem.paragraphs.join('')}
  end

  factory :test_text, :parent => :text do
    content "The quick brown fox jumped over the slow lazy dog"
  end
end
