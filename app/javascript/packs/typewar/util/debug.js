const PARTICLE_OPTIONS = {
  maxParticles: 150,
  size: 18,
  sizeRandom: 4,
  speed: 1,
  speedRandom: 1.2,
  // Lifespan in frames
  lifeSpan: 29,
  lifeSpanRandom: 25,
  // Angle is calculated clockwise: 12pm is 0deg, 3pm is 90deg etc.
  angle: 65,
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

function particleFactory(x, y, particleOptions){
  if(!particleOptions) { return; }
  return Crafty.e("2D, Canvas, Particles")
    .attr({x: x, y: y, w: 10, h: 10})
    .particles(particleOptions);
};

window.d_particle_options = _.cloneDeep(PARTICLE_OPTIONS);
window.particleFactory = particleFactory;
