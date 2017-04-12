Crafty.c("BattleParticles", {
  init: function (){
    this._triggerParticles = false;
    this._particleBuffer = [];
  },
  battleParticles: function () { return this; },

  getParticleBuffer: function (){ return this._particleBuffer; },
  setParticleBuffer: function (new_buf){ this._particleBuffer = new_buf; },
  needTriggerParticles: function (){ return this._triggerParticles; },
  triggerParticles: function () { this._triggerParticles = true; }
});
