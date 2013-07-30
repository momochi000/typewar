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
    this.requires("2D, Collision");
    this._fragment_collection = [];
    this._completed_fragment_collection = [];
  },

  textFragmentSpawner: function (){
    Crafty.bind("TextFragmentCompleted", this.textFragmentCompleted.bind(this));
    return this;
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
   *   <string> text   : the text of the fragment
   *   <array> offset  : 
   *   <array> speed   : [x_spd, y_spd]
   *   <string>type    : a type string to define the type of fragment. Some 
   *     example types are 'attack' 'defense' 'special' 'combo'
   *   <array> accel   : [x_accel, y_accel]
   *   <array> wiggle  : [x_wiggle, y_wiggle]. An amount to randomly shift the
   *     spawn points of the generated text fragment.
   */
  generateTextFragment: function (options){
    var new_accel, x_new, y_new, new_frag, new_text, new_speed, new_type, new_wiggle, y_offset;

    x_new      = options["x"]      || this._x;
    y_new      = options["y"]      || this._y;
    if(options["offset"]) { x_new+=options["offset"][0]; y_new+=options["offset"][1];}
    new_text   = options["text"]   || this.generateRandomString();
    new_speed  = options["speed"]  || [0,0];
    new_type   = options["type"]   || 'attack';
    new_accel  = options["accel"]  || [0,0];
    new_wiggle = options["wiggle"] || false;

    if(new_wiggle){ 
      x_new, y_new = this._adjustForWiggle(x_new, y_new, wiggle[0], wiggle[1]); 
    }else{
      x_new, y_new = this._adjustForWiggle(x_new, y_new, 0, 35);
    }
    new_frag = new TextFragmentEntity({
      text: new_text,
      x: x_new,
      y: y_new,
      x_accel: new_accel[0],
      y_accel: new_accel[1],
      type: new_type,
      attacker: options.attacker,
      defender: options.defender
    });

    new_frag.getEntity().setSpeed(new_speed[0], new_speed[1]);

    console.log("DEBUG: New fragment generated at: [" +x_new+ ", " +y_new+ "] ");

    this._fragment_collection.push(new_frag);

    this._registerFragmentWithBattleManager(new_frag);

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
    return result.trim();
  },

  textFragmentCompleted: function (e){
    this.moveCompletedFragment();
  },

  //private

  // Perhaps this logic should move to the battle manager
  _adjustForWiggle: function (x, y, x_wiggle, y_wiggle){
    var x_new, y_new;

    if(this._coinToss()){
      x_new = x + Math.random() * x_wiggle;
    } else {
      x_new = x - Math.random() * x_wiggle;
    }
    if(this._coinToss()){
      y_new = y + Math.random() * y_wiggle;
    } else {
      y_new = y - Math.random() * y_wiggle;
    }
    return x_new, y_new;
  }, 

  //randomly returns true or false
  _coinToss: function (){
    return ( (Math.floor(Math.random()*2)) == 1 );
  },

  _registerFragmentWithBattleManager: function (frag){
    Typewar.Engine.BattleManager.registerFragment(frag);
  }
});
