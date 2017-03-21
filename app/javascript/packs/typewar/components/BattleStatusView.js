/* TODO everything wrong here, the file name doesn't correspond to the view
 * name nor the component name. The view should also be split into its own file
*/
import Backbone from 'backbone'
require("crafty");
var Handlebars = require('handlebars');

var EntityStatusView = Backbone.View.extend({
  tagName: 'div',
  className: 'entity-status',
  _templateId: '#entity-status-template',
  _parentId: '#status-area',
  entity: null,

  // TODO: This should take in backbone models rather than entities
  initialize: function(opts) {
    this.entity = opts.entity;
    this._template = Handlebars.compile($(this._templateId).html());
  },

  render: function() {
    var opts, $found_el;

    opts = {
      mode_icon: this.getModeIcon(),
      name: this.entity.getName() || "Unnamed",
      percentHP: this.entity.getPercentHP(),
      statusHP: this.getStatusHP()
    }

    this.$el.html(this._template(opts));
    return this.$el;
  },

  deallocate: function (){
    this.entity = null;
    this.remove();
  },

  getModeIcon: function (){
    // Return the appropriate icon for attack or defense etc.
    switch(this.entity.getStance()){
      case "offense":
        return "assets/Typewar/icons/crossed-swords.svg"
        break;
      case "defense":
        return "assets/Typewar/icons/checked-shield.svg"
        break;
      default:
        return "assets/Typewar/icons/checked-shield.svg"
    };
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


// Here is our interface to the view
// It contains a view 
Crafty.c("BattleStatus", {
  _battleStatusDirty: false,
  _statusView: null,

  init: function(){ this.requires("BattleCharacter"); },
  battleStatus: function (){
    this._statusView = new EntityStatusView({entity: this, id: 'entity-status-'+this[0]});
    return this;
  },

  getStatusView: function (){
    return this._statusView;
  },

  renderStatus: function (){
    this._statusView.render();
  },

  isStatusDirty: function (){
    return this._battleStatusDirty;
  },

  resetStatusDirty: function (){
    this._battleStatusDirty = false;
  },

  setStatusDirty: function (){
    this._battleStatusDirty = true;
  }
});
