require('crafty');

Crafty.c("BattleNPCBrain", {
  _isActive: false,
  init: function (){
    this.requires("BattleNPCEnemy");
  },

  battleNPCBrain: function (){ 
    this._bindAIOnPause();
    return this; 
  },

  remove: function (){
    this._clearBattleTimer();
    this._unbindAIOnPause();
  },

  activateAI: function (){
    this._isActive = true;
    if(!this._currentTarget){ return false; }
  },

  deactivateAI: function (){
    this._isActive = false;
  },

  isActive: function (){
    return this._isActive;
  },

  // private

  _aiCycle: function (){
    this.trigger("initiateAttackOn", this._currentTarget);
  },

  _bindAIOnPause: function (){
    Crafty.bind("Pause", this.deactivateAI.bind(this));
    Crafty.bind("Unpause", this.activateAI.bind(this));
  },

  _unbindAIOnPause: function (){
    Crafty.unbind("Pause", this.deactivateAI);
    Crafty.unbind("Unpause", this.activateAI);
  }
});
