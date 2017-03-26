require("crafty");
require("../components/characters/battle/BattleCharacterComponent");
require("../components/characters/battle/BattleNPCEnemyComponent");
require("../components/brains/NPCBrainComponent");
require("../components/animations/BattleSlimeAnimation");
require("../components/BattleStatusView");

export default function battleNPCGenerator(characterData) {
  var npc_components, npc_ent;

  npc_components = "2D, DOM, BattleEffectable, BattleCharacter, BattleNPCSlime, NPCBrain, Collision, BattleStatus, BattleNPCBrain, BattleNPCSkillManager"
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

  return npc_ent;
}
