import BattleEntityBase from "./battle_entity_base"
import CharacterSheet from "../models/character_sheet"
import {SlimeStandardAttack} from "../models/skills/npc/slime_skills"

require("crafty");

const TEST_VOCABULARY = "[{\"difficulty\":1,\"length\":7,\"text\":\"At vero\"},{\"difficulty\":1,\"length\":6,\"text\":\"eos et\"},{\"difficulty\":1,\"length\":18,\"text\":\"accusamus et iusto\"},{\"difficulty\":2,\"length\":4,\"text\":\"odio\"},{\"difficulty\":1,\"length\":46,\"text\":\"dignissimos ducimus qui blanditiis praesentium\"},{\"difficulty\":1,\"length\":39,\"text\":\"voluptatum deleniti atque corrupti quos\"},{\"difficulty\":2,\"length\":7,\"text\":\"dolores\"},{\"difficulty\":1,\"length\":7,\"text\":\"et quas\"},{\"difficulty\":1,\"length\":45,\"text\":\"molestias excepturi sint occaecati cupiditate\"},{\"difficulty\":2,\"length\":3,\"text\":\"non\"},{\"difficulty\":1,\"length\":22,\"text\":\"provident ,  similique\"},{\"difficulty\":2,\"length\":13,\"text\":\"sunt in culpa\"},{\"difficulty\":1,\"length\":29,\"text\":\"qui officia deserunt mollitia\"},{\"difficulty\":1,\"length\":5,\"text\":\"animi\"},{\"difficulty\":2,\"length\":1,\"text\":\",\"},{\"difficulty\":1,\"length\":14,\"text\":\"id est laborum\"},{\"difficulty\":1,\"length\":16,\"text\":\"et dolorum fuga.\"},{\"difficulty\":1,\"length\":33,\"text\":\"Et harum quidem rerum facilis est\"},{\"difficulty\":2,\"length\":22,\"text\":\"et expedita distinctio\"},{\"difficulty\":1,\"length\":13,\"text\":\".  Nam libero\"},{\"difficulty\":1,\"length\":31,\"text\":\"tempore ,  cum soluta nobis est\"},{\"difficulty\":1,\"length\":35,\"text\":\"eligendi optio cumque nihil impedit\"},{\"difficulty\":1,\"length\":9,\"text\":\"quo minus\"},{\"difficulty\":1,\"length\":7,\"text\":\"id quod\"},{\"difficulty\":1,\"length\":30,\"text\":\"maxime placeat facere possimus\"},{\"difficulty\":1,\"length\":31,\"text\":\",  omnis voluptas assumenda est\"},{\"difficulty\":2,\"length\":1,\"text\":\",\"},{\"difficulty\":1,\"length\":24,\"text\":\"omnis dolor repellendus.\"},{\"difficulty\":1,\"length\":42,\"text\":\"Temporibus autem quibusdam et aut officiis\"},{\"difficulty\":1,\"length\":32,\"text\":\"debitis aut rerum necessitatibus\"},{\"difficulty\":1,\"length\":19,\"text\":\"saepe eveniet ut et\"},{\"difficulty\":1,\"length\":27,\"text\":\"voluptates repudiandae sint\"},{\"difficulty\":1,\"length\":16,\"text\":\"et molestiae non\"},{\"difficulty\":1,\"length\":34,\"text\":\"recusandae. Itaque earum rerum hic\"},{\"difficulty\":1,\"length\":27,\"text\":\"tenetur a sapiente delectus\"},{\"difficulty\":1,\"length\":41,\"text\":\",  ut aut reiciendis voluptatibus maiores\"},{\"difficulty\":1,\"length\":21,\"text\":\"alias consequatur aut\"},{\"difficulty\":1,\"length\":32,\"text\":\"perferendis doloribus asperiores\"},{\"difficulty\":1,\"length\":8,\"text\":\"repellat\"}]";

export default class BattleEntityNPC extends BattleEntityBase {
  constructor(opts) {
    super(opts)
    this.urlRoot = '/characters/slimes';
  }

  getFromServer(){
    var self = this;
    
    return new Promise(function (fulfill, reject){
      // self.fetch({
      //   success: function (model, response){
      //     console.log("SUCCESSFULLY FETCHED NPC FROM SERVER");
      //     self.processDataFromServer(response);
      //     fulfill(self.getEntity());
      //   },
      //   error: function (model, response, options){
      //     console.log("ERROR: error obtaining npc data from server. Response was ==>");
      //     console.log(response);
      //     reject();
      //   }
      // });
      self._loadNPC();
      fulfill(self._entity);
    });
  }

  _generatedVocabulary(){
    return JSON.parse(TEST_VOCABULARY);
  }

  _loadNPC() {
    var char_sheet, self;
    self = this;

    char_sheet = new CharacterSheet({
      name:       "Slime",
      properties: {
        blunt:    1,
        slashing: 1,
        piercing: 1,
        fire:     1,
        earth:    1,
        water:    1,
        air:      1,
        light:    1,
        dark:     1,
        poison:   1,
        life:     1,
        death:    1
      },
      status: {
        hp: 20
      },
      stats: {
        level: 0,
        str: 0, 
        spd: 0, 
        sta: 0, 
        dex: 0, 
        int: 0, 
        cha: 0, 
        wis: 0
      },
      vocabulary: self._generatedVocabulary(),
      skills: [SlimeStandardAttack]
    });
    this._entity.charSheet = char_sheet;
  }

  /* processDataFromServer(JSON response)
   * Loads data passed from the server into self.  
   * Ideally, fetch would just do the right thing, but I don't
   * feel like wrestling with it to get it to work right now
   * so this method will do for now.
   * NOTE: status seemed to come back from the server ok (got set as a json)
   * meanwhile, vocabulary and stats got set as strings
   */
  //    processDataFromServer: function (resp){
  //    var char_sheet, properties, vocab, stats, name, status;
  //
  //    name = resp.name;
  //    char_sheet = new Typewar.Models.CharacterSheet({
  //      name:       name || this.name, 
  //      properties: this.get('properties'),
  //      status:     this.get('status'),
  //      stats:      this.get('stats'),
  //      vocabulary: this.get('vocabulary'),
  //      skills:     this.get('skills')
  //    });
  //
  //    this.getEntity().char_sheet = char_sheet;
  //    this.getEntity().updateStatus();
  //  },
}
