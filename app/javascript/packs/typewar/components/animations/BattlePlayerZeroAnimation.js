import { 
  ANIM_READY, ANIM_LIGHT_ATTACK, ANIM_MED_ATTACK, ANIM_HEAVY_ATTACK, ANIM_SPECIAL_ATTACK, ANIM_BLOCK, ANIM_DASH, ANIM_JUMP, ANIM_ENTER, ANIM_CHARGE, ANIM_HIT
} from "../../constants/animation_constants"

require("crafty");

const ZERO_ANIM_READY = "ZERO_READY";
const ZERO_ANIM_LIGHT_SLASH = "ZERO_LIGHT_SLASH";
const ZERO_ANIM_MED_SLASH = "ZERO_MED_SLASH";
const ZERO_ANIM_HEAVY_SLASH = "ZERO_HEAVY_SLASH";
const ZERO_ANIM_UPPER_SLASH = "ZERO_UPPER_SLASH";
const ZERO_ANIM_BLOCK = "ZERO_BLOCK";
const ZERO_ANIM_DASH = "ZERO_DASH";
const ZERO_ANIM_JUMP = "ZERO_JUMP";
const ZERO_ANIM_ENTER = "ZERO_ENTER";
const ZERO_ANIM_CHARGE = "ZERO_CHARGE";
const ZERO_ANIM_HIT = "ZERO_HIT";


const ZERO_ANIMATION_MAP = {
  ANIM_READY: ZERO_ANIM_READY,
  ANIM_LIGHT_ATTACK: ZERO_ANIM_LIGHT_SLASH,
  ANIM_MED_ATTACK: ZERO_ANIM_MED_SLASH,
  ANIM_HEAVY_ATTACK: ZERO_ANIM_HEAVY_SLASH,
  ANIM_SPECIAL_ATTACK: ZERO_ANIM_UPPER_SLASH,
  ANIM_GUARD: ZERO_ANIM_BLOCK,
  ANIM_DASH: ZERO_ANIM_DASH,
  ANIM_JUMP: ZERO_ANIM_JUMP,
  ANIM_ENTER: ZERO_ANIM_ENTER,
  ANIM_CHARGE: ZERO_ANIM_CHARGE,
  ANIM_HIT: ZERO_ANIM_HIT
};

const ATTACK_ANIM_SPEED = 380;
const BLOCK_ANIM_SPEED = 480;
const HIT_ANIM_SPEED = 320;
const READY_ANIM_SPEED = 900;
const PLACEHOLDER_ANIM_SPEED = 700;

Crafty.c("BattlePlayerZeroAnimation", {
  init: function (){
    this.requires("SpriteAnimation");
  },

  battlePlayerZeroAnimation: function (){
    var self = this;
    this.reel(ZERO_ANIM_READY, READY_ANIM_SPEED, 0, 0, 4)
      .reel(ZERO_ANIM_LIGHT_SLASH, ATTACK_ANIM_SPEED, 0, 1, 8)
      .reel(ZERO_ANIM_MED_SLASH, ATTACK_ANIM_SPEED, 0, 2, 6)
      .reel(ZERO_ANIM_HEAVY_SLASH, ATTACK_ANIM_SPEED, 0, 3, 8)
      .reel(ZERO_ANIM_UPPER_SLASH, ATTACK_ANIM_SPEED, 0, 4, 8)
      .reel(ZERO_ANIM_BLOCK, BLOCK_ANIM_SPEED, 0, 5, 7)
      .reel(ZERO_ANIM_DASH, PLACEHOLDER_ANIM_SPEED, 0, 8, 3)
      .reel(ZERO_ANIM_JUMP, PLACEHOLDER_ANIM_SPEED, 9, 6)
      .reel(ZERO_ANIM_ENTER, PLACEHOLDER_ANIM_SPEED, 10, 13)
      .reel(ZERO_ANIM_CHARGE, PLACEHOLDER_ANIM_SPEED, 11, 7)
      ._setupHitAnim()

      .bind("EnterFrame", function (e){
        if(!self.isPlaying()){ self.playAnim(ANIM_READY); }
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

  playAnim: function (animationType){
    this._playAnim(ZERO_ANIMATION_MAP[animationType]);
  },

  // private

  _playAnim: function (reel_id){
    if(!reel_id) {throw "ERROR: No reel id passed to play animation"; }
    this.animate(reel_id, 0);
  },
  _setupHitAnim: function (){
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

    this.reel(ZERO_ANIM_HIT, HIT_ANIM_SPEED, hit_anim_map);
    return this;
  },

});
