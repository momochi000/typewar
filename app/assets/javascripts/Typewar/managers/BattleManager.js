Typewar.Models.BattleManager = Backbone.Model.extend({
  defaults: {
    active_text_fragments: [],
    fragment_graveyard: [],
    live_text_fragments: [],
  },

  initialize: function (){
    if(!this.has('player')) {
      throw "BattleManager initialized without player entity";
    }
    if(!this.has('enemies')) {
      throw "BattleManager initialized without enemies array";
    }

    this._setupCompletedFragmentListener();
    this._setupActivatedFragmentListener();
    this._setupBattleAI();
  },

  calculateDamage: function(opts) {
    //stub for now, should eventually do some math
    return 2;
  },

  /* sweeps through text fragments registered with this manager and removes
   * any that are already completed or have exited the play field or are 
   * invalid or have been wiped out etc.
   * discard fragments that are complete
   * or have collided with the other side (TBI)
   */
  cleanupLiveFragments: function (){
    // TODO: implement me
  },

  getAllLiveFragments: function (){
    return this.get("live_text_fragments");
  },

  getActiveTextFragments: function (){
    return this.get("active_text_fragments") || [];
  },

  /* Callback for when a text fragment is completed. 
   * TODO: This should be renamed
   */
  handleFragmentCompleted: function (data){
    var text_fragment;

    text_fragment = data.text_fragment;
    
    if(text_fragment.attacker == this.get('player')){
      this._resolveAttack(text_fragment);
    }else if(text_fragment.defender == this.get('player')){
      this._resolveDefense(text_fragment);
    }

    this._removeActiveFragment(text_fragment);
  },

  /* Takes a fragment and keeps a reference to it within the manager */
  registerFragment: function (text_fragment){
    this.get("live_text_fragments").push(text_fragment);
  },

  // private

  _decideBattleAction: function (){
    var decider;

    decider = 10 * Math.random();

    if(decider > 6){
      this.get('player').initiateAttackOn(this.get('enemies')[0]);
    }else{
      this.get('enemies')[0].initiateAttackOn(this.get('player'));
    }
  },

  /* Move the given fragment, if it is present in the active_fragments array,
   * to the fragment_graveyard array
   * NOTE: Be wary of references to objects in the various collections 
   * reflecting the correct changes when they've happened to local pointers
   * here.  I'm not sure how things work with backbone.  Might want to look
   * into it if something mysteriously breaks around this bit.
   */
  _removeActiveFragment: function (fragment){
    var active_fragments, fragment_graveyard, self;
    self = this;
    active_fragments = this.get("active_text_fragments");
    fragment_graveyard = this.get("fragment_graveyard")

    index = _.indexOf(active_fragments, fragment);
    active_fragments.splice(index, 1);
    fragment_graveyard.push(fragment);
  },

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
  _setupBattleAI: function (){
    var battle_timer;

    battle_timer = window.setInterval(this._decideBattleAction.bind(this), 6000);
    //this.set("battle_timer", battle_timer);
  },

    // Add the newly activated fragment to the set of active fragments registered with the battle manager
  _setupActivatedFragmentListener: function (){
    var self = this;
    Crafty.bind("TextFragmentActivated", function (evt){
      self.get("active_text_fragments").push(evt);
    });
  },

  _setupCompletedFragmentListener: function (){
    Crafty.bind("TextFragmentCompleted", this.handleFragmentCompleted.bind(this));
  }
});


