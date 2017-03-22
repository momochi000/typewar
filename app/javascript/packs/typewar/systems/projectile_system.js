const DEAD_COUNT_THRESHOLD = 20; // Number of frames where a projectile sits immobile before it's considered dead

// This system handles movement of npc  projectiles.
export function initProjectileSystem(Crafty) {
}


export function projectileSystem(Crafty, frame, dt) {
  var projectiles;

  projectiles = Crafty("BattleNPCProjectile").get();
  _.each(projectiles, (curr_projectile) => {
    updateProjectilePosition(curr_projectile, dt);
  });

  // Remove projectiles that have hit the stage edge
  projectiles = Crafty("BattleProjectile BattleProjectileOutOfBounds").get();
  _.each(projectiles, (curr_projectile) => {
    curr_projectile.destroy();
  });

  projectiles = Crafty("BattlePhysicsProjectile").get();
  _.each(projectiles, (curr_projectile) => {
    findDeadProjectiles(curr_projectile);
    clearDeadProjectiles(curr_projectile);
  });
}

// private 

function clearDeadProjectiles(projectile) {
  if(projectile.getDeadCounter() >= DEAD_COUNT_THRESHOLD){
    projectile.destroy();
  }
}

function findDeadProjectiles(projectile) {
  if(isProjectileStill(projectile)){
    projectile.setDeadCounter(projectile.getDeadCounter()+1);
  }
}

function isProjectileStill(projectile){
  var v;
  v = projectile.body.GetLinearVelocity();
  if(v.x == 0 && v.y == 0){ return true; }
  return false;
}

function updateProjectilePosition(projectile, dt) {
  var coord_delta;

  coord_delta = projectile.positionFunction(dt, projectile.speed);
  projectile.x = projectile.x + coord_delta.x;
  projectile.y = projectile.y + coord_delta.y;
}
