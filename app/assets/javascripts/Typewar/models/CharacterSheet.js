/* The character sheet encapsulates all the standard RPG data about a PC or NPC
 * It includes things like name, stats, status, bio, and so on.

 * ================== List of attributes
 * Note: these are just preliminary and no thought has gone into them yet...
 * Stats: 
 *   str
 *   spd
 *   sta
 *   dex
 *   int
 *   cha
 *   wis
 */

Typewar.Models.CharacterSheet = Backbone.Model.extend({
  defaults: {
    id: null,
    name: "please enter a name",
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
    vocabulary: ''
  },

  /* Returns a json of the character sheet for shipment to the server
   */
  packaged: function (){
    return {
      id: this.get("id"),
      name: this.get("name"),
      status: this.get("status"),
      stats: this.get("stats")
    }
  }
});
