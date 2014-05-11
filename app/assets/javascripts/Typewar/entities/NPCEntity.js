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
  urlRoot: '/characters/slimes',

  initialize: function (){
    var entity, self;
    self = this;
    
    entity = Crafty.e("2D, DOM, BattleCharacter, BattleNPCEnemy, BattleSlimeAnim, BattleSlime, NPCBrain, slime_st0, Collision")
      .attr({x: 390, y: 210, w: 42, h: 42 })
      .battleCharacter()
      .battleSlimeAnim()
      .battleNPCEnemy()
      .battleSlime()
      .nPCBrain()
      .collision([0,0],[0,50],[50,60],[0,60]);
    global_enemy = entity; // DEBUG:

    if(!this.has('skip_fetch')) { this.getFromServer() };

    /* Warning:
     * Got the server to send back a monster with some data.  
     * Everything should just work from here.
     *
     * I worry the server can't respond in time to build
     * the character in time for the battle manager init.
     * or more succinctly, the code marches on while the server
     * is being contacted/responding.
     *
     * This isn't causing a problem now locally, but keep an eye on
     * this for possible problems in the future
     */
    self.set('entity', entity);
    return this;
  },

  deallocate: function (){
    this.getEntity().destroy();
    this.clear();
  },

  getFromServer: function (){
    var self = this;
    
    this.fetch({
      success: function (model, response){
        console.log("SUCCESSFULLY FETCHED NPC FROM SERVER");
        self.processDataFromServer(response);
      },
      error: function (model, response, options){
        console.log("DEBUG: error obtaining npc data from server. Response was ==>");
        console.log(response);
      }
    });
  },

  /* processDataFromServer(JSON response)
   * Loads data passed from the server into self.  
   * Ideally, fetch would just do the right thing, but I don't
   * feel like wrestling with it to get it to work right now
   * so this method will do for now.
   * NOTE: status seemed to come back from the server ok (got set as a json)
   * meanwhile, vocabulary and stats got set as strings
   */
  processDataFromServer: function (resp){
    var char_sheet, properties, vocab, stats, name, status;

    name = resp.name;
    char_sheet = new Typewar.Models.CharacterSheet({
      name:       name || this.name, 
      properties: this.get('properties'),
      status:     this.get('status'),
      stats:      this.get('stats'),
      vocabulary: this.get('vocabulary'),
      skills:     this.get('skills')
    });

    this.getEntity().char_sheet = char_sheet;
    this.getEntity().updateStatus();
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
    this.getEntity().setTarget(target.getEntity());
  }
});
