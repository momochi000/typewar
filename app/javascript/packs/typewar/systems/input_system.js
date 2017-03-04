import { CMD_CHANGE_STANCE } from "../util/command_constants"
require("../components/BattleInput");

function initInputSystem(Crafty) {
  Crafty("BattlePlayer").addComponent("BattleInput").battleInput(); // STATE CHANGE
}

function inputSystem(Crafty) {
  var input_entities, input_entity, input_queue, text_fragment_entities,
    active_text_fragments, text_frag_ents_with_matching_input;

  input_entities = Crafty("BattleInput BattleStance").get();

  if(input_entities.length < 1) {
    throw new Error("Running input system where no entity with BattleInput component exists");
  }

  input_entity = input_entities[0];
  input_queue = input_entity.getInputQueue();

  // no input ready
  if(input_queue.length == 0) { return; }

  input_queue.forEach((currInput) => {
    if(input_entity.isStance("offense")){
      text_fragment_entities = Crafty("TextFragment BattlePCSkillTextFragment").get();
    }else if(input_entity.isStance("defense")){
      text_fragment_entities = Crafty("TextFragment").get();
    }else{
      throw new Error("Input entity is in an invalid stance");
    }

    // TODO: When a text fragment is complete add TextFragmentComplete and remove TextFragment
    // filter completed text fragments
    text_fragment_entities = _.filter(text_fragment_entities, (curr) => {
      return !curr.isComplete();
    });

    active_text_fragments = _.filter(text_fragment_entities, (curr) => {
      return curr.isActive();
    });

    if(currInput == CMD_CHANGE_STANCE) {
      changeStance(input_entity, active_text_fragments);
      return;
    }

    if(_.isEmpty(active_text_fragments)) {
      // find out which text fragments to activate and apply input to them
      text_frag_ents_with_matching_input = _.filter(text_fragment_entities, (curr) => {
        return curr.matchFirstChar(curr_input);
      });
      text_frag_ents_with_matching_input.forEach((curr) => {
        curr.activate(); // STATE CHANGE
        curr.takeInput(curr_input); // STATE CHANGE
      });
    }else{
      active_text_fragments.forEach((curr) => {
        curr.takeInput(curr_input); // STATE CHANGE
      });
    }
  });
}

function changeStance(inputEntity, activeTextFragments){
  activeTextFragments.forEach((curr) => {
    curr.deactivate();  // STATE CHANGE
  });
  inputEntity.toggleStance(); // STATE CHANGE
}

export {initInputSystem, inputSystem}

