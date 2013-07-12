/* A component that creates and manages text fragments so that many
 * can be generated and fired at the player in rapid succession.
 */

Crafty.c("TextFragmentSpawner", {
  _fragment_collection: null,
  _current_fragment: null,
  _current_fragment_index: null,

  init: function (){
    this.requires("2D");
    this._fragment_collection = [];
  },

  textFragmentSpawner: function (){
    return this;
  },

  activateNextFragment: function (){
    var next_frag;
    if(!this._current_fragment){
      this._current_fragment = this._fragment_collection[this._current_fragment_index];
    }else{
      if(this._current_fragment.is_complete){ 
        this._current_fragment_index++;
        this._current_fragment = this._fragment_collection[this._current_fragment_index];
        this._current_fragment.activate();
      }
    }
  },

  generateTextFragment: function (text, speed){
    var new_frag, new_text;

    new_text = text || this.generateRandomString();
    speed = speed || [0,0];

    new_frag = new TextFragmentEntity({
      text: new_text,
      x: this._x,
      y: this._y
    });

    new_frag.getEntity().setSpeed(speed[0], speed[1]);

    this._fragment_collection.push(new_frag);
    this._current_fragment_index = (this._current_fragment_index ? this._current_fragment_index+1 : 0)

    this.activateNextFragment();

    return new_frag;
  },

  generateRandomString: function (length){
    var i, l, valid_chars, result;

    valid_chars = '0123456789abcdefghijklmnopqrstuvwxyz   ';
    l = length || 12; 
    result = '';

    for (i = l; i > 0; --i) {
      result += valid_chars[Math.round(Math.random() * (valid_chars.length - 1))];
    }
    return result;
  }

  //private
});