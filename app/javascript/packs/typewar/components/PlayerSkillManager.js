import Backbone from "backbone"
import AttackObject from "../models/attack_object"
import TextLibrarian from "../util/text_librarian"


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

  cleanupSkillViews: function (){
    _.each(this._skill_views, (curr_view) => {
      curr_view.remove();
    });
    this._skill_views = null;
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
  _view: null,

  init: function (){ 
    this._skills = [];
  },

  playerSkillManager: function (){ return this; },

  getSkillManagerView: function () { return this._view; },

  getSkills: function (){
    return this._skills;
  },

  getSkillset: function (){
    return this.charSheet.data.skills;
  },

  renderSkillManager: function (){
    if(!this._view) { this._initializeView(); }
    this._view.render();
  },

  //private 

  getSlotNum: function (skill){
    return this.getSkillset().indexOf(skill) + 1;
  },

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
