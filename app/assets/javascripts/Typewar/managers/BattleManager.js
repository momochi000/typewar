/* The BattleManager. It manages the battle
 * contains the player and enemies and all active and dead text fragments
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
    if(!this.has('side1')){
      throw "BattleManager initialized without side 1";
    }
    if(!this.has('side2')){
      throw "BattleManager initialized without side 2";
    }

    this._bindEventListeners();
    this._setupBattleAI();
  },

  calculateDamage: function(opts) { //stub for now, should eventually do some math
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

  /* Handles an attack between battle entities
   * This happens before a text fragment is generated and helps to set up the
   * text fragment appropriately before sending it flying.
   */
  handleAttack: function (options){
    var attacker, defender, attack, 
      text_frag_options;
      
    if(!options.attacker){throw "BattleManager: handleAttack called with no attacker";}
    if(!options.defender){throw "BattleManager: handleAttack called with no defender";}
    if(!options.attack)  {throw "BattleManager: handleAttack called with no attack specified";}
    attacker = options.attacker;
    defender = options.defender;
    attack = options.attack; 

    
    // Run it through the battle analyzer to modify the various attributes of 
    // the text fragment options from differences between stats plus modifiers
    // followed by equipment
    // For example: attacker speed 20, defender speed 1: increase speed of the 
    // fragment by some multiplier if the attacker is not the player.  If it is
    // the player, then decrease speed by some multiplier.  Due to the 
    // complexity and multitude of edge cases in these calculations, this
    // behavior must be extrated out into the battle analyzer

    // this.BattleAnalyzer.analyze(attacker, defender, environment);

    text_frag_options = _.deepClone(attack)
    text_frag_options.attacker = attacker;
    text_frag_options.defender = defender;
    // For now just grab a random word, later we'll need to select text based
    // on some properties of the attack
    next_text = attacker._getWordFromVocabulary();
    if(next_text) {text_frag_options.text = next_text;}
    if(this._isSide1(attacker)) { 
      text_frag_options.direction = 1;
    }else{
      text_frag_options.direction = -1;
    }
    //text_frag_options.difficulty_multiplier = 0.01;
    return text_frag_options;
  },

  // Callback for when a text fragment is completed.
  handleFragmentCompleted: function (text_fragment){
    var player, player_ent;

    player = this.get('side1')[0];
    player_ent = player.getEntity();

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
    player = this.get('side1')[0];
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
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // TODO: ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ ON MASTER ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // There's a bug here where if 2 fragments are active, for example
        // foolish
        // foolhardy
        // you'll type 'fool' and both fragments will be active
        // then you type 'h' expecting the first fragment to deactivate
        // and the second fragment to highlight 'foolh'
        // However, foolish will deactivate but nothing will happen with 
        // foolhardy.
        // To fix this, we just need to duplicate the active_fragments array
        // before iterating over it. In the same way a bug was solved in the
        // above block.
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
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
    duped_fragments = null; //deallocate
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
    this._setupFragmentHitEntityListener();
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

  /* Sweep through text fragments registered with this manager and removes
   * any that are already completed or have exited the play field or are 
   * invalid or have been wiped out etc. Discard fragments that are complete
   * or have collided with the other side (TBI)
   */
  _ensureLiveFragmentsClean: function (){
    //TODO: Implement me
  },

  _handleTextFragmentCollision: function (evt){
    var defender, text_fragment;

    text_fragment = evt.text_fragment;
    defender = text_fragment.defender;
    if(defender.isPlayer()){ // Determine who got hit & resolve combat
      this._resolveDefense(text_fragment);
    }else{
      this._resolveAttack(text_fragment);
    }
    this._moveFragmentToGraveyard(text_fragment); // Clear the text fragment
  },

  _isSide1: function (entity){
    var side1_ents, side2_ents;
    side1_ents = _.map(this.get("side1"), function (model){ return model.getEntity() });
    side2_ents = _.map(this.get("side2"), function (model){ return model.getEntity() });
    if(_.contains(side1_ents, entity)){
      return true;
    }else if(_.contains(side2_ents, entity)){
      return false;
    }else{
      throw "ERROR: private method isSide1 in BattleManager called with invalid argument: is neither side 1 or 2";
    }
  },

  _moveFragmentToGraveyard: function (fragment, evt){
    var live_fragments, active_fragments, graveyard;

    live_fragments = this.get("live_text_fragments");
    active_fragments = this.get("active_text_fragments");
    graveyard = this.get("fragment_graveyard");
    if(this._removeFromArray(live_fragments, fragment)){
      //console.log("DEBUG: Removing fragment from LIVE to graveyard XXXXXXXXXXXXXX");
      fragment.deactivate();
      graveyard.push(fragment);
    }else if(this._removeFromArray(active_fragments, fragment)){
      //console.log("DEBUG: Removing fragment from active to graveyard XXXXXXXXXXXXXX");
      fragment.deactivate();
      graveyard.push(fragment);
    }else if(_.contains(graveyard, fragment)){
      //console.log("DEBUG: found the fragment in the graveyard, this is probably double searching somehwere");
    } else {
      throw "ERROR: fragment not found within active or live fragments";
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
   * HERE Lies the latest issue: self.get('side1') and self.get('side2')
   * returns a backbone model as is required.
   * self.get('enemies') should return an array of backbone models
   * but instead returns an array of crafty entities. I need to
   * trace back where that is being set and fix it.
   */
  _setupBattleAI: function (){
    var self, playerEntity, targetEntity;

    self = this;
    playerEntity = this.get("side1")[0].getEntity();
    targetEntity = this.get("side2")[0].getEntity();
    _.each(this.get("side2"), function (e){
      var e_ent;
      e_ent = e.getEntity();
      e_ent.setTarget(playerEntity);
      //e_ent.activateAI();
    }); 

    playerEntity.setTarget(targetEntity);
    //playerEntity.activateAutoAttack();
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
    var self;

    self = this;

    Crafty.bind("TextFragmentExitedStage", function (evt){
      var index, fragment;

      fragment = evt.text_fragment;
      self.handleFragmentMissed(fragment);
      self._moveFragmentToGraveyard(fragment);
    });
  }, 

  _setupFragmentHitEntityListener: function (){
    Crafty.bind("TextFragmentHitUnit", this._handleTextFragmentCollision.bind(this));
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
  },

  _unbindAllListeners: function (){
    Crafty.unbind("TextFragmentCompleted");
    Crafty.unbind("TextFragmentActivated");
    Crafty.unbind("TextFragmentExitedStage");
    Crafty.unbind("TextFragmentHitUnit");
    Crafty.unbind("PlayerDied");
    Crafty.unbind("NPCDied");
  }
});
