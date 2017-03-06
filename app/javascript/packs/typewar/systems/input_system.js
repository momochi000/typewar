import { CMD_CHANGE_STANCE } from "../constants/command_constants"
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

  //  console.log("DEBUG: INPUT SYSTEM PROCESSING>..... LOOPING OVER INPUT QUEUE ---> ", input_queue);
  input_queue.forEach((currInput) => {
    if(input_entity.isStance("offense")){
      //      console.log("DEBUG: INPUT SYSTEM PROCESSING> in offensive stance");
      text_fragment_entities = Crafty("TextFragment BattlePCSkill").get();
      //      console.log("DEBUG: INPUT SYSTEM PROCESSING> relavent text fragment entities obtained ---> ", text_fragment_entities);
    }else if(input_entity.isStance("defense")){
      //      console.log("DEBUG: INPUT SYSTEM PROCESSING> in defensive stance");
      text_fragment_entities = Crafty("TextFragment").get();
    }else{
      throw new Error("Input entity is in an invalid stance");
    }

    // TODO: When a text fragment is complete add TextFragmentComplete and remove TextFragment
    // filter completed text fragments
    text_fragment_entities = _.filter(text_fragment_entities, (curr) => {
      return !curr.isComplete();
    });
    //    console.log("DEBUG: INPUT SYSTEM PROCESSING> Filtering for incomplete text fragments ---> ", text_fragment_entities);

    active_text_fragments = _.filter(text_fragment_entities, (curr) => {
      return curr.isActive();
    });
    //    console.log("DEBUG: INPUT SYSTEM PROCESSING> Filtering for active text fragments ---> ", active_text_fragments);

    if(currInput == CMD_CHANGE_STANCE) {
      changeStance(input_entity, active_text_fragments);
      return;
    }

    if(_.isEmpty(active_text_fragments)) {
      // find out which text fragments to activate and apply input to them
      text_frag_ents_with_matching_input = _.filter(text_fragment_entities, (curr_frag) => {
        return curr_frag.matchFirstChar(currInput);
      });

      text_frag_ents_with_matching_input.forEach((curr_frag) => {
        curr_frag.activate(); // STATE CHANGE
        curr_frag.acceptInput(currInput); // STATE CHANGE
      });
    }else{
      active_text_fragments.forEach((curr_frag) => {
        if(curr_frag.acceptInput(currInput)){ // STATE CHANGE
        }else{
          // LEFT OFF ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
          // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
          // Here's the situation:
          // skill typing and activation seems to work ok
          // cooldown cycling also seems to work.
          // The issue I was working on is that skill canceling isn't working
          //
          // If you have 2 skills that activate at the same time
          // once you keep typing one of them, the other one should cancel
          // and return to a ready state without changing the text
          //
          // There's also teh issue that if 2 skills have identical text
          // if you start typing them, then press a wrong key, it should not
          // bail out of both of them.
          //
          // I think i'll need to revive the code i had before as it was trying to be smart
          // about handling all the edge cases. I've pasted it down below
          //
          //
          //
          //
          //
          //  takeInput: function (input){
          //    var active_skills, ready_skills;
          //
          //    if(this._anyActiveSkills()){
          //      active_skills = this._getActiveSkills();
          //      if(active_skills.length > 1){ // if 2 or more active, match the next letter and deactivate if next letter doesn't match
          //        // Check if any single skill matches
          //        if(this._anySkillsMatchInput(active_skills, input)){
          //          // If progress is made in a skill but another has a typo, bail out of that other one.
          //          _.each(active_skills, function(skill){
          //            if(skill.takeInput(input)){  // correct input
          //            }else{ //incorrect input
          //              skill.fsm.cancel(); // TODO: knowing about the fsm here is a smell and should be refactored
          //            }
          //          });
          //        }
          //      }else{ // if 1 active, match the next letter or accept typo.
          //        active_skills[0].takeInput(input)
          //      }
          //    }else{ // if none active, find those that start with the matching letter
          //      ready_skills = this._getReadySkills();
          //      _.each(ready_skills, function(skill){
          //        if(skill.matchFirstChar(input)){
          //          skill.takeInput(input)
          //          skill.fsm.start();
          //        };
          //      });
          //    }
          //  },
          //
          // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
          // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

          curr_frag.cancel();
        }
      });
    }
  });

  input_entity.clearInputQueue();
}

function changeStance(inputEntity, activeTextFragments){
  activeTextFragments.forEach((curr) => {
    curr.deactivate();  // STATE CHANGE
  });
  inputEntity.toggleStance(); // STATE CHANGE
}

export {initInputSystem, inputSystem}
