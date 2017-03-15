/* Text fragment component, handles tracking of typing over a string.
 * Matches input and keeps track of what was typed and how many typos exist etc.
 * Triggers global events: 
 *   TextFragmentActivated
 *   TextFragmentCompleted
 * Triggers entity events: 
 *   InputIncorrect 
 *   InputCorrect
 *   TextFragmentCompleted
 *
 *   It's becoming clear that this component is meant to be a companion to
 *   another component which provides it's front facing api.  For example
 *   BattlePCSkill comes along with this one.  Methods are called on 
 *   BattlePCSkill but not TextFragment directly.  BattlePCSkill interfaces
 *   with TextFragment to get at the desired functionality
 *
 *   Some of these which must be implemented are
 *   cancel()
 *   acceptInput();
 *
 *   However, any functionality in components should be moved off into their
 *   respective systems.  Ultimately components should contain no behavior
 */

require("crafty");
var StateMachine = require("javascript-state-machine");

Crafty.c("TextFragment", {
  _correct_characters: '',
  _current_position: null,
  _incorrect_characters: '',
  _text: '',
  _textFragFsm: null,

  textFragment: function (text){
    this._initTextFragFsm();
    this._text = text
    return this;
  },

  activate: function (){ this._textFragFsm.activate(); },

  complete: function (){ this._textFragFsm.finish(); },

  errorCount: function (){ return this._incorrect_characters.length; },

  getCorrectCharacters: function (){ return this._correct_characters; },

  getIncorrectCharacters: function (){ return this._incorrect_characters; },

  getNextChar: function (){ return this._text[this._current_position]; },

  getRemainingCharacters: function (){ 
    return this.getText().slice(this._current_position);
  },

  getText: function (){ return this._text; },

  getTextStatus: function (){
    return {
      typed: this.getCorrectCharacters() || '',  
      missed: this.getIncorrectCharacters() || '', 
      rest: this.getRemainingCharacters() || ''
    }
  },

  //  isActive: function (){ return this._isActive; },
  isActive: function (){ return this._textFragFsm.is("active"); },

  //  isComplete: function (){ return this._isComplete; },
  isComplete: function (){ return this._textFragFsm.is("completed"); },

  processed: function (){ return this._textFragFsm.process(); },

  textLength: function (){ return this._text.length; },

  // Return true if the given character matches the first one in the text frag
  matchFirstChar: function (chr){ return (this._text[0] == chr); },

  matchNextChar: function (chr){ return (this.getNextChar() == chr); },

  restart: function (){ this._textFragFsm.restart(); },

  setText: function (newText){ this._text = newText; },

  /* Returns a percentage of how correctly was the fragment typed 
   * returns false if the fragment isn't yet completed.
   * When we allow backspacing, this should include backspaces in
   * the success percentage. There should be a skill that allows
   * a certain number of backspaces to get 100%
   */
  successPct: function (){
    var rating;

    if(this.isComplete()) {
      return (100 * (1 - (this._incorrect_characters.length / this._correct_characters.length)));
    }else{
      return (100 * ((this._correct_characters.length - this._incorrect_characters.length) / this._text.length));
    }
  },

  takeInput: function (chr){
    //console.log("DEBUG: TEXT FRAGMENT#takeInput...");
    //console.log("DEBUG: next char ---> " + this._text[this._current_position] );
    //console.log("DEBUG: char arg ----> " + chr);

    if(this._text[this._current_position] == chr){
      this._correctInput();
      this._checkForCompletion();
      this._triggerRedraw();
      return true
    }else{
      this._wrongInput(chr);
      this._triggerRedraw();
      return false;
    }
  },

  wasPerfect: function (){
    if(this.successPct() >= 99.9) { return true; }
    return false;
  },

  //private

  _checkForCompletion: function (){
    if(this._correct_characters.length == this._text.length){
      this.complete();
    }
  },

  _clearTimestamps: function (){
    this.completed_at = null;
    this.started_at = null;
  },

  _correctInput: function (input){
    // TODO: validate input? check the input against the current position in _text
    this._correct_characters += this._text[this._current_position];
    this._current_position++;
    //    Crafty.trigger("sound_effect", "letter_typed"); //TODO: REFACTOR THIS
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

  _initTextFragFsm: function (){
    var self = this;
    this._textFragFsm = StateMachine.create({
      initial: "ready",
      events: [
        { name: "activate",  from: "ready",     to: "active" },
        { name: "finish",    from: "active",    to: "completed" },
        { name: "process",   from: "completed", to: "processed" },
        { name: "restart",   from: "completed", to: "ready" },
        { name: "restart",   from: "processed", to: "ready" },
        { name: "cancel",    from: "active",    to: "ready" },
      ],
      callbacks: {
        onactivate: function (event, from, to){ self._onActivate(); },
        oncomplete: function (event, from, to){ self._onComplete(); },
        onrestart:  function (event, from, to){ self._onRestart();  },
        oncancel:   function (event, from, to){ self._onRestart();  }
      }
    });
  },

  _onActivate: function (){
    this._current_position = 0;
    this._tagStartedTimestamp();
    this.z = 99999;
    Crafty.trigger("TextFragmentActivated", this);
    this._triggerRedraw();
  },

  _onComplete: function (){
    console.log("DEBUG: TEXT FRAGMENT COMPONENT _COMPLETE ~~~~~~~~");
    this._tagCompletedTimestamp();
    this._triggerRedraw();

    Crafty.trigger("TextFragmentCompleted", this);
    this.trigger("TextFragmentCompleted");
    //    this.removeFromPlay(); // TODO: this might no longer be needed, we should rely on things binding to the Completed event instead
  },

  _onRestart: function (){
    this._incorrect_characters = '';
    this._correct_characters = '';
    this._current_position = null;
    this._clearTimestamps();
    this._triggerRedraw();
  },

  _tagStartedTimestamp: function (){ this.started_at = new Date(); },

  _tagCompletedTimestamp: function (){ this.completed_at = new Date(); },

  _triggerRedraw: function (){ this.trigger("TextFragmentRedraw"); },

  _wrongInput: function (input){
    this._incorrect_characters += input;
    this.trigger("InputIncorrect");
  },

  /* The means of feeding characters to the text fragment. Correct characters
   * move the fragment closer to completion, incorrect characters are tracked
   * as well.
   * return true if the input was correct else false
   */
});
