import {CMD_CHANGE_STANCE} from "../constants/command_constants"
import {PLAYER_SWITCHED_TO_OFFENSE_EVT} from "../constants/scene_constants"

export function triggerPlayerSwitchedToOffenseEventSystem(Crafty){
  var input_entities, input_entity, input_queue;

  input_entities = Crafty("BattleInput BattleStance").get();

  if(input_entities.length < 1) { return; }

  input_entity = input_entities[0];
  input_queue = input_entity.getInputQueue();

  if(input_queue.length == 0) { return; } // no input ready

  input_queue.forEach((currInput) => {
    if(currInput == CMD_CHANGE_STANCE) {
      Crafty.trigger(PLAYER_SWITCHED_TO_OFFENSE_EVT);
    }
  });

}
