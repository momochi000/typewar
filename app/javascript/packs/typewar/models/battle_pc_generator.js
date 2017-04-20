import {DUMMY_TEXT_LIBRARY} from "../constants/dummy_text"

require("../components/characters/battle/BattleCharacterComponent");
require("../components/characters/battle/BattlePlayerComponent");
require("../components/animations/BattlePlayerZeroAnimation");
require("../components/BattleStance");
require("../components/BattleStatusView");

export default function battlePCGenerator(characterData) {
  var pc_components, pc_ent, pc_model, promise;

  pc_components = "2D, DOM, BattleEffectable, BattleCharacter, BattlePlayer, PlayerSkillManager, Collision, BattleStatus, BattleStance";
  pc_components += ", "+characterData.spriteFrame;
  pc_components += ", "+characterData.animationComponent;

  pc_ent = Crafty.e(pc_components);
  pc_ent
    .attr({w: characterData.width, h: characterData.height})
    .battleCharacter(characterData.charSheet)
    .battlePlayer()
    .battleStatus()
    .collision(new Crafty.polygon(characterData.hitbox));

  pc_ent[_.lowerFirst(characterData.animationComponent)].call(pc_ent);

  return getFromServer(pc_ent);
}

function getFromServer(entity){
  return obtainVocabularyFromServer(entity);
}

function obtainVocabularyFromServer(entity){
  if(window.serverCaller){
    return serverCaller.getVocabulariesPromise().then(( data, textStatus, jqXHR ) => {
      entity.charSheet.data.vocabulary = data;
      return entity;
    });
  }else{
    return new Promise(function (fulfill, reject){
      entity.charSheet.data.vocabulary = DUMMY_TEXT_LIBRARY;
      fulfill(entity);
    });
  }
}
