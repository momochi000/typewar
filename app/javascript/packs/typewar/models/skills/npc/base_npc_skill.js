/* This model acts as a template for NPC skills 
 * it defines the interface to NPC skills.  
 * We can declare new skills as inheriting from this model
 * and simply setting the defaults.  Most skills will override
 * some of the getters in order to provide a means of modifying the
 * skill attributes based on difficulty.
 */
export default class BaseSkill {
  constructor (){
    this._attributes = {
      animation: "",
      box2d: {},
      cooldown: 0,
      difficulty: 1,
      hitbox: {w: 0, h: 0},
      name: "",
      properties: {
        blunt:    0, slashing: 0, piercing: 0, fire:     0,
        earth:    0, water:    0, air:      0, light:    0,
        dark:     0, poison:   0, life:     0, death:    0
      },
      sound: {},
      textOptions: {
        min_length: 0,
        max_length: 0,
        min_difficulty: 0,
        max_difficulty: 0
      },
      type: ""
    }
  }

  classesFunc(){ }
  initialMovement(){ }
  positionFunc(){ }

  getAnimation(){ return this._attributes.animation;  } 
  getBox2d(){ return this._attributes.box2d;          } 
  getClassesFunc(){ return this.classesFunc;          } 
  getCooldown(){ return this._attributes.cooldown;    } 
  getDifficulty(){ return this._attributes.difficulty;} 
  getHitbox(){ return this._attributes.hitbox;        } 
  getInitialMovement(){ return this.initialMovement;  } 
  getName(){ return this._attributes.name;            } 
  getPositionFunc(){ return this.positionFunc;        } 
  getProperties(){ return this._attributes.properties;} 
  getSound(){ return this._attributes.sound;          } 
  getTextOptions(){ return this._attributes.textOptions;}
  getType(){ return this._attributes.type;            }

  getSkillAttributes() {
    return {
      animation:        this.getAnimation(),
      box2d:            this.getBox2d(),
      classesFunc:      this.getClassesFunc(),
      cooldown:         this.getCooldown(),
      difficulty:       this.getDifficulty(),
      hitbox:           this.getHitbox(),
      initialMovement:  this.getInitialMovement(),
      name:             this.getName(),
      properties:       this.getProperties(),
      positionFunc:     this.getPositionFunc(),
      sound:            this.getSound(),
      textOptions:     this.getTextOptions(),
      type:             this.getType()
    }
  }
}
