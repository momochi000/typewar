import ZERO from "../character/zero"
import TRAINING_DUMMY from "../character/training_dummy"
import BAYOU from "../background/bayou"

import {ZeroLightSlash} from "../../../models/skills/player/zero_active_skills"
import {SlimeStandardAttack} from "../../../models/skills/npc/slime_skills"
import {SOUND_LETTER_TYPED, SOUND_SWORD_SLASH} from "../../../constants/audio_constants"
import {TRAINING_TUTORIAL_COMPLETED_EVT,
  PLAYER_DEFENDED_ATTACK_EVT,
  PLAYER_SWITCHED_TO_OFFENSE_EVT,
  PLAYER_USED_SKILL_EVT} from "../../../constants/scene_constants"

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
import { triggerPlayerDefendedEventSystem } from "../../../systems/trigger_player_defended_event_system"
import { triggerPlayerSwitchedToOffenseEventSystem } from "../../../systems/trigger_player_switched_to_offense_event_system"
import { triggerPlayerSkillEventSystem } from "../../../systems/trigger_player_skill_event_system"

const STAGE_WIDTH = 450;
const STAGE_HEIGHT = 240;
const STAGE_EDGE_LEFT_BARRIER_OFFSET = 3;
const STAGE_EDGE_RIGHT_BARRIER_OFFSET = 60;
const STAGE_EDGE_FLOOR_BARRIER_OFFSET = 0;

var zero_copy = _.cloneDeep(ZERO);
zero_copy.charSheet.skills = [ZeroLightSlash];
var dummy_copy = _.cloneDeep(TRAINING_DUMMY);
dummy_copy.charSheet.skills = [SlimeStandardAttack];
dummy_copy.charSheet.status.hp = 5
dummy_copy.charSheet.status.maxHp = 5

var trainingScene3Data = {
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
      {system: triggerPlayerDefendedEventSystem},
      {system: triggerPlayerSwitchedToOffenseEventSystem},
      {system: inputSystem},
      {system: triggerPlayerSkillEventSystem},
      {system: playerSkillSystem},
      {system: npcSkillSystem},
      {system: nPCAISystem},
      {system: textFragmentAttackDisplaySystem},
      {system: triggerPlayerDefendedEventSystem},
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
      {system: teardownTutorialSystem},
    ]
  },
  tutorial: {
    steps: [
      {type: 'modal', modalData: {
        headerContent: "Mock Battle",
        modalContent: "Here's where you'll put what you've learned in the past two training exercises together.  Try defending against the dummy's attack.",
        footerContent: "Press space to continue..."
      }},
      {type: 'wait_input', input: "SPACE"},

      {type: 'wait_event', eventTarget: PLAYER_DEFENDED_ATTACK_EVT},

      {type: 'modal', modalData: {
        headerContent: "Switching defense to offense",
        modalContent: "Now we'll switch from defending against attacks to using our skills to hit the dummy.",
        footerContent: "Press space to continue..."
      }},
      {type: 'wait_input', input: "SPACE"},

      {type: 'modal', modalData: {
        headerContent: "Switching defense to offense",
        modalContent: "These icons indicate the stance that each character is in.  The shield above your character indicates that you are defending.  You can switch stances with tab.",
        footerContent: "Press space to continue..."
      }, highlightEntities: "ModeIcon"},
      {type: 'wait_input', input: "SPACE"},

      {type: 'modal', modalData: {
        headerContent: "Switching defense to offense",
        modalContent: "Press tab now to switch to offense.",
        footerContent: "Press space to continue..."
      }, highlightEntities: "ModeIcon"},
      {type: 'wait_input', input: "SPACE"},

      {type: 'wait_event', eventTarget: PLAYER_SWITCHED_TO_OFFENSE_EVT},

      {type: 'modal', modalData: {
        headerContent: "Switching defense to offense",
        modalContent: "See how the icon above your character has changed to crossed swords?",
        footerContent: "Press space to continue..."
      }, highlightEntities: "ModeIcon"},
      {type: 'wait_input', input: "SPACE"},

      {type: 'modal', modalData: {
        headerContent: "Ready to attack",
        modalContent: "Now you're ready to start typing the words here (your skills) ",
        footerContent: "Press space to continue..."
      }, highlightSelectors: ".battle-skill"},
      {type: 'wait_input', input: "SPACE"},

      {type: 'wait_event', eventTarget: PLAYER_USED_SKILL_EVT},


      {type: 'modal', modalData: {
        headerContent: "Finish your training",
        modalContent: "Great! You've defended against the dummy's attacks, then switched to an offensive stance and struck the dummy.",
        footerContent: "Press space to continue..."
      }},
      {type: 'wait_input', input: "SPACE"},

      {type: 'modal', modalData: {
        headerContent: "Finish your training",
        modalContent: "Now use the skills you've learned to protect yourself as you break the practice dummy.  Keep switching to defense to prevent yourself from being hit.  Keep switching back to offense to deal damage when it's safe. These are the fundamentals of battle.  Now, have at it!",
        footerContent: "Press space to continue..."
      }},
      {type: 'wait_input', input: "SPACE"},

      {type: 'wait_event', eventTarget: TRAINING_TUTORIAL_COMPLETED_EVT},
      {type: 'end'}
    ]
  }
}
export default trainingScene3Data
