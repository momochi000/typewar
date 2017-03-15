/* This is the library of game effects that skills may have on the game
 * state/board
 *
*/

import TextLibrarian from "../util/text_librarian"

require("../components/TextFragment");
require("../components/TextFragmentAttackDisplay");
require("../components/DefendableAttack");
require("../components/BattleNPCProjectile");

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

// TODO: This can be made more generic, it shouldnt' be TextFragLinear,
// the position function is passed in seperately so really it could
// be any kind of path.  Also other attributes could determine it's
// appearance and other behavior.
// SpawnProjectileAttack would be more appropriate but I don't want to
// refactor this right now
class SpawnTextFragLinear {
  static execute(args) {
    validateTarget("EffectSpawnTextFragLinear", args.target);

    var text = getTextFromSourceEntity(args.source, args.skill.textOptions);
    //    console.log("DEBUG:  Executing SpawnTextFragLinear ...... text to create -> ", text);

    // LEFT OFF~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Building this text frag attack component.

    Crafty.e("2D, DOM, Collision, TextFragment, TextFragmentAttackDisplay, DefendableAttack, BattleNPCProjectile")
      .attr({
        x: args.source._x,
        y: args.source._y,
        z: args.source._z+1
      })
      .textFragment(text)
      .textFragmentAttackDisplay()
      .defendableAttack({target: args.target})
      .battleNPCProjectile(args.positionFunction, args.speed);
    //      .collision([0,0 ,10,0 ,10,10, 0,10]);

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
  var amount;
  amount = _.reduce(propertiesMagnitude, (sum, curr_val, curr_key) => {
    return (sum+curr_val);
  }, 0);
  target.hp = target.hp - amount;
}

function calculateDamage(target, damageProperties) {
  var output = {};
  if(!target.charSheet) { 
    return;
  }
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

export { Damage, SetCooldown, SpawnTextFragLinear, TriggerAnimation }
