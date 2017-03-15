// This system handles player defense of text fragment attacks
export function initDefendableSkillSystem() {
}

export function defendableSkillSystem(Crafty) {
  var defendable_attacks, completed_defendable_attacks;

  defendable_attacks = Crafty("TextFragment DefendableAttack").get();

  completed_defendable_attacks = _.filter(defendable_attacks, (curr) => {
    return curr.isComplete();
  });

  _.each(completed_defendable_attacks, (curr_attack) => {
    removeAttack(curr_attack);
  });
}

function removeAttack(attack_entity) {
  attack_entity.destroy();
}
