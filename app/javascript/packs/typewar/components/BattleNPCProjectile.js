import AttackObject from "../models/attack_object";

require('crafty');


Crafty.c("BattleNPCProjectile", {
  positionFunction: null,
  speed: 1,

  init: function (){
    this.requires("2D, DOM");
  },

  battleNPCProjectile: function (positionFunction, speed){
    this.positionFunction = positionFunction;
    this.speed = speed || this.speed;

    return this;
  }
});
