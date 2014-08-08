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
    //if(!this.has('side1')){ throw "BattleManager initialized without side 1"; }
    //if(!this.has('side2')){ throw "BattleManager initialized without side 2"; }

    this._setupModeFSM();
    this._bindEventListeners();
    //this._setupBattleAI();
  },

  calculateDamage: function(opts) { // Stub for now, should eventually do some math
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
    if(!options.skill)  {throw "BattleManager: handleAttack called with no attack specified";}
    attacker = options.attacker;
    defender = options.defender;
    skill = options.skill; 

    // Run it through the battle analyzer to modify the various attributes of 
    // the text fragment options from differences between stats plus modifiers
    // followed by equipment
    // For example: attacker speed 20, defender speed 1: increase speed of the 
    // fragment by some multiplier if the attacker is not the player.  If it is
    // the player, then decrease speed by some multiplier.  Due to the 
    // complexity and multitude of edge cases in these calculations, this
    // behavior must be extrated out into the battle analyzer

    // this.BattleAnalyzer.analyze(attacker, defender, environment);

    text_frag_options = _.deepClone(skill)
    text_frag_options.attacker = attacker;
    text_frag_options.defender = defender;
    // For now just grab a random word, later we'll need to select text based
    // on some properties of the attack
   
    next_text = this._getWordFromVocabulary(attacker.getVocabulary(), text_frag_options.text_options);
    if(next_text) {text_frag_options.text = next_text;}
    if(this._isSide1(attacker)) { 
      text_frag_options.direction = 1;
    }else{
      text_frag_options.direction = -1;
    }
    text_frag_options.difficulty_multiplier = 0.2;
    return text_frag_options;
  },

  // Callback for when a text fragment is completed.
  handleFragmentCompleted: function (attack_object){
    var player_ent, text_fragment;

    /* TODO: this needs to be refactored as the player may not necessarily be
     * side 1. There should be a smarter and more elegant method of obtaining 
     * the player character
     */
    player_ent = this._getPlayerEntity();
    text_fragment = attack_object.text_fragment;

    if(attack_object.attacker == player_ent){
      this._resolveAttack(attack_object);
    }else if(attack_object.target == player_ent){
      this._resolveDefense(attack_object);
    }

    this._removeActiveFragment(text_fragment);
  },

  handleTextInput: function (letter_value){
    if(this.mode.is("defense")){
      this._evalDefense(letter_value);
    }else if (this.mode.is("offense")){
      this._evalOffense(letter_value);
    }
  },

  getMode: function (){
    return this.mode.current;
  },

  prepareSkill: function (options){
    if(!options.attacker){throw "BattleManager: prepareSkill called with no attacker";}
    if(!options.skill)  {throw "BattleManager: prepareSkill called with no attack specified";}
    attacker = options.attacker;
    // defender = options.defender; // currently not used, but maybe later..?
    skill = options.skill; 

    return this._getWordFromVocabulary(attacker.getVocabulary(), skill.text_options);
  },

  registerEnemies: function (entities){
    this.set("side2", entities);
  },

  /* Takes a fragment and keeps a reference to it within the manager */
  registerFragment: function (text_fragment){
    this.get("live_text_fragments").push(text_fragment);
  },

  registerPlayer: function (entity){
    this.set("side1", [entity]);
  },

  resolveAttack: function (attack_object){
    var fragment;

    fragment =  attack_object.text_fragment;
    if(fragment.wasPerfect()){
      attack_object.target.successfulHit();
      attack_object.target.takeDamage(2);
    } else if(fragment.successPct() > 90){
      attack_object.target.partialHit();
      attack_object.target.takeDamage(1);
    } else {
      attack_object.target.wasMissed();
    }
  },

  toggleMode: function (){
    this.mode.toggle();
    return this.mode.current;
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

  _evalDefense: function (letter_value){
    var self, active_fragments, live_fragments, duped_fragments;

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
      if(active_fragments.length > 1) {                // if multiple fragments active
        duped_fragments = active_fragments.slice(0);
        _.each(duped_fragments, function (curr_frag){ // send text input to all active fragments
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

  _evalOffense: function (letter_value){
    this._getPlayerEntity().takeInput(letter_value);
  },

  /* Sweep through text fragments registered with this manager and removes
   * any that are already completed or have exited the play field or are 
   * invalid or have been wiped out etc. Discard fragments that are complete
   * or have collided with the other side (TBI)
   */
  _ensureLiveFragmentsClean: function (){
    //TODO: Implement me
  },

  _getPlayer: function (){
    return this.get("side1")[0];
  },

  _getPlayerEntity: function (){
    return this.get("side1")[0].getEntity();
  },

  _getWordFromVocabulary: function (vocab, options){
    var output;
    options = options || {};

    output = Typewar.Util.TextLibrarian.retrieve(vocab, options);
    return output;
  },

  _handleTextFragmentCollision: function (evt){ // Event data coming in is expected to be an AttackObject
    var attack_obj;

    attack_obj = evt;
    if(attack_obj.target.isPlayer()){ // Determine who got hit & resolve combat
      this._resolveDefense(attack_obj);
    }else{
      this._resolveAttack(attack_obj);
    }
    this._moveFragmentToGraveyard(attack_obj.text_fragment);
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

  _resolveDefense: function (attack_obj){
    var fragment;
    fragment = attack_obj.text_fragment;
    if(fragment.wasPerfect()){
      attack_obj.target.successfulDefense();
    } else if(fragment.successPct() >= 88){
      attack_obj.target.partialHit();
      attack_obj.target.takeDamage(1);
    } else {
      attack_obj.target.successfulHit();
      attack_obj.target.takeDamage(2);
    }
  },

  /* TODO: REFACTOR
   * Here lies an issue: self.get('side1') and self.get('side2')
   * returns a backbone model as is required.
   * self.get('enemies') should return an array of backbone models
   * but instead returns an array of crafty entities. I need to
   * trace back where that is being set and fix it.
   */
  _setupBattleAI: function (){
    this._setupPlayerAI();
    this._setupEnemyAI();
  },

  _setupCompletedFragmentListener: function (){
    Crafty.bind("BattleNPCAttackCompleted", this.handleFragmentCompleted.bind(this));
  },

  _setupEnemyAI: function (){
    var playerEntity, targetEntity;

    targetEntity = this.get("side2")[0].getEntity();
    playerEntity = this._getPlayerEntity();
    _.each(this.get("side2"), function (e){
      var e_ent;
      e_ent = e.getEntity();
      e_ent.setTarget(playerEntity);
      e_ent.activateAI();
    }); 
  },

  // Move the fragment from the live set to the active fragments set
  _setupFragmentActivatedListener: function (){
    var self, fragment, live_fragments_set, active_fragments_set;

    self = this;
    Crafty.bind("TextFragmentActivated", function (evt){
      live_fragments_set = self.get("live_text_fragments");
      active_fragments_set = self.get("active_text_fragments");
      fragment = self._removeFromArray(live_fragments_set, evt)  // remove the fragment from the live array
      if(fragment){ active_fragments_set.push(evt); }            // add the fragment to the active array
    });
  },

  _setupFragmentExitStageListener: function (){
    var self;

    self = this;
    Crafty.bind("TextFragmentExitedStage", function (evt){
      self._moveFragmentToGraveyard(evt.text_fragment);
    });
  }, 

  _setupFragmentHitEntityListener: function (){
    Crafty.bind("TextFragmentHitUnit", this._handleTextFragmentCollision.bind(this));
  },

  _setupModeFSM: function (){
    var fsm, self;
    self=this;
    fsm = StateMachine.create({
      initial: "defense",
      events: [
        { name: "toggle", from: "defense", to: "offense" },
        { name: "toggle", from: "offense", to: "defense" }
        //{ name: "toggle", from: "offense", to: "inventory" },
      ],
      callbacks: {
        onafterevent:   function (event, from, to){ Crafty.trigger("SwitchedCombatMode", to); }
      }
    });
    this.mode = fsm;
  },

  _setupPlayerAI: function (){
    var playerEntity, targetEntity;

    playerEntity = this._getPlayerEntity();
    targetEntity = this.get("side2")[0].getEntity();
    playerEntity.setTarget(targetEntity);
    playerEntity.prepareSkills();
  },

  //TODO: battleOver needs to be fleshed out more
  //  contact the server
  //  expose battle end conditions (player win/lose?)
  //  send typing/battle data to server
  //    Collect all typing data from text fragments which were typed.
  //    we can just stub this out for now.
  //  Transition to a battle over scene
  //
  //////////////////////////////////////////////////
  _setupPlayerDiedListener: function (){
    Crafty.bind("PlayerDied", function (e){
      Typewar.Engine.battlemanager.transition("victory");
    });
  },

  // For now this just assumes monster dead = battle over
  _setupNPCDiedListener: function (){
    Crafty.bind("NPCDied", function (e){
      Typewar.Engine.battlemanager.transition("defeat");
    });
  },

  _unbindAllListeners: function (){
    Crafty.unbind("BattleNPCAttackCompleted");
    Crafty.unbind("TextFragmentActivated");
    Crafty.unbind("TextFragmentExitedStage");
    Crafty.unbind("TextFragmentHitUnit");
    Crafty.unbind("PlayerDied");
    Crafty.unbind("NPCDied");
  }
});
