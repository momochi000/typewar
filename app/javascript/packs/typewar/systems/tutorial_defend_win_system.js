/* Game system which manages the second tutorial stage where the player learns
 * to defend against text fragment attacks.
 * */
require("../components/DefenseTutorial");

import {SCENE_TRANSITION_EVT, BATTLE_VICTORY_COND} from "../constants/scene_constants";

export function initTutorialDefendWinSystem(Crafty){
  Crafty.e("DefenseTutorial").defenseTutorial(5);
}

export function tutorialDefendWinSystem(Crafty){
  var tutorial_defense_ent, completed_frags;

  tutorial_defense_ent = Crafty("DefenseTutorial");

  completed_frags = _.filter(Crafty("TextFragment DefendableAttack").get(), (curr_frag) => {
    return curr_frag.isComplete();
   });
  if(completed_frags.length >= 1){
    tutorial_defense_ent.incrementDefendedCount();
  }

  if(tutorial_defense_ent.getDefendedCount() >= tutorial_defense_ent.getDefenseGoal()){
    Crafty.trigger(SCENE_TRANSITION_EVT, BATTLE_VICTORY_COND);
  }
}

export function teardownTutorialDefendWinSystem(Crafty){
  _.each(Crafty("DefenseTutorial").get(), (curr) => {
    curr.destroy();
  });
}