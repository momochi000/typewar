Crafty.c("BattleSlime", {
  init: function (){ 
    this.requires("2D, BattleCharacter, BattleNPCEnemy, BattleSlimeAnim");
  },

  battleSlime: function (){ return this; },

  // TODO: Turn this into an attribute on the model that gets passed to the 
  // entity on creation
  attacks: {
    standard: {
      name: 'standard',
      properties: {
        blunt:    3,
        slashing: 0,
        piercing: 0,
        fire:     0,
        earth:    0,
        water:    0,
        air:      0,
        light:    0,
        dark:     0,
        poison:   0,
        life:     0,
        death:    0
      },
      animation: "attack1", 
      positionFunc: function (req, opt){
        var REQUIRED_OPTIONS, x;

        REQUIRED_OPTIONS = ["start_x", "start_y", "time", "context"];
        _.each(REQUIRED_OPTIONS, function(req_opt){
          if(!req){ throw "no required options present"; }
          if(!req[req_opt]) { throw "Missing required argument __ "+ req_opt +" __ when positionFunc called"; }
        });
        opt      = opt || {};
        opt.spd  = opt.speed || 2;
        opt.dir  = opt.direction || this.direction || 1;
        opt.diff = opt.difficulty_multiplier || this.difficulty_multiplier || 1;

        x = req.start_x + opt.dir*req.time*opt.spd*opt.diff;
        req.context.x = x;
        req.context.y = req.start_y;
        return { x: x, y: req.start_y};
      },
      classesFunc: function (time){
        return ["slime"];
      }, 
      hitbox: {w: 50, h: 50}
    },

    glob: {
      name: 'glob',
      properties: {
        blunt:    3, slashing: 0, piercing: 0, fire:     0, earth:    0, 
        water:    0, air:      0, light:    0, dark:     0, poison:   2,
        life:     0, death:    0
      },
      animation: "attack2",
      initialMovement: function (req){
        var REQUIRED_OPTIONS, force_vector, body_center, x_force, y_force;
        REQUIRED_OPTIONS = ["x", "y", "context"];
        _.each(REQUIRED_OPTIONS, function(req_opt){
          if(!req){ throw "no required options present"; }
          if(!req[req_opt]) { throw "Missing required argument __ "+ req_opt +" __ when initialMovement called"; }
        });

        x_force = Typewar.Util.randomInt(-320, -470);
        y_force = Typewar.Util.randomInt(-330, -510);
        //force_vector = new b2Vec2(-380, -630); //always hits
        force_vector = new b2Vec2(x_force, y_force);
        body_center = req.context.body.GetWorldCenter();
        req.context.body.ApplyForce(force_vector, body_center);
      },
      classesFunc: function (time){ return ["slime"]; }, 
      hitbox: {w: 50, h: 50},
      box2d: {
        bodyType: 'dynamic',
        density : 0.1,
        friction : 2,
        restitution : 0.1
      }
    }
  }
});
