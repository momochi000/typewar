function initSkillSystem(Crafty) {
  var skill_managers;


  skill_managers = Crafty("SkillManager").get();

  _.each(skill_managers, (curr_skill_manager) => {
    curr_skill_manager.prepareSkills();
    curr_skill_manager.render();
  });
}

function skillSystem(Crafty) { 
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
    //    console.log("DEBUG: SKILL SYSTEM PROCESSING, some skill should be run... ----> ",curr_entity);
    curr_entity.processed();
    executeSkill(curr_entity);
    // reset the text fragment
  });
}

// locals

//function resolveAttack(attack_object){
//  var fragment;
//
//  fragment =  attack_object.text_fragment;
//  if(fragment.wasPerfect()){
//    attack_object.target.successfulHit();
//    attack_object.target.takeDamage(2);
//  } else if(fragment.successPct() > 90){
//    attack_object.target.partialHit();
//    attack_object.target.takeDamage(1);
//  } else {
//    attack_object.target.wasMissed();
//  }
//}

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

    console.log("DEBUG: SKILL SYSTEM PROCESSING, About to execute skill effect ---------", effect_klass, skill_args);
    effect_klass.execute(skill_args);
  });
}

export {initSkillSystem, skillSystem}
