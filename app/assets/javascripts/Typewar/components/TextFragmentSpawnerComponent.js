/* A component that creates and manages text fragments so that many
 * can be generated and fired at the player in rapid succession.
 */

// TODO: do we care about the fragment collection and completed fragment 
// collection inside this component? the battle manager should probably
// be sufficient to manage that stuff, revisit whether we need this here
Crafty.c("TextFragmentSpawner", {
  _fragment_collection: null,
  _completed_fragment_collection: null,
  _current_fragment: null,
  _current_fragment_index: null,
  _parent: null, // TODO: deprecate?? don't think this is used

  init: function (){
    this.requires("2D, Collision");
    this._fragment_collection = [];
    this._completed_fragment_collection = [];
  },

  textFragmentSpawner: function (){
    // TODO: Need to revisit if this is working or not and refactor.
    Crafty.bind("TextFragmentCompleted", this.textFragmentCompleted.bind(this));
    return this;
  },

  deallocate: function (){
    Crafty.unbind("TextFragmentCompleted");
    //Crafty.unbind("TextFragmentCompleted", this.textFragmentCompleted); //TODO: Test if this works
    this._fragment_collection = null; //NOTE TEST, do we need to deallocate each fragment individually?
    this._completed_fragment_collection = null;
  },

  /* generateTextFragment(<hash> options) => TextFragmentEntity
   * options defines the attributes and behavior to attach to the newly
   * spawned text fragment.
   * Valid options:
   * <Object> : attack_object an object containing data around the attack.
   */

  generateTextFragment: function (options){
    var new_accel, x_new, y_new, new_frag, new_frag_ent, new_text, new_speed, 
      new_type, new_wiggle, y_offset;

    options = _.extend({x: this.x, y: this.y, z: this.z}, options);
    new_frag = new TextFragmentEntity(options);
    new_frag_ent = new_frag.getEntity();
    this._fragment_collection.push(new_frag_ent);
    this._registerFragmentWithBattleManager(new_frag_ent);
    new_frag_ent.drawSelf();

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

  moveCompletedFragment: function() {
    var completedFragment = this._fragment_collection.shift();
    if(completedFragment) { 
      this._completed_fragment_collection.push(completedFragment) 
    }
  },

  textFragmentCompleted: function (e){
    this.moveCompletedFragment();
  },

  //private

  // Perhaps this logic should move to the battle manager
  _adjustForWiggle: function (x, y, x_wiggle, y_wiggle){
    var x_new, y_new;

    if(Typewar.Util.coinToss()){
      x_new = x + Math.random() * x_wiggle;
    } else {
      x_new = x - Math.random() * x_wiggle;
    }
    if(Typewar.Util.coinToss()){
      y_new = y + Math.random() * y_wiggle;
    } else {
      y_new = y - Math.random() * y_wiggle;
    }
    return x_new, y_new;
  }, 

  _registerFragmentWithBattleManager: function (frag){
    Typewar.Engine.BattleManager.registerFragment(frag);
  }
});
