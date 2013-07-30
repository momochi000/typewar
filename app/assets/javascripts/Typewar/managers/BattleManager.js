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
    this._setupFragmentActivatedListener();
    this._setupFragmentExitStageListener();
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

  // This belongs in underscore or something, need to move this somewhere 
  // appropriate
  _removeFromArray: function (array, item){
    var index;

    console.log("DEBUG: REMOVING ITEM FROM ARRAY");

    index = _.indexOf(array, item);
    if(index >= 0){
      array.splice(index, 1);
      return item;
    } else {
      return null;
    }
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
    var self = this;
    _.each(this.get("enemies"), function (e){
      e.setTarget(self.get("player"));
      e.activateAI();
    }); 

    this.get("player").setTarget(this.get("enemies")[0]);
    this.get("player").activateAutoAttack();

  },

  // Add the newly activated fragment to the set of active fragments registered with the battle manager
  _setupFragmentActivatedListener: function (){
    var self = this;
    Crafty.bind("TextFragmentActivated", function (evt){
      self.get("active_text_fragments").push(evt);
    });
  },

  _setupFragmentExitStageListener: function (){
    var self, live_fragments, active_fragments, graveyard;

    self = this;
    live_fragments = this.get("live_text_fragments");
    active_fragments = this.get("active_text_fragments");
    graveyard = this.get("fragment_graveyard");

    Crafty.bind("TextFragmentExitedStage", function (evt){
      var index, fragment;

      fragment = evt.text_fragment;
      console.log("========================================");
      console.log("DEBUG: Battle manager got TextFragmentExitedStage event");
      console.log(live_fragments);
      console.log(active_fragments);
      console.log(graveyard);
      console.log(fragment);
      console.log(evt);
      console.log("========================================");

      if(self._removeFromArray(live_fragments, fragment)){
        fragment.deactivate();
        console.log("DEBUG: moving deactivated live fragment to the graveyard");
        graveyard.push(fragment);
      }else if(self._removeFromArray(active_fragments, fragment)){
        fragment.deactivate();
        console.log("DEBUG: moving deactivated active fragment to the graveyard");
        graveyard.push(fragment);
      } else {
      // bug here, fragment not found in the right place.  Gotta check the collections
      // FOUND PROBLEM: the fragment collection is a set of backbone models 
      //   while the fragment that we get back from the event is a crafty entity.
      //   I knew this was going to bite me in the ass.. might be time to refactor the
      //   models out of it...
        throw "ERROR: fragment not found within active or live fragments" + evt;
      }
    });
  }, 

  _setupCompletedFragmentListener: function (){
    Crafty.bind("TextFragmentCompleted", this.handleFragmentCompleted.bind(this));
  }
});


