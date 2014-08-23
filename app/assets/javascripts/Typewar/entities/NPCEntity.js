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
    return this;
  },

  deallocate: function (){
    this.clear();
  },

  getFromServer: function (){
    var self = this;
    
    return new Promise(function (fulfill, reject){
      self.fetch({
        success: function (model, response){
          console.log("SUCCESSFULLY FETCHED NPC FROM SERVER");
          self.processDataFromServer(response);
          fulfill(self.getEntity());
        },
        error: function (model, response, options){
          console.log("ERROR: error obtaining npc data from server. Response was ==>");
          console.log(response);
          reject();
        }
      });
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
   * Upon more thought, this should not exist here.
   */
  setTarget: function (target){
    this.getEntity().setTarget(target.getEntity());
  }
});
