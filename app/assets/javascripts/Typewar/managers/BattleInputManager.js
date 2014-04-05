Typewar.Models.BattleInputManager = Backbone.Model.extend({
  initialize: function (){
    var input_manager;

    input_manager = Crafty.e("BattleInputManager")
      .battleInputManager();

    this.set("input_manager_entity", input_manager);
  },

  deallocate: function (){
    // LEFT OFF ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Implement me
    // Then after committing all the changes, refactor me to be
    // set as Typewar.Engine.inputmanager.
    // The class should be BattleInputManager as above but the 
    // instance of the class should be lowercase
    this.get("input_manager_entity").deallocate();
    this.unset("input_manager_entity");
  }
});
