var global_enemy, global_player; // DEBUG;

var ProtoBattleScene = Backbone.Model.extend({
  defaults: {
    scene_id: 'prototype_battle'
  },

  initialize: function (){
    var self,
      enemy_npc,
      player;

    self = this;
    Crafty.scene(self.get('scene_id'), function (){
      Crafty.background("black");
      self.initializeSprites();
      enemy_npc = self.initializeEnemyNPC();
      player = self.initializePC();
      self.initializeBattleManager(player, enemy_npc);
    });
  },

  initializePC: function (){
    player = Crafty.e("2D, DOM, BattlePlayer, BattlePlayerAnim, pl_st0")
    player.attr({ x: 20, y: 200 })
      .battlePlayerAnim()
      .battlePlayer();
    global_player = player;

    return player;
  },

  initializeEnemyNPC: function (){
    enemy_npc = Crafty.e("2D, DOM, BattleNPCEnemy, BattleSlimeAnim, slime_st0")
      .attr({x: 700, y: 250})
      .battleSlimeAnim()
      .battleNPCEnemy();
    global_enemy = enemy_npc; // DEBUG:

    return enemy_npc;
  },

  initializeSprites: function (){
    Sprite.create('player');
    Sprite.create('slime');
  },

  initializeBattleManager: function(player, enemy) {
    new TypewarGame.BattleManager(player, enemy);
  },

  play: function (){
    Crafty.scene(this.get('scene_id'));
  }
});
