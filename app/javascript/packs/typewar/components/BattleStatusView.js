/* TODO everything wrong here, the file name doesn't correspond to the view
 * name nor the component name. The view should also be split into its own file
 * TODO: also a refactor is needed, I don't like there being code in the View
*/
import Backbone from 'backbone'

var Handlebars = require('handlebars');

var EntityStatusView = Backbone.View.extend({
  tagName: 'div',
  className: 'entity-status',
  _templateId: '#entity-status-template',
  _parentId: '#status-area',
  entity: null,

  initialize: function(opts) {
    this.entity = opts.entity;
    this._template = Handlebars.compile($(this._templateId).html());
  },

  render: function() {
    var opts, $found_el;

    opts = {
      name: this.entity.getName() || "Unnamed",
      percentHP: this.entity.getPercentHP(),
      statusHP: this.getStatusHP()
    }

    this.$el.html(this._template(opts));
    return this.$el;
  },

  getStatusHP: function (){
    var percentHP, statusHP;
    
    percentHP = this.entity.getPercentHP();
    if(percentHP < 30) {
      statusHP = 'health-bar-danger';
    } else if (percentHP < 70) {
      statusHP = 'health-bar-warning';
    } else {
      statusHP = 'health-bar-success';
    }

    return statusHP;
  }
});

Crafty.c("BattleStatus", {
  _battleStatusDirty: false,
  _statusView: null,

  init: function(){ this.requires("BattleCharacter"); },
  battleStatus: function (){ return this; },

  getStatusView: function (){ return this._statusView; },

  renderStatus: function (){
    if(!this._statusView) { 
      this._statusView = new EntityStatusView({entity: this, id: 'entity-status-'+this[0]});
    }
    this._statusView.render();
  },

  isStatusDirty: function (){ return this._battleStatusDirty; },

  resetStatusDirty: function (){ this._battleStatusDirty = false; },

  setStatusDirty: function (){ this._battleStatusDirty = true; }
});
