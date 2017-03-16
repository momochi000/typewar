export function initNPCSkillSystem(Crafty) {
  var skill_managers;

  skill_managers = Crafty("BattleNPCSkillManager").get();

  _.each(skill_managers, (curr_skill_manager) => {
    initSkillset(curr_skill_manager);
    initSkills(curr_skill_manager);
    initSkillQueue(curr_skill_manager);
  });

}

export function npcSkillSystem(Crafty) {
  var skill_managers = Crafty("BattleNPCSkillManager").get();

  _.each(skill_managers, (curr_skill_manager) => {
    var skill_queue;

    skill_queue = curr_skill_manager.getSkillQueue();
    if(skill_queue.length < 1) { return; }
    _.each(skill_queue, (triggered_skill) => {
      triggered_skill.activate();
      executeSkill(curr_skill_manager, triggered_skill);
    });
    curr_skill_manager.setSkillQueue([]);
  });
}

// private

function createSkillEntity(skill) {
  var new_skill;

  return Crafty.e("BattleNPCSkill")
    .battleNPCSkill(skill);
}

function executeSkill(sourceEntity, skill) {
  var target;

  target = sourceEntity.getTarget();

  _.each(skill.getSkillDef().effects, (effectData) => {
    var effect_klass, effect_args, skill_args;
    effect_klass = effectData.klass;
    effect_args = effectData;
    skill_args = {
      target: target,
      source: sourceEntity,
      skill: skill
    }

    skill_args = _.merge(skill_args, effect_args);
    console.log("DEBUG: NPC SKILL SYSTEM PROCESSING, About to execute skill effect --------->>", effect_klass, skill_args);
    effect_klass.execute(skill_args);
  });
}

function initSkills(entity) {
  var skillset, new_skills;

  skillset = entity.getSkillset();
  new_skills = [];

  _.each(skillset, (curr_skill) => {
    new_skills.push(createSkillEntity(curr_skill));
  });
  entity.setSkills(new_skills);
}

function initSkillset(entity) {
  var skills = entity.charSheet.data.skills;

  // NPC with  no skills, this is fine, they can just be a target dummy
  if(!skills || (skills.length < 1)) { return; }
  entity.setSkillset(skills);
}

function initSkillQueue(entity) {
  entity.setSkillQueue([]);
}
