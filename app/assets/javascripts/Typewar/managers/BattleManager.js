//Can eventually refactor this to be multiple entities
// TODO: Make this into a backbone model
TypewarGame.BattleManager = function() {
  Crafty.bind("TextFragmentCompleted", _.bind(this.handleAttack, this));
}

_.extend(TypewarGame.BattleManager.prototype, {
  handleAttack: function(data) {
    var text_fragment;

    text_fragment = data.text_fragment;
    console.log("DEBUG:handling attack with data => ");
    console.log(data);

    if(text_fragment.type == 'attack'){
      this._resolveAttack(text_fragment);
    }else if(text_fragment.type == 'defense'){
      this._resolveDefense(text_fragment);
    }


    //if(text_fragment.isAttack()){
    //  this._resolveAttack(text_fragment);
    //}else if(text_fragment.isDefense()){
    //  this._resolveDefense(text_fragment);
    //}


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
  },

  // private
  _resolveAttack: function (fragment){
    fragment.attacker.deliverAttack();
    if(fragment.wasPerfect()){
      fragment.defender.successfulHit();
      fragment.defender.takeDamage();
    }else if(fragment.successPct() > 90){
      fragment.defender.partialHit();
      fragment.defender.takeDamage();
    } else {
      fragment.defender.wasMissed();
    }
  },

  _resolveDefense: function (fragment){
    fragment.attacker.deliverAttack();
    if(fragment.wasPerfect()){
      fragment.defender.successfulDefense();
    }
  },
});
