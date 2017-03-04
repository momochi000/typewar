/* Component to handle all player input during battle.
 * When there are no active text fragments, this component must decide based
 * on player input, which one(s) to activate and continue to feed inputs to.
 *      
 * Case 1: there is a currently active text fragment
 * Pass off the inputs to that fragment and let it do it's thing.
 * Case 2 : there is no active text fragment
 *   Search through unfinished text fragments and find the ones that start
 *   with this matching character.  
 *   If there are none : 
 *     input is incorrect (and some penalty is assessed)
 *   If there is one : 
 *     Make that the active text fragment and pass the input value to it
 *   If there is more than one :
 *     Stub this out, too complex to handle just now but eventually, we
 *     want to track multiple active ones until the user types a character
 *     that only exists on one of them. Then we reset/discard the others
 *     and make that one the active one.
 *     if there are two with identical text, then the user can complete
 *     both by typing them
 * 
 */

import { COMMANDS, CMD_CHANGE_STANCE } from "../util/command_constants"

require('crafty');

Crafty.c("BattleInput", {
  init: function (){ 
    this._inputQueue = [];
    this.is_shift_key_down = false;
  },

  battleInput: function (){
    this._attachKeyboardHandler(); // bind a keyboard input
    return this;
  },

  getInputQueue: function (){
    return this._inputQueue;
  },

  remove: function (destroyed){
    this._detachKeyboardHandler();
  },

  // private 

  _attachKeyboardHandler: function (){
    this.bind('KeyDown', this._handleKeyPress);
    this.bind('KeyUp', this._handleKeyRelease);
    this._handleBrowserKeyOverrides();
  },

  _detachKeyboardHandler: function (){
    this.unbind('KeyDown', this._handleKeyPress);
    this.unbind('KeyUp', this._handleKeyRelease);
    this._unbindBrowserKeyOverrides();
  },

  _handleBrowserKeyOverrides: function (){
    this._preventBackspaceNavigation();
    this._preventTabFieldSwitch();
    this._preventSpacebarScroll();
  },

  _handleKeyPress: function (keyEvent){
    var letter_value;

    letter_value = this._translateKeyToLetter(keyEvent.key);

    if(this._isModifierKey(letter_value)){
      return this._handleModifierKeyPressed(letter_value);
    }

    this._inputQueue.push(letter_value);
  },

  _handleKeyRelease: function (keyEvent){
    var letter_value;
    
    letter_value = this._translateKeyToLetter(keyEvent.key);

    if(this._isModifierKey(letter_value)){
      this._handleModifierKeyReleased(letter_value);
    }
  },

  _handleModifierKeyPressed: function (key_val){
    switch(key_val) {
      case('shift'):
        this.is_shift_key_down = true;
      default:
        return false;
    }
  },

  _handleModifierKeyReleased: function (key_val){
    switch(key_val) {
      case('shift'):
        this.is_shift_key_down = false;
      default:
        return false;
    }
  },

  _isModifierKey: function (key_val){
    switch(key_val) {
      case('shift'):
        return true;
      default:
        return false;
    }
  },

  _preventBackspaceNavigation: function (){
    $(document).on("keydown", function (e) {
      if (e.which === 8 && !$(e.target).is("input, textarea")) {
        e.preventDefault();
      }
    });
  },

  _preventTabFieldSwitch: function (){
    $(document).on("keydown", function (e) {
      if (e.which === 9 && !$(e.target).is("input, textarea")) {
        e.preventDefault();
      }
    });
  },

  _preventSpacebarScroll: function (){
    $(document).on("keydown", function (e) {
      if (e.which === 32 && !$(e.target).is("input, textarea")) {
        e.preventDefault();
      }
    });
  },

  _translateKeyToLetter: function (keyCode){
    //console.log("DEBUG: GOT A KEY INPUT ----> keycode ----->"+keyCode);
    switch(keyCode) {
      case(Crafty.keys['BACKSPACE']):
        // We could do something special with this if we later choose
        return '';
      case(Crafty.keys['TAB']):
        return COMMANDS['tab']
      case(Crafty.keys['ENTER']):
        return '';
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
        if(this.is_shift_key_down) { return "!" }
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
        return '8';
      case(Crafty.keys['9']):
        return '9';
      case(Crafty.keys['A']):
        if(this.is_shift_key_down) { return "A" }
        return 'a';
      case(Crafty.keys['B']):
        if(this.is_shift_key_down) { return "B" }
        return 'b';
      case(Crafty.keys['C']):
        if(this.is_shift_key_down) { return "C" }
        return 'c';
      case(Crafty.keys['D']):
        if(this.is_shift_key_down) { return "D" }
        return 'd';
      case(Crafty.keys['E']):
        if(this.is_shift_key_down) { return "E" }
        return 'e';
      case(Crafty.keys['F']):
        if(this.is_shift_key_down) { return "F" }
        return 'f';
      case(Crafty.keys['G']):
        if(this.is_shift_key_down) { return "G" }
        return 'g';
      case(Crafty.keys['H']):
        if(this.is_shift_key_down) { return "H" }
        return 'h';
      case(Crafty.keys['I']):
        if(this.is_shift_key_down) { return "I" }
        return 'i';
      case(Crafty.keys['J']):
        if(this.is_shift_key_down) { return "J" }
        return 'j';
      case(Crafty.keys['K']):
        if(this.is_shift_key_down) { return "K" }
        return 'k';
      case(Crafty.keys['L']):
        if(this.is_shift_key_down) { return "L" }
        return 'l';
      case(Crafty.keys['M']):
        if(this.is_shift_key_down) { return "M" }
        return 'm';
      case(Crafty.keys['N']):
        if(this.is_shift_key_down) { return "N" }
        return 'n';
      case(Crafty.keys['O']):
        if(this.is_shift_key_down) { return "O" }
        return 'o';
      case(Crafty.keys['P']):
        if(this.is_shift_key_down) { return "P" }
        return 'p';
      case(Crafty.keys['Q']):
        if(this.is_shift_key_down) { return "Q" }
        return 'q';
      case(Crafty.keys['R']):
        if(this.is_shift_key_down) { return "R" }
        return 'r';
      case(Crafty.keys['S']):
        if(this.is_shift_key_down) { return "S" }
        return 's';
      case(Crafty.keys['T']):
        if(this.is_shift_key_down) { return "T" }
        return 't';
      case(Crafty.keys['U']):
        if(this.is_shift_key_down) { return "U" }
        return 'u';
      case(Crafty.keys['V']):
        if(this.is_shift_key_down) { return "V" }
        return 'v';
      case(Crafty.keys['W']):
        if(this.is_shift_key_down) { return "W" }
        return 'w';
      case(Crafty.keys['X']):
        if(this.is_shift_key_down) { return "X" }
        return 'x';
      case(Crafty.keys['Y']):
        if(this.is_shift_key_down) { return "Y" }
        return 'y';
      case(Crafty.keys['Z']):
        if(this.is_shift_key_down) { return "Z" }
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
      case(Crafty.keys['DECIMAL']):
        return ".";
      //case(Crafty.keys['DIVIDE'])
      case(Crafty.keys['SHIFT']):
        return "shift";
      //case(Crafty.keys['CTRL'])
      //case(Crafty.keys['ALT'])
      //case(Crafty.keys['PLUS'])
      case(Crafty.keys['COMMA']):
        return ",";
      case(Crafty.keys['MINUS']):
        return "-";
      //case(Crafty.keys['PERIOD'])
      case(186): // ; semicolon
        if(this.is_shift_key_down) { return ":" }
        return ";";
      case(190): // . period
        return ".";
      case(191): // ? question mark
        return "?";
      case(222): // ' Single quote
        return "'";
      default:
        //console.log("DEBUG: UNRECOGNIZED KEY DETECTED ----> " + keyCode);
        return '';
    }
  },

  _unbindBrowserKeyOverrides: function (){
    $(document).off("keydown");
  }
});
