Typewar.Views.BattleSkillView = Backbone.View.extend({
  tagName: "div",
  className: "battle-skill",
  _template_id: "#battle_skill_template",

  initialize: function (opts){
    if(!opts.entity){ throw "ERROR: Battle Skill View initialized without an entity" };
    this.entity = opts.entity;
    this.text_fragment = opts.text_fragment;
    this.id = 'battle-skill-'+this.entity[0];
  },

  render: function (opts){
    var text_fragment_opts, view_opts;

    view_opts = {};
    text_fragment_opts = this.text_fragment.getTextStatus();
    _.extend(view_opts, this.entity, {name: this.entity.skill.name}, text_fragment_opts, opts);
    var template = _.template($(this._template_id).html(), view_opts);
    this.$el.html(template);
    return this.$el.html();
  },

  setTextFragment: function (new_frag){
    this.text_fragment = new_frag;
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
    this.text_fragment_graveyard = [];
    this._generateTextFragment();
    this._setupStateMachine();
    this._initializeView();
    this._bindRedrawOnTextFragmentUpdate();
    this._bindCombatModeSwitch();
    return this;
  },

  remove: function (){
    //remove the view
    this._view.remove();
  },

  canTakeInput: function (input){
    return (this.fsm.is("ready") || this.fsm.is("active"));
  },

  drawSelf: function (){
    if(this._view){ this._view.render(); }
  },

  executeSkill: function (){
    this.trigger("ExecuteSkill", {
      text_fragment: this.text_fragment, 
      skill: this.skill
    });
    this._cycleTextFragment();
    this._startCooldownCycle();
  },

  getView: function (){
    return this._view;
  },

  // ---------------------- Methods delegated to text fragment

  takeInput: function (input){
    console.log("DEBUG: BattleSkillComponent#takeInput  called with input ----> " + input);
    if(!this.canTakeInput()){return null;}
    //console.log("DEBUG: BattleSkillComponent#takeInput  passing input to the text fragment ------->");
    //console.log(this.text_fragment);
    if(this.text_fragment.takeInput(input)){
      if(this.text_fragment.isComplete()){
        this.fsm.complete();
      }
    }else{
      console.log("DEBUG: incorrect input");
    }
  },

  matchFirstChar: function (chr){
    return this.text_fragment.matchFirstChar(chr);
  },

  // ---------------------- End text fragment delegated methods

  // private

  _bindCombatModeSwitch: function (){
    var self = this;
    this.bind("SwitchingCombatMode", function (){
      if(self.fsm.can('cancel')){
        self.fsm.cancel();
      }
    });
  },

  _bindRedrawOnTextFragmentUpdate: function (){
    this.text_fragment.bind('Redraw', _.bind(this.drawSelf, this));
  },

  _cycleTextFragment: function (){
    this._unbindRedrawOnTextFragmentUpdate();
    this._moveTextFragmentToGraveyard();
    this._generateTextFragment();
    this._view.setTextFragment(this.text_fragment);
    this._bindRedrawOnTextFragmentUpdate();
  },

  // TODO: future implementation: text library
  _generateTextFragment: function (){
    this.text_fragment = Crafty.e("TextFragment")
      .textFragment({text: 'squeegee'});
  },

  _initializeView: function (){
    this._view = new Typewar.Views.BattleSkillView({entity: this, text_fragment: this.text_fragment});
  },

  _moveTextFragmentToGraveyard: function (){
    this.text_fragment_graveyard.push(this.text_fragment);
    this.text_fragment = null;
  },

  _setupStateMachine: function (){
    var self = this;

    this.fsm = StateMachine.create({
      initial: "ready",
      events: [
        { name: "start",    from: "ready",   to: "active" },
        { name: "complete", from: "active",  to: "cooling" },
        { name: "cancel",   from: "active",  to: "ready" },
        { name: "prepared", from: "cooling", to: "ready" }
      ],
      callbacks: { 
        onstart:         function (event, from, to){ },
        onready:         function (event, from, to){ self.text_fragment.activate(); },
        onaftercancel:   function (event, from, to){ self.text_fragment.deactivate(); },
        onaftercomplete: function (event, from, to){ self.executeSkill(); },
        onafterevent:    function (event, from, to){ self.drawSelf(); }
      }
    });
  },

  _startCooldownCycle: function (){
    var self = this;
    this.timeout(function (){
      self.fsm.prepared();
    }, this.skill.cooldown);
  },

  _unbindCombatModeSwitch: function (){
    this.unbind("SwitchingCombatMode");
  },

  _unbindRedrawOnTextFragmentUpdate: function (){
    this.text_fragment.unbind('Redraw');
  }
});
