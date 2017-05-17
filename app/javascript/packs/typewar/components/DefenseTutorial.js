var Handlebars = require('handlebars');
import Backbone from 'backbone'

var DefTutorialNotificationView = Backbone.View.extend({
  tagName: 'div',
  className: 'defense-tutorial-notification',
  id: 'defense-tutorial-notification',
  _templateId: '#defense-tutorial-notif-template',

  initialize: function (){
    console.log("DEBUG: initializing tutorial notification view");
    this._template = Handlebars.compile($(this._templateId).html());
  },

  render: function (count){
    var opts = {count: count};
    console.log("DEBUG: rendering tutorial notif view.  With count -> ",opts);
    this.$el.html(this._template(opts));
    if($("#"+this.id).length <1){ // insert into page if it's not there
      $("#typewar-game").prepend(this.$el);
    }
  }
});

Crafty.c("DefenseTutorial", {
  init: function (){ 
    this._defendedCount = 0;
  },

  defenseTutorial: function (count){
    this._defendedGoal = count;
    this._view = new DefTutorialNotificationView();
    this._view.render(count);
    return this;
  },

  cleanup: function (){
    this._view.remove();
  },

  getDefenseGoal: function (){
    return this._defendedGoal;
  },

  getDefendedCount: function (){
    return this._defendedCount;
  },

  getView: function (){
    return this._view;
  },

  incrementDefendedCount: function (){
    this._defendedCount+=1;
  }
});
