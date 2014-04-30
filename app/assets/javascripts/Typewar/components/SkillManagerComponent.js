
/* IN PROGRESS ---------------------------------------------
 *   + Extract classesFunc (display piece) of text fragment
 *     to a separate component(DONE)
 *   + Building state machine for skills(DONE)
 *   + Render view of the skill manager and attached skills
 *   + COMMIT
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

    console.log("DEBUG: rendering the SkillManagerView");
    //this.$el.html(_.template($(this._template_id).html(), {}));
    var compiled_template = _.template($(this._template_id).html(), {})
    console.log("DEBUG: were we able to compile the template? ===>");
    console.log(compiled_template);
    this.$el.html(compiled_template)
    console.log("DEBUG: were we able to insert the template into this view's html");

    console.log("DEBUG: checking if the view exists on the page");

    if(!this._existsOnPage()){
      console.log("DEBUG: Skill manager View does not exist on page");
      this._insertIntoPage(); //add to page if it's not there
    }

    console.log("DEBUG: looping over to render each skill view");
    // render skill views into self
    self = this;
    _.each(this._skill_views, function (skill_view, index){
      console.log("DEBUG: rendering a skill view =====>");
      console.log(skill_view);

      skill_view.render({number: index});
      console.log("DEBUG: After render of skill view, let me check the el and append it ot the skill manager wrapper");
      console.log(skill_view.el);

      self.$el.find('.skill-manager-wrapper').append(skill_view.el);
    });
    console.log("DEBUG: end of skill manager view render ===================");
  },

  registerSkillViews: function(views){
    console.log("DEBUG: registering skill views with the Skillmanager");
    console.log(views);
    this._skill_views = views
  },

  _existsOnPage: function (){
    //console.log("DEBUG: looking on page for skill manager view...");
    //console.log("DEBUG: what's the skill manager's id? -------->" + this.id);
    //console.log("Can we find it on the page?? ======>");
    //console.log($("#"+this.id));
    return _.some($(this.id));
  },

  _insertIntoPage: function (){
    console.log("DEBUG: inserting skill manager view into the page");
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
    console.log("DEBUG: Skill manager component being initialized");
    console.log("DEBUG: skills being set ====>");
    console.log(skillset);

    this.populateSkillset(skillset);
    console.log("About to init view for skill manager");
    this._initializeView();
    return this;
  },

  remove: function (){ 
    this._skillset = null;
  },

  populateSkillset: function (skills){
    console.log("DEBUG: populating skillset of the battle manager");
    this._skillset = _.map(skills, function (skill){
      console.log("DEBUG: creating a new battle skill with skill definition ====>");
      console.log(skill);
      return Crafty.e("BattleSkill")
        .battleSkill(skill);
    });
    console.log("DEBUG: populated the skillset of the skill manager ====>");
    console.log(this._skillset);
  },

  renderSkillManager: function (){
    this._view.render();
  },

  takeInput: function (input){
    var active_skills, ready_skills;

    console.log("DEBUG: takeInput on skill manager is called");

    if(this._anyActiveSkills()){
      active_skills = this._getActiveSkills();
      if(active_skills.length > 1){ // if 2 or more active, match the next letter and deactivate if next letter doesn't match
        _.each(active_skills, function(skill){
          console.log("DEBUG: more than 1 active skill ready to take input...");
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
      skill.fsm.isactive();
    });
  },

  _getActiveSkills: function (){
    return _.filter(this._skillset, function (skill){
      skill.fsm.isactive();
    });
  },

  _getReadySkills: function (){
    return _.filter(this._skillset, function (skill){
      skill.fsm.isready();
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
