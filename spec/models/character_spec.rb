require 'spec_helper'

describe Character do
  it "should have a valid factory" do
    FactoryGirl.build(:character).should be_valid
    FactoryGirl.build(:easy_slime).should be_valid
  end
end
