var StateMachine = require("javascript-state-machine");

Crafty.c("BattleStance", {
  
  init: function (){ },

  battleStance: function (initialStance){
    this._setupModeFSM(initialStance);
    return this;
  },

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

  _setupModeFSM: function (initialStance){
    var fsm, self, initial_stance;
    self=this;
    initial_stance = initialStance || "defense";
    this._stance = StateMachine.create({
      initial: initial_stance,
      events: [
        { name: "toggle", from: "defense", to: "offense" },
        { name: "toggle", from: "offense", to: "defense" }
      ],
      callbacks: { }
    });
  }
});
