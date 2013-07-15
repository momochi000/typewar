/* A component specifically for enemies encountered in Typewar's battle system
 * This is the base component, other child components are made up of specific
 * monsters or enemy types and require this component, calling methods from it.
 */

Crafty.c("BattleNPCEnemy", {
  _ANIM_DELAY: 430,
  _attack_fragment_spawner: null,
  _defense_fragment_spawner: null,
  char_sheet: null,

  init: function (){
    this.requires("2D, SpriteAnimation");
  },

  battleNPCEnemy: function (char_sheet){
    this.char_sheet = char_sheet || new Typewar.Models.CharacterSheet({name: "Slime"});
    //this._attack_fragment_spawner = this._createFragmentSpawner();
    this._createFragmentSpawners();
    Crafty.bind("TextFragmentCompleted", this.textFragmentCompleted.bind(this));
    return this;
  },

  attack: function (){
    var frag, speed;

    speed = -20 * Math.random();
    frag = this._attack_fragment_spawner.generateTextFragment({speed: [speed, 0], type: 'attack'});
    frag.getEntity().drawSelf();
  },

  /* Calculates what should happen on this party's side of the combat round
   * If the player hit the enemy successfully, compute damage and play the
   * appropriate animations, trigger the appropriate events. This logic could
   * probably live somewhere else, but hey, as long as its' wrapped nicely
   * right here we should be able to pluck it out when we care to.
   */
  computeRound: function (text_fragment){
    if(text_fragment.isAttack()){
      this._resolveAttack(text_fragment);
    }else if(text_fragment.isDefense()){
      this._resolveDefense(text_fragment);
    }
  },

  defend: function (){
    var frag, speed;

    speed = -20 * Math.random();
    frag = this._defense_fragment_spawner.generateTextFragment({speed: [speed, 0], type: 'defense'});
    frag.getEntity().drawSelf();
  },

  miss: function (){
    console.log("DEBUG: SLIME: MISSED ME!!");
  },
  
  partialHit: function (){
    console.log("DEBUG: SLIME: PARTIAL HIT. OW!!! ");
    //var self = this;
    //window.setTimeout(function (){ self.animGuard(); }, this._ANIM_DELAY);
  },

  successfulDefense: function (){
    console.log("DEBUG: SLIME: DEFENDED!!! ");
    //var self = this;
    //window.setTimeout(function (){ self.animGuard(); }, this._ANIM_DELAY);
  },

  successfulHit: function (){
    var self = this;
    console.log("DEBUG: SLIME: HIT!! GOT ME GOOD D=");
    window.setTimeout(function (){ self.animHit(); }, this._ANIM_DELAY);
  },

  textFragmentCompleted: function (e){
    var completed_fragment;
    
    completed_fragment = e.text_fragment;
    this.computeRound(completed_fragment);
  },

  takeDamage: function(damage) {
    var currentHP = this.char_sheet.get("status").hp;
    var newHP = currentHP - damage;

    this.char_sheet.set({status: {hp: newHP}});
    this.updateStatus();
  },

  getStatus: function(attribute) {
    return this.char_sheet.get("status")[attribute];
  },

  getName: function() {
    return this.char_sheet.get("name");
  },

  updateStatus: function() {
    this.trigger("updateStatus");
  },

  //delete: function (){
  //  Crafty.unbind("TextFragmentCompleted", this.textFragmentCompleted);
  //  this._attack_fragment_spawner.destroy();
  //  this._defense_fragment_spawner.destroy();
  //  this.destroy();
  //},
  
  //private 

  /* Calculate a successful/unsuccessful defense based on the given fragment 
   * decide whether/how to animate, calculate damage taken, etc
   */
  _resolveDefense: function (fragment){
    if(fragment.wasPerfect()){
      this.successfulDefense();
    }
  },

  _resolveAttack: function (fragment){
    if(fragment.wasPerfect()){
      this.successfulHit();
    }else if(fragment.successPct() > 90){
      this.partialHit();
    } else {
      this.miss();
    }
  },

  _createFragmentSpawners: function (){
    this._attack_fragment_spawner = Crafty.e("2D, TextFragmentSpawner")
      .attr({x: this._x, y: this._y + 60})
      .textFragmentSpawner();

    this._defense_fragment_spawner = Crafty.e("2D, TextFragmentSpawner")
      .attr({x: this._x, y: this._y - 120})
      .textFragmentSpawner();

    this.attach(this._attack_fragment_spawner);
    this.attach(this._defense_fragment_spawner);
  }
});
