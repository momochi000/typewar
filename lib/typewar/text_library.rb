# TODO: scale up the difficulty on basic characters, should have a more even 
# distribution of weights.
# Make a csv of this and import it to a spreadsheet.  Should help me visualize
# what the difficulty curve of characters is. I want to see a bell curve around
# where the home keys are
module Typewar
  class TextLibrary
    CHARACTER_WEIGHTS = {
      # alphabet
      'a' =>  {:weight => 1, :finger => 1   }, 
      'b' =>  {:weight => 4, :finger => 4   }, 
      'c' =>  {:weight => 3, :finger => 4   }, 
      'd' =>  {:weight => 1, :finger => 3   }, 
      'e' =>  {:weight => 2, :finger => 3   }, 
      'f' =>  {:weight => 1, :finger => 4   }, 
      'g' =>  {:weight => 2, :finger => 4   }, 
      'h' =>  {:weight => 2, :finger => 7   }, 
      'i' =>  {:weight => 2, :finger => 8   }, 
      'j' =>  {:weight => 1, :finger => 7   }, 
      'k' =>  {:weight => 1, :finger => 8   }, 
      'l' =>  {:weight => 1, :finger => 9   }, 
      'm' =>  {:weight => 2, :finger => 7   }, 
      'n' =>  {:weight => 2, :finger => 7   }, 
      'o' =>  {:weight => 3, :finger => 9   }, 
      'p' =>  {:weight => 3, :finger => 10  }, 
      'q' =>  {:weight => 3, :finger => 1   }, 
      'r' =>  {:weight => 2, :finger => 4   }, 
      's' =>  {:weight => 1, :finger => 2   }, 
      't' =>  {:weight => 3, :finger => 4   }, 
      'u' =>  {:weight => 2, :finger => 7   }, 
      'v' =>  {:weight => 3, :finger => 4   }, 
      'w' =>  {:weight => 2, :finger => 2   }, 
      'x' =>  {:weight => 3, :finger => 2   }, 
      'y' =>  {:weight => 3, :finger => 7   }, 
      'z' =>  {:weight => 3, :finger => 1   }, 
      'A' =>  {:weight => 2, :finger => 1   }, 
      'B' =>  {:weight => 5, :finger => 4   }, 
      'C' =>  {:weight => 4, :finger => 4   }, 
      'D' =>  {:weight => 2, :finger => 3   }, 
      'E' =>  {:weight => 3, :finger => 3   }, 
      'F' =>  {:weight => 2, :finger => 4   }, 
      'G' =>  {:weight => 3, :finger => 4   }, 
      'H' =>  {:weight => 3, :finger => 7   }, 
      'I' =>  {:weight => 3, :finger => 8   }, 
      'J' =>  {:weight => 2, :finger => 7   }, 
      'K' =>  {:weight => 2, :finger => 8   }, 
      'L' =>  {:weight => 2, :finger => 9   }, 
      'M' =>  {:weight => 3, :finger => 7   }, 
      'N' =>  {:weight => 3, :finger => 7   }, 
      'O' =>  {:weight => 4, :finger => 9   }, 
      'P' =>  {:weight => 4, :finger => 10  }, 
      'Q' =>  {:weight => 4, :finger => 1   }, 
      'R' =>  {:weight => 3, :finger => 4   }, 
      'S' =>  {:weight => 2, :finger => 2   }, 
      'T' =>  {:weight => 4, :finger => 4   }, 
      'U' =>  {:weight => 3, :finger => 7   }, 
      'V' =>  {:weight => 4, :finger => 4   }, 
      'W' =>  {:weight => 3, :finger => 2   }, 
      'X' =>  {:weight => 4, :finger => 2   }, 
      'Y' =>  {:weight => 4, :finger => 7   }, 
      'Z' =>  {:weight => 4, :finger => 1   }, 
      # numeric
      '1' =>  {:weight => 7, :finger => 1   }, 
      '2' =>  {:weight => 6, :finger => 2   }, 
      '3' =>  {:weight => 4, :finger => 3   }, 
      '4' =>  {:weight => 4, :finger => 4   }, 
      '5' =>  {:weight => 6, :finger => 4   }, 
      '6' =>  {:weight => 7, :finger => 7   }, 
      '7' =>  {:weight => 6, :finger => 7   }, 
      '8' =>  {:weight => 5, :finger => 8   }, 
      '9' =>  {:weight => 5, :finger => 8   }, 
      '0' =>  {:weight => 5, :finger => 9   }, 
      # symbols
      '~' =>  {:weight => 7,  :finger => 1  },
      '!' =>  {:weight => 5,  :finger => 1  },
      '@' =>  {:weight => 5,  :finger => 2  },
      '#' =>  {:weight => 6,  :finger => 3  },
      '$' =>  {:weight => 6,  :finger => 4  },
      '%' =>  {:weight => 8,  :finger => 4  },
      '^' =>  {:weight => 10, :finger => 7  },
      '&' =>  {:weight => 7,  :finger => 7  },
      '*' =>  {:weight => 7,  :finger => 8  },
      '(' =>  {:weight => 6,  :finger => 8  },
      ')' =>  {:weight => 6,  :finger => 9  },
      '-' =>  {:weight => 5,  :finger => 9  },
      '+' =>  {:weight => 7,  :finger => 10 },
      '_' =>  {:weight => 5,  :finger => 9  },
      '=' =>  {:weight => 6,  :finger => 10 },
      '<' =>  {:weight => 6,  :finger => 9  },
      '>' =>  {:weight => 6,  :finger => 10 },
      '[' =>  {:weight => 4,  :finger => 10 },
      ']' =>  {:weight => 5,  :finger => 10 },
      '{' =>  {:weight => 6,  :finger => 10 },
      '}' =>  {:weight => 7,  :finger => 10 },
      '|' =>  {:weight => 8,  :finger => 10 },
      # punctuation
      '`' =>  {:weight => 7, :finger => 1   }, 
      ';' =>  {:weight => 1, :finger => 10  }, 
      ':' =>  {:weight => 3, :finger => 10  }, 
      '"' =>  {:weight => 3, :finger => 10  }, 
      ',' =>  {:weight => 3, :finger => 9   }, 
      '.' =>  {:weight => 2, :finger => 10  }, 
      '/' =>  {:weight => 2, :finger => 10  }, 
      '?' =>  {:weight => 2, :finger => 10  }, 
      ' ' =>  {:weight => 1, :finger => 6   }, 
      '\n' =>  {:weight => 1, :finger => 6  }, 
      '\\' => {:weight => 7, :finger => 10  }, 
      "'" =>  {:weight => 2, :finger => 10  }
    }

    def initialize(text)
      @text = text
    end

    # Return a library of text
    def generate(options={})
      strings = TextSlicer.new(@text).slice
      strings = strings.
        map{|s|sanitize_string(s)}.
        map{|s|format_string(s)}.
        compact.
        delete_if{|s|s.blank?}

      strings.map do |string|
        {
          :difficulty => calculate_avg_char_difficulty(string),
              :length => string.length,
                :text => string
        }
      end
    end

    private

    def calculate_avg_char_difficulty(str)
      s = str.split('')
      prev = nil
      index = 0
      curr_total = 0

      s.each do |char|
        weight_modifier = 0
        if prev
          if prev == char
            weight_modifier = -1
          elsif CHARACTER_WEIGHTS[prev][:finger] == CHARACTER_WEIGHTS[char][:finger] 
            weight_modifier = 1
          end
        end
        curr_total += CHARACTER_WEIGHTS[char][:weight] + weight_modifier
        prev = char
      end

      (curr_total.to_f / str.length).round
    end

    def format_string(str)
      str.
        gsub(/^[[:punct:]]/, '').
        gsub(/\s+([[:punct:]])/, '\1').
        gsub(/^\s+/, '').
        gsub(/\s+$/, '').
        gsub(/\s*’\s*/,"'").
        gsub(/\s*"\s*/,'"').
        gsub(/\s*\-\s*/,"-")
    end

    def sanitize_string(str)
      str.
        gsub(/\n/,'').
        gsub(/—/,'-').
        gsub(/\s+/, ' ').
        gsub('…', '...').
        gsub('“', '"').gsub('”', '"')
    end
  end
end
