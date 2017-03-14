/* A component that creates and manages text fragments so that many
 * can be generated and fired at the player in rapid succession.
 */

// TODO: Marked for deletion

require("crafty");
require("./TextFragmentDisplayComponent");
require("./BattleNPCProjectile");

Crafty.c("TextFragmentSpawner", {
  _fragment_collection: null,
  _completed_fragment_collection: null,
  _current_fragment: null,
  _current_fragment_index: null,

  init: function (){
    this.requires("2D, Collision");
    this._fragment_collection = [];
    this._completed_fragment_collection = [];
  },

  textFragmentSpawner: function (battleManagerRef){
    // TODO: Need to revisit if this is working or not and refactor.
    Crafty.bind("TextFragmentCompleted", this.textFragmentCompleted.bind(this));
    //    this._battleManagerReference = battleManagerRef;
    return this;
  },

  remove: function (destroyed){
    Crafty.unbind("TextFragmentCompleted");
    //Crafty.unbind("TextFragmentCompleted", this.textFragmentCompleted); //TODO: Test if this works
    this._fragment_collection = null; //TODO: do we need to deallocate each fragment individually?
    this._completed_fragment_collection = null;
  },

  /* generateTextFragment(<hash> options) => TextFragmentEntity
   * options defines the attributes and behavior to attach to the newly
   * spawned text fragment.
   * Valid options:
   * <Object> : attack_properties an object containing data around the attack.
   */
  generateTextFragment: function (options){
    var new_accel, x_new, y_new, new_frag, new_text, new_speed, 
      new_type, new_wiggle, y_offset;

    options = _.extend({x: this.x, y: this.y, z: this.z}, options);

    attack_properties = options.attack_properties;
    hitbox = attack_properties.hitbox;
    
    var new_frag = Crafty.e("2D, DOM, Collision, TextFragment, TextFragmentDisplay, BattleNPCAttack")
      .attr({
        x: this.x || 0, 
        y: this.y || 0, 
        z: this.z || 0, 
        //w: hitbox.w || 5, 
        //h: hitbox.h || 5
        w: 5, 
        h: 5
      })
      .collision(this._generateCollisionPolyFromRect(attack_properties.hitbox))

    console.log("DEBUG: in text fragment spawner, generating text fragment.  Options are ---------->", options);
    console.log("DEBUG: in text fragment spawner, generating text fragment.  box2d properties  are ---------->", attack_properties.box2d);
    if(!_.isEmpty(attack_properties.box2d)){ 
      new_frag.addComponent("Box2D");
      new_frag.box2d(attack_properties.box2d); 
    }

    new_frag.textFragment({text: attack_properties.text})
      .textFragmentDisplay({classesFunc: attack_properties.classesFunc})
      .battleNPCAttack(attack_properties);

    this._fragment_collection.push(new_frag);
    this._registerFragmentWithBattleManager(new_frag);
    new_frag.drawSelf();

    console.log("DEBUG: TextFragmentSpawner here! generated a new fragment.  Now returning it --------->", new_frag);

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

  // TODO: put this in a library or something, or maybe make it a crafty module
  _generateCollisionPolyFromRect: function (rect){
    return new Crafty.polygon([0,0],[rect.w,0],[rect.w,rect.h],[0,rect.h]);
  },

  //  _registerFragmentWithBattleManager: function (frag){
  //    this._battleManagerReference.registerFragment(frag);
  //  }
});
