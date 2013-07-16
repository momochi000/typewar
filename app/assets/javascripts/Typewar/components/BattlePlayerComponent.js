Crafty.c("BattlePlayer", {
  char_sheet: null,
  _ANIM_HIT_DELAY: 430,

  init: function (){
    this.requires("2D, BattlePlayerAnimation");
  },

  battlePlayer: function (char_sheet){
    var self = this;

    this.char_sheet = char_sheet || new Typewar.Models.CharacterSheet({name: "Player"});

    return this;
  },

  deliverAttack: function (){
    this.animAttack();
    // deal damage to target?
    // build up special meter?
  },

  handleBeingAttacked: function(e) {
    //stub for now, but could play animation or etc.
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
  
  partialHit: function (){
    var self = this;
    console.log("DEBUG: PLAYER: PARTIAL HIT. OW!!! ");
    window.setTimeout(function (){ self.animBlock(); }, this._ANIM_HIT_DELAY);
  },

  successfulDefense: function (){
    var self = this;
    console.log("DEBUG: PLAYER: DEFENDED!!! ");
    window.setTimeout(function (){ self.animBlock(); }, this._ANIM_HIT_DELAY);
  },

  successfulHit: function (){
    var self = this;
    console.log("DEBUG: PLAYER: HIT!! GOT ME GOOD D=");
    window.setTimeout(function (){ self.animHit(); }, this._ANIM_HIT_DELAY);
  },

  takeDamage: function (){
  },

  updateStatus: function() {
    this.trigger("updateStatus");
  },

  wasMissed: function (){
  }
});

