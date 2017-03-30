import BattleEntityBase from "./battle_entity_base"
import CharacterSheet from "../models/character_sheet"
import ServerCaller from "../util/server_caller"
import {SlimeStandardAttack, SlimeGlobAttack} from "../models/skills/npc/slime_skills"
import {DUMMY_TEXT_LIBRARY} from "../constants/dummy_text"

require("crafty");

export default class BattleEntityNPC extends BattleEntityBase {
  constructor(opts) {
    super(opts)
    this.urlRoot = '/characters/slimes';
  }

  getFromServer(){
    var self = this;
    
    this._loadNPC();
    return this._obtainVocabularyFromServer();
  }

  _generatedVocabulary(){
    return DUMMY_TEXT_LIBRARY;
  }

  _loadNPC() { // TODO: Marked for deletion
    var char_sheet, self;

    if(this._entity.charSheet) { return; }
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
      skills: [SlimeGlobAttack]
      //      skills: [SlimeStandardAttack, SlimeGlobAttack]
    });
    this._entity.charSheet = char_sheet;
  }

  _obtainVocabularyFromServer(){
    var self;
    self = this;
    // do an ajax get 
    if(window.serverCaller){
      return serverCaller.getVocabulariesPromise().then(( data, textStatus, jqXHR ) => {
        self._entity.charSheet.data.vocabulary = data
      });
    }else{
      return new Promise(function (fulfill, reject){
        self._entity.charSheet.data.vocabulary = self._generatedVocabulary();
        fulfill(this._entity);
      });
    }
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
