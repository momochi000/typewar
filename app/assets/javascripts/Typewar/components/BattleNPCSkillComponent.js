/* NPCSkill - A wrapper around skill data
 * Contains some additional logic to control skill cooldowns
 * Is meant to be expanded when necessary to include additional functionality
 */
Crafty.c("NPCSkill", {

  init: function (){ },

  nPCSkill: function (skill_data){
    if(!skill_data) {
      throw "ERROR: attempting to initialize NPCSkill component without any skill data";
    }
    this._initSkillData(skill_data);
    this._setupStateMachine();
    return this;
  },

  activate: function (){
    if(this.fsm.activate()){
      return this.skill_data;
    }else{
      // invalid transition.  don't need to do anyting
    }
  },

  isReady: function (){
    return this.fsm.is("ready");
  },

  // private

  _beginCooldown: function (){
    var self = this;
    this.timeout(function (){
      self.fsm.prepare();
    }, this.skill_data.cooldown);
  },

  _initSkillData: function (skill_data){
    this.skill_data = skill_data;
  },

  _setupStateMachine: function (){
    var self = this;
    this.fsm = StateMachine.create({
      initial: "ready",
      events: [
        { name: "activate",   from: "ready",    to: "cooling" },
        { name: "prepare",   from: "cooling",  to: "ready" }
      ],
      callbacks: { 
        onafteractivate:     function (event, from, to) { self._beginCooldown(); },
        onbeforeready:       function (event, from, to) { },
      }
    });
  }
});
 
