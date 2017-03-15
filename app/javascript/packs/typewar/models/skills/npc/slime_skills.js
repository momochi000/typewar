/* TODO: Evaluate if this makes sense..
 *   remove start_x and start_y from required options.  Text fragments should 
 *   always be spawned from the x,y of the spawner.  If there needs to be some 
 *   offset, then it can be part of the position function
 */

//import BaseSkill from './base_npc_skill'
import * as Effects from "../../effects"
import { 
  SLIME_ANIM_READY, SLIME_ANIM_SLASH, SLIME_ANIM_THROW, SLIME_ANIM_BLOCK, SLIME_ANIM_HIT 
} from "../../../constants/animation_constants"

//class SlimeStandard extends BaseSkill {
//  constructor() {
//    super();
//
//    this._attributes = _.assign(this._attributes, {
//      name: 'standard',
//      properties: {
//        blunt:    3, slashing: 0, piercing: 0, fire:     0,
//        earth:    0, water:    0, air:      0, light:    0,
//        dark:     0, poison:   0, life:     0, death:    0
//      },
//      animation: "attack1", 
//      cooldown: 700,
//      hitbox: {w: 50, h: 50},
//      type: "Projectile",
//      textOptions: {
//        min_length: 9,
//        max_length: 25,
//        min_difficulty: 1,
//        max_difficulty: 4
//      },
//      sound: {
//        "standard_attack": "audio/xxx.mp3" // placeholder..
//      }
//    });
//  }
//
//  classesFunc(time){
//    return ["slime"];
//  }
//
//  positionFunc(req, opt){
//    var REQUIRED_OPTIONS, x;
//
//    REQUIRED_OPTIONS = ["start_x", "start_y", "time", "context"];
//
//    if(!req){ throw new Error("no required options present"); }
//    _.each(REQUIRED_OPTIONS, function(req_opt){
//      if(!req[req_opt]) { throw new Error("Missing required argument __ "+ req_opt +" __ when positionFunc called"); }
//    });
//    opt      = opt || {};
//    opt.spd  = opt.speed || 2;
//    opt.dir  = opt.direction || this.direction || 1;
//    opt.diff = opt.difficulty_multiplier || this.difficulty_multiplier || this.difficulty;
//
//    x = req.start_x + opt.dir*req.time*opt.spd*opt.diff;
//    req.context.x = x;
//    req.context.y = req.start_y;
//    return { x: x, y: req.start_y};
//  }
//}
//
//class SlimeGlob extends BaseSkill {
//  constructor() {
//    super();
//    this._attributes = _.assign(this._attributes, {
//
//      name: 'glob',
//      properties: {
//        blunt:    3, slashing: 0, piercing: 0, fire:     0,
//        earth:    0, water:    0, air:      0, light:    0,
//        dark:     0, poison:   2, life:     0, death:    0
//      },
//      animation: "attack2",
//      cooldown: 3000,
//      hitbox: {w: 50, h: 50},
//      box2d: {
//        bodyType: 'dynamic',
//        density: 0.1,
//        friction: 2,
//        restitution: 0.1
//      },
//      type: "Projectile",
//      textOptions: {
//        min_length: 5,
//        max_length: 15,
//        min_difficulty: 1,
//        max_difficulty: 2
//      }
//    });
//  }
//
//  classesFunc(time){ return ["slime"]; }
//  initialMovement(req){
//    var REQUIRED_OPTIONS, force_vector, body_center, x_force, y_force;
//    REQUIRED_OPTIONS = ["x", "y", "context"];
//    if(!req){ throw new Error("no required options present"); }
//    _.each(REQUIRED_OPTIONS, function(req_opt){
//      if(!req[req_opt]) { throw new Error("Missing required argument __ "+ req_opt +" __ when initialMovement called"); }
//    });
//
//    x_force = Typewar.Util.randomInt(-320, -470);
//    y_force = Typewar.Util.randomInt(-330, -510);
//    //force_vector = new b2Vec2(-380, -630); //always hits
//    force_vector = new b2Vec2(x_force, y_force);
//    body_center = req.context.body.GetWorldCenter();
//    req.context.body.ApplyForce(force_vector, body_center);
//  }
//}
//
//export { SlimeStandard, SlimeGlob }


export var SlimeStandardAttack = {
  effects: [
    { klass: Effects.SpawnTextFragLinear, positionFunction: linearProjectile, speed: 0.08 },
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
  properties: {
    blunt:    3, slashing: 0, piercing: 0,
    fire:     0, earth:    0, water:    0,
    air:      0, light:    0, dark:     0,
    poison:   0, life:     0, death:    0
  }
}

// TODO: this and other functions defining projectile movement/behavior should maybe move to a different file?
// this returns a delta x and y given a timestep
function linearProjectile(dt, speed) {
  return {x: (-1*speed*dt), y: 0};
}
