/* This model defines the interface to NPC skills.  
 * We can declare new skills as inheriting from this model
 * and simply setting the defaults.  Most skills will override
 * some of the getters in order to provide a means of modifying the
 * skill attributes based on difficulty.
 */
Typewar.Models.Skills.BaseNPCSkill = Backbone.Model.extend({
  defaults: {
    animation: "",
    box2d: {},
    classesFunc: function (){ },
    cooldown: 0,
    difficulty: 1,
    hitbox: {w: 0, h: 0},
    initialMovement: function (){ },
    name: "",
    positionFunc: function (){ },
    properties: {
      blunt:    0, slashing: 0, piercing: 0, fire:     0,
      earth:    0, water:    0, air:      0, light:    0,
      dark:     0, poison:   0, life:     0, death:    0
    },
    sound: {},
    text_options: {
      min_length: 0,
      max_length: 0,
      min_difficulty: 0,
      max_difficulty: 0
    },
    type: ""
  },

  getAnimation:       function (){ return this.get("animation");      },
  getBox2d:           function (){ return this.get("box2d");          },
  getClassesFunc:     function (){ return this.get("classesFunc");    },
  getCooldown:        function (){ return this.get("cooldown");       },
  getHitbox:          function (){ return this.get("hitbox");         },
  getInitialMovement: function (){ return this.get("initialMovement");},
  getName:            function (){ return this.get("name");           },
  getPositionFunc:    function (){ return this.get("positionFunc");   },
  getProperties:      function (){ return this.get("properties");     },
  getSound:           function (){ return this.get("sound");          },
  getTextOptions:     function (){ return this.get("text_options");   },
  getType:            function (){ return this.get("type");           },

  getSkillAttributes: function () {
    return {
      animation:      this.getAnimation(),
      box2d:          this.getBox2d(),
      classesFunc:    this.getClassesFunc(),
      cooldown:       this.getCooldown(),
      hitbox:         this.getHitbox(),
      initialMovement:this.getInitialMovement(),
      name:           this.getName(),
      properties:     this.getProperties(),
      positionFunc:   this.getPositionFunc(),
      sound:          this.getSound(),
      text_options:   this.getTextOptions(),
      type:           this.getType()
    }
  }
});
