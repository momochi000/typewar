require("../components/BattleInputManagerComponent");

export default class BattleInputManager {
  constructor() {
    var input_manager;

    input_manager = Crafty.e("BattleInputManager")
      .battleInputManager();

    this._inputManagerEntity = input_manager;
  }

  get inputManagerEntity(){
    return this._inputManagerEntity;
  }
}
