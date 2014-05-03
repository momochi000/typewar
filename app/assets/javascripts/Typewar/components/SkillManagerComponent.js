
/* IN PROGRESS ---------------------------------------------
 *   + (DONE)Extract classesFunc (display piece) of text fragment
 *     to a separate component
 *   + (DONE)Building state machine for skills
 *   + (DONE) Render view of the skill manager and attached skills
 *   + (DONE)COMMIT
 *   + Check input passing to text fragment inside the skill
 *   + Render updates of the typed/active skills on keypresses
 *   + Hook in callbacks from text fragment completion
 *   + Ensure callbacks from skill completion do not interfere
 *     with callbacks from monster attack completion
 *   + Pull out code from battlemanager around text fragment 
 *     completion for player attack 
 */

Typewar.Views.SkillManagerView = Backbone.View.extend({
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

  registerSkillViews: function(views){
    this._skill_views = views
  },

  _existsOnPage: function (){
    return _.some($(this.id));
  },

  _insertIntoPage: function (){
    Typewar.Engine.$container.append(this.$el);
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
    this.populateSkillset(skillset);
    this._bindSkillCompleteListeners();
    this._initializeView();
    return this;
  },

  remove: function (){ 
    this._skillset = null;
  },

  populateSkillset: function (skills){
    this._skillset = _.map(skills, function (skill){
      return Crafty.e("BattleSkill").battleSkill(skill);
    });
  },

  /* This is a callback which is invoked when a skill is completed.  When a
   * BattleSkill is completed, it triggers the event this is bound to and 
   * passes the skill up to here
   */
  doSkill: function (skill){
    skill.onComplete(this);
  },

  renderSkillManager: function (){
    this._view.render();
  },

  takeInput: function (input){
    var active_skills, ready_skills;

    if(this._anyActiveSkills()){
      active_skills = this._getActiveSkills();
      if(active_skills.length > 1){ // if 2 or more active, match the next letter and deactivate if next letter doesn't match
        _.each(active_skills, function(skill){
        });
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
      })
    }
  },
  
  // private

  _anyActiveSkills: function (){
    return _.some(this._skillset, function (skill){
      return skill.fsm.is("active");
    });
  },

  _bindSkillCompleteListeners: function (){
    var self = this;
    _.each(this._skillset, function (skill){
      skill.bind("ExecuteSkill", _.bind(self.doSkill, self));
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

    this._view = new Typewar.Views.SkillManagerView({id: 'battle-skillset'});
    skill_views = _.map(this._skillset, function (curr_skill){ 
      return curr_skill.getView() 
    });
    this._view.registerSkillViews(skill_views);
  }
});
