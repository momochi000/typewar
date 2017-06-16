/* TODO: Evaluate if this makes sense..
 *   remove start_x and start_y from required options.  Text fragments should
 *   always be spawned from the x,y of the spawner.  If there needs to be some
 *   offset, then it can be part of the position function
 */

//import BaseSkill from './base_npc_skill'
import * as Effects from "../../effects"

import {
  ANIM_READY, ANIM_LIGHT_ATTACK, ANIM_MED_ATTACK, ANIM_HEAVY_ATTACK, ANIM_SPECIAL_ATTACK, ANIM_BLOCK, ANIM_DASH, ANIM_JUMP, ANIM_ENTER, ANIM_CHARGE, ANIM_HIT
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
      klass: Effects.SpawnTextProjectile,
      positionFunction: linearProjectile,
      speed: 0.03,
      textOptions: {
        minLength: 7,
        maxLength: 13,
      },
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
        { klass: Effects.TriggerAnimation, animation: ANIM_HIT },
        { klass: Effects.ScreenShake }
      ]
    },
    { klass: Effects.TriggerAnimation, target: "self", animation: ANIM_LIGHT_ATTACK },
    { klass: Effects.SetCooldown, target: "self", cooldownLength: 3400 }
  ],
  cost: 0,
  name: 'slime standard attack',
  startupDelay: 1000
};

export var SlimeGlobAttack = {
  effects: [
    {
      klass: Effects.SpawnTextProjectilePhysics,
      textOptions: {
        minLength: 5,
        maxLength: 8,
      },
      box2d: {
        bodyType: 'dynamic',
        density: 0.1,
        friction: 2,
        restitution: 0.2
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
        { klass: Effects.TriggerAnimation, animation: ANIM_HIT },
        { klass: Effects.ScreenShake }
      ]
    },
    { klass: Effects.TriggerAnimation, target: "self", animation: ANIM_HEAVY_ATTACK },
    { klass: Effects.SetCooldown, target: "self", cooldownLength: 3000 }
  ],
  cost: 0,
  name: 'glob',
  startupDelay: 2000
}

export var SlimeScatterAttack = {
  effects: [
    {
      klass: Effects.SpawnScatterTextProjectilePhysics,
      count: 25,
      textOptions: {
        randomString: true,
        minLength: 1,
        maxLength: 1,
      },
      box2d: {
        bodyType: 'dynamic',
        density: 0.1,
        friction: 2,
        restitution: 0.32
      },
      effects: [
        {
          klass: Effects.Damage,
          properties: {
            blunt:    2, slashing: 0, piercing: 0,
            fire:     0, earth:    0, water:    0,
            air:      0, light:    0, dark:     0,
            poison:   0, life:     0, death:    0
          }
        },
        { klass: Effects.TriggerAnimation, animation: ANIM_HIT }
      ]
    },
    { klass: Effects.TriggerAnimation, target: "self", animation: ANIM_HEAVY_ATTACK },
    { klass: Effects.SetCooldown, target: "self", cooldownLength: 10000 }
  ],
  cost: 0,
  name: 'glob',
  startupDelay: 6000
}

// TODO: this and other functions defining projectile movement/behavior should maybe move to a different file?
// this returns a delta x and y given a timestep
function linearProjectile(dt, speed) {
  return {x: (-1*speed*dt), y: 0};
}
