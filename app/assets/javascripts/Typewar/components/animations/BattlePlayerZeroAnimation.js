Crafty.c("BattlePlayerZeroAnim", {
  _ATTACK_ANIM_SPEED: 380,
  _BLOCK_ANIM_SPEED: 480,
  _HIT_ANIM_SPEED: 320,
  _READY_ANIM_SPEED: 900,
  _PLACEHOLDER_ANIM_SPEED: 700,

  init: function (){
    this.requires("SpriteAnimation");
  },

  battlePlayerZeroAnim: function (){
    var self = this;
    this.reel("ready", this._READY_ANIM_SPEED, 0, 0, 4)
      .reel("attack1", this._ATTACK_ANIM_SPEED, 0, 1, 8)
      .reel("attack2", this._ATTACK_ANIM_SPEED, 0, 2, 6)
      .reel("attack3", this._ATTACK_ANIM_SPEED, 0, 3, 8)
      .reel("attack4", this._ATTACK_ANIM_SPEED, 0, 4, 8)
      .reel("block", this._BLOCK_ANIM_SPEED, 0, 5, 7)
      .reel("dash", this._PLACEHOLDER_ANIM_SPEED, 0, 8, 3)
      .reel("jump", this._PLACEHOLDER_ANIM_SPEED, 9, 6)
      .reel("enter", this._PLACEHOLDER_ANIM_SPEED, 10, 13)
      .reel("charge", this._PLACEHOLDER_ANIM_SPEED, 11, 7)
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
    this.animate(attack_name, 0);
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

  playAnim: function (reel_id){
    if(!reel_id) {throw "ERROR: No reel id passed to play animation"; }
    this.animate(reel_id, 0);
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

    this.reel("hit", this._HIT_ANIM_SPEED, hit_anim_map);
    return this;
  }
});
