/* Battle particle system
 *
 * How it works:
 * Entities have some high level component indicating that they should 
 * generate particles.  For example: PlayerParticles, and NPCParticles.  These
 * are added to their respective entities here in the system initializer.  
 * Those components are wrappers for the lower level component 
 * BattleParticles, which has the actual data.  When there is a need to 
 * generate particles, BattleParticles gets a directive "triggerParticles()".
 * This sets a flag on the component which will be processed by the system.
 *
 * When the system sees a BattleParticles component with the flag set, it 
 * generates a particle source.  This is an entity with the "ParticleSource" 
 * and the "Particles" components.  Particles spews out the actual particles.
 * ParticleSource keeps track of a start frame so that after a set number of
 * frames, the ParticleSource is destroyed.  The particle source is pushed 
 * into a particle buffer on the owner component and gets attach()d as well. 
 * ------------
 *
*/

import {viewportConvert} from "../util/viewport"

require("../components/PlayerParticles");
require("../components/NPCParticles");
require("../components/ParticleSource");

const BASE_PARTICLE_OPTIONS = {
  maxParticles: 150,
  size: 18,
  sizeRandom: 4,
  speed: 3,
  speedRandom: 1.2,
  // Lifespan in frames
  lifeSpan: 29,
  lifeSpanRandom: 25,
  // Angle is calculated clockwise: 12pm is 0deg, 3pm is 90deg etc.
  angle: 270,
  angleRandom: 34,
  startColour: [255, 131, 0, 1],
  startColourRandom: [48, 50, 45, 0],
  endColour: [245, 35, 0, 0],
  endColourRandom: [60, 60, 60, 0],
  // Only applies when fastMode is off, specifies how sharp the gradients are drawn
  sharpness: 20,
  sharpnessRandom: 10,
  // Random spread from origin
  spread: 10,
  // How many frames should this last
  duration: 5,
  // Will draw squares instead of circle gradients
  fastMode: false,
  gravity: { x: 0, y: 0.1 },
  // sensible values are 0-3
  jitter: 3,
  // Offset for the origin of the particles
  originOffset: {x: 0, y: 0}
};

const PARTICLE_LIFESPAN = 300; //frames, or 5 seconds

var playerParticleOptions;
var nPCParticleOptions;

playerParticleOptions = _.cloneDeep(BASE_PARTICLE_OPTIONS);
nPCParticleOptions = _.cloneDeep(BASE_PARTICLE_OPTIONS);

playerParticleOptions.originOffset.x = 10;
playerParticleOptions.originOffset.y = 30;

nPCParticleOptions.angle = 65;
nPCParticleOptions.originOffset.x = 10;
nPCParticleOptions.originOffset.y = 20;

export function initParticleSystem(Crafty){
  var player, npc;
  player = Crafty("BattlePlayer");
  player.addComponent("PlayerParticles").playerParticles();

  npc = Crafty("BattleNPC");
  npc.addComponent("NPCParticles").nPCParticles();

  bindCleanupParticles();
}

export function particleSystem(Crafty){
  var ents_with_particles, particle_buffer;

  ents_with_particles = Crafty("BattleParticles").get();
  _.each(ents_with_particles, (currEntity) => {
    if(currEntity.needTriggerParticles()){
      triggerParticlesOnEntity(currEntity);
    }

    cleanupOldParticleSources(currEntity);
  });
}

function bindCleanupParticles(){
  Crafty("BattleParticles").bind("Remove", function (){
    _.each(this.getParticleBuffer(), (curr_particle) => {
      curr_particle.destroy();
    });
    this._particleBuffer = null;
  });
}

function cleanupOldParticleSources(entity){
  var curr_particle_buffer;
  curr_particle_buffer = entity.getParticleBuffer();
  _.each(curr_particle_buffer, (curr_particle_source) => {
    if((Crafty.frame() - curr_particle_source.getStartFrame()) >= PARTICLE_LIFESPAN){

      curr_particle_source.destroy();
      curr_particle_source.setDestroyFlag(true);
    }
  });
  _.remove(curr_particle_buffer, (curr_particle_source) => {
    return curr_particle_source.getDestroyFlag();
  });
  entity.setParticleBuffer(curr_particle_buffer);
}

function generateParticleSource(Crafty){
  return Crafty.e("2D, Canvas, ParticleSource, Particles")
    .particleSource(Crafty.frame());
}

function triggerParticlesOnEntity(entity){
  var new_particle_source;

  entity._triggerParticles = false;
  new_particle_source = generateParticleSource(Crafty);
  new_particle_source.attr({x: entity._x, y: entity._y, w: 10, h: 10});
  entity.attach(new_particle_source);
  entity.getParticleBuffer().push(new_particle_source);
  //console.log(`DEBUG: about to puff out particles on -> ${entity[0]} at x: ${new_particle_source._x}, y: ${new_particle_source._y}`);
  if(entity.has("PlayerParticles")) {
    new_particle_source.particles(playerParticleOptions);
  }else if(entity.has("NPCParticles")) {
    new_particle_source.particles(nPCParticleOptions);
  }else{
    console.log("DEBUG: ERROR: some unknown entity has BattleParticles attached");
    return ;
  }
}
