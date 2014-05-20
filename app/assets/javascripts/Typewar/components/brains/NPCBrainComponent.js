Crafty.c("NPCBrain", {
  init: function (){
    this.requires("BattleNPCEnemy");
  },

  nPCBrain: function (){ 
    this._is_active = null;
    this._bindAIOnPause();
    return this; 
  },

  remove: function (){
    this._clearBattleTimer();
  },

  activateAI: function (){
    this._activate();
  },

  deactivateAI: function (){
    this._deactivate();
  },

  isActive: function (){
    return this._is_active;
  },

  // private

  _activate: function (){
    var self = this;

    this._is_active = true;
    if(!this._current_target){ return false; }
    if(!this.battle_timer){
      this.battle_timer = window.setInterval(function() {
        if(self._is_active){
          self.initiateAttackOn(self._current_target);
        }
      }, 2000);
    }
  },

  _bindAIOnPause: function (){
    var self = this;
    this.bind("Pause", function (){ self._deactivate(); });
    this.bind("Unpause", function (){
      if(self._is_active === false){ self._is_active = true; }
    });
  },

  _clearBattleTimer: function (){
    if(this.battle_timer){ window.clearInterval(this.battle_timer); }
  },

  _deactivate: function (){
    this._is_active = false;
  },

  _unbindAIOnPause: function (){
    this.unbind("Pause");
    this.unbind("Unpause");
  }
});
