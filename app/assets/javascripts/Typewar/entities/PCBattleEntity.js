// TODO: Rename to BattleEntityPC and do the same for npc to keep it consistent
var PCBattleEntity = BaseEntity.extend({
  defaults: { },
  urlRoot: '/characters/players',

  initialize: function (){
    if(!this.has('entity')) { 
      throw new Error("Error: attempted to create a new PCBattle model without a crafty entity");
    }
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
          console.log("SUCCESSFULLY FETCHED PLAYER FROM SERVER.");
          self._processDataFromServer(response);
          fulfill(self.getEntity());
        },

        error: function (model, response, options) {
          console.log("ERROR OBTAINING PLAYER DATA FROM SERVER. RESPONSE WAS ==> ");
          console.log(response);
          console.log("model ====> ");
          console.log(model);
          reject(response);
        }
      });
    });
  },

  //private

  // This is going to go away, Using it now to test the new vocab structure
  _generatedVocabulary: function (){
    return JSON.parse("[{\"difficulty\":1,\"length\":7,\"text\":\"At vero\"},{\"difficulty\":1,\"length\":6,\"text\":\"eos et\"},{\"difficulty\":1,\"length\":18,\"text\":\"accusamus et iusto\"},{\"difficulty\":2,\"length\":4,\"text\":\"odio\"},{\"difficulty\":1,\"length\":46,\"text\":\"dignissimos ducimus qui blanditiis praesentium\"},{\"difficulty\":1,\"length\":39,\"text\":\"voluptatum deleniti atque corrupti quos\"},{\"difficulty\":2,\"length\":7,\"text\":\"dolores\"},{\"difficulty\":1,\"length\":7,\"text\":\"et quas\"},{\"difficulty\":1,\"length\":45,\"text\":\"molestias excepturi sint occaecati cupiditate\"},{\"difficulty\":2,\"length\":3,\"text\":\"non\"},{\"difficulty\":1,\"length\":22,\"text\":\"provident ,  similique\"},{\"difficulty\":2,\"length\":13,\"text\":\"sunt in culpa\"},{\"difficulty\":1,\"length\":29,\"text\":\"qui officia deserunt mollitia\"},{\"difficulty\":1,\"length\":5,\"text\":\"animi\"},{\"difficulty\":2,\"length\":1,\"text\":\",\"},{\"difficulty\":1,\"length\":14,\"text\":\"id est laborum\"},{\"difficulty\":1,\"length\":16,\"text\":\"et dolorum fuga.\"},{\"difficulty\":1,\"length\":33,\"text\":\"Et harum quidem rerum facilis est\"},{\"difficulty\":2,\"length\":22,\"text\":\"et expedita distinctio\"},{\"difficulty\":1,\"length\":13,\"text\":\".  Nam libero\"},{\"difficulty\":1,\"length\":31,\"text\":\"tempore ,  cum soluta nobis est\"},{\"difficulty\":1,\"length\":35,\"text\":\"eligendi optio cumque nihil impedit\"},{\"difficulty\":1,\"length\":9,\"text\":\"quo minus\"},{\"difficulty\":1,\"length\":7,\"text\":\"id quod\"},{\"difficulty\":1,\"length\":30,\"text\":\"maxime placeat facere possimus\"},{\"difficulty\":1,\"length\":31,\"text\":\",  omnis voluptas assumenda est\"},{\"difficulty\":2,\"length\":1,\"text\":\",\"},{\"difficulty\":1,\"length\":24,\"text\":\"omnis dolor repellendus.\"},{\"difficulty\":1,\"length\":42,\"text\":\"Temporibus autem quibusdam et aut officiis\"},{\"difficulty\":1,\"length\":32,\"text\":\"debitis aut rerum necessitatibus\"},{\"difficulty\":1,\"length\":19,\"text\":\"saepe eveniet ut et\"},{\"difficulty\":1,\"length\":27,\"text\":\"voluptates repudiandae sint\"},{\"difficulty\":1,\"length\":16,\"text\":\"et molestiae non\"},{\"difficulty\":1,\"length\":34,\"text\":\"recusandae. Itaque earum rerum hic\"},{\"difficulty\":1,\"length\":27,\"text\":\"tenetur a sapiente delectus\"},{\"difficulty\":1,\"length\":41,\"text\":\",  ut aut reiciendis voluptatibus maiores\"},{\"difficulty\":1,\"length\":21,\"text\":\"alias consequatur aut\"},{\"difficulty\":1,\"length\":32,\"text\":\"perferendis doloribus asperiores\"},{\"difficulty\":1,\"length\":8,\"text\":\"repellat\"}]");
  },

  _processDataFromServer: function (resp){
    var char_sheet, properties, vocab, stats, name, status;

    vocab = this.get('vocabulary');
    stats = this.get('stats');
    status = this.get('status');
    properties = this.get('properties');
    name = resp.name;

    char_sheet = new Typewar.Models.CharacterSheet({
      name:       name || this.name, 
      status:     status,
      stats:      stats,
      vocabulary: vocab || this._generatedVocabulary()
    });

    this.getEntity().char_sheet = char_sheet;
    this.getEntity().updateStatus();
  }
});
