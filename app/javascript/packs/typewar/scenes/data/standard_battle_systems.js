import {initBattleEffectSystem, battleEffectSystem} from "../../systems/battle_effect_system"
import {initBattleStatusSystem, battleStatusSystem, teardownBattleStatusSystem} from "../../systems/battle_status_system"
import {initInputSystem, inputSystem} from "../../systems/input_system"
import {initPlayerSkillSystem, playerSkillSystem} from "../../systems/player_skill_system"
import {initNPCSkillSystem, npcSkillSystem} from "../../systems/npc_skill_system"
import {initNPCAISystem, nPCAISystem} from "../../systems/npc_ai_system"
import {initProjectileSystem, projectileSystem} from "../../systems/projectile_system"
import {initTriggerEffectOnCollideSystem, triggerEffectOnCollideSystem} from "../../systems/trigger_effect_on_collide_system"
import {initDefendableSkillSystem, defendableSkillSystem} from "../../systems/defendable_skill_system"
import {initTextFragmentAttackDisplaySystem, textFragmentAttackDisplaySystem} from "../../systems/text_fragment_attack_display_system"
import {initAudioSystem, audioSystem, teardownAudioSystem} from "../../systems/audio_system"
import {npcDiedPlayerWinSystem} from "../../systems/npc_died_player_win_system"
import {playerDieLoseSystem} from "../../systems/player_die_lose_system"
import {initParticleSystem, particleSystem} from "../../systems/particle_system"

var standardBattleSystems = {
  initializers:[
    {system: initAudioSystem, options: {audioData: ["audio"]}},
    {system: initBattleStatusSystem},
    {system: initInputSystem},
    {system: initPlayerSkillSystem},
    {system: initNPCSkillSystem},
    {system: initNPCAISystem},
    {system: initParticleSystem}
  ],
  runners:[
    {system: inputSystem},
    {system: playerSkillSystem},
    {system: npcSkillSystem},
    {system: nPCAISystem},
    {system: textFragmentAttackDisplaySystem},
    {system: defendableSkillSystem},
    {system: projectileSystem},
    {system: triggerEffectOnCollideSystem},
    {system: battleEffectSystem},
    {system: battleStatusSystem},
    {system: particleSystem},
    {system: audioSystem},
    {system: npcDiedPlayerWinSystem},
    {system: playerDieLoseSystem},
  ],
  cleanup:[
    {system: teardownBattleStatusSystem},
    {system: teardownAudioSystem}
  
  ]
}

export default standardBattleSystems
