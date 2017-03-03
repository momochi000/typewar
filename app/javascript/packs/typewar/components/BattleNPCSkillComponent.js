/* NPCSkill - A wrapper around skill data
 * Contains some additional logic to control skill cooldowns
 * Is meant to be expanded when necessary to include additional functionality
 */
require("crafty");
var StateMachine = require("javascript-state-machine");

Crafty.c("NPCSkill", {
  init: function (){ 
    this.skill = null;
  },

  nPCSkill: function (skill, difficulty){
    if(!skill) {
      throw "ERROR: attempting to initialize NPCSkill component without any skill data";
    }
    this._initSkill(skill, difficulty);
    this._setupStateMachine();
    return this;
  },

  activate: function (){
    if(this.fsm.activate()){
      return this.getSkillData();
    }else{
      // invalid transition.  don't need to do anyting
    }
  },

  getSkillData: function (){
    return this.skill.getSkillAttributes(); 
  },

  isReady: function (){
    return this.fsm.is("ready");
  },

  // private

  _beginCooldown: function (){
    var self = this;
    this.timeout(function (){
      self.fsm.prepare();
    }, this.getSkillData().cooldown);
  },

  _initSkill: function (skill, difficulty){
    this.skill = new skill({difficulty: (difficulty || 1)});
  },

  _setupStateMachine: function (){
    var self = this;
    this.fsm = StateMachine.create({
      initial: "ready",
      events: [
        { name: "activate",  from: "ready",    to: "cooling" },
        { name: "prepare",   from: "cooling",  to: "ready" }
      ],
      callbacks: { 
        onafteractivate:     function (event, from, to) { self._beginCooldown(); },
        onbeforeready:       function (event, from, to) { },
      }
    });
  }
});
 
