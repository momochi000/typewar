Crafty.c("BattleSlimeAnim", {
  _READY_ANIM_SPEED: 39,
  _ATTACK_ANIM_SPEED: 25,
  _BLOCK_ANIM_SPEED: 15,
  _HIT_ANIM_SPEED: 18,

  init: function (){
    this.requires("SpriteAnimation");
  },

  battleSlimeAnim: function (){
    var self = this;
    this.animate("ready", 0, 0, 4)
      .animate("hit", 0, 1, 7)
      .animate("attack1", 0, 2, 7)
      .animate("block", 0, 3, 7)
      .bind("EnterFrame", function (e){
        if(!self.isPlaying()){ self.animReady(); }
      });
    return this;
  },

  animAttack: function (){
    this.stop().animate("attack1", this._ATTACK_ANIM_SPEED, 0);
  },

  animBlock: function (){
    this.stop().animate("block", this._ATTACK_ANIM_SPEED, 0);
  },

  animHit: function (){
    this.stop().animate("hit", this._ATTACK_ANIM_SPEED, 0);
  },

  animReady: function (){
    this.animate("ready", this._READY_ANIM_SPEED, -1);
  },
});
