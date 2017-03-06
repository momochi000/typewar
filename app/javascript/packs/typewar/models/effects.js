/* This is the library of game effects that skills may have on the game
 * state/board
 *
*/

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

class SetCooldown{
  static execute(args) {
    validateTarget("EffectSetCooldown", args.target);
    args = setSelfTargetArg(args);
    setTimeout(() => {
      args.skill.prepareSkill();
    }, args.cooldownLength);
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
    console.log("ERROR: attempting to calculate damage against a target that has no character sheet -> ", target);
    return;
  }
  // NOTE: Eventually we'll do some sophisticated calculation of target
  // properties against the properties of the thing doing the damaging
  // for now just subtract
  target.charSheet.properties
  _.each(target.charSheet.properties, (val, key) => {
    output[key] = damageProperties[key] - val;
  });
  return output;
}

function displayDamageEffect(damageAmount) {
  // TBI
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

export { Damage, SetCooldown, TriggerAnimation }
