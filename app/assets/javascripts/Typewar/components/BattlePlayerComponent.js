Crafty.c("BattlePlayer", {
  char_sheet: null,
  _current_target: null,
  _fragment_spawner: null,
  _ANIM_HIT_DELAY: 410,

  init: function (){
    this.requires("2D, BattlePlayerAnimation");
  },

  battlePlayer: function (char_sheet){
    var self = this;

    this.char_sheet = char_sheet || new Typewar.Models.CharacterSheet({name: "Player"});
    this._createFragmentSpawner();
    this.z = 5;

    return this;
  },

  attacks: {
    standard: {
      name: "standard",
      properties: {
        blunt:    0,
        slashing: 3,
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
      animation: "attack1", // Player attack should happen when text fragment 
                            // is completed (playtest it). This should also
                            // accept an array so the attack can be randomized
      positionFunc: function (req, opt){
        var REQUIRED_OPTIONS, x;

        REQUIRED_OPTIONS = ["start_x", "start_y", "time", "context"];
        _.each(REQUIRED_OPTIONS, function(req_opt){
          if(!req){ throw "no required options present"; }
          if(!req[req_opt]) { throw "Missing required argument __ "+ req_opt +" __ when positionFunc called"; }
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
        return ["player"];
      }, 
      hitbox: {w: 50, h: 50}
    }
  },

  activateAutoAttack: function (){
    var self = this;
    this.battle_timer = window.setInterval(function() {
      self.initiateAttackOn(self._current_target);
    }, 7000);
  },

  deactivateAutoAttack: function (){
    if(this.battle_timer){ window.clearInterval(this.battle_timer); }
  },

  deallocate: function (){
    this.deactivateAutoAttack();
    this._fragment_spawner.deallocate();
    this._fragment_spawner = null;
    this.destroy();
  },

  deliverAttack: function (){
    this.animAttack();
  },

  die: function (){
    Crafty.trigger("PlayerDied", {target: this});
  },

  getStatus: function (attribute){
    return this.char_sheet.get("status")[attribute];
  },

  getName: function (){
    return this.char_sheet.get("name");
  },

  getVocabulary: function (){
    return this.char_sheet.get("vocabulary");
  },


  getPercentHP: function (){
    return 100 * this.char_sheet.get("status").hp / this.char_sheet.defaults.status.hp;
  },

  initiateAttackOn: function (defender){
    var frag, speed, text_fragment_options, next_text;

    text_fragment_options = Typewar.Engine.BattleManager.handleAttack({
      attacker: this,
      defender: defender,
      attack: this.attacks['standard']
    });

    frag = this._fragment_spawner.generateTextFragment({
      attack_properties: text_fragment_options
    });
  },

  isPlayer: function (){ return true; },
  isNPC: function (){ return false; },
 
  partialHit: function (){
    var self = this;
    console.log("DEBUG: PLAYER: PARTIAL HIT. OW!!! ");
    window.setTimeout(function (){ self.animBlock(); }, this._ANIM_HIT_DELAY);
  },

  setTarget: function (target){
    this._current_target = target;
  },

  successfulDefense: function (){
    var self = this;
    console.log("DEBUG: PLAYER: DEFENDED!!! ");
    window.setTimeout(function (){ self.animBlock(); }, this._ANIM_HIT_DELAY);
  },

  successfulHit: function (){
    var self = this;
    console.log("DEBUG: PLAYER: HIT!! GOT ME GOOD D=");
    window.setTimeout(function (){ self.animHit(); }, this._ANIM_HIT_DELAY);
  },

  takeDamage: function(damage) {
    var currentHP, newHP;

    currentHP = this.char_sheet.get("status").hp;
    newHP = currentHP - damage;
    this.char_sheet.set({status: {hp: newHP}});
    this.updateStatus();
    if(newHP <= 0){ this.die(); }
  },

  updateStatus: function() {
    this.trigger("updateStatus");
  },

  wasMissed: function (){ },

  // private
  
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
