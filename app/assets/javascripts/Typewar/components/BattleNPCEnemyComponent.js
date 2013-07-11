/* A component specifically for enemies encountered in Typewar's battle system
 * This is the base component, other child components are made up of specific
 * monsters or enemy types and require this component, calling methods from it.
 */

Crafty.c("BattleNPCEnemy", {
  _text_fragment_spawner: null,
  char_sheet: null,

  init: function (){
    this.requires("2D, SpriteAnimation");
  },

  battleNPCEnemy: function (char_sheet){
    this.char_sheet = char_sheet || new Typewar.Models.CharacterSheet;
    this._text_fragment_spawner = this._createFragmentSpawner();
    this.attach(this._text_fragment_spawner);
    Crafty.bind("TextFragmentCompleted", this.textFragmentCompleted);
    return this;
  },

  attack: function (){
    this._text_fragment_spawner.generateTextFragment(null, [-10, 0]);
  },

  textFragmentCompleted: function (e){
    console.log("DEBUG: DETECTED A TEXT FRAGMENT COMPLETE");
    console.log(e);
  },

  //delete: function (){
  //  Crafty.unbind("TextFragmentCompleted", this.textFragmentCompleted);
  //  this._text_fragment_spawner.destroy();
  //  this.destroy();
  //},
  
  //private 
  _createFragmentSpawner: function (){
    return Crafty.e("2D, TextFragmentSpawner")
      .attr({x: this._x, y: this._y})
      .textFragmentSpawner();
  }
});
