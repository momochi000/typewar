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

Crafty.c("BattleInputManager", {
  init: function (){
  },

  battleInputManager: function (){
    this._attachKeyboardHandler(); // bind a keyboard input
  },

  // private 

  _attachKeyboardHandler: function (){
    this.bind('KeyDown', this._handleKeyPress);
  },

  _detachKeyboardHandler: function (){
    this.unbind('KeyDown', this._handleKeyPress);
  },

  _handleKeyPress: function (keyEvent){
    var self, active_fragment, letter_value, battle_manager, all_live_fragments;

    self = this;
    letter_value = this._translateKeyToLetter(keyEvent.key);
    battle_manager = Typewar.Engine.BattleManager;
    active_fragments = battle_manager.getActiveTextFragments();

    if(_.isEmpty(active_fragments)){
      battle_manager.cleanupLiveFragments();
      all_live_fragments = battle_manager.getAllLiveFragments();
      _.each(all_live_fragments, function (curr_frag){
        var curr_frag_ent;
        curr_frag_ent = curr_frag.getEntity();
        if(curr_frag_ent.matchFirstChar(letter_value)){
          curr_frag_ent.activate();
          curr_frag_ent.takeInput(letter_value);
          // LEFT OFF ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
          // Ok, here's the state of things: 
          // The decision to wrap text fragments with backbone models is biting me in the ass right here.  I'm getting some instances as backbone models and some as crafty entities.  Need to do a refactor of remove the TextFragmentEntity backbone model and all uses of it and change those to use crafty ents.
        }
      });
    }else{
      _.each(active_fragments, function (curr_frag){
        curr_frag.takeInput(letter_value);
      });
      // count typos if no letters match
    }

    battle_manager = null; //clear the reference

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
        return '8';
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