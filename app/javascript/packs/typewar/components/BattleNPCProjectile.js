import AttackObject from "../models/attack_object";

require('crafty');


Crafty.c("BattleNPCProjectile", {
  positionFunction: null,
  speed: 1,

  init: function (){
    this.requires("2D, DOM, Collision");
  },

  battleNPCProjectile: function (positionFunction, speed){
    this.positionFunction = positionFunction;
    this.speed = speed || this.speed;

    this.onHit("BattlePlayer", this._handlePlayerHit.bind(this));
    return this;
  },

  _handlePlayerHit: function (hitDatas){
    // NOTE: can also attach the hit data to this added component so that we
    // can access it in the projectile system where the damage is evaluated
    // for now we can just assume it's the player
    console.log("DEBUG: the player was hit by a projectile.!!!!!!");
    this.addComponent("BattleNPCProjectileHit");
  }
});
