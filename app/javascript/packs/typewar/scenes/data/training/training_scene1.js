import ZERO from "../character/zero"
import TRAINING_DUMMY from "../character/training_dummy"
import BAYOU from "../background/bayou"

import {ZeroLightSlash} from "../../../models/skills/player/zero_active_skills"
import {SOUND_LETTER_TYPED, SOUND_SWORD_SLASH} from "../../../constants/audio_constants"
import {TRAINING_TUTORIAL_COMPLETED_EVT} from "../../../constants/scene_constants"

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
import { npcDiedTutorialSystem } from "../../../systems/npc_died_tutorial_system"


const STAGE_WIDTH = 450;
const STAGE_HEIGHT = 240;
const STAGE_EDGE_LEFT_BARRIER_OFFSET = 3;
const STAGE_EDGE_RIGHT_BARRIER_OFFSET = 60;
const STAGE_EDGE_FLOOR_BARRIER_OFFSET = 0;

var zero_copy = _.cloneDeep(ZERO);

zero_copy.charSheet.skills = [ZeroLightSlash];
zero_copy.initialStance = "offense";

var dummy_copy = _.cloneDeep(TRAINING_DUMMY);
//dummy_copy.charSheet.status.hp = 5;
//dummy_copy.charSheet.status.maxHp = 5;
dummy_copy.charSheet.status.hp = 1;
dummy_copy.charSheet.status.maxHp = 1;

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
      {system: npcDiedTutorialSystem}
    ],
    cleanup: [
      {system: teardownBattleStatusSystem},
      {system: teardownAudioSystem},
      {system: teardownTutorialSystem}
    ]
  },
  tutorial: {
    steps: [
      {type: 'wait', duration: 1000},
      {type: 'modal', modalData: {
        headerContent: "Welcome to Typewarrior!",
        modalContent: "This is a fighting game featuring typing.",
        footerContent: "Press space to continue..."
      }},
      {type: 'wait_input', input: "SPACE"},

      {type: 'modal', modalData: {
        headerContent: "How to Play: Defeat Your Opponent!",
        modalContent: "Type the words to attack and defend.  Successful attacks will deplete the enemy's health.  Successful attacks against you will deplete your health.  Reduce the enemy's health to zero before you are defeated. In this stage we'll show you how to attack.",
        footerContent: "Press space to continue..."
      }},
      {type: 'wait_input', input: "SPACE"},

      {type: 'modal', modalData: {
        headerContent: "How to Play: Opponent's Health",
        modalContent: "Here's your opponent's health bar.  As you attack, this bar will deplete.  Bring it to zero and you've won!",
        footerContent: "Press space to continue..."
      }, highlightSelectors: ".entity-status-training-dummy"},
      {type: 'wait_input', input: "SPACE"},

      {type: 'modal', modalData: {
        headerContent: "How to Play: Your Skills",
        modalContent: "Here are your skills, type the word or words shown here to attack.  There will be a cooldown after you've used a given skill where it won't yet be ready.",
        footerContent: "Press space to continue..."
      }, highlightSelectors: ".battle-skill"},
      {type: 'wait_input', input: "SPACE"},

      {type: 'modal', modalData: {
        headerContent: "How to Play: Prepare to Fight",
        modalContent: "This training dummy won't fight back.  Just keep hitting it to get the hang of attacking.",
        footerContent: "Ready? Press space to continue..."
      }},
      {type: 'wait_input', input: "SPACE"},
      {type: 'wait_event', eventTarget: TRAINING_TUTORIAL_COMPLETED_EVT}, // wait 5 things complete
      {type: 'end'}
    ]
  }
}
export default trainingScene1Data
