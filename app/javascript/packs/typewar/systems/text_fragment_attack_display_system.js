export function initTextFragmentAttackDisplaySystem(Crafty) { }

export function textFragmentAttackDisplaySystem(Crafty) {
  var displayable_attacks, completed_displayable_attacks;

  displayable_attacks = Crafty("TextFragment TextFragmentAttackDisplay").get();

  completed_displayable_attacks = _.filter(displayable_attacks, (curr) => {
    return curr.isComplete();
  });

  _.each(completed_displayable_attacks, (curr) => {
    curr.cleanupView();
  });
}
