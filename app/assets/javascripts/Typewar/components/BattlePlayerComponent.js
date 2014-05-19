Crafty.c("BattlePlayer", {
  _ANIM_HIT_DELAY: 410,
  _current_target: null,
  _fragment_spawner: null,
  stance: 'defense',

  init: function (){
    this.requires("2D, BattlePlayerAnimation, BattleCharacter");
    this._bindChangeStance();
  },

  battlePlayer: function (char_sheet){
    if(!this.char_sheet) { this._buildDefaultCharSheet(); }
    return this;
  },

  remove: function (destroyed) { },

  die: function (){
    Crafty.trigger("PlayerDied", {target: this});
  },

  getStance: function (){
    return this.stance;
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

  _bindChangeStance: function (){
    var self = this;
    this.bind("SwitchedCombatMode", function (evt){
      self.stance = evt;
      self.updateStatus();
    });
  }, 

  _buildDefaultCharSheet: function (){
    this.char_sheet = new Typewar.Models.CharacterSheet({name: "Player"});
  },

  _unbindChangeStance: function (){
    this.unbind("SwitchedCombatMode");
  }
});
