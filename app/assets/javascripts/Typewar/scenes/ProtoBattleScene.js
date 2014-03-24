var global_bg; // DEBUG;

var ProtoBattleScene = Backbone.Model.extend({
  defaults: {
    scene_id: 'prototype_battle'
  },

  initialize: function (){
    var self, statusBar;

    self = this;
    Crafty.scene(self.get('scene_id'), function (){
      self.initSprites();
      self.loadCombatants();
      self.initBackground();
      self.initStageEdges();
      self.initCamera();
      self.initBattleManager(self.combatants);
      self.initStatusBar(self.combatants.player, self.combatants.enemies[0]);
      self.initInputManager();
    });
  },

  initBackground: function (){
    global_bg = Crafty.e("2D, DOM, Image, BattleBackground")
      .battleBackground("assets/Typewar/backgrounds/Fighting-Game-Background-GIFs-2.gif", 800, 336)
      .attr({x: -26, y: -60, z: 0});
  },

  initBattleManager: function (options){
    Typewar.Engine.BattleManager = new Typewar.Models.BattleManager(options);
  },

  initCamera: function (){
    Crafty.viewport.scale(2.4);
    Crafty.viewport.y -= 140;
    Crafty.viewport.x -= 30;
  },

  initPC: function (){
    var player;
    player = new PCBattleEntity();

    return player;
  },

  initEnemyNPC: function (){
    var slime_char_sheet = new Typewar.Models.CharacterSheet;

    slime_char_sheet.set('name', 'Chaos slime');
    enemy_npc = new NPCEntity();

    return enemy_npc
  },

  initSprites: function (){
    //Sprite.create('player');
    Sprite.create('player_zero');
    Sprite.create('slime');
  },

  // TODO: set up the right edge of the screen correctly according to the width of the window
  initStageEdges: function (){
    var width, height;

    width = Typewar.viewportWidth;
    height = Typewar.viewportHeight;

    Crafty.e("2D, DOM, Collision, BattleStageEdge, SolidHitBox") // Left edge
      .attr({x: 0, y: 0, w: 5, h: height })
      .collision([[0,0], [0, height], [5, height], [5, 0]]);

    Crafty.e("2D, DOM, Collision, BattleStageEdge, SolidHitBox") // Right edge
      .attr({x: 600, y: 0, w: 5, h: height })
      .collision([[0,0], [0, height], [5, height], [5, 0]]);
  },

  initInputManager: function (){
    Typewar.Engine.InputManager = new Typewar.Models.BattleInputManager;
  },

  initStatusBar: function(player, enemy) {
    var statusBar = new Typewar.Views.StatusBarView();
    // TODO: Make this pass in models rather than entities
    statusBar.addEntity(player.getEntity());
    statusBar.addEntity(enemy.getEntity());

    statusBar.render();
  },

  loadCombatants: function (){
    var enemy_npc, player;

    enemy_npc = this.initEnemyNPC();
    player = this.initPC();
    this.combatants = {player: player, enemies: [enemy_npc]};
    return this.combatants;
  },

  play: function (){
    Crafty.scene(this.get('scene_id'));
  }
});
