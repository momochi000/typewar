/* The Attack manager handles all the details of text fragment generation based
 * on all the inputs necessary for determining how a text fragment should 
 * behave.
 * It must:
 *   Adjust difficulty based on the player's typing speed/ability
 *   Adjust text fragment properties based on the attacker and defender's stats
 *   Adjust for any environmental factors
 *   Adjust for any status effects on attacker or defender

 * Thoughts: perhaps this should move to a component on the battle entity
 */

Typewar.Models.AttackManager = Backbone.Model.extend({
});
