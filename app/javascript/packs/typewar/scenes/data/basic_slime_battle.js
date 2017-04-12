import * as ZeroSkills from "../../models/skills/player/zero_active_skills"
import {SlimeStandardAttack} from "../../models/skills/npc/slime_skills"
import {SOUND_LETTER_TYPED} from "../../constants/audio_constants"
import * as Images from "../../assets/images"
import * as Audio from "../../assets/audio"

const STAGE_EDGE_LEFT_BARRIER_OFFSET = 3;
const STAGE_EDGE_RIGHT_BARRIER_OFFSET = 60;
const STAGE_EDGE_FLOOR_BARRIER_OFFSET = 0;

export var basicSlimeBattleData = {
  id: "prototype_battle",
  name: "prototype battle scene",
  width: 450,
  height: 240,
  borders: {
    left: STAGE_EDGE_LEFT_BARRIER_OFFSET,
    right: STAGE_EDGE_RIGHT_BARRIER_OFFSET,
    floor: STAGE_EDGE_FLOOR_BARRIER_OFFSET
  },

  background: {
    name: 'bayou',
    filepath: Images.IMG_BG_BAYOU,
    width: 800,
    height: 336,
    css: `url(${Images.IMG_BG_BAYOU}) center center / 110% no-repeat rgb(255, 255, 255)`,
    offset: {x: -26, y: -60, z: 0}
  },

  combatants: {
    player: {
      spriteId: "player_zero",
      spriteFrame: "plz_st0",
      animationComponent: "BattlePlayerZeroAnimation",
      hitbox: [5,-30, 50,-30, 50,40, 5,40],
      charSheet: {
        name: "player 1",
        properties: {
          blunt:    1, slashing: 1, piercing: 1,
          fire:     1, earth:    1, water:    1,
          air:      1, light:    1, dark:     1,
          poison:   1, life:     1, death:    1
        },
        stats: {
          level: 1,
          str: 1, 
          spd: 1, 
          sta: 1, 
          dex: 1, 
          int: 1, 
          cha: 1, 
          wis: 1
        },
        skills: [
          ZeroSkills.ZeroLightSlash,
          ZeroSkills.ZeroMedSlash,
          ZeroSkills.ZeroHardSlash, 
          ZeroSkills.ZeroUpperSlash
        ]
      }
    },
    npc: {
      spriteId: "slime",
      spriteFrame: "slime_st0",
      animationComponent: "BattleSlimeAnimation",
      width: 42, height: 42,
      hitbox: [0,0, 0,50, 50,60, 0,60],
      charSheet: {
        name:       "Slime",
        properties: {
          blunt:    1, slashing: 1, piercing: 1,
          fire:     1, earth:    1, water:    1,
          air:      1, light:    1, dark:     1,
          poison:   1, life:     1, death:    1
        },
        status: {
          hp: 2,
          maxHp: 10
        },
        stats: {
          level: 0,
          str: 0, 
          spd: 0, 
          sta: 0, 
          dex: 0, 
          int: 0, 
          cha: 0, 
          wis: 0
        },
        skills: [SlimeStandardAttack]
      },
    }
  },

  audio: {
    sounds: [
      { soundId: SOUND_LETTER_TYPED, soundUrls: Audio.SND_TYPEWRITER }
    ]
  }
}
