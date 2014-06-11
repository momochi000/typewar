var global_bg; // DEBUG;

var ProtoBattleScene = Backbone.Model.extend({
  defaults: {
    scene_id: 'prototype_battle',
    STAGE_WIDTH: 450,
    STAGE_HEIGHT: 240
  },

  initialize: function (){
    var self;

    self = this;
    Crafty.scene(self.get('scene_id'), function (){
      var chars_loaded_promise;

      self.initSprites();
      self.initBackground();
      self.initStageEdges();
      self.initCamera();
      self.initBattleManager();

      self.initCombatants().then(function (response){
        self.initUI();
        self.activateBattleAI();
        self.initInputManager();
      }, function (error){
        alert('bail');
      }).catch( function (error){
        console.log("ERROR: there was an error during or after initializing combatants", error);
      });
    });
  },

  activateBattleAI: function (){
    Typewar.Engine.BattleManager._setupBattleAI();
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
    _.each(this.get('combatants').enemies, function (enemy){
      enemy.deallocate();
    });
    this.unset('combatants');
  },

  deallocateInputManager: function (){
    Typewar.Engine.inputManager.destroy();
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
    Crafty.viewport.y -= 70;
    Crafty.viewport.x -= 10;
  },

  initCombatants: function (){
    var enemy_npc, player, combatants, self;

    self = this;

    return new Promise( function (fulfill, reject){
      self.initPC().then( function (pc_model) {
        player = pc_model;
        return self.initEnemyNPC();
      }, function (error){
        console.log("ERROR: there was an error initializing the player character", error);
      }).then( function (npc_model) {
        enemy_npc = npc_model
        combatants = {player: player, enemies: [enemy_npc]};
        self.set('combatants', combatants);
        self._addCombatantsToBattleManager();
        fulfill();
      }, function (error){
        console.log("ERROR: there was an error initializing the npc", error);
      }).catch( function (error){
        console.log("ERROR: there was an error initializing the player or NPC and adding them to the battle manager", error);
      });
    });
  },

  initEnemyNPC: function (){
    //var slime_char_sheet = new Typewar.Models.CharacterSheet;
    //slime_char_sheet.set('name', 'Chaos slime');

    return new NPCEntity();
  },

  initInputManager: function (){
    Typewar.Engine.inputManager = new Typewar.Models.BattleInputManager;
  },

  initPC: function (){
    var pc_model, promise;

    pc_model = new PCBattleEntity();
    promise = pc_model.getFromServer();
    return promise;
  },

  initSkillManager: function (){
    var player;

    player = this.get("combatants").player;
    player.initSkills();
  },

  initSprites: function (){
    //Sprite.create('player');
    Sprite.create('player_zero');
    Sprite.create('slime');
  },

  // TODO: Add top border
  initStageEdges: function (){
    var height, left_edge, right_edge, bottom_edge, stage_width,
      STAGE_EDGE_BORDER_WIDTH,
      STAGE_EDGE_LEFT_BARRIER_OFFSET, STAGE_EDGE_RIGHT_BARRIER_OFFSET,
      STAGE_EDGE_FLOOR_BARRIER_OFFSET;

    STAGE_EDGE_BORDER_WIDTH = 9000;
    STAGE_EDGE_LEFT_BARRIER_OFFSET = -80;
    STAGE_EDGE_RIGHT_BARRIER_OFFSET = 60;
    STAGE_EDGE_FLOOR_BARRIER_OFFSET = 40;

    stage_width = this.get("STAGE_WIDTH");
    stage_height = this.get("STAGE_HEIGHT");

    left_edge = Crafty.e("2D, DOM, Collision, BattleStageEdge")
      .attr({x: STAGE_EDGE_LEFT_BARRIER_OFFSET, y: 0, w: 5, h: 9000 })
      .collision([0,0], [0, 9000], [5, 9000], [5, 0]);

    right_edge = Crafty.e("2D, DOM, Collision, BattleStageEdge")
      .attr({x: stage_width+STAGE_EDGE_RIGHT_BARRIER_OFFSET, y: 0, w: 5, h: 9000 })
      .collision([0,0], [0, 9000], [5, 9000], [5, 0]);

    bottom_edge = Crafty.e("2D, DOM, Collision, BattleStageEdge")
      .attr({x: 0, y: stage_height + STAGE_EDGE_FLOOR_BARRIER_OFFSET, w: 9000, h: 5 })
      .collision([0,0], [9000, 0], [9000, 5], [0, 5]);

    this.set('left_edge', left_edge);
    this.set('right_edge', right_edge);
    this.set('bottom_edge', bottom_edge);
  },

  initStatusBar: function() {
    var player, enemy, statusBar;

    player = this.get("combatants").player;
    enemy = this.get("combatants").enemies[0];
    statusBar = new Typewar.Views.StatusBarView();
    statusBar.render();
    statusBar.addEntity(player.getEntity());
    statusBar.addEntity(enemy.getEntity());
    this.set('status_bar', statusBar);
  },

  initUI: function (){
    this.initSkillManager();
    this.initStatusBar();
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
  },

  // private
  _addCombatantsToBattleManager: function (){
    Typewar.Engine.BattleManager.registerPlayer(this.get('combatants').player);
    Typewar.Engine.BattleManager.registerEnemies(this.get('combatants').enemies);
  }
});
