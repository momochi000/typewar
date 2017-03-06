import {
  ZERO_ANIM_READY,
  ZERO_ANIM_LIGHT_SLASH,
  ZERO_ANIM_MED_SLASH,
  ZERO_ANIM_HEAVY_SLASH,
  ZERO_ANIM_UPPER_SLASH,
  ZERO_ANIM_BLOCK,
  ZERO_ANIM_DASH,
  ZERO_ANIM_JUMP,
  ZERO_ANIM_ENTER,
  ZERO_ANIM_CHARGE,
  ZERO_ANIM_HIT,
} from "../../constants/animation_constants"

require("crafty");

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
    this.reel(ZERO_ANIM_READY, this._READY_ANIM_SPEED, 0, 0, 4)
      .reel(ZERO_ANIM_LIGHT_SLASH, this._ATTACK_ANIM_SPEED, 0, 1, 8)
      .reel(ZERO_ANIM_MED_SLASH, this._ATTACK_ANIM_SPEED, 0, 2, 6)
      .reel(ZERO_ANIM_HEAVY_SLASH, this._ATTACK_ANIM_SPEED, 0, 3, 8)
      .reel(ZERO_ANIM_UPPER_SLASH, this._ATTACK_ANIM_SPEED, 0, 4, 8)
      .reel(ZERO_ANIM_BLOCK, this._BLOCK_ANIM_SPEED, 0, 5, 7)
      .reel(ZERO_ANIM_DASH, this._PLACEHOLDER_ANIM_SPEED, 0, 8, 3)
      .reel(ZERO_ANIM_JUMP, this._PLACEHOLDER_ANIM_SPEED, 9, 6)
      .reel(ZERO_ANIM_ENTER, this._PLACEHOLDER_ANIM_SPEED, 10, 13)
      .reel(ZERO_ANIM_CHARGE, this._PLACEHOLDER_ANIM_SPEED, 11, 7)
      .setupHitAnim()

      .bind("EnterFrame", function (e){
        if(!self.isPlaying()){ self.animReady(); }
      });
    return this;
  },

  animAttack: function (reelName){
    var attack_name, attack_names;

    if(!reelName){
      // randomize attack animation
      attack_names = [ZERO_ANIM_LIGHT_SLASH, ZERO_ANIM_MED_SLASH_ZERO_ANIM_HEAVY_SLASH, ZERO_ANIM_UPPER_SLASH];
      attack_name = attack_names[Math.floor(attack_names.length * Math.random())];
    }else{
      attack_name = reelName;
    }
    this.animate(attack_name, 0);
  },

  animBlock: function (){
    this.animate(ZERO_ANIM_BLOCK, 0);
  },

  animHit: function (){
    this.animate(ZERO_ANIM_HIT, 0);
  }, 

  animReady: function (){
    this.animate(ZERO_ANIM_READY, -1);
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

    this.reel(ZERO_ANIM_HIT, this._HIT_ANIM_SPEED, hit_anim_map);
    return this;
  }
});
