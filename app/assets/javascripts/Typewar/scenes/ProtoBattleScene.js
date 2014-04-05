var global_bg; // DEBUG;

var ProtoBattleScene = Backbone.Model.extend({
  defaults: {
    scene_id: 'prototype_battle'
  },

  initialize: function (){
    var self;

    self = this;
    Crafty.scene(self.get('scene_id'), function (){
      self.initSprites();
      self.loadCombatants();
      self.initBackground();
      self.initStageEdges();
      self.initCamera();
      self.initBattleManager(self.get('combatants'));
      self.initStatusBar(self.get('combatants').player, self.get('combatants').enemies[0]);
      self.initInputManager();
    });
  },

  deallocateBattleManager: function (){
    Typewar.Engine.BattleManager.destroy();
  },

  deallocateBG: function (){
    this.get('background').destroy();
    this.unset('background');
  },

  deallocateCombatants: function (){
    this.get('combatants').player.deallocate();
    this.get('combatants').enemies[0].deallocate();
    this.unset('combatants');
  },

  deallocateInputManager: function (){
    Typewar.Engine.InputManager.deallocate();
  },

  deallocateStageEdges: function (){
    this.get('left_edge').destroy();
    this.unset('left_edge');
    this.get('right_edge').destroy();
    this.unset('right_edge');
  },

  deallocateStatusBar: function (){
    this.get('status_bar').deallocate();
  },

  initBackground: function (){
    var bg;
    bg = Crafty.e("2D, DOM, Image, BattleBackground")
      .battleBackground("assets/Typewar/backgrounds/Fighting-Game-Background-GIFs-2.gif", 800, 336)
      .attr({x: -26, y: -60, z: 0});
    global_bg = bg;
    this.set('background', bg);
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
    return new PCBattleEntity();
  },

  initEnemyNPC: function (){
    //var slime_char_sheet = new Typewar.Models.CharacterSheet;
    //slime_char_sheet.set('name', 'Chaos slime');

    return new NPCEntity();
  },

  initSprites: function (){
    //Sprite.create('player');
    Sprite.create('player_zero');
    Sprite.create('slime');
  },

  // TODO: set up the right edge of the screen correctly according to the width of the window
  initStageEdges: function (){
    var width, height, left_edge, right_edge;

    width = Typewar.viewportWidth;
    height = Typewar.viewportHeight;

    left_edge = Crafty.e("2D, DOM, Collision, BattleStageEdge, SolidHitBox") // Left edge
      .attr({x: 0, y: 0, w: 5, h: height })
      .collision([[0,0], [0, height], [5, height], [5, 0]]);

    right_edge = Crafty.e("2D, DOM, Collision, BattleStageEdge, SolidHitBox") // Right edge
      .attr({x: 600, y: 0, w: 5, h: height })
      .collision([[0,0], [0, height], [5, height], [5, 0]]);

    this.set('left_edge', left_edge);
    this.set('right_edge', right_edge);
  },

  initInputManager: function (){
    Typewar.Engine.InputManager = new Typewar.Models.BattleInputManager;
  },

  initStatusBar: function(player, enemy) {
    var statusBar = new Typewar.Views.StatusBarView();
    // TODO: Make this pass in backbone models rather than entities
    statusBar.render();
    statusBar.addEntity(player.getEntity());
    statusBar.addEntity(enemy.getEntity());
    this.set('status_bar', statusBar);
  },

  loadCombatants: function (){
    var enemy_npc, player, combatants;

    enemy_npc = this.initEnemyNPC();
    player = this.initPC();

    combatants = {player: player, enemies: [enemy_npc]};
    this.set('combatants', combatants);
    return combatants;
  },

  play: function (){
    Crafty.scene(this.get('scene_id'));
  },

  resetCamera: function (){
    Crafty.viewport.scale(1);
  }, 

  stop: function (){
    this.deallocateCombatants();
    this.deallocateBG();
    this.deallocateStageEdges();
    this.resetCamera();
    this.deallocateBattleManager();
    this.deallocateStatusBar();
    this.deallocateInputManager();
  }
});
