module Typewar
  class TextSlicer
    DEFAULT_NUM_WORDS_TO_SLICE = 6

    def initialize(input)
      @input = input
      prepare_input
    end

    # TODO: Allow options to weigh the string size more towards the
    # lower/middle/higher end based on some easing function
    def slice(options={})
      @output = []
      word_size = (options[:word_size] || DEFAULT_NUM_WORDS_TO_SLICE)-1
      temp = @text.split(word_boundaries).delete_if(&:blank?)
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

    def word_boundaries
      #/\b/ # simplistic
      /[.\s\-—"]/
    end
  end
end
