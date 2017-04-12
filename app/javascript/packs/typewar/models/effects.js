// This is the library of game effects that skills may have on the game state/board

import TextLibrarian from "../util/text_librarian"

var Box2D = require("box2dweb");
require("../components/TextFragment");
require("../components/TextFragmentAttackDisplay");
require("../components/DefendableAttack");
require("../components/BattleProjectile");
require("../components/BattleNPCProjectile");
require("../components/TriggerableEffectOnCollide");
require("../components/BattlePhysicsProjectile");
require("../components/vendor/box2d");


const A_TO_Z = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];

class Damage {
  static execute(args) {
    var damage_properties_amount;

    validateTarget("EffectDamage", args.target);
    if(!args.target.has("BattleCharacter")) { 
      throw new Error("EffectDamage being executed without a valid target");
    }
    args = setSelfTargetArg(args);
    damage_properties_amount = calculateDamage(args.target, args.properties);

    applyDamage(args.target, damage_properties_amount);

    // displayDamageEffect(damage_amount);
  }
}

class SetCooldown {
  static execute(args) {
    var args_copy;

    validateTarget("EffectSetCooldown", args.target);
    args = setSelfTargetArg(args);
    args_copy = _.merge({}, args);
    setTimeout(() => {
      args_copy.skill.prepare();
    }, args.cooldownLength);
  }
}

class SpawnScatterTextProjectilePhysics {
  static execute(args){
    var i, new_ent, text;

    if(!args.count) { throw new Error("Error, attempting to SpawnScatterTextProjectilePhysics without a count");}
    validateTarget("SpawnScatterTextProjectilePhysics", args.target);

    for(i=0; i<args.count; i++){
      if(args.textOptions.randomString) {
        text = buildRandomString(args.textOptions);
      }else{
        text = getTextFromSourceEntity(args.source, args.textOptions);
      }

      new_ent = createTextFragmentPhysics(text, args);
      applyForceToEntity(new_ent, this.getRandomForceVectorToHit());
    }
  }

  static getRandomForceVectorToHit(){
    var x_force, y_force;

    //x_force = _.random(-8300, -12000);
    //y_force = _.random(-12000, -20000);
    x_force = _.random(-9300, -15000); // TODO These force arguments need to be passed in to the effect
    y_force = _.random(-12000, -26000);
    return new Box2D.Common.Math.b2Vec2(x_force, y_force);
  }
}

class SpawnTextProjectilePhysics {
  static execute(args) {
    var text, new_ent;

    validateTarget("EffectSpawnTextProjectilePhysics", args.target);
    text = getTextFromSourceEntity(args.source, args.textOptions);

    new_ent = createTextFragmentPhysics(text, args);
    applyForceToEntity(new_ent, this.getRandomForceVectorToHit());
    return new_ent;
  }

  static getRandomForceVectorToHit(){
    var x_force, y_force;
    x_force = _.random(-9300, -15000); // TODO These force arguments need to be passed in to the effect
    y_force = _.random(-12000, -26000);
    return new Box2D.Common.Math.b2Vec2(x_force, y_force);
  }
}

// TODO: This can be made more generic, it shouldnt' be TextFragLinear,
// the position function is passed in seperately so really it could
// be any kind of path.  Also other attributes could determine it's
// appearance and other behavior.
// SpawnProjectileAttack would be more appropriate but I don't want to
// refactor this right now
class SpawnTextProjectile {
  static execute(args) {
    var text;

    validateTarget("EffectSpawnTextProjectile", args.target);
    text = getTextFromSourceEntity(args.source, args.textOptions);

    return Crafty.e("2D, DOM, Collision, TextFragment, TextFragmentAttackDisplay, DefendableAttack, BattleProjectile, BattleNPCProjectile, TriggerableEffectOnCollide")
      .attr({
        x: args.source._x,
        y: args.source._y-20,
        z: (args.source._z+1),
        h: 20,
        w: 20
      })
      .textFragment(text)
      .textFragmentAttackDisplay()
      .defendableAttack()
      .collision()
      .battleProjectile()
      .battleNPCProjectile(args.positionFunction, args.speed)
      .triggerableEffectOnCollide({
        source: args.source, 
        target: args.target, 
        effects: args.effects, 
        targetComponent: "BattlePlayer" // TODO: This should be moved to an argument of the effect when it's defined in a skill
      });
  }
}

