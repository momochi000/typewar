/* TODO REFACTOR
 * This is set to get a major overhaul
*/
require("../components/BattleInputManagerComponent");

export default class BattleInputManager {
  constructor(battleManagerRef) { // REFACTOR the reference passed in here is just a quick and dirty fix while we get the game up and running again
    var input_manager;

    console.log("DEBUG: in BattleInputManager constructor...");
    input_manager = Crafty.e("BattleInputManager")
      .battleInputManager(battleManagerRef);

    this._inputManagerEntity = input_manager;
  }

  get inputManagerEntity(){
    return this._inputManagerEntity;
  }
}
