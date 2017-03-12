require('crafty');

import { 
  SLIME_ANIM_READY, SLIME_ANIM_SLASH, SLIME_ANIM_THROW, SLIME_ANIM_BLOCK, SLIME_ANIM_HIT 
} from "../../constants/animation_constants"

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
    this.reel(SLIME_ANIM_READY, this._READY_ANIM_SPEED, 0, 0, 4)
      .reel(SLIME_ANIM_HIT, this._HIT_ANIM_SPEED, 0, 1, 7)
      .reel(SLIME_ANIM_SLASH, this._ATTACK_ANIM_SPEED, 0, 2, 7)
      .reel(SLIME_ANIM_THROW, this._ATTACK_ANIM_SPEED, 0, 4, 8)
      .reel(SLIME_ANIM_BLOCK, this._BLOCK_ANIM_SPEED, 0, 3, 7)
      .bind("EnterFrame", function (e){
        if(!self.isPlaying()){ self.animReady(); }
      });
    return this;
  },

  animAttack: function (anim){
    anim = anim || SLIME_ANIM_THROW;
    this.animate(anim, 0);
  },

  animBlock: function (){
    this.animate(SLIME_ANIM_BLOCK, 0);
  },

  animHit: function (){
    this.animate(SLIME_ANIM_HIT, 0);
  },

  animReady: function (){
    this.animate(SLIME_ANIM_READY, -1);
  },
});
