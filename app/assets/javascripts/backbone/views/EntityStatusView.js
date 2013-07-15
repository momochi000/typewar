Typewar.Views.EntityStatusView = Backbone.View.extend({
  tagName: 'div',
  className: 'entity-status',
  _templateId: '#entity-status',
  _parentId: '#status-area',
  entity: null,

  initialize: function(opts) {
    this.entity = opts.entity;
    this.entity.bind('updateStatus', _.bind(this.render, this));
  },

  render: function() {
    var opts = {
      hp: this.entity.getStatus("hp"),
      name: this.entity.getName()
    }
    this.$el.html(_.template($(this._templateId).html(), opts));
    $(this._parentId).append(this.el);

    return this;
  }
});
