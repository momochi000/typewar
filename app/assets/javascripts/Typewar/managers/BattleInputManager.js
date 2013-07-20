Typewar.Models.BattleInputManager = Backbone.Model.extend({
  initialize: function (){
    var input_manager;

    input_manager = Crafty.e("BattleInputManager")
      .battleInputManager();

    this.set("input_manager_entity", input_manager);
  }
});
