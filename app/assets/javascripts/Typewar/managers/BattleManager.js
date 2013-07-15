//Can eventually refactor this to be multiple entities
// TODO: Make this into a backbone model
TypewarGame.BattleManager = function(text_fragment) {
  this.attacker = text_fragment.attacker;
  this.defender = text_fragment.defender;
  this.fragment = text_fragment;

  Crafty.bind("TextFragmentCompleted", _.bind(this.handleAttack, this));
}

_.extend(TypewarGame.BattleManager.prototype, {
  handleAttack: function(data) {
//    if(data.parent === this.entityTwo) {
//      this.entityOne.deliverAttack();
//      this.entityTwo.handleBeingAttacked(data);
//      
//      var damage = this.calculateDamage({
//        attacker: this.entityOne,
//        defender: this.entityTwo
//      });
//
//      this.entityTwo.takeDamage(damage);
//    } else {
//      this.entityTwo.deliverAttack();
//      this.entityOne.handleBeingAttacked(data);
//
//      var damage = this.calculateDamage({
//        attacker: this.entityTwo,
//        defender: this.entityOne
//      });
//
//      this.entityOne.takeDamage(damage);
//    }
  },

  calculateDamage: function(opts) {
    //stub for now, should eventually do some math
    return 2;
  }
});
