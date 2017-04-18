import ZERO from "./character/zero"
import SLIME from "./character/slime"
import BAYOU from "./background/bayou"

import {SlimeStandardAttack} from "../../models/skills/npc/slime_skills"
import {SOUND_LETTER_TYPED} from "../../constants/audio_constants"
import * as Audio from "../../assets/audio"

const STAGE_WIDTH = 450;
const STAGE_HEIGHT = 240;
const STAGE_EDGE_LEFT_BARRIER_OFFSET = 3;
const STAGE_EDGE_RIGHT_BARRIER_OFFSET = 60;
const STAGE_EDGE_FLOOR_BARRIER_OFFSET = 0;

var basicSlimeBattleData = {
  id: "prototype_battle",
  name: "prototype battle scene",
  width: 450,
  height: 240,
  borders: {
    left: STAGE_EDGE_LEFT_BARRIER_OFFSET,
    right: STAGE_WIDTH + STAGE_EDGE_RIGHT_BARRIER_OFFSET,
    floor: STAGE_HEIGHT + STAGE_EDGE_FLOOR_BARRIER_OFFSET
  },

  background: BAYOU,

  combatants: {
    player: ZERO,
    npc: SLIME
  },

  audio: {
    sounds: [
      { soundId: SOUND_LETTER_TYPED, soundUrls: Audio.SND_TYPEWRITER }
    ]
  }
}
export default basicSlimeBattleData
