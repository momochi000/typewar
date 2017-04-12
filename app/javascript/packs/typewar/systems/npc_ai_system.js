export function initNPCAISystem(Crafty) {
  var skills;
  skills = Crafty("BattleNPCSkill").get();
  _.each(skills, (curr_skill) => {
    curr_skill.activate();

    setTimeout(() => {
      curr_skill.prepare();
    }, curr_skill.getSkillDef().startupDelay);
  });
}

export function nPCAISystem(Crafty) {
  var npc_brains;

  npc_brains = Crafty("BattleNPCBrain BattleNPCSkillManager").get();

  _.each(npc_brains, (curr_npc_entity) => {
    var ready_skills;

    ready_skills = gatherReadySkills(curr_npc_entity);
    if(ready_skills.length < 1) { return; }

    _.each(ready_skills, (curr_skill) => {
      curr_npc_entity.getSkillQueue().push(curr_skill);
    });
  });
}

// this function has to be fast because it'll run every game frame and it's O(num_skills)
function gatherReadySkills(entity) {
  return _.filter(entity.getSkills(), (curr_skill) => {
    return(curr_skill.isReady());
  });
}
