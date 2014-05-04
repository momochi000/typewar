Crafty.c("BattlePlayer", {
  _current_target: null,
  _fragment_spawner: null,
  _ANIM_HIT_DELAY: 410,

  init: function (){
    this.requires("2D, BattlePlayerAnimation, BattleCharacter");
  },

  battlePlayer: function (char_sheet){
    if(!this.char_sheet) { 
      this.char_sheet = new Typewar.Models.CharacterSheet({name: "Player"});
    }

    return this;
  },

  remove: function (destroyed) {
  },

  die: function (){
    Crafty.trigger("PlayerDied", {target: this});
  },

  initiateAttackOn: function (defender){
    var frag, speed, text_fragment_options, next_text;

    text_fragment_options = Typewar.Engine.BattleManager.handleAttack({
      attacker: this,
      defender: defender,
      attack: this.attacks['standard']
    });

    frag = this._fragment_spawner.generateTextFragment({
      attack_properties: text_fragment_options
    });
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
});
