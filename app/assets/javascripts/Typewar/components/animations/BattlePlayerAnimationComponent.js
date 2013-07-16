Crafty.c("BattlePlayerAnim", {
  _ATTACK_ANIM_SPEED: 8,
  _BLOCK_ANIM_SPEED: 18,
  _HIT_ANIM_SPEED: 16,
  _READY_ANIM_SPEED: 29,

  init: function (){
    this.requires("SpriteAnimation");
  },

  battlePlayerAnim: function (){
    var self = this;
    this.animate("ready", 0, 0, 6)
      .animate("hit", 0, 1, 6)
      .animate("attack1", 0, 2, 6)
      .animate("block", 0, 3, 6)
      .bind("EnterFrame", function (e){
        if(!self.isPlaying()){ self.animReady(); }
      });
    return this;
  },

  animAttack: function (){
    this.stop().animate("attack1", this._ATTACK_ANIM_SPEED, 0);
  },

  animBlock: function (){
    this.stop().animate("block", this._BLOCK_ANIM_SPEED, 0);
  },

  animHit: function (){
    this.stop().animate("hit", this._HIT_ANIM_SPEED, 0);
  }, 

  animReady: function (){
    this.animate("ready", this._READY_ANIM_SPEED, -1);
  }
});
