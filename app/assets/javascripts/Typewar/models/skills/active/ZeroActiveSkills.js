/* TODO: These skill definitions need to be moved server side.  I'm putting 
 * them here for easy access during development and their structure 
 * should pretty much not change.
 */

/* example skill template:
 * {
 *   animation: 'reel_id',//optional
 *   cooldown: xx<integer>,
 *   cost: 0 <integer>,
 *   properties: {...} // property list
 * }
 */

Typewar.Data.Skills = {};

Typewar.Data.Skills["ZeroLightSlash"] = {
  animation: "attack1",
  cooldown: 700,
  cost: 0,
  name: 'light slash',
  properties: {
    blunt:    0, slashing: 1, piercing: 0,
    fire:     0, earth:    0, water:    0,
    air:      0, light:    0, dark:     0,
    poison:   0, life:     0, death:    0
  }
};

Typewar.Data.Skills["ZeroMedSlash"] = {
  init: function (){ },
  zeroMedSlash: function (){
    return this;
  },
  animation: "attack2",
  cooldown: 2000,
  cost: 0,
  name: 'medium slash',
  properties: {
    blunt:    0, slashing: 2, piercing: 0,
    fire:     0, earth:    0, water:    0,
    air:      0, light:    0, dark:     0,
    poison:   0, life:     0, death:    0
  },
};

Typewar.Data.Skills["ZeroHardSlash"] = {
  init: function (){ },
  zeroMedSlash: function (){
    return this;
  },
  animation: "attack3", 
  cooldown: 5000,
  cost: 0,
  name: 'heavy slash',
  properties: {
    blunt:    0, slashing: 3, piercing: 0,
    fire:     0, earth:    0, water:    0,
    air:      0, light:    0, dark:     0,
    poison:   0, life:     0, death:    0
  }
};

Typewar.Data.Skills["ZeroUpperSlash"] = {
  init: function (){ },
  zeroMedSlash: function (){
    return this;
  },
  animation: "attack4",
  cooldown: 2200,
  cost: 0,
  name: 'upper slash',
  properties: {
    blunt:    0, slashing: 2, piercing: 0,
    fire:     0, earth:    0, water:    0,
    air:      0, light:    0, dark:     0,
    poison:   0, life:     0, death:    0
  }
};
