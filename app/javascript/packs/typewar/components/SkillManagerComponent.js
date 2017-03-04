import Backbone from "backbone"
import AttackObject from "../models/attack_object"

require("crafty");
require("./BattlePCSkill");

  // LEFT OFF NOTE: Don't seem to be using handlebars here.. how can this render? need to fix

const SKILL_MANAGER_VIEW_CONTAINER = "#typewar-skill-manager-wrap";

var SkillManagerView = Backbone.View.extend({
  tagName: "div",
  className: "skill-manager",
  _template_id: "#skill_manager_template",
  render: function (){ 
    var self;

    this.$el.html(_.template($(this._template_id).html(), {}));
    if(!this._existsOnPage()){ this._insertIntoPage();} //add to page if it's not there 
    self = this;            // render skill views into self
    _.each(this._skill_views, function (skill_view, index){
      skill_view.render({number: index});
      self.$el.find('.skill-manager-wrapper').append(skill_view.el);
    });
  },

  registerSkillViews: function (views){
    this._skill_views = views;
  },

  _existsOnPage: function (){
    return _.some($(this.id));
  },

  _insertIntoPage: function (){
    $(SKILL_MANAGER_VIEW_CONTAINER).append(this.$el);
  }
});


/* Component which contains a set of skills
 * This is to be attached to the player and provide an
 * interface to use the skills.  It should also be paired with
 * A module to handle player skills during battle
 */

Crafty.c("SkillManager", {
  _skillset: null,
  _view: null,

  init: function (){ },

  skillManager: function (skillset){
    if(skillset){
      this.populateSkillset(skillset);
    }else if(this.char_sheet.skills){
      this.populateSkillset(this.char_sheet.skills);
    }else{
      throw "SkillManagerComponent: attempting to initialize SkillManager without any skills";
    }
    this._bindSkillCompleteListeners();
    this._initializeView();
    this.renderSkillManager();
    return this;
  },

  remove: function (){ 
    this._view.remove();
    this._skillset = null;
  },

  populateSkillset: function (skills){
    var self = this;
    this._skillset = _.map(skills, function (skill){
      return Crafty.e("BattlePCSkill").battlePCSkill(skill, self);
    });
  },

  prepareSkills: function (){
    _.each(this._skillset, function (skill){
      skill.ready();
    });
  },

  doSkill: function (evt){
    var attack_obj;

    this.playAnim(evt.skill.animation);
    // deplete mana/stamina
    attack_obj = this._generateAttackObject(evt.skill, evt.text_fragment);
    Typewar.Engine.battlemanager.resolveAttack(attack_obj);
  },

  getSlotNum: function (skill){
    return this._skillset.indexOf(skill) + 1;
  },

  getCurrentSkillTexts: function (){
    return _.map(this._skillset, function (skill){
      return skill.currentText();
    });
  },

  renderSkillManager: function (){
    this._view.render();
  },

  takeInput: function (input){
    var active_skills, ready_skills;

    if(this._anyActiveSkills()){
      active_skills = this._getActiveSkills();
      if(active_skills.length > 1){ // if 2 or more active, match the next letter and deactivate if next letter doesn't match
        // Check if any single skill matches
        if(this._anySkillsMatchInput(active_skills, input)){
          // If progress is made in a skill but another has a typo, bail out of that other one.
          _.each(active_skills, function(skill){
            if(skill.takeInput(input)){  // correct input
            }else{ //incorrect input
              skill.fsm.cancel(); // TODO: knowing about the fsm here is a smell and should be refactored
            }
          });
        }
      }else{ // if 1 active, match the next letter or accept typo.
        active_skills[0].takeInput(input)
      }
    }else{ // if none active, find those that start with the matching letter
      ready_skills = this._getReadySkills();
      _.each(ready_skills, function(skill){
        if(skill.matchFirstChar(input)){
          skill.takeInput(input)
          skill.fsm.start();
        };
      });
    }
  },
  
  // private

  _anyActiveSkills: function (){
    return _.some(this._skillset, function (skill){
      return skill.fsm.is("active");
    });
  },

  _anySkillsMatchInput: function (skills, input){
    var matcher;

    matcher = _.find(skills, function (curr_skill){
      return curr_skill.matchNextChar(input);
    });
    if(matcher){ return true; }
    return false;
  },

  _bindSkillCompleteListeners: function (){
    var self = this;
    _.each(this._skillset, function (skill){
      skill.bind("ExecuteSkill", _.bind(self.doSkill, self));
    });
  },

  _generateAttackObject: function (skill, text_fragment){
    return new AttackObject({
      properties: skill.properties,
      target: this._current_target,
      attacker: this,
      text_fragment: text_fragment
    });
  },

  _getActiveSkills: function (){
    return _.filter(this._skillset, function (skill){
      return skill.fsm.is("active");
    });
  },

  _getReadySkills: function (){
    return _.filter(this._skillset, function (skill){
      return skill.fsm.is("ready");
    });
  },

  _initializeView: function (){
    var skill_views;

    this._view = new SkillManagerView({id: 'battle-skillset'});
    skill_views = _.map(this._skillset, function (curr_skill){ 
      curr_skill.render();
      return curr_skill.getView();
    });
    this._view.registerSkillViews(skill_views);
  }
});
