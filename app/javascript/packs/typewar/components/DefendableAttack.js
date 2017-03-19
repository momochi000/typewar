Crafty.c("DefendableAttack", {
  init: function (){},
  defendableAttack: function (options){ 
    return this; 
  },

  acceptInput: function (input){
    return this.takeInput(input);
  },

  cancel: function (){
    this._textFragFsm.cancel();
  }
});
