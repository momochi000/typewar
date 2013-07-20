Crafty.c("BattlePlayer", {
  char_sheet: null,
  _fragment_spawner: null,
  _ANIM_HIT_DELAY: 430,

  init: function (){
    this.requires("2D, BattlePlayerAnimation");
  },

  battlePlayer: function (char_sheet){
    var self = this;

    this.char_sheet = char_sheet || new Typewar.Models.CharacterSheet({name: "Player"});
    this._createFragmentSpawner();

    return this;
  },

  deliverAttack: function (){
    this.animAttack();
  },

  getStatus: function (attribute){
    return this.char_sheet.get("status")[attribute];
  },

  getName: function (){
    return this.char_sheet.get("name");
  },

  getPercentHP: function (){
    return 100 * this.char_sheet.get("status").hp / this.char_sheet.defaults.status.hp;
  },

  initiateAttackOn: function (defender){
    var frag, speed;

    speed = 20 * Math.random();
    frag = this._fragment_spawner.generateTextFragment({
      offset: [0, -150],
      speed: [speed, 0],
      attacker: this,
      defender: defender
      //type: "defense"
    });
    frag.getEntity().drawSelf();
  },
 
  partialHit: function (){
    var self = this;
    console.log("DEBUG: PLAYER: PARTIAL HIT. OW!!! ");
    window.setTimeout(function (){ self.animBlock(); }, this._ANIM_HIT_DELAY);
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
  },

  updateStatus: function() {
    this.trigger("updateStatus");
  },

  wasMissed: function (){
  },

  // private
  
  _createFragmentSpawner: function (){
    this._fragment_spawner = Crafty.e("2D, TextFragmentSpawner")
      .attr({x: this._x, y: this._y})
      .textFragmentSpawner();

    this.attach(this._fragment_spawner);
  }
});

