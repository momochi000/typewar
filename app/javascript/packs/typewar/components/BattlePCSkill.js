// TODO: need to re set up the fragment spawner later when we want
// some skills to kick out fragments

import Backbone from "backbone"
import TextLibrarian from "../util/text_librarian"

require('crafty');

var Handlebars = require("handlebars");
var StateMachine = require("javascript-state-machine");
require("./TextFragment");

var BattlePCSkillView = Backbone.View.extend({
  tagName: "div",
  className: "battle-skill",
  _template_id: "#battle_skill_template",

  initialize: function (opts){
    if(!opts.entity){ throw "ERROR: Battle Skill View initialized without an entity" };
    this._entity = opts.entity;
    this.text_fragment = opts.text_fragment;
    this.id = 'battle-skill-'+this._entity[0];
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
      name: this._entity.skill.name,
      css_classes: this._entity._battlePCFsm.current,
      skill_slot_num: this._entity.getSkillSlotNum()
    };
    return _.extend(
      view_opts, 
      this._entity, 
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
    // TODO: if the skill is not ready or text fragment is not ready,
    // then display default text fragment options
    return this._entity.getTextStatus();
    //    return this._defaultTextFragmentOptions();
  }
});


// TODO: Refactor this changing skill attribute to _skillDef, then use getters
// and setters to manage it, don't let anyone explicitly go entity.skill
Crafty.c("BattlePCSkill", {
  skill: null,
  text_fragment: null,
  text_fragment_graveyard: null,
  _battlePCFsm: null,
  _owner: null,
  _view: null,

  init: function (){ },
  battlePCSkill: function (owner, skillDef){
    this._owner = owner;
    this.skill = skillDef;
    this._setupStateMachine();
    this._initializeView();
    this._battlePCFsm.initialize();
    return this;
  },

  remove: function (){
    this._view.remove(); //remove the view
  },

  cancel: function (){ this._battlePCFsm.cancel(); },

  canTakeInput: function (input){
    return (this._battlePCFsm.is("ready") || this._battlePCFsm.is("active"));
  },

  currentText: function (){ return this.getText(); },

  getOwner: function (){ return this._owner; },

  getSkillDef: function (){ return this.skill; },

  getTarget: function (){ return this._owner.getTarget(); },

  getView: function (){ return this._view; },

  prepare: function (){ this._battlePCFsm.prepared(); },

  ready: function (){ this._battlePCFsm.initialize(); },

  render: function (){
    if(!this._view){ return; }
    this._view.render();
  },

  getSkillSlotNum: function (){ return this._owner.getSlotNum(this.skill); },

  acceptInput: function (input){
    if(!this.canTakeInput()){return null;}
    if(this.takeInput(input)){
      if(this._battlePCFsm.is("ready")){ this._battlePCFsm.start(); }
      if(this.isComplete()){ this._battlePCFsm.complete(); }
      return true;
    }else{
      return false;
    }
  },

  // private

  _bindRedrawOnTextFragmentUpdate: function (){
    this.bind('TextFragmentRedraw', _.bind(this.render, this));
  },

  _cycleTextFragment: function (){
    this._generateNewText();
  },

  _generateNewText: function (){
    var new_text;
    this.setText(TextLibrarian.retrieve(this._owner.getVocabulary(), this.skill.textOptions));
  },

  _getTextFromVocabulary: function (opts){
    var txt;

    return TextLibrarian.retrieve(this.getVocabulary(), this.skill.textOptions);
  },

  _initializeView: function (){
    this._view = new BattlePCSkillView({entity: this, text_fragment: this});
  },

  _setupStateMachine: function (){
    var self = this;

    this._battlePCFsm = StateMachine.create({
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
          self._bindRedrawOnTextFragmentUpdate();
        },
        onready:         function (event, from, to){ },
        onstart:         function (event, from, to){ },
        onbeforecancel:  function (event, from, to){ self._textFragFsm.cancel(); },
        onaftercomplete: function (event, from, to){ self._cycleTextFragment(); },
        onafterevent:    function (event, from, to){ self.render(); },
        onprepared:      function (event, from, to){ self.restart(); }
      }
    });
  },

  _unbindCombatModeSwitch: function (){ this.unbind("SwitchedCombatMode"); },

  _unbindRedrawOnTextFragmentUpdate: function (){
    this.text_fragment.unbind('TextFragmentRedraw');
  }
});
