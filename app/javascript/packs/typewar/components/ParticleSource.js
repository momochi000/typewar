Crafty.c("ParticleSource", {
  init: function (){
    this._startFrame = null;
    this._deleteMe = false;
  },
  particleSource: function (startFrame) { 
    this._startFrame = startFrame;
    return this; 
  },
  getStartFrame: function (){ return this._startFrame; },
  getDestroyFlag: function () { return this._deleteMe; },
  setDestroyFlag: function (value){ this._deleteMe = value; }
});
