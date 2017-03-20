/* TODO: Evaluate if this makes sense..
 *   remove start_x and start_y from required options.  Text fragments should 
 *   always be spawned from the x,y of the spawner.  If there needs to be some 
 *   offset, then it can be part of the position function
 */

//import BaseSkill from './base_npc_skill'
import * as Effects from "../../effects"
import { 
  SLIME_ANIM_READY, SLIME_ANIM_SLASH, SLIME_ANIM_THROW, SLIME_ANIM_BLOCK, SLIME_ANIM_HIT, ZERO_ANIM_HIT
} from "../../../constants/animation_constants"


// TODO NOTES: 
// Animation will need an overhaul.
// Currently, I'm using some constants to define specific animation reels.
// But actually, let's say a successful attack should trigger the stagger 
// animation for the target.  Well, as it is now, it'll specify specifically
// the ZERO_ANIM_HIT but what if the target isn't zero? then this thing will 
// break

export var SlimeStandardAttack = {
  effects: [
    {
      klass: Effects.SpawnTextFragLinear,
      positionFunction: linearProjectile,
      speed: 0.08,
      effects: [
        {
          klass: Effects.Damage,
          properties: {
            blunt:    3, slashing: 0, piercing: 0,
            fire:     0, earth:    0, water:    0,
            air:      0, light:    0, dark:     0,
            poison:   0, life:     0, death:    0
          }
        },
        { klass: Effects.TriggerAnimation, animation: ZERO_ANIM_HIT }
      ]
    },
    { klass: Effects.TriggerAnimation, target: "self", animation: SLIME_ANIM_SLASH },
    //    { klass: Effects.SetCooldown, target: "self", cooldownLength: 1900 }
  ],
  cost: 0,
  name: 'slime standard attack',
  textOptions: {
    min_length: 9,
    max_length: 25,
    min_difficulty: 1,
    max_difficulty: 4
  },
};

export var SlimeGlobAttack = {
  effects: [
    {
      klass: Effects.SpawnTextProjectilePhysics,
      box2d: {
        bodyType: 'dynamic',
        density: 0.1,
        friction: 2,
        restitution: 0.1
      },
      effects: [
        {
          klass: Effects.Damage,
          properties: {
            blunt:    3, slashing: 0, piercing: 0,
            fire:     0, earth:    0, water:    0,
            air:      0, light:    0, dark:     0,
            poison:   2, life:     0, death:    0
          }
        },
        { klass: Effects.TriggerAnimation, animation: ZERO_ANIM_HIT }
      ]
    },
    { klass: Effects.TriggerAnimation, target: "self", animation: SLIME_ANIM_THROW },
    //    { klass: Effects.SetCooldown, target: "self", cooldownLength: 2300 }
  ],
  cost: 0,
  name: 'glob',
  textOptions: {
    min_length: 5,
    max_length: 15,
    min_difficulty: 1,
    max_difficulty: 2
  }
}

// TODO: this and other functions defining projectile movement/behavior should maybe move to a different file?
// this returns a delta x and y given a timestep
function linearProjectile(dt, speed) {
  return {x: (-1*speed*dt), y: 0};
}
