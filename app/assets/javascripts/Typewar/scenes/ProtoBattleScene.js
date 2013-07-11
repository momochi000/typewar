var global_enemy;
var ProtoBattleScene = Backbone.Model.extend({
  defaults: {
    scene_id: 'prototype_battle'
  },

  initialize: function (){
    var self,
      enemy_npc;

    self = this;
    Crafty.scene(self.get('scene_id'), function (){
      Crafty.background("black");
      enemy_npc = Crafty.e("2D, DOM, BattleNPCEnemy")
        .attr({x: 500, y: 300})
        .battleNPCEnemy();
      global_enemy = enemy_npc;
    });
  },

  play: function (){
    Crafty.scene(this.get('scene_id'));
  }
});
