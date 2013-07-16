/* A component specifically for enemies encountered in Typewar's battle system
 * This is the base component, other child components are made up of specific
 * monsters or enemy types and require this component, calling methods from it.
 */

Crafty.c("BattleNPCEnemy", {
  _ANIM_HIT_DELAY: 430,
  _fragment_spawner: null,
  char_sheet: null,

  init: function (){
    this.requires("2D, SpriteAnimation");
  },

  battleNPCEnemy: function (char_sheet){
    this.char_sheet = char_sheet || new Typewar.Models.CharacterSheet({name: "Slime"});
    this._createFragmentSpawner();
    return this;
  },

  deliverAttack: function (){
    this.animAttack();
  },

  initiateAttackOn: function (defender){
    var frag, speed, starting_y_pos;

    starting_y_pos = this._y + 60 + (50 - Math.random()*100);
    speed = -20 * Math.random();
    frag = this._fragment_spawner.generateTextFragment({
      y: starting_y_pos,
      speed: [speed, 0],
      attacker: this,
      defender: defender
      //type: "defense"
    });
    frag.getEntity().drawSelf();
  },

  wasMissed: function (){
    console.log("DEBUG: SLIME: MISSED ME!!");
  },
  
  partialHit: function (){
    console.log("DEBUG: SLIME: PARTIAL HIT. OW!!! ");
    var self = this;
    window.setTimeout(function (){ self.animBlock(); }, this._ANIM_HIT_DELAY);
  },

  successfulDefense: function (){
    console.log("DEBUG: SLIME: DEFENDED!!! ");
    var self = this;
    window.setTimeout(function (){ self.animBlock(); }, this._ANIM_HIT_DELAY);
  },

  successfulHit: function (){
    var self = this;
    console.log("DEBUG: SLIME: HIT!! GOT ME GOOD D=");
    window.setTimeout(function (){ self.animHit(); }, this._ANIM_HIT_DELAY);
  },

  takeDamage: function(damage) {
    var currentHP, newHP;

    damage = damage || 2;
    currentHP = this.char_sheet.get("status").hp;
    newHP = currentHP - damage;

    this.char_sheet.set({status: {hp: newHP}});
    this.updateStatus();
  },

  getStatus: function(attribute) {
    return this.char_sheet.get("status")[attribute];
  },

  getName: function() {
    return this.char_sheet.get("name");
  },

  getPercentHP: function() {
    return 100 * this.char_sheet.get("status").hp / this.char_sheet.defaults.status.hp;
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

  _createFragmentSpawner: function (){
    this._fragment_spawner = Crafty.e("2D, TextFragmentSpawner")
      .attr({x: this._x, y: this._y})
      .textFragmentSpawner();

    this.attach(this._fragment_spawner);
  }
});
