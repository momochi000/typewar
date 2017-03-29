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

class SpawnTextProjectilePhysics {
  static execute(args) {
    var text, new_ent;

    validateTarget("EffectSpawnTextProjectilePhysics", args.target);
    text = getTextFromSourceEntity(args.source, args.textOptions);

    new_ent = Crafty.e("2D, DOM, Collision, TextFragment, TextFragmentAttackDisplay, DefendableAttack, Box2D, TriggerableEffectOnCollide, BattleProjectile, BattlePhysicsProjectile")
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

    SpawnTextProjectilePhysics.applyInitialForce(new_ent);
  }

  static applyInitialForce(entity) {
    var force_vector, body_center, x_force, y_force;

    //    x_force = _.random(-320, -470);
    //    y_force = _.random(-330, -510);
    //    force_vector = new b2Vec2(-380, -630); //always hits
    x_force = _.random(-9300, -15000); // TODO These force arguments need to be passed in to the effect
    y_force = _.random(-12000, -26000);
    force_vector = new Box2D.Common.Math.b2Vec2(x_force, y_force);
    body_center = entity.body.GetWorldCenter();
    entity.body.ApplyForce(force_vector, body_center);
  }
}

// TODO: This can be made more generic, it shouldnt' be TextFragLinear,
// the position function is passed in seperately so really it could
// be any kind of path.  Also other attributes could determine it's
// appearance and other behavior.
// SpawnProjectileAttack would be more appropriate but I don't want to
// refactor this right now
class SpawnTextFragLinear {
  static execute(args) {
    var text;

    validateTarget("EffectSpawnTextFragLinear", args.target);
    text = getTextFromSourceEntity(args.source, args.textOptions);

    Crafty.e("2D, DOM, Collision, TextFragment, TextFragmentAttackDisplay, DefendableAttack, BattleProjectile, BattleNPCProjectile, TriggerableEffectOnCollide")
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

function displayDamageEffect(damageAmount) {
  // TBI
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

export { Damage, SetCooldown, SpawnTextFragLinear, SpawnTextProjectilePhysics, TriggerAnimation }
