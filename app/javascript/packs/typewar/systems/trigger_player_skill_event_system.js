import {PLAYER_USED_SKILL_EVT} from "../constants/scene_constants"

export function triggerPlayerSkillEventSystem(Crafty){
  var skill_entities, completed_skill_entities;

  skill_entities = Crafty("BattlePCSkill TextFragment").get();
  completed_skill_entities = _.filter(skill_entities, (curr) => {
    return curr.isComplete();
  });

  _.each(completed_skill_entities, (curr_entity) => {
    Crafty.trigger(PLAYER_USED_SKILL_EVT);
  });
}
