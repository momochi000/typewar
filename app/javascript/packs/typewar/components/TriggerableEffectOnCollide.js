require("crafty");
Crafty.c("TriggerableEffectOnCollide", {
  init: function (){
    this.requires("2D, Collision");
  },

  triggerableEffectOnCollide: function (options){
    this._source = options.source;
    this._target = options.target;
    this._effects = options.effects;
    this._targetComponent = options.targetComponent;
    this.onHit(this._targetComponent, this._handleTargetHit.bind(this));

    return this;
  },

  getEffects: function (){
    return this._effects;
  },

  getSource: function (){
    return this._source;
  },

  getTarget: function (){
    return this._target;
  },

  getTargetComponent: function (){
    return this._targetComponent;
  },

  _handleTargetHit: function (hitDatas){
    // NOTE: can also attach the hit data to this added component so that we
    // can access it in the projectile system where the damage is evaluated
    // for now we can just assume it's the player
    console.log("DEBUG: the player was hit by a projectile.!!!!!!");
    this.addComponent("TriggerableEffectOnCollideHit");
  }
});
