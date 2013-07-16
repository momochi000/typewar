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
      fragment.defender.takeDamage(2);
    } else if(fragment.successPct() > 90){
      fragment.defender.partialHit();
      fragment.defender.takeDamage(1);
    } else {
      fragment.defender.wasMissed();
    }
  },

  _resolveDefense: function (fragment){
    fragment.attacker.deliverAttack();
    if(fragment.wasPerfect()){
      fragment.defender.successfulDefense();
    } else if(fragment.successPct() > 90){
      fragment.defender.partialHit();
      fragment.defender.takeDamage(1);
    } else {
      fragment.defender.successfulHit();
      fragment.defender.takeDamage(2);
    }
  },
});
