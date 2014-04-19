/* A component for common functionality between all battle entities */

Crafty.c("BattleCharacter", {
  char_sheet: null,

  init: function (){
    this.requires("2D");
  },

  battleCharacter: function (char_sheet){
    this.char_sheet = char_sheet;
    this.z = 5;

    return this;
  },

  deliverAttack: function (){
    this.animAttack();
  },

  getStatus: function (attribute){
    if(!attribute){ return this.char_sheet.get("status"); }
    return this.char_sheet.get("status")[attribute];
  },

  getName: function (){
    return this.char_sheet.get("name");
  },

  getVocabulary: function (){
    return this.char_sheet.get("vocabulary");
  },

  getPercentHP: function (){
    return 100 * (this.getStatus('hp') / this.getStatus('max_hp'));
  },

  takeDamage: function(damage) {
    var char_status;

    char_status = this.getStatus();
    char_status.hp = char_status.hp - damage;
    this.char_sheet.set({status: char_status});
    this.updateStatus();
    if(char_status.hp <= 0){ this.die(); }
    char_status = null;
  },

  updateStatus: function() {
    this.trigger("UpdateStatus");
  }
});
