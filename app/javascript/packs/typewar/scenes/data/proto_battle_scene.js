import zero from "./character/zero"
import slime from "./character/slime"

import * as ZeroSkills from "../../models/skills/player/zero_active_skills"
import {SlimeStandardAttack, SlimeGlobAttack} from "../../models/skills/npc/slime_skills"
import {SOUND_LETTER_TYPED} from "../../constants/audio_constants"
import * as Images from "../../assets/images"
import * as Audio from "../../assets/audio"

const STAGE_EDGE_LEFT_BARRIER_OFFSET = 3;
const STAGE_EDGE_RIGHT_BARRIER_OFFSET = 60;
const STAGE_EDGE_FLOOR_BARRIER_OFFSET = 0;

var slime_copy = _.cloneDeep(slime);
slime_copy.charSheet.status.maxHp = 20;
slime_copy.charSheet.status.hp = 20;
slime_copy.charSheet.skills = [SlimeStandardAttack, SlimeGlobAttack];

var protoBattleSceneData = {
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
    player: zero,
    npc: slime_copy
  },

  audio: {
    sounds: [
      { soundId: SOUND_LETTER_TYPED, soundUrls: Audio.SND_TYPEWRITER }
    ]
  }
}

export default protoBattleSceneData
