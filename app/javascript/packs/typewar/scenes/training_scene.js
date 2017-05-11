import BattleScene from "./battle_scene"
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
import {initParticleSystem, particleSystem} from "../systems/particle_system"
import {initTutorialSystem, tutorialSystem, teardownTutorialSystem} from "../systems/tutorial_system"
import { npcDiedPlayerWinSystem } from "../systems/npc_died_player_win_system"


const DEFAULT_NPC_LOC_X = 390;
const DEFAULT_NPC_LOC_Y = 210;

export default class TrainingScene extends BattleScene {
  constructor(sceneId, sceneData) {
    super(sceneId, sceneData);
  }

  //private 

  init(){
    var self, chars_loaded_promise;
    self = this;

    self.initSprites();
    self.initBackground();
    self.initStageEdges();

    self.initCombatants().then(function (response){
      console.log("DEBUG: in the 'then' after trainingScene#initCombatants");
      self.initSystems();
      self.registerSystems();
      self.initCamera();
    }, function (error){
      console.log("DEBUG: FAILED TO INITIALIZE COMBATANTS FOR SOME REASON...");
      throw(error);
      alert('Failed to initialize combatants for some reason..');
    }).catch( function (error){
      console.log("DEBUG: ERROR IN PROMISE GROUP~~~~~~~---->", error);
      throw(error);
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

  initSystems(){
    initAudioSystem(Crafty, this._sceneData.audio);
    initBattleStatusSystem(Crafty);
    initInputSystem(Crafty);
    initPlayerSkillSystem(Crafty);
    initNPCSkillSystem(Crafty);
    initNPCAISystem(Crafty);
    initParticleSystem(Crafty);
    initTutorialSystem(Crafty, this._sceneData.tutorial);
  }

  runSystems(evt){
    tutorialSystem(Crafty);
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
  }

  teardownSystems(){
    Crafty.unbind("EnterFrame", this.runSystems);
    teardownBattleStatusSystem(Crafty);
    teardownAudioSystem(Crafty);
    teardownTutorialSystem(Crafty);
  }
}
