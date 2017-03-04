// TODO: need to re set up the fragment spawner later when we want
// some skills to kick out fragments

import Backbone from "backbone"
import TextLibrarian from "../managers/text_librarian"

require('crafty');

var Handlebars = require('handlebars');
var StateMachine = require("javascript-state-machine");
require("./TextFragmentComponent");

var BattlePCSkillView = Backbone.View.extend({
  tagName: "div",
  className: "battle-skill",
  _template_id: "#battle_skill_template",

  initialize: function (opts){
    if(!opts.entity){ throw "ERROR: Battle Skill View initialized without an entity" };
    this.entity = opts.entity;
    this.text_fragment = opts.text_fragment;
    this.id = 'battle-skill-'+this.entity[0];
    this._template = Handlebars.compile($(this._template_id).html());
  },

  render: function (opts){
    var html, view_opts;

    view_opts = this._buildViewOptions(opts);
    html = this._template(view_opts);
    this.$el.html(html);
    return this.$el.html();
  },

  setTextFragment: function (new_frag){
    this.text_fragment = new_frag;
  },

  //private

  _buildViewOptions: function (opts){
    var skill_opts, text_fragment_opts, view_opts;

    view_opts = {};
    skill_opts = {
      name: this.entity.skill.name,
      css_classes: this.entity.fsm.current,
      skill_slot_num: this.entity.skillSlotNum()
    };
    return _.extend(
      view_opts, 
      this.entity, 
      skill_opts, 
      this._getTextFragmentOptions(), 
      opts);
  },
  
  _defaultTextFragmentOptions: function (){
    return {
      typed: '', 
      missed: '', 
      rest: ''
    }
  },

  _getTextFragmentOptions: function (){
    if(this.text_fragment){ return this.text_fragment.getTextStatus(); }
    return this._defaultTextFragmentOptions();
  }
});



Crafty.c("BattlePCSkill", {
  skill: null,
  text_fragment: null,
  text_fragment_graveyard: null,
  fsm: null,
  _view: null,

  init: function (){ },
  battlePCSkill: function (skill, owner){
    this.skill = skill;
    this._entity = owner;
    this.text_fragment_graveyard = [];
    this._setupStateMachine();
    this._initializeView();
    return this;
  },

  remove: function (){
    this._view.remove(); //remove the view
  },

  canTakeInput: function (input){
    return (this.fsm.is("ready") || this.fsm.is("active"));
  },

  currentText: function (){
    if(!this.text_fragment) { return null; }
    return this.text_fragment.getText();
  },

  executeSkill: function (){
    this.trigger("ExecuteSkill", {
      text_fragment: this.text_fragment, 
      skill: this.skill
    });
    this._cycleTextFragment();
    this._startCooldownCycle(); //TODO: perhaps this should move to the state machine
  },

  getView: function (){
    return this._view;
  },

  ready: function (){
    this.fsm.initialize();
  },

  render: function (){
    if(!this._view){ return; }
    this._view.render();
  },

  skillSlotNum: function (){
    return this._entity.getSlotNum(this);
  },

  // ---------------------- Methods delegated to text fragment

  takeInput: function (input){
    if(!this.canTakeInput()){return null;}
    if(this.text_fragment.takeInput(input)){
      if(this.text_fragment.isComplete()){
        this.fsm.complete();
      }
      return true;
    }else{
      return false;
    }
  },

  matchFirstChar: function (chr){
    return this.text_fragment.matchFirstChar(chr);
  },

  matchNextChar: function (chr){
    return this.text_fragment.matchNextChar(chr);
  },

  // ---------------------- End text fragment delegated methods

  // private

  _bindCombatModeSwitch: function (){
    var self = this;
    this.bind("SwitchedCombatMode", function (){
      if(self.fsm.can('cancel')){
        self.fsm.cancel();
      }
    });
  },

  _bindRedrawOnTextFragmentUpdate: function (){
    this.text_fragment.bind('Redraw', _.bind(this.render, this));
  },

  _clearTextFragment: function (){
    this._unbindRedrawOnTextFragmentUpdate();
    this.text_fragment.remove();
    this.text_fragment = null;
  },

  _cycleTextFragment: function (){
    if(this.text_fragment){
      this._unbindRedrawOnTextFragmentUpdate();
      this._moveTextFragmentToGraveyard();
    }
    this._generateTextFragment();
    this._view.setTextFragment(this.text_fragment);
    this._bindRedrawOnTextFragmentUpdate();
  },

  _generateTextFragment: function (){
    var t, matches, loop_count, GUARD_INFINITE_LOOP;

    GUARD_INFINITE_LOOP = 20;
    for(loop_count = 0;;){
      t = this._getTextFromVocabulary({});
      matches = _.filter(this._entity.getCurrentSkillTexts(), function (curr_text){
        return curr_text == t;
      });
      if(matches.length < 1){ break; }
      if(loop_count > GUARD_INFINITE_LOOP){ 
        t = this._makeRandomString();
        break;
      }
    }
    this.text_fragment = Crafty.e("TextFragment BattlePCSkillTextFragment")
      .textFragment({text: t});
  },

  _getTextFromVocabulary: function (opts){
    var txt;

    return TextLibrarian.retrieve(this._entity.getVocabulary(), this.skill.textOptions);
  },

  _initializeView: function (){
    this._view = new BattlePCSkillView({entity: this, text_fragment: this.text_fragment});
  },

  _makeRandomString: function (){
    var i, possible, text;

    text = "";
    possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( i=0; i < 15; i++ ){
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  },

  _moveTextFragmentToGraveyard: function (){
    this.text_fragment_graveyard.push(this.text_fragment);
    this.text_fragment = null;
  },

  _setupStateMachine: function (){
    var self = this;

    this.fsm = StateMachine.create({
      initial: "inactive",
      events: [
        { name: "initialize", from: "inactive", to: "ready" },
        { name: "start",      from: "ready",    to: "active" },
        { name: "complete",   from: "active",   to: "cooling" },
        { name: "complete",   from: "ready",    to: "cooling" },
        { name: "cancel",     from: "active",   to: "ready" },
        { name: "prepared",   from: "cooling",  to: "ready" }
      ],
      callbacks: { 
        onbeforeinitialize:    function (event, from, to){
          console.log("DEBUG: BattlePCSkillComponent state machine onbeforeinitialize.  We need to be getting here");
          self._generateTextFragment();
          self._view.setTextFragment(self.text_fragment);
          self._bindRedrawOnTextFragmentUpdate();
          self._bindCombatModeSwitch();
        },
        onstart:         function (event, from, to){ },
        onready:         function (event, from, to){ self.text_fragment.activate(); },
        onbeforecancel:  function (event, from, to){ self.text_fragment.reset(); },
        onaftercomplete: function (event, from, to){ self.executeSkill(); },
        onafterevent:    function (event, from, to){ self.render(); }
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
    this.unbind("SwitchedCombatMode");
  },

  _unbindRedrawOnTextFragmentUpdate: function (){
    this.text_fragment.unbind('Redraw');
  }
});
