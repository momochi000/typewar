import Backbone from "backbone"
import AttackObject from "../models/attack_object"
import TextLibrarian from "../util/text_librarian"

require("crafty");
require("./BattlePCSkill");
var Handlebars = require("handlebars");

const SKILL_MANAGER_VIEW_CONTAINER = "#typewar-skill-manager-wrap";

var PlayerSkillManagerView = Backbone.View.extend({
  tagName: "div",
  className: "skill-manager",
  _template_id: "#skill_manager_template",

  initialize: function (){
    this._template = Handlebars.compile($(this._template_id).html());
  },

  render: function (){ 
    var self;
    self = this;

    this.$el.html(this._template());
    if(!this._existsOnPage()){ this._insertIntoPage();}
    _.each(this._skill_views, function (skill_view, index){
      skill_view.render({number: index});
      self.$el.find('.skill-manager-wrapper').append(skill_view.$el);
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
 * interface to use the skills.
 */

Crafty.c("PlayerSkillManager", {
  _skills: null,
  _skillset: null,
  _view: null,

  init: function (){ },

  playerSkillManager: function (skillset){
    if(skillset){
      this._populateSkillset(skillset);
    }else if(this.char_sheet.skills){
      this._populateSkillset(this.char_sheet.skills);
    }else{
      throw "SkillManagerComponent: attempting to initialize SkillManager without any skills";
    }
    return this;
  },

  prepareSkills: function (){
    var self = this;
    this._skills = [];
    _.each(this._skillset, (curr_skill_def) => {
      this._skills.push(self._buildSkill(curr_skill_def).bind(self));
    });
  },

  remove: function (){ 
    this._view.remove();
    this._skillset = null;
  },

  render: function (){
    if(!this._view) { this._initializeView(); }
    this._view.render();
  },

  //private 

  _populateSkillset: function (skills){
    this._skillset = skills
  },

  getSlotNum: function (skill){
    return this._skillset.indexOf(skill) + 1;
  },

  _buildSkill: function (skill){
    return Crafty.e("BattlePCSkill, TextFragment")
             .textFragment(TextLibrarian.retrieve(this.getVocabulary(), skill.textOptions))
             .battlePCSkill(this, skill);
  },

  //  _generateAttackObject: function (skill, text_fragment){
  //    return new AttackObject({
  //      properties: skill.properties,
  //      target: this._currentTarget,
  //      attacker: this,
  //      text_fragment: text_fragment
  //    });
  //  },

  _initializeView: function (){
    var skill_views;

    this._view = new PlayerSkillManagerView({id: 'battle-skillset'});
    skill_views = _.map(this._skills, function (curr_skill){ 
      curr_skill.render();
      return curr_skill.getView();
    });
    this._view.registerSkillViews(skill_views);
  }
});
