export function initTriggerEffectOnCollideSystem(Crafty) {}

export function triggerEffectOnCollideSystem(Crafty) {
  var projectiles_hit;

  projectiles_hit = Crafty("TriggerableEffectOnCollide TriggerableEffectOnCollideHit").get();
  _.each(projectiles_hit, (curr_projectile) => {
    evaluateAttack(curr_projectile);
    curr_projectile.destroy();
  });
}

// private 

function evaluateAttack(curr_projectile) {
  var source, target, effects;

  source = curr_projectile.getSource();
  target = curr_projectile.getTarget();
  effects = curr_projectile.getEffects();
  _.each(effects, (curr_effect) => {
    var effect_klass, effect_args

    effect_klass = curr_effect.klass;
    effect_args = curr_effect;
    effect_args = _.merge({source: source, target: target}, effect_args);

    //    console.log("DEBUG: TRIGGER EFFECT ON COLLISION SYSTEM PROCESSING, EVALUATING AN ATTACK EFFECT --------->>", effect_klass, effect_args);
    effect_klass.execute(effect_args);
  });
}
