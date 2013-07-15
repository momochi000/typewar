TypewarGame.BattleManager = function(entityOne, entityTwo) {
  this.entityOne = entityOne;
  this.entityTwo = entityTwo;

  Crafty.bind("TextFragmentCompleted", _.bind(this.handleAttack, this));
}

_.extend(TypewarGame.BattleManager.prototype, {
  handleAttack: function(data) {
    if(data.parent === this.entityTwo) {
      this.entityOne.deliverAttack();
      this.entityTwo.handleBeingAttacked(data);
    } else {
      this.entityTwo.deliverAttack();
      this.entityOne.handleBeingAttacked(data);
    }
  }
});
