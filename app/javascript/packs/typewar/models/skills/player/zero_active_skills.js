/* TODO: Separate player skills and NPC skills into distinct namespaces
 *
 * Skill definitions can stay here but the server can declare skills by skill id
 */

/* example skill template:
 * {
 *   cooldown: xx<integer>,
 *   cost: 0 <integer>,
 *   name: 'human readable name',
 *   textOptions: {...}, // options for text fragment generation
 *   properties: {...} // property list
 * }
 */

import * as Effects from "../../effects"
import {
  ZERO_ANIM_LIGHT_SLASH, ZERO_ANIM_MED_SLASH, ZERO_ANIM_HEAVY_SLASH, ZERO_ANIM_UPPER_SLASH
} from "../../../constants/animation_constants"

var ZeroLightSlash = {
  effects: [
    { klass: Effects.Damage},
    { klass: Effects.TriggerAnimation, target: "self", animation: ZERO_ANIM_LIGHT_SLASH},
    { klass: Effects.SetCooldown, target: "self", cooldownLength: 700} 
  ],
  cost: 0,
  name: 'light slash',
  textOptions: {
    min_length: 4,
    max_length: 22,
    min_difficulty: 1,
    max_difficulty: 3
  },
  properties: {
    blunt:    0, slashing: 2, piercing: 0,
    fire:     0, earth:    0, water:    0,
    air:      0, light:    0, dark:     0,
    poison:   0, life:     0, death:    0
  }
};

var ZeroMedSlash = {
  effects: [
    { klass: Effects.Damage },
    { klass: Effects.TriggerAnimation, target: "self", animation: ZERO_ANIM_MED_SLASH},
    { klass: Effects.SetCooldown, target: "self", cooldownLength: 2000} 
  ],
  cost: 0,
  name: 'medium slash',
  textOptions: {
    min_length: 9,
    max_length: 30,
    min_difficulty: 2,
    max_difficulty: 5
  },
  properties: {
    blunt:    0, slashing: 3, piercing: 0,
    fire:     0, earth:    0, water:    0,
    air:      0, light:    0, dark:     0,
    poison:   0, life:     0, death:    0
  },
};

var ZeroHardSlash = {
  effects: [
    { klass: Effects.Damage },
    { klass: Effects.TriggerAnimation, target: "self", animation: ZERO_ANIM_HEAVY_SLASH},
    { klass: Effects.SetCooldown, target: "self", cooldownLength: 5000} 
  ],
  cost: 0,
  name: 'heavy slash',
  textOptions: {
    min_length: 20,
    max_length: 40,
    min_difficulty: 2,
    max_difficulty: 7
  },
  properties: {
    blunt:    0, slashing: 4, piercing: 0,
    fire:     0, earth:    0, water:    0,
    air:      0, light:    0, dark:     0,
    poison:   0, life:     0, death:    0
  }
};

var ZeroUpperSlash = {
  effects: [
    { klass: Effects.Damage },
    { klass: Effects.TriggerAnimation, target: "self", animation: ZERO_ANIM_UPPER_SLASH},
    { klass: Effects.SetCooldown, target: "self", cooldownLength: 2200} 
  ],
  cost: 0,
  name: 'upper slash',
  textOptions: {
    min_length: 9,
    max_length: 30,
    min_difficulty: 2,
    max_difficulty: 5
  },
  properties: {
    blunt:    0, slashing: 3, piercing: 0,
    fire:     0, earth:    0, water:    0,
    air:      0, light:    0, dark:     0,
    poison:   0, life:     0, death:    0
  }
};

export {ZeroLightSlash, ZeroMedSlash, ZeroHardSlash, ZeroUpperSlash}
