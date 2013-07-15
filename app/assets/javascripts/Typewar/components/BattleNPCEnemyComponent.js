/* A component specifically for enemies encountered in Typewar's battle system
 * This is the base component, other child components are made up of specific
 * monsters or enemy types and require this component, calling methods from it.
 */

Crafty.c("BattleNPCEnemy", {
  _attack_fragment_spawner: null,
  _defense_fragment_spawner: null,
  char_sheet: null,

  init: function (){
    this.requires("2D, SpriteAnimation");
  },

  battleNPCEnemy: function (char_sheet){
    this.char_sheet = char_sheet || new Typewar.Models.CharacterSheet;
    this._createFragmentSpawners();
    Crafty.bind("TextFragmentCompleted", _.bind(this.textFragmentCompleted, this));
    return this;
  },

  attack: function (){
    var frag, speed;

    speed = -20 * Math.random();
    frag = this._attack_fragment_spawner.generateTextFragment({speed: [speed, 0], type: 'attack'});
    frag.getEntity().drawSelf();
  },

  defend: function (){
    var frag, speed;

    speed = -20 * Math.random();
    frag = this._defense_fragment_spawner.generateTextFragment({speed: [speed, 0], type: 'defense'});
    frag.getEntity().drawSelf();
  },

  textFragmentCompleted: function (e){
    var self, completed_fragment;
    var self = this;
    completed_fragment = e.text_fragment;
    window.setTimeout(function (){ self.animHit(); }, 430);
  },

  //delete: function (){
  //  Crafty.unbind("TextFragmentCompleted", this.textFragmentCompleted);
  //  this._attack_fragment_spawner.destroy();
  //  this._defense_fragment_spawner.destroy();
  //  this.destroy();
  //},
  
  //private 
  _createFragmentSpawner: function (){
    return Crafty.e("2D, TextFragmentSpawner")
      .attr({x: this._x, y: this._y})
      .textFragmentSpawner();
  }
});
