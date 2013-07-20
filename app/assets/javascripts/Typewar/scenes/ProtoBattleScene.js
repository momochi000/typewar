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
      self.initSprites();
      enemy_npc = self.initEnemyNPC();
      player = self.initPC();
      self.initCamera();
      self.initBattleManager({player: player, enemies: [enemy_npc]});
      self.initStatusBar(player, enemy_npc);
      self.initInputManager();
    });
  },

  initCamera: function (){
    Crafty.viewport.scale(1.75);
  },

  initPC: function (){
    player = Crafty.e("2D, DOM, BattlePlayer, BattlePlayerAnim, pl_st0")
    player.attr({ x: 20, y: 180 })
      .battlePlayerAnim()
      .battlePlayer();
    global_player = player;

    return player;
  },

  initEnemyNPC: function (){
    var slime_char_sheet = new Typewar.Models.CharacterSheet;
    slime_char_sheet.set('name', 'Chaos slime');

    slime_char_sheet 
    enemy_npc = Crafty.e("2D, DOM, BattleNPCEnemy, BattleSlimeAnim, slime_st0")
      .attr({x: 520, y: 220})
      .battleSlimeAnim()
      .battleNPCEnemy(slime_char_sheet);
    global_enemy = enemy_npc; // DEBUG:

    return enemy_npc;
  },

  initSprites: function (){
    Sprite.create('player');
    Sprite.create('slime');
  },

  initBattleManager: function (options){
    Typewar.Engine.BattleManager = new Typewar.Models.BattleManager(options);
  },

  initInputManager: function (){
    Typewar.Engine.InputManager = new Typewar.Models.BattleInputManager;
  },

  initStatusBar: function(player, enemy) {
    var statusBar = new Typewar.Views.StatusBarView();
    statusBar.addEntity(player);
    statusBar.addEntity(enemy);

    statusBar.render();
  },

  play: function (){
    Crafty.scene(this.get('scene_id'));
  }
});
