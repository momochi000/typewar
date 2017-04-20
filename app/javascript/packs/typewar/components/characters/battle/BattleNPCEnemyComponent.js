/* A component specifically for enemies encountered in Typewar's battle system
 * This is the base component, other child components are made up of specific
 * monsters or enemy types and require this component, calling methods from it.
 */
import CharacterSheet from "../../../models/character_sheet"

Crafty.c("BattleNPCSlime", {
  _ANIM_HIT_DELAY: 430,
  _ANIM_ATTACK_DELAY: 200,

  init: function (){
    this.requires("2D, SpriteAnimation, BattleCharacter");
  },

  battleNPCEnemy: function (charSheet){
    if(!this.charSheet) { 
      this.charSheet = new CharacterSheet({name :"Slime"});
    }
    this._fragment_timers = [];

    return this;
  },

  getStance: function (){
    return "offense";
  },

  isPlayer: function (){ return false; },
  isNPC: function (){ return true; },
});
