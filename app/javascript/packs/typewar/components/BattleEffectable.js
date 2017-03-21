Crafty.c("BattleEffectable", {
  init: function (){
    this._effectQueue = [];
  },

  battleEffectable: function (){ return this; },

  getEffectQueue: function (){
    return this._effectQueue;
  },

  setEffectQueue: function (newQ){
    this._effectQueue = newQ;
  }
});
