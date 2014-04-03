Crafty.c("BattleSlimeAnim", {
  _ATTACK_ANIM_SPEED: 23,
  _BLOCK_ANIM_SPEED: 17,
  _HIT_ANIM_SPEED: 18,
  _READY_ANIM_SPEED: 39,

  init: function (){
    this.requires("SpriteAnimation");
  },

  battleSlimeAnim: function (){
    var self = this;
    this.animate("ready", 0, 0, 4)
      .animate("hit", 0, 1, 7)
      .animate("attack1", 0, 2, 7)
      .animate("attack2", 0, 4, 8)
      .animate("block", 0, 3, 7)
      .bind("EnterFrame", function (e){
        if(!self.isPlaying()){ self.animReady(); }
      });
    return this;
  },

  animAttack: function (){
    this.stop().animate("attack2", this._ATTACK_ANIM_SPEED, 0);
  },

  animBlock: function (){
    this.stop().animate("block", this._BLOCK_ANIM_SPEED, 0);
  },

  animHit: function (){
    this.stop().animate("hit", this._HIT_ANIM_SPEED, 0);
  },

  animReady: function (){
    this.animate("ready", this._READY_ANIM_SPEED, -1);
  },
});
