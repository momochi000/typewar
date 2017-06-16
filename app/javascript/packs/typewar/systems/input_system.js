import {CMD_CHANGE_STANCE} from "../constants/command_constants"

require("../components/BattleInput");

export function initInputSystem(Crafty) { 
  Crafty("BattlePlayer").addComponent("BattleInput").battleInput(); // STATE CHANGE
}

export function inputSystem(Crafty) {
  var input_entities, input_entity, input_queue, text_fragment_entities;

  input_entities = Crafty("BattleInput BattleStance").get();

  if(input_entities.length < 1) { return; }

  input_entity = input_entities[0];
  input_queue = input_entity.getInputQueue();

  if(input_queue.length == 0) { return; } // no input ready

  input_queue.forEach((currInput) => {

    if(processCommandInput(currInput, input_entity)){ return; }

    text_fragment_entities = getRelevantTextFragmentsBasedOnStance(input_entity);
    text_fragment_entities = filterOutCompleteTextFrags(text_fragment_entities);
    text_fragment_entities = filterOutCoolingTextFrags(text_fragment_entities);
    text_fragment_entities = filterOutProcessedTextFrags(text_fragment_entities);

    processInput(currInput, text_fragment_entities);
  });

  input_entity.clearInputQueue();
}

// private

function cancelActiveTextFragments() {
  var active_text_frags;

  active_text_frags = filterActiveTextFrags(Crafty("TextFragment").get());
  active_text_frags.forEach((curr_frag) => {
    curr_frag.cancel();
  });
}

function changeStance(inputEntity) {
  cancelActiveTextFragments();
  inputEntity.toggleStance(); // STATE CHANGE
  // TODO: refactor: push a stance change into the effect queue
  inputEntity.setStatusDirty();
}

function getSkillFragmentEntities() {
  return Crafty("TextFragment BattlePCSkill").get();
}

function getDefendableFragmentEntities() {
  return Crafty("TextFragment DefendableAttack").get();
}

function getRelevantTextFragmentsBasedOnStance(inputEntity) {
  if(inputEntity.isStance("offense")){
    return getSkillFragmentEntities();
  }else if(inputEntity.isStance("defense")){
    return getDefendableFragmentEntities();
  }else{
    throw new Error("Input entity is in an invalid stance");
  }

}

function filterActiveTextFrags(textFragmentEntities) {
  return _.filter(textFragmentEntities, (curr) => {
    return curr.isActive();
  });
}

function filterOutCompleteTextFrags(textFragmentEntities) {
  return _.filter(textFragmentEntities, (curr) => {
    return !curr.isComplete();
  });
}

function filterOutCoolingTextFrags(textFragmentEntities) {
  return _.filter(textFragmentEntities, (curr) => {
    return !curr.isCooling();
  });
}

function filterOutProcessedTextFrags(textFragmentEntities) {
  return _.filter(textFragmentEntities, (curr) => {
    return !curr.isProcessed();
  });
}

function processCommandInput(input, inputEntity){
  switch(input){
    case(CMD_CHANGE_STANCE):
      changeStance(inputEntity);
      return true;
    default:
      return false;
  }
}


function processInput(input, applicableTextFrags){
  var active_text_fragments, receiving_correct_input, text_frags_with_matching_input;

  active_text_fragments = filterActiveTextFrags(applicableTextFrags);

  if(_.isEmpty(active_text_fragments)) { // case: no active text fragments
    // find out which text fragments to activate and apply input to them
    text_frags_with_matching_input = _.filter(applicableTextFrags, (curr_frag) => {
      return curr_frag.matchFirstChar(input);
    });

    text_frags_with_matching_input.forEach((curr_frag) => {
      curr_frag.activate(); // STATE CHANGE
      curr_frag.acceptInput(input); // STATE CHANGE
    });
    return;
  }

  if(active_text_fragments.length == 1) { // case: 1 active text fragment
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
