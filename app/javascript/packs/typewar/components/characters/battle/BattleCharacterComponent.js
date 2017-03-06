/* A component for common functionality between all battle entities */

require('crafty');

Crafty.c("BattleCharacter", {
  charSheet: null,
  _currentTarget: null,
  _model: null,

  init: function (){
    this.requires("2D");
  },

  battleCharacter: function (charSheet){
    this.charSheet = charSheet;
    this.z = 5;

    return this;
  },

  remove: function (destroyed){
    this.z = -9999;
  },

  getStatus: function (){
    return this.charSheet.data.status;
  },

  getName: function (){
    return this.charSheet.data.name;
  },

  getTarget: function (){
    return this._currentTarget;
  },

  getVocabulary: function (){
    return this.charSheet.data.vocabulary;
  },

  getPercentHP: function (){
    return 100 * (this.getStatus().hp / this.getStatus().maxHp);
  },

  setTarget: function (target){
    this._currentTarget = target;
  },

  takeDamage: function(damage) {
    var char_status;

    char_status = this.getStatus();
    char_status.hp = char_status.hp - damage;
    this.charSheet.data.status = char_status;
    this.updateStatus();
    if(char_status.hp <= 0){ this.die(); }
    char_status = null;
  },

  updateStatus: function() {
    this.trigger("UpdateStatus");
  }
});
