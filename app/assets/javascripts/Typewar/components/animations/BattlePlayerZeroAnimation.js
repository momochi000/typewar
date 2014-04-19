Crafty.c("BattlePlayerZeroAnim", {
  _ATTACK_ANIM_SPEED: 8,
  _BLOCK_ANIM_SPEED: 18,
  _HIT_ANIM_SPEED: 32,
  _READY_ANIM_SPEED: 49,

  init: function (){
    this.requires("SpriteAnimation");
  },

  battlePlayerZeroAnim: function (){
    var self = this;
    this.animate("ready", 0, 0, 4)
      .animate("attack1", 0, 1, 8)
      .animate("attack2", 0, 2, 6)
      .animate("attack3", 0, 3, 8)
      .animate("attack4", 0, 4, 8)
      .animate("block", 0, 5, 7)
      .animate("dash", 0, 8, 3)
      .animate("jump", 0, 9, 6)
      .animate("enter", 0, 10, 13)
      .animate("charge", 0, 11, 7)
      .setupHitAnim()

      .bind("EnterFrame", function (e){
        if(!self.isPlaying()){ self.animReady(); }
      });
    return this;
  },

  animAttack: function (anim){
    var attack_name, attack_names;

    if(!anim){
      // randomize attack animation
      attack_names = ["attack1", "attack2", "attack3", "attack4"];
      attack_name = attack_names[Math.floor(attack_names.length * Math.random())];
    }else{
      attack_name = anim;
    }
    this.stop().animate(attack_name, this._ATTACK_ANIM_SPEED, 0);
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

  // private
  setupHitAnim: function (){
    var hit_anim_map;

    hit_anim_map = [
      [0,6], [1,6],
      [0,7], [1,7],
      [0,6], [1,6],
      [0,7], [1,7],
      [0,6], [1,6],
      [0,7], [1,7],
      [0,6], [1,6],
      [0,7], [1,7],
      [0,6], [1,6],
      [0,7], [1,7]
    ]

    this.animate("hit", hit_anim_map);
    return this;
  }
});
