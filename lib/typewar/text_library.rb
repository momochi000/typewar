module Typewar
  class TextLibrary
    #CHARACTER_WEIGHTS = {
    #  # alphabet
    #  'a' => 1, 'b' => 3, 'c' => 3, 'd' => 1, 'e' => 1, 'f' => 1, 'g' => 1,
    #  'h' => 1, 'i' => 1, 'j' => 1, 'k' => 1, 'l' => 1, 'm' => 1, 'n' => 2,
    #  'o' => 2, 'p' => 2, 'q' => 2, 'r' => 1, 's' => 1, 't' => 2, 'u' => 1,
    #  'v' => 2, 'w' => 2, 'x' => 2, 'y' => 2, 'z' => 2,
    #  'A' => 2, 'B' => 4, 'C' => 4, 'D' => 2, 'E' => 2, 'F' => 2, 'G' => 2,
    #  'H' => 2, 'I' => 2, 'J' => 2, 'K' => 2, 'L' => 2, 'M' => 2, 'N' => 3,
    #  'O' => 3, 'P' => 3, 'Q' => 3, 'R' => 2, 'S' => 2, 'T' => 3, 'U' => 2,
    #  'V' => 3, 'W' => 2, 'X' => 3, 'Y' => 3, 'Z' => 3, 'Z' => 3,
    #  # numeric
    #  '1' => 7, '2' => 6, '3' => 4, '4' => 3, '5' => 5, '6' => 6, '7' => 5,
    #  '8' => 4, '9' => 4, '0' => 4,
    #  # symbols
    #  '~' => 7, '!' => 5, '@' => 5, '#' => 6, '$' => 6, '%' => 8, '^' => 10,
    #  '&' => 7, '*' => 7, '(' => 6, ')' => 6, '-' => 5, '+' => 7, '_' => 5,
    #  '=' => 6, '<' => 6, '>' => 6, '[' => 4, ']' => 5, '{' => 6, '}' => 7,
    #  '|' => 6,
    #  # punctuation
    #  '`' => 7, ';' => 1, ':' => 3, '"' => 3, ',' => 2, '.' => 2, '/' => 2,
    #  '?' => 2, ' ' => 1, '\\' => 5, '\'' => 2
    #}

    CHARACTER_WEIGHTS = {
      # alphabet
      'a' =>  {:weight => 1, :finger => 1   }, 
      'b' =>  {:weight => 3, :finger => 4   }, 
      'c' =>  {:weight => 3, :finger => 4   }, 
      'd' =>  {:weight => 1, :finger => 3   }, 
      'e' =>  {:weight => 1, :finger => 3   }, 
      'f' =>  {:weight => 1, :finger => 4   }, 
      'g' =>  {:weight => 1, :finger => 4   }, 
      'h' =>  {:weight => 1, :finger => 7   }, 
      'i' =>  {:weight => 1, :finger => 8   }, 
      'j' =>  {:weight => 1, :finger => 7   }, 
      'k' =>  {:weight => 1, :finger => 8   }, 
      'l' =>  {:weight => 1, :finger => 9   }, 
      'm' =>  {:weight => 1, :finger => 7   }, 
      'n' =>  {:weight => 2, :finger => 7   }, 
      'o' =>  {:weight => 2, :finger => 9   }, 
      'p' =>  {:weight => 2, :finger => 10  }, 
      'q' =>  {:weight => 2, :finger => 1   }, 
      'r' =>  {:weight => 1, :finger => 4   }, 
      's' =>  {:weight => 1, :finger => 2   }, 
      't' =>  {:weight => 2, :finger => 4   }, 
      'u' =>  {:weight => 1, :finger => 7   }, 
      'v' =>  {:weight => 2, :finger => 4   }, 
      'w' =>  {:weight => 2, :finger => 2   }, 
      'x' =>  {:weight => 2, :finger => 2   }, 
      'y' =>  {:weight => 2, :finger => 7   }, 
      'z' =>  {:weight => 2, :finger => 1   }, 
      'A' =>  {:weight => 1, :finger => 1   }, 
      'B' =>  {:weight => 3, :finger => 4   }, 
      'C' =>  {:weight => 3, :finger => 4   }, 
      'D' =>  {:weight => 1, :finger => 3   }, 
      'E' =>  {:weight => 1, :finger => 3   }, 
      'F' =>  {:weight => 1, :finger => 4   }, 
      'G' =>  {:weight => 1, :finger => 4   }, 
      'H' =>  {:weight => 1, :finger => 7   }, 
      'I' =>  {:weight => 1, :finger => 8   }, 
      'J' =>  {:weight => 1, :finger => 7   }, 
      'K' =>  {:weight => 1, :finger => 8   }, 
      'L' =>  {:weight => 1, :finger => 9   }, 
      'M' =>  {:weight => 1, :finger => 7   }, 
      'N' =>  {:weight => 2, :finger => 7   }, 
      'O' =>  {:weight => 2, :finger => 9   }, 
      'P' =>  {:weight => 2, :finger => 10  }, 
      'Q' =>  {:weight => 2, :finger => 1   }, 
      'R' =>  {:weight => 1, :finger => 4   }, 
      'S' =>  {:weight => 1, :finger => 2   }, 
      'T' =>  {:weight => 2, :finger => 4   }, 
      'U' =>  {:weight => 1, :finger => 7   }, 
      'V' =>  {:weight => 2, :finger => 4   }, 
      'W' =>  {:weight => 2, :finger => 2   }, 
      'X' =>  {:weight => 2, :finger => 2   }, 
      'Y' =>  {:weight => 2, :finger => 7   }, 
      'Z' =>  {:weight => 2, :finger => 1   }, 
      # numeric
      '1' =>  {:weight => 7, :finger => 1   }, 
      '2' =>  {:weight => 6, :finger => 2   }, 
      '3' =>  {:weight => 4, :finger => 3   }, 
      '4' =>  {:weight => 3, :finger => 4   }, 
      '5' =>  {:weight => 5, :finger => 4   }, 
      '6' =>  {:weight => 6, :finger => 7   }, 
      '7' =>  {:weight => 5, :finger => 7   }, 
      '8' =>  {:weight => 4, :finger => 8   }, 
      '9' =>  {:weight => 4, :finger => 8   }, 
      '0' =>  {:weight => 4, :finger => 9   }, 
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
      ',' =>  {:weight => 2, :finger => 9   }, 
      '.' =>  {:weight => 2, :finger => 10  }, 
      '/' =>  {:weight => 2, :finger => 10  }, 
      '?' =>  {:weight => 2, :finger => 10  }, 
      ' ' =>  {:weight => 1, :finger => 6   }, 
      '\\' => {:weight => 6, :finger => 10  }, 
      '\'' => {:weight => 2, :finger => 10  }
    }

    def initialize(text)
      @text = text
    end

    # Return a library of text
    def generate(options={})
      strings = TextSlicer.new(@text).slice #slice the text into array of strings

      # for each string in strings
      # determine the average character difficulty
      # modify the difficulty with consecutive letter difficulty

    end

    private
  end
end
