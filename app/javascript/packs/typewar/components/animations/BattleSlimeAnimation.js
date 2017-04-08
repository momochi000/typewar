

import { 
  ANIM_READY, ANIM_LIGHT_ATTACK, ANIM_MED_ATTACK, ANIM_HEAVY_ATTACK, ANIM_SPECIAL_ATTACK, ANIM_BLOCK, ANIM_DASH, ANIM_JUMP, ANIM_ENTER, ANIM_CHARGE, ANIM_HIT
} from "../../constants/animation_constants"

const SLIME_ANIM_READY = "SLIME_READY";
const SLIME_ANIM_SLASH = "SLIME_SLASH";
const SLIME_ANIM_THROW = "SLIME_THROW";
const SLIME_ANIM_BLOCK = "SLIME_BLOCK";
const SLIME_ANIM_HIT = "SLIME_HIT";

const SLIME_ANIMATION_MAP = {
  ANIM_READY: SLIME_ANIM_READY,
  ANIM_LIGHT_ATTACK: SLIME_ANIM_SLASH,
  ANIM_MED_ATTACK: SLIME_ANIM_SLASH,
  ANIM_HEAVY_ATTACK: SLIME_ANIM_THROW,
  ANIM_SPECIAL_ATTACK: SLIME_ANIM_THROW,
  ANIM_GUARD: SLIME_ANIM_BLOCK,
  ANIM_DASH: '',
  ANIM_JUMP: '',
  ANIM_ENTER: '',
  ANIM_CHARGE: '',
  ANIM_HIT: SLIME_ANIM_HIT 
};

const ATTACK_ANIM_SPEED = 500;
const BLOCK_ANIM_SPEED = 270;
const HIT_ANIM_SPEED = 420;
const READY_ANIM_SPEED = 600;

Crafty.c("BattleSlimeAnimation", {

  init: function (){
    this.requires("SpriteAnimation");
  },

  battleSlimeAnimation: function (){
    var self = this;
    this.reel(SLIME_ANIM_READY, READY_ANIM_SPEED, 0, 0, 4)
      .reel(SLIME_ANIM_HIT, HIT_ANIM_SPEED, 0, 1, 7)
      .reel(SLIME_ANIM_SLASH, ATTACK_ANIM_SPEED, 0, 2, 7)
      .reel(SLIME_ANIM_THROW, ATTACK_ANIM_SPEED, 0, 4, 8)
      .reel(SLIME_ANIM_BLOCK, BLOCK_ANIM_SPEED, 0, 3, 7)
      .bind("EnterFrame", function (e){
        if(!self.isPlaying()){ self.playAnim(ANIM_READY); }
      });
    return this;
  },

  playAnim: function (animationType){
    this._playAnim(SLIME_ANIMATION_MAP[animationType]);
  },

  _playAnim: function (reel_id){
    if(!reel_id) {
      throw new Error("ERROR: No reel id passed to play animation"); 
    }
    this.animate(reel_id, 0);
  }
});
