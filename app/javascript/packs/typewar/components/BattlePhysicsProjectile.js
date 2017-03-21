Crafty.c("BattlePhysicsProjectile", {
  _deadCount: null,

  init: function (){
    this._deadCount = 0;
  },

  battlePhysicsProjectile: function () { return this; },

  getDeadCounter: function (){
    return this._deadCount;
  },

  setDeadCounter: function (newCount){
    this._deadCount = newCount;
  }
});
