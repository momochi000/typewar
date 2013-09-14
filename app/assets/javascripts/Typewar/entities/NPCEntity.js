var global_enemy; // DEBUG;

/* NPC Entity model.
 * TODO: rename this to NPCBattleEntity. It is tied strongly to
 * the battle component and should only be used in a battle scene.
 *
 * Currently will try to get a random monster from the server on init. 
 * Initialize with {skip_fetch: true} to not do that.
 */
var NPCEntity = BaseEntity.extend({
  defaults: { },
  urlRoot: '/characters',

  initialize: function (){
    var entity, self;
    self = this;
    
    entity = Crafty.e("2D, DOM, BattleNPCEnemy, BattleSlimeAnim, NPCBrain, slime_st0")
      .attr({x: 390, y: 210})
      .nPCBrain()
      .battleSlimeAnim()
      .battleNPCEnemy();
    global_enemy = entity; // DEBUG:

    if(!this.has('skip_fetch')) { this.getFromServer() };


    /* LEFT OFF: 
     * Got the server to send back a monster with some data.  
     * Everything should just work from here.
     * Seems to be a problem before starting the battle, I
     * think I broke something earlier between character
     * creation and battle start/initialization
     * It's complaining about (ultimately) enemies not being
     * initialized when initializing battle manager.
     * however I know I was passing in both.
     * 
     * I speculate the server doesn't respond in time to build
     * the character in time for the battle manager init.
     * or more accurately, the code marches on while the server
     * is being contacted/responding.
     * 
     * What I want to try next is doing a lock for 5 seconds or 
     * until the server responds
     */
    self.set('entity', entity);
    return this;
  },

  activateAI: function (){
    this.getEntity().activateAI();
  },
  deactivateAI: function (){
    this.getEntity().deactivateAI();
  },

  getFromServer: function (){
    var self;

    self = this;

    //console.log("DEBUG: in get from server, about to fetch()");
    //console.log("DEBUG: do we have a url: "+ this.url + " what about urlRoot? : " + this.urlRoot);
    
    this.fetch({
      success: function (model, response){
        console.log("DEBUG: SUCCESSFUL GET FROM SERVER< WHAT DID WE GET?? => ");
        console.log(model);
        console.log(response);
        //self.get('entity').char_sheet = response.char_sheet
        // edit the attached entity according to the data in here
      },
      error: function (model, response, options){
        console.log("DEBUG: error, ");
      }
    });
  },

  /* Convenience wrapper to call the entity's setTarget method,
   * Expects backbone model as the target
   * TODO: This could probably move to the base model
   * on the other hand, base model is extremely bare bones. Instead
   * there should be a battle Entity model that inherits from
   * base which this then inherits from. The battle base gets
   * set target.
   */
  setTarget: function (target){
    console.log("DEBUG: in NPCENTITY.setTarget()");
    console.log("DEBUG: THIS => ");
    console.log(this);
    console.log(this.getEntity());
    console.log("DEBUG: TARGET => ")
    console.log(target);
    console.log(target.getEntity());

    console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&");
    this.getEntity().setTarget(target.getEntity());
  }

});
