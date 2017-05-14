Crafty.c("DefenseTutorial", {
  init: function (){ 
    this._defendedCount = 0;
  },

  defenseTutorial: function (count){
    this._defendedGoal = count;
    return this;
  },

  getDefenseGoal: function (){
    return this._defendedGoal;
  },

  getDefendedCount: function (){
    return this._defendedCount;
  },

  incrementDefendedCount: function (){
    this._defendedCount+=1;
  }
});
