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
    var new_view = new Typewar.Views.EntityStatusView({entity: entity, id: 'entity-status-'+entity[0]})
    new_view.render();
    this._entityViews.push(new_view);
    this.$el.append(new_view.$el);
  },

  deallocate: function (){
    _.each(this._entityViews, function (view){
      view.deallocate();
      view.remove();
    });
    this.remove();
  }
});
