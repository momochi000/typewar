/* A component specifically for enemies encountered in Typewar's battle system
 * This is the base component, other child components are made up of specific
 * monsters or enemy types and require this component, calling methods from it.

 * Events Triggered:
 * updateStatus ===========> When the status of the npc changes
 * enemy_died =============> When this monster dies
 * TODO: Make these events use consistent style
 */

Crafty.c("BattleNPCEnemy", {
  _ANIM_HIT_DELAY: 430,
  _ANIM_ATTACK_DELAY: 200,
  _fragment_spawner: null,
  _current_target: null,
  _backbone_model: null,

  init: function (){
    this.requires("2D, SpriteAnimation, BattleCharacter");
  },

  battleNPCEnemy: function (char_sheet){
    //this.char_sheet = char_sheet || new Typewar.Models.CharacterSheet({name: "Slime"});
    if(!this.char_sheet) { 
      this.char_sheet = new Typewar.Models.CharacterSheet({name :"Slime"});
    }
    this._fragment_timers = [];
    this._createFragmentSpawner();
    this._initBackboneModel();

    return this;
  },

  remove: function (destroyed){
    this.deactivateAI();
    this._clearFragmentTimers();
    this._fragment_spawner.destroy();
    this._fragment_spawner = null;
    this._backbone_model.deallocate();
  },

  die: function (){
    Crafty.trigger("NPCDied", {target: this});
  },

  getStance: function (){
    return "offense";
  },

  getFromServer: function (){
    return this._backbone_model.getFromServer();
  },

  initiateAttackOn: function (defender, skill){
    var self, skill, frag, speed, text_fragment_options, skill_data;
    self = this;

    if(!skill){ skill = this.getRandomReadySkill(); }
    if(!skill){ return; } // Do not attack if no skill available


    skill_data = skill.activate();
    text_fragment_options = Typewar.Engine.battlemanager.handleAttack({
      attacker: this, 
      defender: defender, 
      skill: skill_data
    });
    this.animAttack(skill_data.animation);
    this._fragment_timers.push(window.setTimeout(function (){ // Spawn the fragment a short delay after the animation plays
      frag = self._fragment_spawner.generateTextFragment({
        attack_properties: text_fragment_options
      });
    }, this._ANIM_ATTACK_DELAY));
  },

  isPlayer: function (){ return false; },
  isNPC: function (){ return true; },

  partialHit: function (){
    console.log("DEBUG: SLIME: PARTIAL HIT. OW!!! ");
    var self = this;
    window.setTimeout(function (){ self.animBlock(); }, this._ANIM_HIT_DELAY);
  },

  setTarget: function (target){
    this._current_target = target;
  },

  successfulDefense: function (){
    console.log("DEBUG: SLIME: DEFENDED!!! ");
    var self = this;
    window.setTimeout(function (){ self.animBlock(); }, this._ANIM_HIT_DELAY);
  },

  successfulHit: function (){
    var self = this;
    console.log("DEBUG: SLIME: HIT!! GOT ME GOOD D=");
    window.setTimeout(function (){ self.animHit(); }, this._ANIM_HIT_DELAY);
  },

  wasMissed: function (){
    console.log("DEBUG: SLIME: MISSED ME!!");
  },

  //private 

  _clearFragmentTimers: function (){
    _.each(this._fragment_timers, function (t_id){
      window.clearTimeout(t_id);
    });
    delete this._fragment_timers;
    this._fragment_timers = null;
  },

  _createFragmentSpawner: function (){
    this._fragment_spawner = Crafty.e("2D, TextFragmentSpawner")
      .attr({x: this._x, y: this._y})
      .textFragmentSpawner();

    this.attach(this._fragment_spawner);
  },

  _initBackboneModel: function (){
    this._backbone_model = new NPCEntity({entity: this});
  },

  _setupBattleNPCSkills: function (){
    var skills_from_server = this.char_sheet.get("skills");

    if(skills_from_server){
      this.addComponent("NPCSkillManager").
        nPCSkillManager(skills_from_server);
    }else{ // Default skills if none provided in the server call
      this.addComponent("NPCSkillManager").
        nPCSkillManager({
          SlimeStandard: Typewar.Data.Skills.SlimeStandard,
          SlimeGlob: Typewar.Data.Skills.SlimeGlob
        });
    }
  }
});
