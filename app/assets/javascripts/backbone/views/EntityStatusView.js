Typewar.Views.EntityStatusView = Backbone.View.extend({
  tagName: 'div',
  className: 'entity-status',
  _templateId: '#entity-status',
  _parentId: '#status-area',
  entity: null,

  initialize: function(opts) {
    this.entity = opts.entity;
    this.entity.bind('updateStatus', _.bind(this.render, this));
    //Figure out how to nicely unbind this to prevent memory leaks
  },

  render: function() {
    var opts = {
      hp: this.entity.getStatus("hp"),
      name: this.entity.getName(),
      percentHP: this.entity.getPercentHP(),
      statusHP: this.getStatusHP()
    }
    this.$el.html(_.template($(this._templateId).html(), opts));
    $(this._parentId).append(this.el);

    return this;
  },

  getStatusHP: function() {
    var percentHP = this.entity.getPercentHP();
    var statusHP;

    if(percentHP < 30) {
      statusHP = 'progress-danger';
    } else if (percentHP < 70) {
      statusHP = 'progress-warning';
    } else {
      statusHP = 'progress-success';
    }

    return statusHP;
  }
});
