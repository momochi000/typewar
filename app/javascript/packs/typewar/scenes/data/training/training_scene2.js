import ZERO from "../character/zero"
import TRAINING_DUMMY from "../character/training_dummy"
import BAYOU from "../background/bayou"

import {ZeroLightSlash} from "../../../models/skills/player/zero_active_skills"
import {SlimeStandardAttack} from "../../../models/skills/npc/slime_skills"
import {SOUND_LETTER_TYPED, SOUND_SWORD_SLASH} from "../../../constants/audio_constants"

import {initBattleEffectSystem, battleEffectSystem} from "../../../systems/battle_effect_system"
import {initBattleStatusSystem, battleStatusSystem, teardownBattleStatusSystem} from "../../../systems/battle_status_system"
import {initInputSystem, inputSystem} from "../../../systems/input_system"
import {initPlayerSkillSystem, playerSkillSystem} from "../../../systems/player_skill_system"
import {initNPCSkillSystem, npcSkillSystem} from "../../../systems/npc_skill_system"
import {initNPCAISystem, nPCAISystem} from "../../../systems/npc_ai_system"
import {initProjectileSystem, projectileSystem} from "../../../systems/projectile_system"
import {initTriggerEffectOnCollideSystem, triggerEffectOnCollideSystem} from "../../../systems/trigger_effect_on_collide_system"
import {initDefendableSkillSystem, defendableSkillSystem} from "../../../systems/defendable_skill_system"
import {initTextFragmentAttackDisplaySystem, textFragmentAttackDisplaySystem} from "../../../systems/text_fragment_attack_display_system"
import {initAudioSystem, audioSystem, teardownAudioSystem} from "../../../systems/audio_system"
import {initParticleSystem, particleSystem} from "../../../systems/particle_system"
import {initTutorialSystem, tutorialSystem, teardownTutorialSystem} from "../../../systems/tutorial_system"
import { npcDiedPlayerWinSystem } from "../../../systems/npc_died_player_win_system"

const STAGE_WIDTH = 450;
const STAGE_HEIGHT = 240;
const STAGE_EDGE_LEFT_BARRIER_OFFSET = 3;
const STAGE_EDGE_RIGHT_BARRIER_OFFSET = 60;
const STAGE_EDGE_FLOOR_BARRIER_OFFSET = 0;

var zero_copy = _.cloneDeep(ZERO);
zero_copy.charSheet.skills = [];
var dummy_copy = _.cloneDeep(TRAINING_DUMMY);
dummy_copy.charSheet.skills = [SlimeStandardAttack];

var trainingScene1Data = {
  id: "training_scene_1",
  name: "Training scene 1",
  width: 450,
  height: 240,
  borders: {
    left: STAGE_EDGE_LEFT_BARRIER_OFFSET,
    right: STAGE_WIDTH + STAGE_EDGE_RIGHT_BARRIER_OFFSET,
    floor: STAGE_HEIGHT + STAGE_EDGE_FLOOR_BARRIER_OFFSET
  },

  background: BAYOU,

  combatants: {
    player: zero_copy,
    npc: dummy_copy
  },

  audio: {
    sounds: [
      SOUND_LETTER_TYPED,
      SOUND_SWORD_SLASH
    ]
  },
  systems: {
    initializers: [
      {system: initAudioSystem, options: {audioData: ["audio"]}},
      {system: initBattleStatusSystem},
      {system: initInputSystem},
      {system: initPlayerSkillSystem},
      {system: initNPCSkillSystem},
      {system: initNPCAISystem},
      {system: initParticleSystem},
      {system: initTutorialSystem, options: {tutorialData: ["tutorial"]}}
    ],
    runners: [
      {system: tutorialSystem},
      {system: inputSystem},
      {system: playerSkillSystem},
      {system: npcSkillSystem},
      {system: nPCAISystem},
      {system: textFragmentAttackDisplaySystem},
      {system: defendableSkillSystem},
      {system: projectileSystem},
      {system: triggerEffectOnCollideSystem},
      {system: battleEffectSystem},
      {system: battleStatusSystem},
      {system: particleSystem},
      {system: audioSystem},
      {system: npcDiedPlayerWinSystem}
    ],
    cleanup: [
      {system: teardownBattleStatusSystem},
      {system: teardownAudioSystem},
      {system: teardownTutorialSystem}
    ]
  },
  tutorial: {
    steps: [
      {type: 'wait', duration: 3000},
      {type: 'modal', modalData: {
        headerContent: "Defend yourself!",
        modalContent: "Now we'll practice defending yourself.  The training dummy will attempt to attack you by sending words your way. Type the words successfully to guard against them.  If they hit you, you will receive damage.",
        footerContent: "Press space to continue..."
      }},
      {type: 'wait_input', input: "SPACE"},

      {type: 'end'}
    ]
  }
}
export default trainingScene1Data
