import Sprite from "../assets/sprite"
import Background from "../assets/background"
import BattleManager from "../managers/battle_manager"
import StatusBarView from "../views/status_bar_view"

import battlePCGenerator from "../models/battle_pc_generator"
import battleNPCGenerator from "../models/battle_npc_generator"

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
require("../components/BattleStatusView"); // TODO MARKED FOR MOVE
require("../components/BattleNPCSkillManagerComponent");

const PTM_RATIO = 2; // pixel to meter ratio for physics
const VIEWPORT_SCALE = 2.4;
const VIEWPORT_X_OFFSET = -10
const VIEWPORT_Y_OFFSET = -70
const DEFAULT_PLAYER_LOC_X = 20;
const DEFAULT_PLAYER_LOC_Y = 180;
const DEFAULT_NPC_LOC_X = 390;
const DEFAULT_NPC_LOC_Y = 210;

// REFACTOR: Make most of the methods in here private
export default class BattleScene {

  constructor(sceneId, sceneData){
    var self;

    self = this;
    this._sceneId = sceneId;
    this._sceneData = sceneData;

    console.log("DEBUG: ProtoBattleScene#constructor");
    Crafty.scene(this._sceneId, function (){
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
        console.log("DEBUG: FAILED TO INITIALIZE COMBATANTS FOR SOME REASON...");
        throw(error);
        alert('Failed to initialize combatants for some reason..');
      }).catch( function (error){
        console.log("DEBUG: ERROR IN PROMISE GROUP~~~~~~~---->", error);
        throw(error);
      });
    });
  }

  get sceneId(){
    return this._sceneId;
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
    this._combatants.npc.destroy();
    this._combatants = null;
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

    // TODO: Replace this entity with Crafty.background()
    bg_data = this._sceneData.background;
    bg = Crafty.e("2D, DOM, Image, BattleBackground")
      .battleBackground(bg_data.filepath, bg_data.width, bg_data.height)
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
    Crafty.viewport.scale(VIEWPORT_SCALE);
    Crafty.viewport.x += VIEWPORT_X_OFFSET;
    Crafty.viewport.y += VIEWPORT_Y_OFFSET;
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
        self._combatants = {player: player, npc: enemy_npc};
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


    enemy_entity = battleNPCGenerator(this._sceneData.combatants.npc);

    //    enemy_entity = Crafty.e("2D, DOM, BattleEffectable, BattleCharacter, BattleNPCSlime, BattleSlimeAnim, NPCBrain, slime_st0, Collision, BattleStatus, BattleNPCBrain, BattleNPCSkillManager")
    //      .attr({x: 390, y: 210, w: 42, h: 42 })
    //      .battleCharacter()
    //      .battleNPCEnemy()
    //      .battleSlimeAnim()
    //      .battleStatus()
    //      .battleNPCBrain()
    //      .collision([0,0],[0,50],[50,60],[0,60]);

    enemy_entity.x = DEFAULT_NPC_LOC_X;
    enemy_entity.y = DEFAULT_NPC_LOC_Y;

    promise = enemy_entity.getFromServer();

    return promise.then( () => {
      return enemy_entity;
    });
  }

  // Character data -> an entity should be it's own class somewhere
  initPC(){
    var pc_ent, pc_model, promise;

    pc_ent = battlePCGenerator(this._sceneData.combatants.player);
    //    pc_ent = Crafty.e("2D, DOM, BattleEffectable, BattleCharacter, BattlePlayer, PlayerSkillManager, BattlePlayerZeroAnim, plz_st0, Collision, BattleStatus, BattleStance");
    //    pc_ent.attr({ x: DEFAULT_PLAYER_LOC_X, y: DEFAULT_PLAYER_LOC_Y})
    //      .battlePlayerZeroAnim()
    //      .battleCharacter()
    //      .battlePlayer()
    //      .battleStatus()
    //      .collision([5,-30],[50,-30],[50,40],[5,40]);

    pc_ent.x = DEFAULT_PLAYER_LOC_X;
    pc_ent.y = DEFAULT_PLAYER_LOC_Y;
    promise = pc_ent.getFromServer();

    return promise.then( () => {
      return pc_ent
    });
  }

  initSprites(){
    Sprite.create('player_zero');
    Sprite.create('slime');
  }

  initStageEdges(){
    this._stageBorders = {
      leftEdge: Crafty.e("2D, DOM, Collision, BattleStageEdge, BattleStageBoundary")
        .attr({x: this._sceneData.borders.left, y: 0, w: 5, h: 9000 })
        .collision([0,0], [0, 9000], [5, 9000], [5, 0]),

      rightEdge: Crafty.e("2D, DOM, Collision, BattleStageEdge, BattleStageBoundary")
        .attr({x: this._sceneData.width+this._sceneData.borders.right, y: 0, w: 5, h: 9000 })
        .collision([0,0], [0, 9000], [5, 9000], [5, 0]),

      bottomEdge: Crafty.e("2D, DOM, Collision, BattleStageEdge, Box2D")
        .attr({x: 0, y: this._sceneData.height + this._sceneData.borders.floor, w: 9000, h: 5 })
        .collision([0,0], [9000, 0], [9000, 5], [0, 5])
        .box2d({ bodyType: 'rigid' })
    }
  }

  // TODO: Should this go into a UI system?
  initStatusBar() {
    var player, enemy, statusBar;

    player = this._combatants.player;
    enemy = this._combatants.npc;
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
    Crafty.scene(this._sceneId);
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
