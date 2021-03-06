import {DUMMY_TEXT_LIBRARY} from "../constants/dummy_text"

require("../components/characters/battle/BattleCharacterComponent");
require("../components/characters/battle/BattleNPCEnemyComponent");
require("../components/brains/NPCBrainComponent");
require("../components/animations/BattleSlimeAnimation");
require("../components/BattleStatusView");

export default function battleNPCGenerator(characterData) {
  var npc_components, npc_ent;

  npc_components = "2D, DOM, BattleEffectable, BattleCharacter, BattleNPC, BattleNPCSlime, NPCBrain, Collision, BattleStatus, BattleNPCBrain, BattleNPCSkillManager";
  npc_components += ", "+characterData.spriteFrame;
  npc_components += ", "+characterData.animationComponent;

  npc_ent = Crafty.e(npc_components);
  npc_ent
    .battleCharacter(characterData.charSheet)
    .battleNPCEnemy()
    .battleStatus()
    .battleNPCBrain()
    .collision(new Crafty.polygon(characterData.hitbox));

  npc_ent[_.lowerFirst(characterData.animationComponent)].call(npc_ent);

  return getFromServer(npc_ent);
}

function getFromServer(entity){
  return obtainVocabularyFromServer(entity);
}

function obtainVocabularyFromServer(entity){
  if(window.serverCaller){
    return serverCaller.getVocabulariesPromise().then(( data, textStatus, jqXHR ) => {
      entity.charSheet.data.vocabulary = data
      return entity;
    });
  }else{
    return new Promise(function (fulfill, reject){
      entity.charSheet.data.vocabulary = DUMMY_TEXT_LIBRARY;
      fulfill(entity);
    });
  }
}
