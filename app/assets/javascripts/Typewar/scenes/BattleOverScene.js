var BattleOverScene = Backbone.Model.extend({
  defaults: {
    scene_id: 'battle_over'
  },

  initialize: function (){
    var self = this;
    Crafty.scene(this.get('scene_id'), function (){
      self.initBackground();
    });
  },

  initBackground: function (){
    if(this.get('is_win') === true) {
      Crafty.background("#FFF url(\"assets/Typewar/backgrounds/battle_over_win.png\") no-repeat center center");
    }else{
      Crafty.background("#FFF url(\"assets/Typewar/backgrounds/battle_over_lose.jpg\") no-repeat center center");
    }
  },
  
  play: function (){
    Crafty.scene(this.get("scene_id"));
  }
});
