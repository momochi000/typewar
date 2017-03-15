Crafty.c("DefendableAttack", {
  init: function (){},
  defendableAttack: function (options){ 
    this._target = options.target;
    return this; 
  },

  acceptInput: function (input){
    return this.takeInput(input);
  },

  cancel: function (){
    this._textFragFsm.cancel();
  },

  getTarget: function (){
    return this._target;
  }
});
