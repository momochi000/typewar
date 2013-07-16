var global_enemy, global_player; // DEBUG;

var ProtoBattleScene = Backbone.Model.extend({
  defaults: {
    scene_id: 'prototype_battle'
  },

  initialize: function (){
    var self,
      enemy_npc,
      player,
      statusBar;

    self = this;
    Crafty.scene(self.get('scene_id'), function (){
      Crafty.background("black");
      self.initializeSprites();
      enemy_npc = self.initializeEnemyNPC();
      player = self.initializePC();
      self.initializeBattleManager({player: player, enemies: [enemy_npc]});
      self.initializeStatusBar(player, enemy_npc);
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
    var slime_char_sheet = new Typewar.Models.CharacterSheet;
    slime_char_sheet.set('name', 'Chaos slime');

    slime_char_sheet 
    enemy_npc = Crafty.e("2D, DOM, BattleNPCEnemy, BattleSlimeAnim, slime_st0")
      .attr({x: 700, y: 250})
      .battleSlimeAnim()
      .battleNPCEnemy(slime_char_sheet);
    global_enemy = enemy_npc; // DEBUG:

    return enemy_npc;
  },

  initializeSprites: function (){
    Sprite.create('player');
    Sprite.create('slime');
  },

  initializeBattleManager: function (options){
    new Typewar.Models.BattleManager(options);
  },

  initializeStatusBar: function(player, enemy) {
    var statusBar = new Typewar.Views.StatusBarView();
    statusBar.addEntity(player);
    statusBar.addEntity(enemy);

    statusBar.render();
  },

  play: function (){
    Crafty.scene(this.get('scene_id'));
  }
});
