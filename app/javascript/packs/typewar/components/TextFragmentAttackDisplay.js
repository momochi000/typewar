/* TODO: this should move to it's own directory */
/* There's a potential bug here where two fragments get created with
 * the same DOM id because our unique id generator is pretty garbage
 */

import Backbone from "backbone"

require("crafty");
require("./TextFragment");
require("./BattleNPCProjectile");

var Handlebars = require("handlebars");

var TextFragmentAttackDisplayView = Backbone.View.extend({
  tagName: 'div',
  className: 'text-fragment-attack',
  _templateId: "#text_fragment_attack_template",

  initialize: function (options){
    this._entity = options.entity;
    if(!this._entity) { throw new Error("Attempting to initialize TextFragmentAttackDisplayView without an entity"); }
    this._template = Handlebars.compile($(this._templateId).html());
  },

  render: function (){
    var ent_dom_id, opts;

    opts = this._prepareTemplateOptions();

    if($(this.id).length === 0){ // element not yet rendered on page, insert
      this.id = this._generateId(this._entity);
      this.$el.html(this._template(opts));
      ent_dom_id = this._entity.getDomId();
      $("#"+ent_dom_id).append(this.$el);
    }else{
      this.$el.html(this._template(opts));
    }
  },

  // private
  
  // Generate a dom id based on the Crafty entity id, they should both be unique
  _generateId: function (entity){
    return "text_fragment_" + entity.getId();
  },

  _prepareTemplateOptions: function (){
    var ent = this._entity;

    return {
      typed: ent.getCorrectCharacters(),
      missed: ent.getIncorrectCharacters(),
      rest: ent.getRemainingCharacters(),
      activeClass: (ent.isActive() ? "active" : "inactive")
    };
  }
});


Crafty.c("TextFragmentAttackDisplay", {
  _view: null,
  init: function (){
    this.requires("2D, DOM, Collision, TextFragment");
  },

  textFragmentAttackDisplay: function (opts){
    this._initView();
    this._bindRerenderOnRedraw();
    this.render();
    return this;
  },

  cleanupView: function (){
    this._view.undelegateEvents();
    this._view.remove();
  },

  render: function (){
    this._view.render();
  },

  //private
  
  _bindRerenderOnRedraw: function (){
    this.bind("TextFragmentRedraw", this.render.bind(this));
  },

  _initView: function (){
    this._view = new TextFragmentAttackDisplayView({entity: this});
  },
});
