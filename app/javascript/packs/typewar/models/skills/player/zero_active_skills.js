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

// TODO: refactor  Properties and cost should be arguments of their respective effects.  i.e.: the damage effect should have properties

import * as Effects from "../../effects"

import { 
  ANIM_READY, ANIM_LIGHT_ATTACK, ANIM_MED_ATTACK, ANIM_HEAVY_ATTACK, ANIM_SPECIAL_ATTACK, ANIM_BLOCK, ANIM_DASH, ANIM_JUMP, ANIM_ENTER, ANIM_CHARGE, ANIM_HIT
} from "../../../constants/animation_constants"

var ZeroLightSlash = {
  effects: [
    { 
      klass: Effects.Damage,
      properties: {
        blunt:    0, slashing: 2, piercing: 0,
        fire:     0, earth:    0, water:    0,
        air:      0, light:    0, dark:     0,
        poison:   0, life:     0, death:    0
      }
    },
    { klass: Effects.TriggerAnimation, target: "self", animation: ANIM_LIGHT_ATTACK},
    { klass: Effects.TriggerAnimation, animation: ANIM_HIT },
    { klass: Effects.ScreenShake },
    { klass: Effects.SetCooldown, target: "self", cooldownLength: 700} 
  ],
  cost: 0,
  name: 'light slash',
  textOptions: {
    minLength: 4,
    maxLength: 7,
  }
};

var ZeroMedSlash = {
  effects: [
    { 
      klass: Effects.Damage,
      properties: {
        blunt:    0, slashing: 3, piercing: 0,
        fire:     0, earth:    0, water:    0,
        air:      0, light:    0, dark:     0,
        poison:   0, life:     0, death:    0
      },
    },
    { klass: Effects.TriggerAnimation, target: "self", animation: ANIM_MED_ATTACK},
    { klass: Effects.TriggerAnimation, animation: ANIM_HIT },
    { klass: Effects.ScreenShake },
    { klass: Effects.SetCooldown, target: "self", cooldownLength: 2000} 
  ],
  cost: 0,
  name: 'medium slash',
  textOptions: {
    minLength: 6,
    maxLength: 9,
  }
};

var ZeroHardSlash = {
  effects: [
    { klass: Effects.Damage,
      properties: {
        blunt:    0, slashing: 4, piercing: 0,
        fire:     0, earth:    0, water:    0,
        air:      0, light:    0, dark:     0,
        poison:   0, life:     0, death:    0
      }
    },
    { klass: Effects.TriggerAnimation, target: "self", animation: ANIM_HEAVY_ATTACK},
    { klass: Effects.TriggerAnimation, animation: ANIM_HIT },
    { klass: Effects.ScreenShake },
    { klass: Effects.SetCooldown, target: "self", cooldownLength: 5000} 
  ],
  cost: 0,
  name: 'heavy slash',
  textOptions: {
    minLength: 8,
    maxLength: 20,
  }
};

var ZeroUpperSlash = {
  effects: [
    {
      klass: Effects.Damage,
      properties: {
        blunt:    0, slashing: 3, piercing: 0,
        fire:     0, earth:    0, water:    0,
        air:      0, light:    0, dark:     0,
        poison:   0, life:     0, death:    0
      }
    },
    { klass: Effects.TriggerAnimation, target: "self", animation: ANIM_SPECIAL_ATTACK},
    { klass: Effects.TriggerAnimation, animation: ANIM_HIT },
    { klass: Effects.ScreenShake },
    { klass: Effects.SetCooldown, target: "self", cooldownLength: 2200} 
  ],
  cost: 0,
  name: 'upper slash',
  textOptions: {
    minLength: 5,
    maxLength: 13,
  }
};

export {ZeroLightSlash, ZeroMedSlash, ZeroHardSlash, ZeroUpperSlash}
