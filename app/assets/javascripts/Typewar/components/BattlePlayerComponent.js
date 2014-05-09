Crafty.c("BattlePlayer", {
  _current_target: null,
  _fragment_spawner: null,
  _ANIM_HIT_DELAY: 410,

  init: function (){
    this.requires("2D, BattlePlayerAnimation, BattleCharacter");
  },

  battlePlayer: function (char_sheet){
    if(!this.char_sheet) { this._buildDefaultCharSheet(); }
    return this;
  },

  remove: function (destroyed) {
  },

  die: function (){
    Crafty.trigger("PlayerDied", {target: this});
  },

  getTarget: function (){
    return this._current_target;
  },

  isPlayer: function (){ return true; },
  isNPC: function (){ return false; },
 
  partialHit: function (){
    var self = this;
    console.log("DEBUG: PLAYER: PARTIAL HIT. OW!!! ");
    //window.setTimeout(function (){ self.animBlock(); }, this._ANIM_HIT_DELAY);
    self.animBlock();
  },

  setTarget: function (target){
    this._current_target = target;
  },

  successfulDefense: function (){
    console.log("DEBUG: PLAYER: DEFENDED!!! ");
    this.animBlock();
  },

  successfulHit: function (){
    console.log("DEBUG: PLAYER: HIT!! GOT ME GOOD D=");
    this.animHit();
  },

  wasMissed: function (){ },

  // private
  _buildDefaultCharSheet: function (){
    this.char_sheet = new Typewar.Models.CharacterSheet({name: "Player"});
  }
});
