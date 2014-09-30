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

  getAnimation:       function (difficulty){ return this.get("animation");      },
  getBox2d:           function (difficulty){ return this.get("box2d");          },
  getClassesFunc:     function (difficulty){ return this.get("classesFunc");    },
  getCooldown:        function (difficulty){ return this.get("cooldown");       },
  getHitbox:          function (difficulty){ return this.get("hitbox");         },
  getInitialMovement: function (difficulty){ return this.get("initialMovement");},
  getName:            function (difficulty){ return this.get("name");           },
  getPositionFunc:    function (difficulty){ return this.get("positionFunc");   },
  getProperties:      function (difficulty){ return this.get("properties");     },
  getSound:           function (difficulty){ return this.get("sound");          },
  getTextOptions:     function (difficulty){ return this.get("text_options");   },
  getType:            function (difficulty){ return this.get("type");           },

  getSkillAttributes: function (difficulty) {
    return {
      animation:      this.getAnimation(difficulty),
      box2d:          this.getBox2d(difficulty),
      classesFunc:    this.getClassesFunc(difficulty),
      cooldown:       this.getCooldown(difficulty),
      hitbox:         this.getHitbox(difficulty),
      initialMovement:this.getInitialMovement(difficulty),
      name:           this.getName(difficulty),
      properties:     this.getProperties(difficulty),
      positionFunc:   this.getPositionFunc(difficulty),
      sound:          this.getSound(difficulty),
      text_options:   this.getTextOptions(difficulty),
      type:           this.getType(difficulty)
    }
  }
});
