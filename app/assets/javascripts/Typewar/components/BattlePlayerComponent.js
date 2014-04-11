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

  getPercentHP: function (){
    return 100 * this.char_sheet.get("status").hp / this.char_sheet.defaults.status.hp;
  },

  initiateAttackOn: function (defender){
    var frag, speed;

    speed = 20 * Math.random();
    frag = this._fragment_spawner.generateTextFragment({
      offset: [-10, -100],
      speed: [speed, 0],
      attacker: this,
      defender: defender,
      classes: ["player"],
      text: this._getWordFromVocabulary()
    });
    frag.getEntity().drawSelf();
  },
 
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

  wasMissed: function (){
  },

  // private
  
  _createFragmentSpawner: function (){
    this._fragment_spawner = Crafty.e("2D, TextFragmentSpawner")
      .attr({x: this._x, y: this._y})
      .textFragmentSpawner();

    this.attach(this._fragment_spawner);
  },

  _getWordFromVocabulary: function (){
    var vocab;
    vocab = this.char_sheet.get('vocabulary');
    if(vocab && vocab.length > 1){
      return vocab[Math.floor(Math.random()*vocab.length)];
    }else{
      return null;
    }
  }
});
