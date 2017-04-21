var StateMachine = require("javascript-state-machine");

Crafty.c("Tutorial", {
  init: function (){ this._isListeningForInput = false },

  tutorial: function (data){
    this.setTutorialData(data);
    this.setTutorialStepNum(0);
    //    this._setupTutorialFSM();
    return this;
  },

  getTutorialData: function (){ return this._tutorialData; },
  setTutorialData: function (newdata) { this._tutorialData = newdata; },

  //getTutorialState: function (){ return this._tutorialState; },
  //setTutorialState: function (newState){ this._tutorialState = newState; }
  getTutorialStepNum: function (){ return this._tutorialStep; },
  setTutorialStepNum: function (newStep){ this._tutorialStep = newStep; },

  getCurrTutorialStep: function (){ return this._tutorialData.steps[this._tutorialStep]; },
  incrementTutorialStep: function (){ this._tutorialStep+=1; },

  listenForInput: function (){ this._isListeningForInput = true; },
  isListeningForInput: function (){ return this._isListeningForInput; },
  stopListeningForInput: function () { return this._isListeningForInput = false; },

  getCallback: function (){ return this._callback; },
  setCallback: function (newCallback){ this._callback = newCallback; },


  // I think no state machine
  //  _setupTutorialFSM: function (){
  //    this._tutorialFsm = Statemachine.create({
  //      initial: "warming",
  //      events: [
  //        { name: "next", from: "warming", to: "waiting" },
  //        { name: "next", from: "waiting", to: "gg
  //      ]
  //    });
  //
  //    // example
  //    this._stance = StateMachine.create({
  //      initial: initial_stance,
  //      events: [
  //        { name: "toggle", from: "defense", to: "offense" },
  //        { name: "toggle", from: "offense", to: "defense" }
  //      ],
  //      callbacks: { }
  //    });
  //  }
});
