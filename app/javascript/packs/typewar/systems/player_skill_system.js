require("../components/PlayerSkillManager");

function initPlayerSkillSystem(Crafty) {
  var player;

  player = Crafty("BattlePlayer").get();

  //  skill_managers = Crafty("PlayerSkillManager").get();

  _.each(player, (curr_player) => {
    curr_player.addComponent("PlayerSkillManager")
      .playerSkillManager(curr_player.charSheet.data.skills);
    curr_player.prepareSkills();
    curr_player.renderSkillManager();
  });
}

function playerSkillSystem(Crafty) { 
  var skill_entities, completed_skill_entities;

  // NOTE: There is a potential problem/issue here:
  // Querying for completed skills in this manner does not guarantee order
  // so in theory, if two skills trigger within the same execution frame
  // they could occur out of order.  It's probly such a small edge case that
  // it doesn't matter, but it's possible and worth noting in case it becomes
  // an issue...
  skill_entities = Crafty("BattlePCSkill TextFragment").get();
  completed_skill_entities = _.filter(skill_entities, (curr) => {
    return curr.isComplete();
  });

  _.each(completed_skill_entities, (curr_entity) => {
    curr_entity.processed();
    executeSkill(curr_entity);
  });
}

// locals

function executeSkill(skillEntity){
  var target;

  target = skillEntity.getTarget();

  _.each(skillEntity.skill.effects, (effectData) => {
    var effect_klass, effect_args, skill_args;

    effect_klass = effectData.klass
    effect_args = effectData;
    skill_args = {
      target: target,
      source: skillEntity.getOwner(),
      skill: skillEntity
    }
    skill_args = _.merge(skillEntity.getSkillDef(), skill_args, effect_args);

    console.log("DEBUG: PLAYER SKILL SYSTEM PROCESSING, About to execute skill effect --------->>", effect_klass, skill_args);
    effect_klass.execute(skill_args);
  });
}

export {initPlayerSkillSystem, playerSkillSystem}
