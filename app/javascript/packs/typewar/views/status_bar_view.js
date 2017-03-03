/* TODO REFACTOR:
 * All views should go in their own files like this one
*/

import Backbone from "backbone"

var StatusBarView;
var Handlebars = require('handlebars');

const STATUS_BAR_VIEW_CONTAINER = "#typewar-status-bar-wrap";

export default StatusBarView = Backbone.View.extend({
  tagName: 'div',
  className: 'status-bar',
  _templateId: '#status-bar-template',
  _childViews: [],

  initialize: function (){
    this._template = Handlebars.compile($(this._templateId).html());
  },

  insertChild: function (childView){
    this._childViews.push(childView);
  },

  render: function (opts){
    var self = this;
    if(!this._existsOnPage()){ this._insertIntoPage();}
    this.$el.html(this._template());

    _.each(this._childViews, function(view) {
      self.$el.append(view.render()); 
    });

    return this;
  },

  _existsOnPage: function (){
    return _.some($(this.id));
  },

  _insertIntoPage: function (){
    $(STATUS_BAR_VIEW_CONTAINER).append(this.$el);
  }
});
