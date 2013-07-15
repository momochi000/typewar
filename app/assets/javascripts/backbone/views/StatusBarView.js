Typewar.Views.StatusBarView = Backbone.View.extend({
  tagName: 'div',
  className: 'status-bar',
  _templateId: '#status-bar-template',
  _entityViews: [],

  render: function(opts) {
    this.$el.html(_.template($(this._templateId).html(), opts));
    $('body').append(this.el);

    _.each(this._entityViews, function(view) {
      view.render();
    });

    return this;
  },

  addEntity: function(entity) {
    this._entityViews.push(new Typewar.Views.EntityStatusView({entity: entity}));  
  }
});
