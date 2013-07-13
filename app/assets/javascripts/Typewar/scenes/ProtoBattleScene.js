var global_enemy, global_player; // DEBUG;

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
      self.initializeSprites();
      self.initializeEnemyNPC();
      self.initializePC();
    });
  },

  initializePC: function (){
    player = Crafty.e("2D, DOM, BattlePlayer, BattlePlayerAnim, pl_st0")
    player.attr({ x: 20, y: 200 })
      .battlePlayerAnim()
      .battlePlayer();
    global_player = player;
  },

  initializeEnemyNPC: function (){
    enemy_npc = Crafty.e("2D, DOM, BattleNPCEnemy, BattleSlimeAnim, slime_st0")
      .attr({x: 700, y: 250})
      .battleSlimeAnim()
      .battleNPCEnemy();
    global_enemy = enemy_npc; // DEBUG:
  },

  initializeSprites: function (){
    Sprite.create('player');
    Sprite.create('slime');
  },

  play: function (){
    Crafty.scene(this.get('scene_id'));
  }

});
