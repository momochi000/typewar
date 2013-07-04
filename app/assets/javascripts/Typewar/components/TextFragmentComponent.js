var TextFragmentView = Backbone.View.extend({
  tagName: 'div',
  className: 'text-fragment',
  _template_id: "#text_fragment_template",
  render: function (opts){
    if(!this.id) { this.el.id = this._generateUniqueId(); }
    if(!_.any($(this.id))){
      this.$el.html(_.template($(this._template_id).html(), opts));
      // Ultimately we're going to append it to some crafty element. For now, 
      // append it to the stage so we can see it in action
      $('body').append(this.el);
      //$('#cr-stage').append(this.el);
    }else{ }
  },
  // private
  
  _generateUniqueId: function (){
    var u_id;
    u_id = "text_fragment_" + this._generateRandomVal();
    return u_id;
  },

  _generateRandomVal: function (){ // Should probably be moved into a library or something
    return Math.floor(Math.random()*1000000);
  }
});

Crafty.c("TextFragment", {
  is_active: false,
  _correct_characters: '',
  _complete_callback: null,
  _current_position: null,
  _incorrect_characters: '',
  _success_callback: null,
  _text: '',
  _view: null,

  init: function (){
    this.current_position = 0;
  },

  textFragment: function (text, success_callback){
    this._text = text;
    if(success_callback) { this._success_callback = success_callback; }
    return this;
  },

  activate: function (){ 
    this._current_position = 0;
    this.is_active = true; 
    this._attachKeyboardHandler();
    this.drawSelf();
  },

  deactivate: function (){ 
    this._detachKeyboardHandler();
    this.is_active = false; 
    this._current_position = null;
    this.drawSelf();
  },

  // A test function for debug purposes
  drawSelf: function (){
    if(!this._view) { this._view = new TextFragmentView; }
    this._view.render({active: this.is_active,
                       typed: this._correct_characters, 
                       missed: this._incorrect_characters, 
                       rest: this._text.slice(this._current_position)});
  },

  //private

  _attachKeyboardHandler: function (){
    this.bind('KeyDown', this._handleKeyPress);
  },

  _detachKeyboardHandler: function (){
    this.unbind('KeyDown', this._handleKeyPress);
  },

  _handleKeyPress: function (keyEvent){
    var letter_value;
    letter_value = this._translateKeyToLetter(keyEvent.key);
    if(letter_value){
      if(this._text[this._current_position] == letter_value){
        this._correctInput();
        this._checkForCompletion();
      }else{
        this._wrongInput(letter_value);
      }
    }
    this.drawSelf();
  },

  _checkForCompletion: function (){
    if(this._correct_characters.length == this._text.length){
      console.log("wohoo! successfully typed the thingy");
      this.deactivate();
      // Fire the success callback if one is registered
      if(this._success_callback) { this._success_callback(); }
      this.drawSelf();
    }
  },

  _correctInput: function (input){
    // validate input? check the input against the current position in _text
    this._correct_characters += this._text[this._current_position];
    this._current_position++;
  },

  _wrongInput: function (input){
    this._incorrect_characters += input;
  },

  _translateKeyToLetter: function (keyCode){
    switch(keyCode) {
      //case(Crafty.keys['BACKSPACE'])
      //case(Crafty.keys['TAB'])
      //case(Crafty.keys['ENTER'])
      //case(Crafty.keys['CAPS'])
      //case(Crafty.keys['ESC'])
      case(Crafty.keys['SPACE']): 
        return ' ';
      //case(Crafty.keys['PAGE_UP'])
      //case(Crafty.keys['PAGE_DOWN'])
      //case(Crafty.keys['END'])
      //case(Crafty.keys['HOME'])
      //case(Crafty.keys['LEFT_ARROW'])
      //case(Crafty.keys['UP_ARROW'])
      //case(Crafty.keys['RIGHT_ARROW'])
      //case(Crafty.keys['DOWN_ARROW'])
      //case(Crafty.keys['INSERT'])
      //case(Crafty.keys['DELETE'])
      case(Crafty.keys['0']): 
        return '0';
      case(Crafty.keys['1']):
        return '1';
      case(Crafty.keys['2']):
        return '2';
      case(Crafty.keys['3']):
        return '3';
      case(Crafty.keys['4']):
        return '4';
      case(Crafty.keys['5']):
        return '5';
      case(Crafty.keys['6']):
        return '6';
      case(Crafty.keys['7']):
        return '7';
      case(Crafty.keys['8']):
        return '9';
      case(Crafty.keys['9']):
        return '9';
      case(Crafty.keys['A']):
        return 'a';
      case(Crafty.keys['B']):
        return 'b';
      case(Crafty.keys['C']):
        return 'c';
      case(Crafty.keys['D']):
        return 'd';
      case(Crafty.keys['E']):
        return 'e';
      case(Crafty.keys['F']):
        return 'f';
      case(Crafty.keys['G']):
        return 'g';
      case(Crafty.keys['H']):
        return 'h';
      case(Crafty.keys['I']):
        return 'i';
      case(Crafty.keys['J']):
        return 'j';
      case(Crafty.keys['K']):
        return 'k';
      case(Crafty.keys['L']):
        return 'l';
      case(Crafty.keys['M']):
        return 'm';
      case(Crafty.keys['N']):
        return 'n';
      case(Crafty.keys['O']):
        return 'o';
      case(Crafty.keys['P']):
        return 'p';
      case(Crafty.keys['Q']):
        return 'q';
      case(Crafty.keys['R']):
        return 'r';
      case(Crafty.keys['S']):
        return 's';
      case(Crafty.keys['T']):
        return 't';
      case(Crafty.keys['U']):
        return 'u';
      case(Crafty.keys['V']):
        return 'v';
      case(Crafty.keys['W']):
        return 'w';
      case(Crafty.keys['X']):
        return 'x';
      case(Crafty.keys['Y']):
        return 'y';
      case(Crafty.keys['Z']):
        return 'z';
      //case(Crafty.keys['NUMPAD_0'])
      //case(Crafty.keys['NUMPAD_1'])
      //case(Crafty.keys['NUMPAD_2'])
      //case(Crafty.keys['NUMPAD_3'])
      //case(Crafty.keys['NUMPAD_4'])
      //case(Crafty.keys['NUMPAD_5'])
      //case(Crafty.keys['NUMPAD_6'])
      //case(Crafty.keys['NUMPAD_7'])
      //case(Crafty.keys['NUMPAD_8'])
      //case(Crafty.keys['NUMPAD_9'])
      //case(Crafty.keys['MULTIPLY'])
      //case(Crafty.keys['ADD'])
      //case(Crafty.keys['SUBSTRACT'])
      //case(Crafty.keys['DECIMAL'])
      //case(Crafty.keys['DIVIDE'])
      //case(Crafty.keys['SHIFT'])
      //case(Crafty.keys['CTRL'])
      //case(Crafty.keys['ALT'])
      //case(Crafty.keys['PLUS'])
      //case(Crafty.keys['COMMA'])
      //case(Crafty.keys['MINUS'])
      //case(Crafty.keys['PERIOD'])
    }
  }
});