class TriggerAnimation {
  static execute(args) {
    validateTarget("EffectTriggerAnimation", args.target);
    args = setSelfTargetArg(args);
    if(!args.target.has("SpriteAnimation")) { 
      throw new Error("EffectTriggerAnimation being executed without a valid target");
    }

    args.target.playAnim(args.animation)
  }
}

// locals

function applyDamage(target, propertiesMagnitude) {
  var amount, effect_func;
  amount = _.reduce(propertiesMagnitude, (sum, curr_val, curr_key) => {
    return (sum+curr_val);
  }, 0);
  
  target.hp = target.hp - amount;
  effect_func = new Function("entity",
    "let new_health, old_health;"+
    "old_health = entity.getHP();" +
    "new_health = old_health - "+ amount +";" +
    "entity.setHP(new_health);"
  );
  target.getEffectQueue().push(effect_func);
}

function applyForceToEntity(entity, force){
  var body_center;

  body_center = entity.body.GetWorldCenter();
  entity.body.ApplyForce(force, body_center);
}

function calculateDamage(target, damageProperties) {
  var output = {};
  if(!target.charSheet) { return; }
  // NOTE: Eventually we'll do some sophisticated calculation of target
  // properties against the properties of the thing doing the damaging
  // for now just subtract
  _.each(target.charSheet.data.properties, (val, key) => {
    let prop_amount;
    prop_amount = damageProperties[key] - val;
    output[key] = (prop_amount < 0) ? (0) : (prop_amount);
  });
  return output;
}

function createTextFragmentPhysics(text, args) {
  return Crafty.e("2D, DOM, Collision, TextFragment, TextFragmentAttackDisplay, DefendableAttack, Box2D, TriggerableEffectOnCollide, BattleProjectile, BattlePhysicsProjectile")
    .attr({
      x: args.source._x,
      y: args.source._y-20,
      z: (args.source._z+1),
      h: 20,
      w: 20
    })
    .textFragment(text)
    .textFragmentAttackDisplay()
    .defendableAttack({source: args.source, target: args.target, effects: args.effects})
    .collision()
    .battleProjectile()
    .box2d(args.box2d)
    .triggerableEffectOnCollide({
      source: args.source, 
      target: args.target, 
      effects: args.effects, 
      targetComponent: "BattlePlayer"
    });
}

function displayDamageEffect(damageAmount) {
  // TBI
}

function buildRandomString(options){
  var i, length, output;

  if(options.minLength && options.maxLength){
    if(options.minLength == options.maxLength){
      length = options.minLength
    }else{
      length = _.random(options.minLength, options.maxLength);
    }
  }else if(options.minLength){
    length = _.random(options.minLength, 100);
  }else if(options.maxLength){
    length = _.random(1, options.maxLength);
  }


  output = "";
  for(i=0; i<length; i++){
    output+= _.sample(A_TO_Z);
  }
  return output;
}

function getTextFromSourceEntity(entity, textOptions) {
  return TextLibrarian.retrieve(entity.getVocabulary(), textOptions);
}

function setSelfTargetArg(args) {
  if(args.target == "self") {
    args.target = args.source;
  }
  return args;
}

function validateTarget(effectName, target) {
  if(!target) { 
    throw new Error(effectName + " being executed without a target");
  }
}

export { Damage, SetCooldown, SpawnTextProjectile, SpawnScatterTextProjectilePhysics, SpawnTextProjectilePhysics, TriggerAnimation }
