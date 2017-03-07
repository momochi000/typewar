import { CMD_CHANGE_STANCE } from "../constants/command_constants"
require("../components/BattleInput");

function initInputSystem(Crafty) {
  Crafty("BattlePlayer").addComponent("BattleInput").battleInput(); // STATE CHANGE
}

function inputSystem(Crafty) {
  var input_entities, input_entity, input_queue, text_fragment_entities;


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
      text_fragment_entities = Crafty("TextFragment BattlePCSkill").get();
    }else if(input_entity.isStance("defense")){
      text_fragment_entities = Crafty("TextFragment").get();
    }else{
      throw new Error("Input entity is in an invalid stance");
    }

    text_fragment_entities = _.filter(text_fragment_entities, (curr) => {
      return !curr.isComplete();
    });

    acceptInput(text_fragment_entities, currInput, input_entity);
  });

  input_entity.clearInputQueue();
}

function acceptInput(entities, input, inputEntity) {
  var active_text_fragments, receiving_correct_input, text_frag_ents_with_matching_input;

  active_text_fragments = _.filter(entities, (curr) => {
    return curr.isActive();
  });


  if(input == CMD_CHANGE_STANCE) {
    changeStance(inputEntity, active_text_fragments);
    return;
  }

  if(_.isEmpty(active_text_fragments)) {
    // find out which text fragments to activate and apply input to them
    text_frag_ents_with_matching_input = _.filter(entities, (curr_frag) => {
      return curr_frag.matchFirstChar(input);
    });

    text_frag_ents_with_matching_input.forEach((curr_frag) => {
      curr_frag.activate(); // STATE CHANGE
      curr_frag.acceptInput(input); // STATE CHANGE
    });
    return;
  }

  if(active_text_fragments.length == 1) {
    active_text_fragments[0].acceptInput(input);
    return;
  }

  // case: multiple active text fragments
  // rules: 
  // if none receive correct input, then do nothing (discard input)
  // if one receives correct input, advance that one and reset the others (cancel())
  // if multiple receives correct input, advance them all

  receiving_correct_input = _.filter(active_text_fragments, (curr) => {
    return curr.matchNextChar(input);
  });

  if(receiving_correct_input.length == 0){
    // TODO: for now do nothing, but eventually we should record an incorrect
    // input
  }else if(receiving_correct_input.length >= 1){
    //split active_text_fragments into those which are getting corect input
    //and those which are not, those which don't get cancel
    active_text_fragments.forEach((curr) => {
      if(curr.matchNextChar(input)){ // STATE CHANGE
        curr.acceptInput(input);
      }else{
        curr.cancel();
      }
    });
  }else{
    throw new Error("Error, something funky is going on here....");
  }
}

function changeStance(inputEntity, activeTextFragments){
  activeTextFragments.forEach((curr) => {
    curr.cancel();  // STATE CHANGE
  });
  inputEntity.toggleStance(); // STATE CHANGE
}

export {initInputSystem, inputSystem}
