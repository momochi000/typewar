Crafty.c("NPCBrain", {
  init: function (){
    this.requires("BattleNPCEnemy");
  },

  nPCBrain: function (){ return this; },

  activateAI: function (){
    this._activate();
  },

  deactivateAI: function (){
    this._deactivate();
  },

  //private
  _activate: function (){
    var self = this;

    if(!this._current_target){ return false; }
    this.battle_timer = window.setInterval(function() {
      self.initiateAttackOn(self._current_target);
    }, 7000);
  },

  _deactivate: function (){
    if(this.battle_timer){ window.clearInterval(this.battle_timer); }
  }

});
