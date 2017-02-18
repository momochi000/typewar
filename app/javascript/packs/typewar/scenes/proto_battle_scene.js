import Sprite from "../assets/sprite"
import Background from "../assets/background"
import BattleManager from "../managers/battle_manager"

require("../components/BattleBackgroundComponent");

const STAGE_EDGE_BORDER_WIDTH = 9000;
const STAGE_EDGE_LEFT_BARRIER_OFFSET = -80;
const STAGE_EDGE_RIGHT_BARRIER_OFFSET = 60;
const STAGE_EDGE_FLOOR_BARRIER_OFFSET = 40;

// REFACTOR: Make most of the methods in here private
export default class ProtoBattleScene {

  constructor(){
    var self;

    self = this;
    this._scene_id = 'prototype_battle';
    this.STAGE_WIDTH = 450;
    this.STAGE_HEIGHT = 240;

    console.log("DEBUG: ProtoBattleScene#constructor");
    Crafty.scene(this._scene_id, function (){
      var chars_loaded_promise;

      self.initSprites();
      self.initBackground();
      //      self.initAudio();
      self.initStageEdges();
      self.initCamera();
      self.initBattleManager();

      // LEFT OFF 2 ------------------------------------------------------------
      // ----------------------------------------------------------------------
      //   Let's reexamine if there is really a need to put these in promises.
      //   It's really hightened the complexity and I'm not sure if it's necessary
      //
      //   From what I remember, I put it there because the player and npc data
      //   could (or would) come from the server, and so the game would need to
      //   wait for that to continue loading other things or else it would break.
      //
      //   Perhaps web workers could facilitate this...
      //   What might be better is a loader module (BattleLoadingScene?) that
      //   kicks off background workers which load all the necessary systems and
      //   assets, keeping track of their status.  When they're all green, then
      //   the loader is done and hands off it's data over to the battle manager
      //
      //   Another thing to think about is to place all data into some top level
      //   store similar to the way flux handles it's store.
      // ----------------------------------------------------------------------
      // ----------------------------------------------------------------------
      //      self.initCombatants().then(function (response){
      //        self.initUI();
      //        self.activateBattleAI();
      //        self.initInputManager();
      //      }, function (error){
      //        throw new Error(error);
      //        alert('bail');
      //      }).catch( function (error){
      //      });
    });
  }

  get sceneId(){
    return this._scene_id;
  }

  activateBattleAI(){
    Typewar.Engine.battlemanager._setupBattleAI();
  }

  deallocateBattleManager(){
    Typewar.Engine.battlemanager.destroy();
  }

  deallocateBG(){
    this._background.destroy();
    this._background = null;
  }

  deallocateCombatants(){
    this._combatants.player.destroy();
    _.each(this._combatants.enemies, function (enemy){
      enemy.destroy();
    });
    this._combatants = null;
  }

  deallocateInputManager(){
    Typewar.Engine.inputmanager.destroy();
  }

  deallocateStageEdges(){
    this._stageBorders.leftEdge.destroy();
    this._stageBorders.leftEdge = null;
    this._stageBorders.rightEdge.destroy();
    this._stageBorders.rightEdge = null
    this._stageBorders.bottomEdge.destroy();
    this._stageBorders.bottomEdge = null
  }

  deallocateStatusBar(){
    this._statusBar.deallocate();
  }

  initAudio(){
    Typewar.Engine.audiomanager = Crafty.e("AudioManager").audioManager();
    Typewar.Engine.audiomanager.initAudioModule("input");
  }

  initBackground(){
    var bg, bg_data;

    bg_data = Background.getBackground('test_bg01');
    bg = Crafty.e("2D, DOM, Image, BattleBackground")
      .battleBackground(bg_data.file, bg_data.width, bg_data.height)
      .attr({x: -26, y: -60, z: 0});
    this._background = bg;
  }

  initBattleManager(options){
    options = options || {};
    this._battleManager = new BattleManager(options)
  }

  initCamera(){
    Crafty.viewport.scale(2.4);
    Crafty.viewport.y -= 70;
    Crafty.viewport.x -= 10;
  }

