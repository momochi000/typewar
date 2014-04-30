Crafty.c("TextFragment", {
  is_active: false,
  is_complete: false,
  _correct_characters: '',
  _current_position: null,
  _incorrect_characters: '',
  _text: '',

  init: function (){
  },

  textFragment: function (){
    return this;
  },

  remove: function (){
    this.deactivate();
    this._unbindAll();
    this._view.remove(); //destroy the view.  May need to unbind additional events by hand
  },

  activate: function (){ 
    if(!this.is_active){
      this._current_position = 0;
      this.is_active = true; 
      this.z = 99999;
      Crafty.trigger("TextFragmentActivated", this);
      this.drawSelf();
    }
  },

  deactivate: function (){ 
    this.is_active = false; 
    this.z = 0;
    this._current_position = null;
    this.drawSelf(); // TODO: refactor calls to drawSelf out into text fragment 
                     // display component for now it's ok to have them here, 
                     // it won't break if it calls but there's nothing to 
                     // display
  },

  getTextStatus: function (){
    return {
      typed: this._correct_characters, 
      missed: this._incorrect_characters, 
      rest: this._text.slice(this._current_position)
    }
  },

  isActive: function (){ return this.is_active; },

  isComplete: function (){ return this.is_complete; },

  // Return true if the given character matches the first one in the text frag
  matchFirstChar: function (chr){
    return (this._text[0] == chr);
  },

  /* We want to call this when the fragment is no longer to be displayed.
   * The fragment doesn't get destroyed yet, it may have reached the player or
   * it may have been correctly typed.  Either way, we remove it from the
   * battle scene.
   */
  removeFromPlay: function (){
    this._view.remove();
    this.removeComponent("Collision", true); // TODO: these can probably move to the display component
    this.y = -9999999999; 
    this.z = -100;
    this._unbindAll();
  },

  reset: function (){
    this.is_complete = false;
    this._incorrect_characters = '';
    this._correct_characters = '';
    this.deactivate();
  },

  /* Returns a percentage of how correctly was the fragment typed 
   * returns false if the fragment isn't yet completed.
   * When we allow backspacing, this should include backspaces in
   * the success percentage. There should be a skill that allows
   * a certain number of backspaces to get 100%
   */
  successPct: function (){
    var rating;

    if(this.is_complete) {
      return (100 * (1 - (this._incorrect_characters.length / this._correct_characters.length)));
    }else{
      return (100 * ((this._correct_characters.length - this._incorrect_characters.length) / this._text.length));
    }
  },

  /* The means of feeding characters to the text fragment. Correct characters
   * move the fragment closer to completion, incorrect characters are tracked
   * as well.
   * return true if the input was correct else false
   */
  takeInput: function (chr){
    if(this._text[this._current_position] == chr){
      this._correctInput();
      this._checkForCompletion();
      this.drawSelf();
      return true
    }else{
      this._wrongInput(chr);
      this.drawSelf();
      return false;
    }
  },

  wasPerfect: function (){
    if(this.successPct() >= 99.9) { return true; }
    return false;
  },

  //private

  _complete: function (){
    this.is_complete = true
    this.deactivate();
    this.drawSelf();

    Crafty.trigger("TextFragmentCompleted", this);
    this.removeFromPlay();
    return this;
  },

  _checkForCompletion: function (){
    if(this._correct_characters.length == this._text.length){
      this._complete();
    }
  },

  _correctInput: function (input){
    // TODO: validate input? check the input against the current position in _text
    this._correct_characters += this._text[this._current_position];
    this._current_position++;
  },

  _getClasses: function (){
    return this._classes.concat(this._classesFunc(this._currentTime()));
  },

  _getClassesForDom: function (){
    var output;
    output = _.reduce(this._getClasses(), function (memo, curr_class){
      return(memo + ' ' + curr_class);
    }, '');
    return output;
  },

  _wrongInput: function (input){
    this._incorrect_characters += input;
    this._flickerEffect(); // TODO: refactor over to the display component
  }
});
