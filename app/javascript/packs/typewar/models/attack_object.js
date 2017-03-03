/* AttackObject: A simple wrapper object encapsulating and 
 * standardizing attack information for use in combat.
 */

var BLANK_PROPERTIES = {
  blunt:    0, slashing: 0, piercing: 0, fire:     0,
  earth:    0, water:    0, air:      0, light:    0,
  dark:     0, poison:   0, life:     0, death:    0
};

export default class AttackObject {
  constructor(options){
    if(!opts.attacker){ throw "Attempting to initialize AttackObject without an attacker"; }
    if(!opts.target)  { throw "Attempting to initialize AttackObject without a defender"; }
    this.properties    = opts.properties || BLANK_PROPERTIES;
    this.target        = opts.target;
    this.attacker      = opts.attacker;
    this.text_fragment = opts.text_fragment;
  }
}
