/* Game system which triggers an event when the player blocks an attack.  This
 * is created so as not to pollute the clean (eventless) game code with events
 * which are only meant to be used in tutorials
 */

import {PLAYER_DEFENDED_ATTACK_EVT} from "../constants/scene_constants"

export function triggerPlayerDefendedEventSystem(Crafty){
  var defendable_attacks, completed_defendable_attacks;

  defendable_attacks = Crafty("TextFragment DefendableAttack").get();

  completed_defendable_attacks = _.filter(defendable_attacks, (curr) => {
    return curr.isComplete();
  });

  _.each(completed_defendable_attacks, (curr_attack) => {
    Crafty.trigger(PLAYER_DEFENDED_ATTACK_EVT);
  });
}
