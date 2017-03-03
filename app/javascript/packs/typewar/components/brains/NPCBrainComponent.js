require('crafty');

Crafty.c("NPCBrain", {
  init: function (){
    this.requires("BattleNPCEnemy, NPCSkillManager");
  },

  nPCBrain: function (){ 
    this._is_active = null;
    this._bindAIOnPause();
    return this; 
  },

  remove: function (){
    this._clearBattleTimer();
    this._unbindAIOnPause();
  },

  activateAI: function (){
    this._is_active = true;
    if(!this._current_target){ return false; }
    if(!this.battle_timer){ this._initBattleTimer(); }
  },

  deactivateAI: function (){
    this._is_active = false;
  },

  isActive: function (){
    return this._is_active;
  },

  // private

  _aiCycle: function (){
    this.trigger("initiateAttackOn", this._current_target);
  },

  _bindAIOnPause: function (){
    var self = this;
    this.bind("Pause", function (){ self.deactivateAI(); });
    this.bind("Unpause", function (){ self.activateAI(); });
  },

  _clearBattleTimer: function (){
    if(this.battle_timer){ window.clearInterval(this.battle_timer); }
  },

  _initBattleTimer: function (){
    var self = this;

    this.battle_timer = window.setInterval(function() {
      if(self._is_active){
        self._aiCycle();
      }
    }, 5000);
  },

  _unbindAIOnPause: function (){
    this.unbind("Pause");
    this.unbind("Unpause");
  }
});
