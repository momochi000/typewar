export default class PlayerLoseScene {
  constructor() {
    Crafty.scene();
  }
}

Typewar.Data.Scenes.PlayerLoseScene = Backbone.Model.extend({
  defaults: {
    scene_id: 'player_lose_scene'
  },

  initialize: function (){
    var self = this;
    Crafty.scene(this.get('scene_id'), function (){
      self.initBackground();
    });
  },

  initBackground: function (){
    Crafty.background("#FFF url(\"assets/Typewar/backgrounds/battle_over_lose.jpg\") no-repeat center center");
  },

  play: function (){
    Crafty.scene(this.get("scene_id"));
  }
});
