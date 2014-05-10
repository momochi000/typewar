module Typewar
  class TextSlicer
    def initialize(input)
      @input = input
      prepare_input
    end

    # TODO: Allow options to weigh the string size more towards the
    # lower/middle/higher end based on some easing function
    def slice(options={})
      @output = []
      word_size = (options[:word_size] || 7)-1
      temp = @text.split(/\b/).delete_if(&:blank?)
      until temp.empty?
        @output << temp.pop(rand(word_size) + 1).join(' ')
      end
      @output.reverse!
      format_punctuation
    end

    private

    # TODO: This should be able to handle other types of input, such as a
    # file object or a url which points to some content.
    def prepare_input
      @text = @input
    end

    def format_punctuation
      @output = @output.map{|s| s.gsub(/\s+\.\s+/, '. ')}.map(&:strip)
    end
  end
end
