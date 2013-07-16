/* A component that creates and manages text fragments so that many
 * can be generated and fired at the player in rapid succession.
 */

Crafty.c("TextFragmentSpawner", {
  _fragment_collection: null,
  _completed_fragment_collection: null,
  _current_fragment: null,
  _current_fragment_index: null,
  _parent: null,

  init: function (){
    this.requires("2D");
    this._fragment_collection = [];
    this._completed_fragment_collection = [];
  },

  textFragmentSpawner: function (){
    Crafty.bind("TextFragmentCompleted", this.textFragmentCompleted.bind(this));
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
      this._completed_fragment_collection.push(completedFragment) 
    }
  },

  /* generateTextFragment(<hash> options) => TextFragmentEntity
   * options defines the attributes and behavior to attach to the newly
   * spawned text fragment.
   * Valid options:
   *   <string>text : the text of the fragment
   *   speed [x_spd, y_spd]
   *   <string>type : a type string to define the type of fragment. Some example
         types are 'attack' 'defense' 'special' 'combo'
   */
  generateTextFragment: function (options){
    var new_x, new_y, new_frag, new_text, new_speed, new_type;

    new_x = options["x"] || this._x;
    new_y = options["y"] || this._y + 50 - Math.random() * 100;
    new_text = options["text"] || this.generateRandomString();
    new_speed = options["speed"] || [0,0];
    new_type = options["type"] || 'attack';

    new_frag = new TextFragmentEntity({
      text: new_text,
      x: new_x,
      y: new_y,
      type: new_type,
      attacker: options.attacker,
      defender: options.defender
    });

    new_frag.getEntity().setSpeed(new_speed[0], new_speed[1]);

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
