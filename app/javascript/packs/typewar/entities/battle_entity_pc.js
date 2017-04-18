import BattleEntityBase from "./battle_entity_base"
import CharacterSheet from "../models/character_sheet"
import * as ZeroSkills from "../models/skills/player/zero_active_skills"
import ServerCaller from "../util/server_caller"
import {DUMMY_TEXT_LIBRARY} from "../constants/dummy_text"



export default class BattleEntityPC extends BattleEntityBase {

  constructor(opts) {
    console.log("DEBUG: at start of BattleEntityPC#constructor() ...");
    super(opts);
    this.urlRoot = '/characters/players'; // TODO: Marked for deletion?
    console.log("DEBUG: made it to the end of BattleEntityPC#constructor() ...");
  }

  getFromServer() { // stub for now..
    var self = this;

    self._loadPlayer();
    return this._obtainVocabularyFromServer();
  }

  //private

  // This vocabulary should come from the server, for now we'll load a test 
  // one here in js
  _generatedVocabulary() {
    return DUMMY_TEXT_LIBRARY;
  }

  // Instead of grabbing the player from the server, we'll just load it from 
  // some fixture in javascript
  _loadPlayer() {  // TODO: Marked for deletion
    var char_sheet, self;

    if(this._entity.charSheet) { return; }
    self = this;
    char_sheet = new CharacterSheet({
      name: "player 1",
      stats: {
        level: 1,
        str: 1, 
        spd: 1, 
        sta: 1, 
        dex: 1, 
        int: 1, 
        cha: 1, 
        wis: 1
      },
      skills: [
        ZeroSkills.ZeroLightSlash,
        ZeroSkills.ZeroMedSlash,
        ZeroSkills.ZeroHardSlash, 
        ZeroSkills.ZeroUpperSlash
      ]
    });
    this._entity.charSheet = char_sheet
  }

  _obtainVocabularyFromServer(){
    var self;
    self = this;
    // do an ajax get 
    if(window.serverCaller){
      return serverCaller.getVocabulariesPromise().then(( data, textStatus, jqXHR ) => {
        self._entity.charSheet.data.vocabulary = data;
      });
    }else{
      return new Promise(function (fulfill, reject){
        self._entity.charSheet.data.vocabulary = self._generatedVocabulary();
        fulfill(this._entity);
      });
    }
  }
  //_processDataFromServer(resp){
  //  var char_sheet, properties, vocab, stats, name, status;

  //  vocab = this.get('vocabulary');
  //  stats = this.get('stats');
  //  status = this.get('status');
  //  properties = this.get('properties');
  //  name = resp.name;

  //  char_sheet = new Typewar.Models.CharacterSheet({
  //    name:       name || this.name, 
  //    status:     status,
  //    stats:      stats,
  //    vocabulary: vocab || this._generatedVocabulary()
  //  });

  //  this.getEntity().char_sheet = char_sheet;
  //  this.getEntity().updateStatus();
  //}
}
