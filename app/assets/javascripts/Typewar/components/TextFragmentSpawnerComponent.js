/* A component that creates and manages text fragments so that many
 * can be generated and fired at the player in rapid succession.
 */

Crafty.c("TextFragmentSpawner", {
  _fragment_collection: null,
  _completed_fragment_collection: null,
  _current_fragment: null,
  _current_fragment_index: null,

  init: function (){
    this.requires("2D");
    this._fragment_collection = [];
    this._completed_fragment_collection = [];
  },

  textFragmentSpawner: function (){
    Crafty.bind("TextFragmentCompleted", _.bind(this.textFragmentCompleted, this));
    return this;
  },

  activateNextFragment: function() {
    if(this._fragment_collection.length > 0) {
      this._fragment_collection[0].activate();
    }
  },

  moveCompletedFragment: function() {
    var completedFragment = this._fragment_collection.shift();
    if(completedFragment) { 
      this._completed_fragment_collection.shift(completedFragment) 
    }

  },

  generateTextFragment: function (text, speed){
    var new_frag, new_text;

    new_text = text || this.generateRandomString();
    speed = speed || [0,0];

    new_frag = new TextFragmentEntity({
      text: new_text,
      x: this._x,
      y: this._y + 50 - Math.random() * 100
    });

    new_frag.getEntity().setSpeed(speed[0], speed[1]);

    this._fragment_collection.push(new_frag);

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
  },

  textFragmentCompleted: function (e){
    this.moveCompletedFragment();
    this.activateNextFragment();
  }

  //private
});
