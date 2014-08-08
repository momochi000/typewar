Typewar.Data.Scenes.PlayerWinScene = Backbone.Model.extend({
  defaults: {
    scene_id: 'player_win_scene'
  },

  initialize: function (){
    var self = this;
    Crafty.scene(this.get('scene_id'), function (){
      self.initBackground();
    });
  },

  initBackground: function (){
    Crafty.background("#FFF url(\"assets/Typewar/backgrounds/battle_over_win.png\") no-repeat center center");
  },
  
  play: function (){
    Crafty.scene(this.get("scene_id"));
  }
});
