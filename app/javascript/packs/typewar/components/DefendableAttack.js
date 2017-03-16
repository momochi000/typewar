Crafty.c("DefendableAttack", {
  init: function (){},
  defendableAttack: function (options){ 
    this._source = options.source;
    this._target = options.target;
    this._effects = options.effects;
    return this; 
  },

  acceptInput: function (input){
    return this.takeInput(input);
  },

  cancel: function (){
    this._textFragFsm.cancel();
  },

  getEffects: function (){
    return this._effects;
  },

  getSource: function (){
    return this._source;
  },

  getTarget: function (){
    return this._target;
  }
});
