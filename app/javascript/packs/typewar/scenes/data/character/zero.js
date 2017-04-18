import * as ZeroSkills from "../../../models/skills/player/zero_active_skills"

const zero = {
  spriteId: "player_zero",
  spriteFrame: "plz_st0",
  animationComponent: "BattlePlayerZeroAnimation",
  width: 80,
  height: 72,
  hitbox: [20,0, 45,0, 45,75, 20,75],
  charSheet: {
    name: "player 1",
    properties: {
      blunt:    1, slashing: 1, piercing: 1,
      fire:     1, earth:    1, water:    1,
      air:      1, light:    1, dark:     1,
      poison:   1, life:     1, death:    1
    },
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
  }
};

export default zero
