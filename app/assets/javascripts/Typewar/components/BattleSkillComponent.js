Typewar.Views.BattleSkillView = Backbone.View.extend({
  tagName: "div",
  className: "battle-skill",
  _template_id: "#battle_skill_template",

  initialize: function (opts){
    console.log("DEBUG: INITIALIZING BattleSkillView with options =====>");
    console.log(opts);
    if(!opts.entity){ throw "ERROR: Battle Skill View initialized without an entity" };
    this.entity = opts.entity;
    this.text_fragment = opts.text_fragment;
    this.id = 'battle-skill-'+this.entity[0];
  },

  render: function (opts){
    var text_fragment_opts, view_opts;

    view_opts = {};
    console.log("DEBUG: Rendering BattleSkillView");

    text_fragment_opts = this.text_fragment.getTextStatus();

    _.extend(view_opts, this.entity, {name: this.entity.skill.name}, text_fragment_opts, opts);

    console.log("DEBUG: options going into the render of battleskill view .... ===> ");
    console.log(view_opts);
    console.log("DEBUG: whats' my own id?? ---->"+ this.id);
    console.log("DEBUG: can we compile the template??? ===>");
    var template = _.template($(this._template_id).html(), view_opts);
    console.log(template);

    this.$el.html(template);

    console.log("DEBUG: finished  render of battle skill view");

    return this.$el.html();
  }
});

Crafty.c("BattleSkill", {
  skill: null,
  text_fragment: null,
  text_fragment_graveyard: null,
  fsm: null,
  _view: null,

  init: function (){ },
  battleSkill: function (skill){
    this.skill = skill;
    this._generateTextFragment();
    this._attachStateMachine();
    this._initializeView();
    return this;
  },
  remove: function (){},

  canTakeInput: function (input){
    return (this.isready() || this.isactive());
  },

  executeSkill: function (){
    console.log("DEBUG: skill executing!!! " + this.skill.name);
  },

  getView: function (){
    return this._view;
  },

  takeInput: function (input){
    if(!this.canTakeInput()){return null;}
    if(this.text_fragment.takeInput(input)){
      if(this.text_fragment.isComplete()){
        this.executeSkill();
      }
    }
  },

  // ---------------------- Methods delegated to text fragment
  matchFirstChar: function (chr){
    return this.text_fragment.matchFirstChar(chr);
  },
  // ---------------------- End text fragment delegated methods

  // private

  _attachStateMachine: function (){
    var fsm;
    console.log("DEBUG: building state machine for skill component");
    fsm = StateMachine.create({
      initial: "ready",
      events: [
        { name: "start",    from: "ready",   to: "active" },
        { name: "complete", from: "active",  to: "cooling" },
        { name: "cancel",   from: "active",  to: "ready" },
        { name: "prepared", from: "cooling", to: "ready" }
      ],
      callbacks: { 
        onstart: function (event, from, to){
          console.log("DEBUG: battle skill has entered active state");
          console.log(event);
          console.log(from);
          console.log(to);
          console.log("==================");
        },
      }
    });
    console.log("DEBUG: initialized state machine====>");
    console.log(fsm);
    this.fsm = fsm;
  },

  _generateTextFragment: function (){
    // obtain appropriate text for this skill
    // will need to come up with a method for doing this.  Text should 
    // probably be tied to the skill? each skill has some library of text? or not.. i think each skill should have some word difficulty.  I think we need to come up with a word chooser.
    // A module/algorithm that can search through a dictionary of words (probably just an array) and choose a word given a length and a difficulty rating


    this.text_fragment = Crafty.e("TextFragment")
      .textFragment({text: 'squeegee'});
  },

  _initializeView: function (){
    this._view = new Typewar.Views.BattleSkillView({entity: this, text_fragment: this.text_fragment});
  }
});

