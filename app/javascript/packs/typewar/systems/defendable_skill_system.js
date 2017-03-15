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
    playBlockAnim(curr_attack.getTarget());
    playBlockSound();
    removeAttack(curr_attack);
  });
}

//private 

function playBlockAnim(target) {
  if(!target.has("SpriteAnimation")){ return; }
  target.animBlock();
}

function playBlockSound() {
  // TODO: implement me
}

function removeAttack(attack_entity) {
  attack_entity.destroy();
}
