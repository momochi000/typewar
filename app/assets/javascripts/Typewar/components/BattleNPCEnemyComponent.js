/* A component specifically for enemies encountered in Typewar's battle system
 * This is the base component, other child components are made up of specific
 * monsters or enemy types and require this component, calling methods from it.

 * Events Triggered:
 * updateStatus ===========> When the status of the npc changes
 * enemy_died =============> When this monster dies
 */

Crafty.c("BattleNPCEnemy", {
  _ANIM_HIT_DELAY: 430,
  _fragment_spawner: null,
  _current_target: null,
  char_sheet: null,

  init: function (){
    this.requires("2D, SpriteAnimation");
  },

  battleNPCEnemy: function (char_sheet){
    this.char_sheet = char_sheet || new Typewar.Models.CharacterSheet({name: "Slime"});
    this._createFragmentSpawner();
    this.z = 5;
    return this;
  },

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
          if(!req[req_opt]) { throw "Missing required argument __ "+ req_opt +" __ when initialMovement called"; }
        });
        opt      = opt || {};
        opt.spd  = 2;
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
        var REQUIRED_OPTIONS, force_vector, body_center;
        REQUIRED_OPTIONS = ["x", "y", "context"];
        _.each(REQUIRED_OPTIONS, function(req_opt){
          if(!req){ throw "no required options present"; }
          if(!req[req_opt]) { throw "Missing required argument __ "+ req_opt +" __ when initialMovement called"; }
        });

        force_vector = new b2Vec2(-380, -290);
        body_center = req.context.body.GetWorldCenter();
        req.context.body.ApplyForce(force_vector, body_center);
      },
      classesFunc: function (time){ return ["slime"]; }, 
      hitbox: {w: 50, h: 50},
      box2d: {
        bodyType: 'dynamic',
        //density : 0.2,
        density : 0.1,
        friction : 2,
        restitution : 0.1
      }
    }
  },

  deallocate: function (){
    this.deactivateAI();
    this._fragment_spawner.deallocate();
    this._fragment_spawner = null;
    this.destroy();
  },

  deliverAttack: function (){
    this.animAttack();
  },

  die: function (){
    Crafty.trigger("NPCDied", {target: this});
  },

  getStatus: function(attribute) {
    return this.char_sheet.get("status")[attribute];
  },

  getName: function() {
    return this.char_sheet.get("name");
  },

  getVocabulary: function (){
    return this.char_sheet.get("vocabulary");
  },

  getPercentHP: function() {
    return 100 * this.char_sheet.get("status").hp / this.char_sheet.defaults.status.hp;
  },

  initiateAttackOn: function (defender){
    var frag, speed, text_fragment_options;

    text_fragment_options = Typewar.Engine.BattleManager.handleAttack({
      attacker: this, 
      defender: defender, 
      attack: this.attacks['glob']
    });

    frag = this._fragment_spawner.generateTextFragment({attack_properties: text_fragment_options});
  },

  isPlayer: function (){ return false; },
  isNPC: function (){ return true; },

  partialHit: function (){
    console.log("DEBUG: SLIME: PARTIAL HIT. OW!!! ");
    var self = this;
    window.setTimeout(function (){ self.animBlock(); }, this._ANIM_HIT_DELAY);
  },

  setTarget: function (target){
    this._current_target = target;
  },

  successfulDefense: function (){
    console.log("DEBUG: SLIME: DEFENDED!!! ");
    var self = this;
    window.setTimeout(function (){ self.animBlock(); }, this._ANIM_HIT_DELAY);
  },

  successfulHit: function (){
    var self = this;
    console.log("DEBUG: SLIME: HIT!! GOT ME GOOD D=");
    window.setTimeout(function (){ self.animHit(); }, this._ANIM_HIT_DELAY);
  },

  takeDamage: function(damage) {
    var currentHP, newHP;

    damage = damage || 2;
    currentHP = this.char_sheet.get("status").hp;
    newHP = currentHP - damage;

    this.char_sheet.set({status: {hp: newHP}});
    this.updateStatus();
    if(newHP <= 0){ this.die(); }
  },

  updateStatus: function() {
    this.trigger("updateStatus");
  },

  wasMissed: function (){
    console.log("DEBUG: SLIME: MISSED ME!!");
  },

  //private 

  _createFragmentSpawner: function (){
    this._fragment_spawner = Crafty.e("2D, TextFragmentSpawner")
      .attr({x: this._x, y: this._y})
      .textFragmentSpawner();

    this.attach(this._fragment_spawner);
  },

  // Grab a random string from the vocabulary
  _getWordFromVocabulary: function (){
    var vocab;
    vocab = this.getVocabulary();
    if(vocab && vocab.length > 1){
      return vocab[Math.floor(Math.random()*vocab.length)];
    }else{
      return null;
    }
  }
});
