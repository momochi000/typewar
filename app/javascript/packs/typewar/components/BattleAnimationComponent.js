/* A component that manages battle animations.  This defines a base class 
 * that will be overwritten by specific enemies (maybe)
 * Mainly it's going to define an interface of what sorts of animations any 
 * NPC in battle are going to respond to.
 * Standard battle stance animation
 * Alternate stances? 
 * A set of standard attacks,
 * A set of hit animations
 * Wounded battle stance, etc etc.
 */



Crafty.c("BattleAnimation", {
  _ANIM_SPEED: 10,
  init: function (){
    this.requires("SpriteAnimation");
  },

  battleAnimation: function (){
    return this;
  },
  animAttack: function (){},
  animReady: function (){},
  animHit: function (){}
});