  initCombatants(){
    var enemy_npc, player, self;

    self = this;

    return new Promise( function (fulfill, reject){
      self.initPC().then( function (pc_entity) {
        player = pc_entity;
        return self.initEnemyNPC();
      }, function (error){
        console.log("ERROR: there was an error initializing the player character", error);
      }).then( function (npc_entity) {
        enemy_npc = npc_entity;
        this._combatants = {player: player, enemies: [enemy_npc]};
        self._addCombatantsToBattleManager();
        fulfill();
      }, function (error){
        console.log("ERROR: there was an error initializing the npc", error);
      }).catch( function (error){
        console.log("ERROR: there was an error initializing the player or NPC and adding them to the battle manager", error);
      });
    });
  }

  initEnemyNPC(){
    var enemy_entity;
    //return new NPCEntity();

     enemy_entity = Crafty.e("2D, DOM, BattleCharacter, BattleNPCEnemy, BattleSlimeAnim, NPCBrain, slime_st0, Collision, BattleStatus, BattleSlime")
      .attr({x: 390, y: 210, w: 42, h: 42 })
      .battleCharacter()
      .battleNPCEnemy()
      .battleSlimeAnim()
      .battleStatus()
      .nPCBrain()
      .collision([0,0],[0,50],[50,60],[0,60]);

    promise = enemy_entity.getFromServer();

    promise.then( function (){
      enemy_entity._setupBattleNPCSkills();
    });

    return promise;
  }

  initInputManager(){
    Typewar.Engine.inputmanager = new Typewar.Models.BattleInputManager;
  }

  initPC(){
    var pc_ent, pc_model, promise;

    pc_ent = Crafty.e("2D, DOM, BattleCharacter, BattlePlayer, BattlePlayerZeroAnim, plz_st0, Collision, BattleStatus")
    pc_ent.attr({ x: 20, y: 180 })
      .battlePlayerZeroAnim()
      .battleCharacter()
      .battlePlayer()
      .battleStatus()
      .collision([0,0],[60,0],[60,120],[0,120]);

    promise = pc_ent.getFromServer();
    return promise;
  }

  initSkillManager(){
    var player;

    player = this._combatants.player;
    player.initSkills();
  }

  initSprites(){
    //Sprite.create('player');
    Sprite.create('player_zero');
    Sprite.create('slime');
  }

  initStageEdges(){
    var stage_height, stage_width,
    stage_width = this.STAGE_WIDTH;
    stage_height = this.STAGE_HEIGHT;

    this._stageBorders = {
      leftEdge: Crafty.e("2D, DOM, Collision, BattleStageEdge")
                  .attr({x: STAGE_EDGE_LEFT_BARRIER_OFFSET, y: 0, w: 5, h: 9000 })
                  .collision([0,0], [0, 9000], [5, 9000], [5, 0]),

      rightEdge: Crafty.e("2D, DOM, Collision, BattleStageEdge")
                   .attr({x: stage_width+STAGE_EDGE_RIGHT_BARRIER_OFFSET, y: 0, w: 5, h: 9000 })
                   .collision([0,0], [0, 9000], [5, 9000], [5, 0]),

      bottomEdge: Crafty.e("2D, DOM, Collision, BattleStageEdge")
                    .attr({x: 0, y: stage_height + STAGE_EDGE_FLOOR_BARRIER_OFFSET, w: 9000, h: 5 })
                    .collision([0,0], [9000, 0], [9000, 5], [0, 5])
    }
  }

  initStatusBar() {
    var player, enemy, statusBar;

    player = this._combatants.player;
    enemy = this._combatants.enemies[0];
    statusBar = new Typewar.Views.StatusBarView();
    statusBar.render();
    statusBar.addEntity(player);
    statusBar.addEntity(enemy);
    this._statusBar = statusBar;
  }

  initUI(){
    this.initSkillManager();
    this.initStatusBar();
  }

  play(){
    Crafty.scene(this._scene_id);
  }

  resetCamera(){
    Crafty.viewport.scale(1);
  } 

  stop(){
    this._analyzeTypingData();
    this.deallocateCombatants();
    this.deallocateBG();
    this.deallocateStageEdges();
    this.resetCamera();
    this.deallocateBattleManager();
    this.deallocateStatusBar();
    this.deallocateInputManager();
  }

  // private
  _addCombatantsToBattleManager(){
    // TODO: This looks rather smelly. Probably refactor.
    this._battleManager.registerPlayer(this._combatants.player);
    this._battleManager.registerEnemies(this._combatants.enemies);
  }

  _analyzeTypingData(){
    var typing_analyzer;

    typing_analyzer = new Typewar.Engine.Managers.TypingStatsManager()
    typing_analyzer.analyze();
    // TODO: send this data back up to the server
  }
}
