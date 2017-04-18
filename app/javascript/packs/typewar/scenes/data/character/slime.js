import {SlimeStandardAttack} from "../../../models/skills/npc/slime_skills"

const slime = {
  spriteId: "slime",
  spriteFrame: "slime_st0",
  animationComponent: "BattleSlimeAnimation",
  width: 42, height: 42,
  hitbox: [0,0, 0,50, 50,60, 0,60],
  charSheet: {
    name:       "Slime",
    properties: {
      blunt:    1, slashing: 1, piercing: 1,
      fire:     1, earth:    1, water:    1,
      air:      1, light:    1, dark:     1,
      poison:   1, life:     1, death:    1
    },
    status: {
      hp: 2,
      maxHp: 10
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
    skills: [SlimeStandardAttack]
  },
}
export default slime
