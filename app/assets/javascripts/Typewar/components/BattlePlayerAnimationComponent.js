Crafty.c("BattlePlayerAnimation", {
  _READY_ANIM_SPEED: 29,
  _ATTACK_ANIM_SPEED: 8,

  init: function (){
    this.requires("SpriteAnimation");
  },

  battlePlayerAnimation: function (){
    var self = this;
    this.animate("ready", 0, 0, 6)
      .animate("hit", 0, 1, 6)
      .animate("attack1", 0, 2, 6)
      .bind("EnterFrame", function (e){
        if(!self.isPlaying()){ self.animReady(); }
      });
    return this;
  },

  animAttack: function (){
    this.stop().animate("attack1", this._ATTACK_ANIM_SPEED, 0);
  },

  animReady: function (){
    this.animate("ready", this._READY_ANIM_SPEED, -1);
  },
});
