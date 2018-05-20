/* Component which represents a UI element which is meant to highlight and describe some element on the page
 */

import Backbone from "backbone"

var Handlebars = require("handlebars");

var ModalView = Backbone.View.extend({
  tagName: 'div',
  className: 'typewar-ui-modal',
  _templateId: '#modal-template',

  initialize: function (opts) {
    this._template = Handlebars.compile($(this._templateId).html());
  },

  render: function (viewOptions){
    var view_opts
    view_opts = viewOptions || {};
    this.$el.html(this._template(view_opts));
    $("body").prepend(this.$el);
  }

});

Crafty.c("UICallout", {
  init: function (){ },

  uiCallout: function (options){
    this._view = new ModalView();
    return this;
  },

  render: function (view_options){
    this._view.render(view_options);
  },

  cleanup: function (){
    this._view.remove();
  }
});
