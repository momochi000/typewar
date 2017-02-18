require('crafty');

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
    this.reel("ready", this._READY_ANIM_SPEED, 0, 0, 6)
      .reel("hit", this._HIT_ANIM_SPEED, 0, 1, 6)
      .reel("attack1", this._ATTACK_ANIM_SPEED, 0, 2, 6)
      .reel("block", this._BLOCK_ANIM_SPEED, 0, 3, 6)
      .bind("EnterFrame", function (e){
        if(!self.isPlaying()){ self.animReady(); }
      });
    return this;
  },

  animAttack: function (){
    this.animate("attack1", 0);
  },

  animBlock: function (){
    this.animate("block", 0);
  },

  animHit: function (){
    this.animate("hit", 0);
  }, 

  animReady: function (){
    this.animate("ready", -1);
  }
});
