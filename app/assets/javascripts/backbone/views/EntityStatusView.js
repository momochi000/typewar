Typewar.Views.EntityStatusView = Backbone.View.extend({
  tagName: 'div',
  className: 'entity-status',
  _templateId: '#entity-status-template',
  _parentId: '#status-area',
  entity: null,

  // TODO: This should take in backbone models rather than entities
  initialize: function(opts) {
    this.entity = opts.entity;
    // TODO: Figure out how to nicely unbind this to prevent memory leaks
    this.entity.bind('UpdateStatus', _.bind(this.render, this));
  },

  render: function() {
    var opts, $found_el;
    opts = {
      hp: this.entity.getStatus("hp"),
      mode_icon: this.getStanceIcon(),
      name: this.entity.getName(),
      percentHP: this.entity.getPercentHP(),
      statusHP: this.getStatusHP()
    }

    this.$el.html(_.template($(this._templateId).html(), opts));
    return this;
  },

  deallocate: function (){
    this.entity.unbind('UpdateStatus'); // TODO: check to make sure this works
    this.entity = null;
    this.remove();
  },

  getStanceIcon: function (){
    // Return the appropriate icon for attack or defense etc.
    var curr_mode;

    curr_mode = Typewar.Engine.BattleManager.getMode();
    console.log("DEBUG: EntityStatusView#getStanceIcon current_mode is ---->" + curr_mode);
    //switch(Typewar.Engine.BattleManager.getMode()){
    switch(curr_mode){
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
    var percentHP = this.entity.getPercentHP();
    var statusHP;

    if(percentHP < 30) {
      statusHP = 'progress-bar-danger';
    } else if (percentHP < 70) {
      statusHP = 'progress-bar-warning';
    } else {
      statusHP = 'progress-bar-success';
    }

    return statusHP;
  }
});
