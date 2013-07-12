Crafty.c("BattlePlayer", {
  char_sheet: null,

  init: function (){
    this.requires("2D, BattlePlayerAnimation");
  },

  battlePlayer: function (char_sheet){
    var self = this;

    this.char_sheet = char_sheet || new Typewar.Models.CharacterSheet;
    Crafty.bind("TextFragmentCompleted", function (e){
      console.log("DEBUG: Player received TextFragmentCompleted event");
      self.attack();
    });
    return this;
  },

  attack: function (){
    this.animAttack();
    // deal damage to target?
    // build up special meter?
  }
});
