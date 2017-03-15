// This system handles movement of npc  projectiles.
export function initProjectileSystem(Crafty) {
}


export function projectileSystem(Crafty, frame, dt) {
  var projectiles;

  projectiles = Crafty("BattleNPCProjectile").get();

  _.each(projectiles, (curr_projectile) => {
    updateProjectilePosition(curr_projectile, dt);
  });
}

// private 

function updateProjectilePosition(projectile, dt) {
  var coord_delta;

  coord_delta = projectile.positionFunction(dt, projectile.speed);
  projectile.x = projectile.x + coord_delta.x;
  projectile.y = projectile.y + coord_delta.y;
}
