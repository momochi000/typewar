# Stupid storage mechanism for text that we can pre-process
class Text < ActiveRecord::Base
  def generate_library
    Typewar::TextLibrary.new(content).generate
  end
end
