import Sprite from "../assets/sprite"
import Camera from "../managers/camera"

import battlePCGenerator from "../models/battle_pc_generator"
import battleNPCGenerator from "../models/battle_npc_generator"

import {initBattleEffectSystem, battleEffectSystem} from "../systems/battle_effect_system"
import {initBattleStatusSystem, battleStatusSystem, teardownBattleStatusSystem} from "../systems/battle_status_system"
import {initInputSystem, inputSystem} from "../systems/input_system"
import {initPlayerSkillSystem, playerSkillSystem} from "../systems/player_skill_system"
import {initNPCSkillSystem, npcSkillSystem} from "../systems/npc_skill_system"
import {initNPCAISystem, nPCAISystem} from "../systems/npc_ai_system"
import {initProjectileSystem, projectileSystem} from "../systems/projectile_system"
import {initTriggerEffectOnCollideSystem, triggerEffectOnCollideSystem} from "../systems/trigger_effect_on_collide_system"
import {initDefendableSkillSystem, defendableSkillSystem} from "../systems/defendable_skill_system"
import {initTextFragmentAttackDisplaySystem, textFragmentAttackDisplaySystem} from "../systems/text_fragment_attack_display_system"
import {initAudioSystem, audioSystem, teardownAudioSystem} from "../systems/audio_system"
import {npcDiedPlayerWinSystem} from "../systems/npc_died_player_win_system"
import {playerDieLoseSystem} from "../systems/player_die_lose_system"
import {initParticleSystem, particleSystem} from "../systems/particle_system"

require("../components/BattleBackgroundComponent");
require("../components/BattleEffectable");
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
    this._sceneId = sceneId;
    this._sceneData = sceneData;

    Crafty.scene(this._sceneId, this.init.bind(this), this.stop.bind(this));
  }

  get sceneId(){
    return this._sceneId;
  }

  play(){
    Crafty.scene(this._sceneId);
  }

  // private
  // TODO: rename these methods with _ at the start

  clearBG(){
    Crafty.background("");
  }

  deallocateStageEdges(){
    this._stageBorders.leftEdge = null;
    this._stageBorders.rightEdge = null
    this._stageBorders.bottomEdge = null
  }

  init(){
    var self, chars_loaded_promise;
    self = this;

    self.initBox2d();
    self.initSprites();
    self.initBackground();
    self.initStageEdges();

    self.initCombatants().then(function (response){
      self.initSystems();
      self.registerSystems();
      self.initCamera();
    }, function (error){
      throw(error);
      alert('Failed to initialize combatants for some reason..');
    }).catch( function (error){
      throw(error);
    });
  }

  initBackground(){
    var bg, bg_data, bg_css;

    bg_data = this._sceneData.background;
    bg_css = `url(${bg_data.filepath}) ${bg_data.offsetX} ${bg_data.offsetY} / ${bg_data.size} no-repeat ${bg_data.color}`;

    Crafty.background(bg_css);

    //bg = Crafty.e("2D, DOM, Image, BattleBackground")
    //  .battleBackground(bg_data.filepath, bg_data.width, bg_data.height)
    //  .attr({x: bg_data.offset.x, y: bg_data.offset.y, z: bg_data.offset.z || 0});
    //this._background = bg;
  }

  initBox2d() {
    Crafty.box2D.init(0, 10, PTM_RATIO, true);
  }

  initCamera(){
    var camera_args;
    camera_args = {background: this._sceneData.background};
    camera_args = _.merge(camera_args, {
      scale: VIEWPORT_SCALE, 
      offsetX: VIEWPORT_X_OFFSET, 
      offsetY: VIEWPORT_Y_OFFSET
    });

    window.camera = new Camera(camera_args);
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
    var promise;

    promise = battleNPCGenerator(this._sceneData.combatants.npc);
    return promise.then( (npc_ent) => {
      npc_ent.x = DEFAULT_NPC_LOC_X;
      npc_ent.y = DEFAULT_NPC_LOC_Y;
      return npc_ent;
    });
  }

  initPC(){
    var promise;

    promise = battlePCGenerator(this._sceneData.combatants.player);
    return promise.then( (pc_ent) => {
      pc_ent.x = DEFAULT_PLAYER_LOC_X;
      pc_ent.y = DEFAULT_PLAYER_LOC_Y;
      return pc_ent
    });
  }

  initSprites(){
    Sprite.create(this._sceneData.combatants.player.spriteId);
    Sprite.create(this._sceneData.combatants.npc.spriteId);
  }

  initStageEdges(){
    this._stageBorders = {
      leftEdge: Crafty.e("2D, DOM, Collision, BattleStageEdge, BattleStageBoundary")
        .attr({x: this._sceneData.borders.left, y: 0, w: 5, h: 9000 })
        .collision(),

      rightEdge: Crafty.e("2D, DOM, Collision, BattleStageEdge, BattleStageBoundary")
        .attr({x: this._sceneData.borders.right, y: 0, w: 5, h: 9000 })
        .collision(),

      bottomEdge: Crafty.e("2D, DOM, Collision, BattleStageEdge, Box2D")
        .attr({x: 0, y: this._sceneData.borders.floor, w: 9000, h: 5 })
        .collision()
        .box2d({ bodyType: 'rigid' })
    }
  }

  initSystems(){
    initAudioSystem(Crafty, this._sceneData.audio);
    initBattleStatusSystem(Crafty);
    initInputSystem(Crafty);
    initPlayerSkillSystem(Crafty);
    initNPCSkillSystem(Crafty);
    initNPCAISystem(Crafty);
    initParticleSystem(Crafty);
  }

  registerSystems(){
    Crafty.bind("EnterFrame", this.runSystems);
  }

  resetCamera(){
    Crafty.viewport.scale(1);
    Crafty.viewport.x -= VIEWPORT_X_OFFSET;
    Crafty.viewport.y -= VIEWPORT_Y_OFFSET;
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
    particleSystem(Crafty);
    audioSystem(Crafty);
    npcDiedPlayerWinSystem(Crafty);
    playerDieLoseSystem(Crafty);
  }

  stop(){
    this.teardownSystems();
    this.clearBG();
    //    this._analyzeTypingData();
    this.deallocateStageEdges();

    //    this.resetCamera();
    delete window.camera;
    window.camera = null;
  }

  teardownSystems(){
    Crafty.unbind("EnterFrame", this.runSystems);
    teardownBattleStatusSystem(Crafty);
    teardownAudioSystem(Crafty);
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
