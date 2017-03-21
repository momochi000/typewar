var StateMachine = require("javascript-state-machine");
Crafty.c("BattleStance", {
  
  init: function (){
    this._setupModeFSM();
  },

  battleStance: function (){},

  getStance: function (){
    return this._stance.current;
  },

  isStance: function (stanceName){
    return this._stance.is(stanceName);
  },

  toggleStance: function (){
    this._stance.toggle();
    return this.getStance();
  },

  _setupModeFSM: function (){
    var fsm, self;
    self=this;
    this._stance = StateMachine.create({
      initial: "defense",
      events: [
        { name: "toggle", from: "defense", to: "offense" },
        { name: "toggle", from: "offense", to: "defense" }
      ],
      callbacks: { }
    });
  }
});
