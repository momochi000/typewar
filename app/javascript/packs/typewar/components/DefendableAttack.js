Crafty.c("DefendableAttack", {
  init: function (){},
  defendableAttack: function (){ return this; },

  cancel: function (){
    this._textFragFsm.cancel();
  },

  acceptInput: function (input){
    return this.takeInput(input);
  }
});
