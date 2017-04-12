import Backbone from "backbone"

var StatusBarView;
var Handlebars = require('handlebars');

const STATUS_BAR_VIEW_CONTAINER = "#typewar-status-bar-wrap";

StatusBarView = Backbone.View.extend({
  tagName: 'div',
  className: 'status-bar',
  _templateId: '#status-bar-template',

  initialize: function (){
    this._childViews = [];
    this._template = Handlebars.compile($(this._templateId).html());
  },

  insertChild: function (childView){
    this._childViews.push(childView);
  },

  cleanupChildViews: function (){
    _.each(this._childViews, (curr_child) => {
      curr_child.remove();
    });
    this._childViews = null;
  },

  render: function (opts){
    if(!this._existsOnPage()){ this._insertIntoPage();}
    this.$el.html(this._template());

    this._renderChildViews();
    return this;
  },

  _existsOnPage: function (){
    return _.some($(this.id));
  },

  _insertIntoPage: function (){
    $(STATUS_BAR_VIEW_CONTAINER).append(this.$el);
  },

  _renderChildViews: function (){
    var self = this;
    _.each(this._childViews, function(view) {
      self.$el.append(view.render()); 
    });
  }
});

Crafty.c("BattleStatusBarView", {
  init: function (){
  },

  battleStatusBarView: function (){
    this._view = new StatusBarView();
    return this;
  },

  getView: function (){
    return this._view;
  },

  render: function (){
    this._view.render();
  }
});
