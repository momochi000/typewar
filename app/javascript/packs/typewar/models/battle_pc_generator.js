require("crafty");
require("../components/characters/battle/BattleCharacterComponent");
require("../components/characters/battle/BattlePlayerComponent");
require("../components/animations/BattlePlayerZeroAnimation");
require("../components/BattleStance");
require("../components/BattleStatusView");

export default function battlePCGenerator(characterData) {
  var pc_components, pc_ent, pc_model, promise;

  pc_components = "2D, DOM, BattleEffectable, BattleCharacter, BattlePlayer, PlayerSkillManager, Collision, BattleStatus, BattleStance";
  pc_components += ", "+characterData.spriteId;
  pc_components += ", "+characterData.animationComponent;

  pc_ent = Crafty.e(pc_components);
  pc_ent
    .battleCharacter(characterData.charSheet)
    .battlePlayer()
    .battleStatus()
    .collision(new Crafty.polygon(characterData.hitbox));

  pc_ent[_.lowerFirst(characterData.animationComponent)].call(pc_ent);

  return pc_ent;
}
