/* The BattleManager manages the battle.
 * it contains the player and enemies and all active and dead text fragments
 * 
 * TODO: In keeping things consistent, wherever I use backbone models, the 
 * things that are contained within should also be backbone models.  In that
 * vein, Text fragments, enemies, and the player stored here should be 
 * backbone models, not crafty entities.  Entities may be referenced through
 * their respective models.
 */

Typewar.Models.BattleManager = Backbone.Model.extend({
  defaults: {
    active_text_fragments: [],
    fragment_graveyard: [],
    live_text_fragments: []
  },

  initialize: function (){
    if(!this.has('player')) {
      throw "BattleManager initialized without player entity";
    }
    if(!this.has('enemies')) {
      throw "BattleManager initialized without enemies array";
    }

    this._bindEventListeners();
    this._setupBattleAI();
  },

  calculateDamage: function(opts) {
    //stub for now, should eventually do some math
    return 2;
  },

  deallocate: function (){
    this._unbindAllListeners();
    this._cleanupLiveFragments();
    this._cleanupActiveFragments();
    this._cleanupFragmentGraveyard();
    this.clear();
  },

  getLiveFragments: function (){
    return this.get("live_text_fragments");
  },

  getActiveTextFragments: function (){
    return this.get("active_text_fragments") || [];
  },

  /* Callback for when a text fragment is completed. 
   * TODO: This should be renamed
   */
  handleFragmentCompleted: function (data){
    var text_fragment, player, player_ent;

    player = this.get('player');
    player_ent = player.getEntity();
    text_fragment = data.text_fragment;

    if(text_fragment.attacker == player_ent){
      this._resolveAttack(text_fragment);
    }else if(text_fragment.defender == player_ent){
      this._resolveDefense(text_fragment);
    }

    this._removeActiveFragment(text_fragment);
  },

  handleFragmentMissed: function (data){
    var fragment, player, player_ent;

    fragment = ( data['text_fragment'] ? data['text_framgent'] : data );
    player = this.get('player');
    player_ent = player.getEntity();

    if(fragment.attacker == player_ent){
      //console.log("DEBUG: player fragment went off screen");
    }else if(fragment.defender == player_ent){
      //console.log("DEBUG: monster fragment went off screen");
      this._resolveDefense(fragment);
    }

  },

  handleTextInput: function (letter_value){
    var active_fragments, live_fragments, self, duped_fragments;

    self = this;
    live_fragments = this.getLiveFragments();
    active_fragments = this.getActiveTextFragments();

    // If there are no active fragments, loop over live fragments and see if
    // any match the pressed key
    if(_.isEmpty(active_fragments)){
      this._ensureLiveFragmentsClean();
      duped_fragments = live_fragments.slice(0);
      _.each(duped_fragments, function (curr_frag){
        if(curr_frag.matchFirstChar(letter_value)){
          curr_frag.activate();
          curr_frag.takeInput(letter_value);
        }
      });
    }else{
      // NOTE: this algorithm allows the following edge case:
      // When multiple fragments are 'active' starting with the same text, e.g.
      // 'fool' and 'foolish'.  If you type 'foox', it will deactivate all but 
      // one of the active text fragments.  This might be acceptable, and we 
      // can use this to encourage accuracy by banging out combos.
      if(active_fragments.length > 1) {                // if multiple fragments active
        _.each(active_fragments, function (curr_frag){ // send text input to all active fragments
          if(!curr_frag.takeInput(letter_value)){ 
            curr_frag.reset()                          // deactivate any which have incorrect input
            self._removeFromArray(active_fragments, curr_frag);
            live_fragments.push(curr_frag);       // move fragment from active back to live
          }
        });
      }else{
        active_fragments[0].takeInput(letter_value);
      }
    }
  },

  /* Takes a fragment and keeps a reference to it within the manager */
  registerFragment: function (text_fragment){
    this.get("live_text_fragments").push(text_fragment);
  },

  // private

  _bindEventListeners: function (){
    this._setupCompletedFragmentListener();
    this._setupFragmentActivatedListener();
    this._setupFragmentExitStageListener();
    this._setupNPCDiedListener();
    this._setupPlayerDiedListener();
  },

  _cleanupActiveFragments: function (){
    this.unset("active_text_fragments");
  },

  _cleanupFragmentGraveyard: function (){
    this.unset("fragment_graveyard");
  },

  _cleanupLiveFragments: function (){
    this.unset("live_text_fragments"); // NOTE: TESTME__ Is this sufficient? or should we call deallocate on each fragment?
  },

  /* sweeps through text fragments registered with this manager and removes
   * any that are already completed or have exited the play field or are 
   * invalid or have been wiped out etc.
   * discard fragments that are complete
   * or have collided with the other side (TBI)
   */
  _ensureLiveFragmentsClean: function (){
    //TODO: Implement me
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

  // This belongs in underscore or something, need to move this somewhere 
  // appropriate
  _removeFromArray: function (array, item){
    var index;

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

  /* LEFT OFF~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   * HERE Lies the latest issue: self.get('player')
   * returns a backbone model as is required.
   * self.get('enemies') should return an array of backbone models
   * but instead returns an array of crafty entities. I need to
   * trace back where that is being set and fix it.
   */
  _setupBattleAI: function (){
    var self, playerEntity, targetEntity;
    self = this;

    _.each(this.get("enemies"), function (e){
      e.setTarget(self.get("player"));
      e.activateAI();
    }); 

    playerEntity = this.get("player").getEntity();
    targetEntity = this.get("enemies")[0].getEntity();

    playerEntity.setTarget(targetEntity);
    playerEntity.activateAutoAttack();
  },

  _setupCompletedFragmentListener: function (){
    Crafty.bind("TextFragmentCompleted", this.handleFragmentCompleted.bind(this));
  },

  // Move the fragment from the live set to the active fragments set
  _setupFragmentActivatedListener: function (){
    var self, fragment, live_fragments_set, active_fragments_set;

    self = this;
    Crafty.bind("TextFragmentActivated", function (evt){
      live_fragments_set = self.get("live_text_fragments");
      active_fragments_set = self.get("active_text_fragments");
      fragment = self._removeFromArray(live_fragments_set, evt)     // remove the fragment from the live array
      active_fragments_set.push(evt);                           // add the fragment to the active array
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

      self.handleFragmentMissed(fragment);

      if(self._removeFromArray(live_fragments, fragment)){
        //console.log("DEBUG: Removing fragment from LIVE to graveyard XXXXXXXXXXXXXX");
        fragment.deactivate();
        graveyard.push(fragment);
      }else if(self._removeFromArray(active_fragments, fragment)){
        //console.log("DEBUG: Removing fragment from active to graveyard XXXXXXXXXXXXXX");
        fragment.deactivate();
        graveyard.push(fragment);
      }else if(_.contains(graveyard, fragment)){
        //console.log("DEBUG: found the fragment in the graveyard, this is probably double searching somehwere");
      } else {
        throw "ERROR: fragment not found within active or live fragments" + evt;
      }
    });
  }, 

  _setupPlayerDiedListener: function (){
    Crafty.bind("PlayerDied", function (e){
      Typewar.battleOver(false);
    });
  },

  // For now this just assumes monster dead = battle over
  _setupNPCDiedListener: function (){
    Crafty.bind("NPCDied", function (e){
      Typewar.battleOver(true);
    });
  }
});
