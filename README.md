# Typewar

Typewar is a typing-based browser RPG, inspired by typeracer.

Some upcoming features:

* Spells
* Weapons/Items
* Leveling system
* PVP
* PVE
* Combo moves
* Multiple character classes
* Dungeons


## DEV NOTES

### LEFT OFF - 

#### Beef up text fragment spawner

  Move the enemy (in the scene) to the right a bit.

  Add a sprite for the enemy.
    Add animation for enemy sprite when hit.
    Add animation for when they attack

  Add hit points to enemy

  Make player attack do damage to enemy

  Change player sprite (current one is crap)

  Show damage numbers above enemy when they take damage

  Show health status for enemy.

  Add second stream of text fragments from enemy (spawner). 


---
### DONE - 

  Keep track of the current (active) fragment.  Maybe there should be an
  active pointer/instance var.

  When a spawner generates a new fragment, ensure that it doesn't get
  activated if another fragment is already active

  When a fragment is completed, if there is another live fragment, activate
  the next one in the array.


  Finish the first draft of the text fragment component
