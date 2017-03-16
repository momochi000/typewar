// This system handles movement of npc  projectiles.
export function initProjectileSystem(Crafty) {
}


export function projectileSystem(Crafty, frame, dt) {
  var projectiles, projectiles_hit;

  projectiles = Crafty("BattleNPCProjectile").get();

  _.each(projectiles, (curr_projectile) => {
    updateProjectilePosition(curr_projectile, dt);
  });

  projectiles_hit = Crafty("DefendableAttack BattleNPCProjectile BattleNPCProjectileHit").get();
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

    console.log("DEBUG: PROJECTILE SYSTEM PROCESSING, EVALUATING AN ATTACK EFFECT --------->>", effect_klass, effect_args);
    effect_klass.execute(effect_args);
  });
}

function updateProjectilePosition(projectile, dt) {
  var coord_delta;

  coord_delta = projectile.positionFunction(dt, projectile.speed);
  projectile.x = projectile.x + coord_delta.x;
  projectile.y = projectile.y + coord_delta.y;
}
