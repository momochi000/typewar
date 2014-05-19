Typewar.Views.StatusBarView = Backbone.View.extend({
  tagName: 'div',
  className: 'status-bar',
  _templateId: '#status-bar-template',
  _entityViews: [],

  render: function(opts) {
    this.$el.html(_.template($(this._templateId).html(), opts));
    //$('body').append(this.el);
    Typewar.Engine.$container.find('#cr-stage').prepend(this.el);

    _.each(this._entityViews, function(view) {
      view.render();
    });

    return this;
  },

  addEntity: function(entity) {
    if(!entity.status_view){ return null; }
    this._entityViews.push(entity.status_view);
    this.$el.append(entity.status_view.$el);
    return entity.status_view;
  },

  deallocate: function (){
    _.each(this._entityViews, function (view){
      view.deallocate();
      view.remove();
    });
    this.remove();
  }
});
