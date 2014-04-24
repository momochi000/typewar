Crafty.c("BattleSlimeAnim", {
  _ATTACK_ANIM_SPEED: 500,
  _BLOCK_ANIM_SPEED: 270,
  _HIT_ANIM_SPEED: 280,
  _READY_ANIM_SPEED: 600,

  init: function (){
    this.requires("SpriteAnimation");
  },

  battleSlimeAnim: function (){
    var self = this;
    this.reel("ready", this._READY_ANIM_SPEED, 0, 0, 4)
      .reel("hit", this._HIT_ANIM_SPEED, 0, 1, 7)
      .reel("attack1", this._ATTACK_ANIM_SPEED, 0, 2, 7)
      .reel("attack2", this._ATTACK_ANIM_SPEED, 0, 4, 8)
      .reel("block", this._BLOCK_ANIM_SPEED, 0, 3, 7)
      .bind("EnterFrame", function (e){
        if(!self.isPlaying()){ self.animReady(); }
      });
    return this;
  },

  animAttack: function (anim){
    anim = anim || "attack2";
    this.animate(anim, 0);
  },

  animBlock: function (){
    this.animate("block", 0);
  },

  animHit: function (){
    this.animate("hit", 0);
  },

  animReady: function (){
    this.animate("ready", -1);
  },
});
