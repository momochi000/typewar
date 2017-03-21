import Sprite from "../assets/sprite"
import Background from "../assets/background"
import BattleManager from "../managers/battle_manager"
//import BattleInputManager from "../managers/battle_input_manager"
import StatusBarView from "../views/status_bar_view"

import {initBattleEffectSystem, battleEffectSystem} from "../systems/battle_effect_system"
import {initBattleStatusSystem, battleStatusSystem} from "../systems/battle_status_system"
import {initInputSystem, inputSystem} from "../systems/input_system"
import {initPlayerSkillSystem, playerSkillSystem} from "../systems/player_skill_system"
import {initNPCSkillSystem, npcSkillSystem} from "../systems/npc_skill_system"
import {initNPCAISystem, nPCAISystem} from "../systems/npc_ai_system"
import {initProjectileSystem, projectileSystem} from "../systems/projectile_system"
import {initTriggerEffectOnCollideSystem, triggerEffectOnCollideSystem} from "../systems/trigger_effect_on_collide_system"
import {initDefendableSkillSystem, defendableSkillSystem} from "../systems/defendable_skill_system"
import {initTextFragmentAttackDisplaySystem, textFragmentAttackDisplaySystem} from "../systems/text_fragment_attack_display_system"

require("../components/BattleBackgroundComponent");
require("../components/BattleEffectable");
require("../components/BattleStatusView");
require("../components/BattleStance");
require("../components/characters/battle/BattleCharacterComponent");
require("../components/characters/battle/BattlePlayerComponent");
require("../components/BattleNPCSkillManagerComponent");
require("../components/animations/BattlePlayerZeroAnimation");
require("../components/characters/battle/BattleNPCEnemyComponent");
require("../components/animations/BattleSlimeAnimation");
require("../components/brains/NPCBrainComponent");

const PTM_RATIO = 2; // pixel to meter ratio for physics
const STAGE_EDGE_BORDER_WIDTH = 9000;
const STAGE_EDGE_LEFT_BARRIER_OFFSET = -80;
const STAGE_EDGE_RIGHT_BARRIER_OFFSET = 60;
const STAGE_EDGE_FLOOR_BARRIER_OFFSET = 0;

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

      self.initBox2d();
      self.initSprites();
      self.initBackground();
      //      self.initAudio();
      self.initStageEdges();
      self.initCamera();

      self.initCombatants().then(function (response){
        console.log("DEBUG: in the 'then' after ProtoBattleScene#initCombatants");
        self.initUI();
        //        self.activateBattleAI();
        self.initSystems();
        self.registerSystems();
      }, function (error){
        throw new Error(error);
        alert('Failed to initialize combatants for some reason..');
      }).catch( function (error){
        console.log("DEBUG: ERROR IN PROMISE GROUP~~~~~~~---->", error);
      });
    });
  }

  get sceneId(){
    return this._scene_id;
  }

  activateBattleAI(){
    this._battleManager._setupBattleAI();
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
    throw new Error("Not implmemented error");
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

  initBox2d() {
    Crafty.box2D.init(0, 10, PTM_RATIO, true);
  }

  initCamera(){
    Crafty.viewport.scale(2.4);
    Crafty.viewport.y -= 70;
    Crafty.viewport.x -= 10;
  }

  initCombatants(){
    var enemy_npc, player, self;

    self = this;

    return new Promise( (fulfill, reject) => {
      self.initPC().then((pc_entity) => {
        player = pc_entity;

        return self.initEnemyNPC();
      }, (error) => {
        console.log("ERROR: there was an error initializing the player character", error);
      }).then((npc_entity) => {
        enemy_npc = npc_entity;
        self._combatants = {player: player, enemies: [enemy_npc]};
        player.setTarget(enemy_npc);
        enemy_npc.setTarget(player);

        fulfill();
      }, (error) => {
        console.log("ERROR: there was an error initializing the npc", error);
      }).catch( (error) => {
        console.log("ERROR: there was an error initializing the player or NPC and adding them to the battle manager", error);
      });
    });
  }

  initEnemyNPC(){
    var enemy_entity, promise;

     enemy_entity = Crafty.e("2D, DOM, BattleEffectable, BattleCharacter, BattleNPCSlime, BattleSlimeAnim, NPCBrain, slime_st0, Collision, BattleStatus, BattleNPCBrain, BattleNPCSkillManager")
      .attr({x: 390, y: 210, w: 42, h: 42 })
      .battleCharacter()
      .battleNPCEnemy()
      .battleSlimeAnim()
      .battleStatus()
      .battleNPCBrain()
      .collision([0,0],[0,50],[50,60],[0,60]);

    promise = enemy_entity.getFromServer();

    return promise.then( () => {
      return enemy_entity;
    });
  }

  initPC(){
    var pc_ent, pc_model, promise;

    pc_ent = Crafty.e("2D, DOM, BattleEffectable, BattleCharacter, BattlePlayer, PlayerSkillManager, BattlePlayerZeroAnim, plz_st0, Collision, BattleStatus, BattleStance");
    pc_ent.attr({ x: 20, y: 180})
      .battlePlayerZeroAnim()
      .battleCharacter()
      .battlePlayer()
      .battleStatus()
      .collision([5,-30],[50,-30],[50,40],[5,40]);

    return pc_ent.getFromServer();
  }

  initSprites(){
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

      bottomEdge: Crafty.e("2D, DOM, Collision, BattleStageEdge, Box2D")
                    .attr({x: 0, y: stage_height + STAGE_EDGE_FLOOR_BARRIER_OFFSET, w: 9000, h: 5 })
                    .collision([0,0], [9000, 0], [9000, 5], [0, 5])
                    .box2d({ bodyType: 'rigid' })
    }
  }

  initStatusBar() {
    var player, enemy, statusBar;

    player = this._combatants.player;
    enemy = this._combatants.enemies[0];
    statusBar = new StatusBarView();
    statusBar.insertChild(player.getStatusView());
    statusBar.insertChild(enemy.getStatusView());
    statusBar.render();
    this._statusBar = statusBar;
  }

  initSystems(){
    initInputSystem(Crafty);
    initPlayerSkillSystem(Crafty);
    initNPCSkillSystem(Crafty);
    initNPCAISystem(Crafty);
  }

  initUI(){
    this.initStatusBar();
  }

  play(){
    Crafty.scene(this._scene_id);
  }

  registerSystems(){
    Crafty.bind("EnterFrame", this.runSystems);
  }

  resetCamera(){
    Crafty.viewport.scale(1);
  } 

  runSystems(evt){
    inputSystem(Crafty);
    playerSkillSystem(Crafty);
    npcSkillSystem(Crafty);
    nPCAISystem(Crafty);
    textFragmentAttackDisplaySystem(Crafty);
    defendableSkillSystem(Crafty);
    projectileSystem(Crafty, evt.frame, evt.dt);
    triggerEffectOnCollideSystem(Crafty);
    battleEffectSystem(Crafty);
    battleStatusSystem(Crafty);
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

  //  _analyzeTypingData(){
  //    var typing_analyzer;
  //
  //    typing_analyzer = new Typewar.Engine.Managers.TypingStatsManager()
  //    typing_analyzer.analyze();
  //    // TODO: send this data back up to the server
  //  }
}
