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

---

## DEV NOTES

### Design Ideas/Brainstorm
As the opponent gets hits on you, they advance closer to you. When they get 
too close, they can do a stronger attack. Also you get less time to type the
next string of text.

Combos happen as part of the battle flow. The engine will select a set of text
and they will be fired at the player in rapid succession (adjusted for the
player's typing speed/ability). If the player can type each block in the
sequence successfully, each completed block will perform another hit in the
combo and advance the player closer to the enemy. The combo finishes at the end
right in front of the opponent with a larger attack that does more dmg (a 
special or super). Similarly, opponents can initiate and execute combos. For
each attack in sequence, player must type the words correctly to defend against
them. Player may still take damage from successful defense, but reduced. High
armor/def can protect from damage or maybe certain passive skills block 
defended damages entirely. With each attack in the sequence, the enemy moves
closer to the player, giving less time to react to the text fragment. This
ramps up the difficulty of defending successfully from the entire sequence.
Combos should be challenging to pull off and difficult to defend against fully.

Combos play out differently for ranged vs melee attackers.

A certain skill could allow the player to preview a text fragment before it's
fired. Separate skills that allow preview for attack vs defense. This will
allow the player to prepare which works well for close combat and combos.

---

---

### LEFT OFF - 

#### Beef up text fragment spawner

  Add second stream of text fragments from enemy (spawner). 
    Enemy should have two spawners: attack and defense.

  Make player attack do damage to enemy

  Add defend animation and insert appropriately

  Change player sprite (current one is crap)

  Show damage numbers above enemy when they take damage

  Show health status for enemy.

  Do not auto activate the 'next' text fragment (in collection). The player 
  should be able to activate one by typing.

  Add hit effect sprite

#### Battle Manager/event propagation

  A battle manager that handles all of the battle events, so that individual entities(player/npc) won't
  have to manage listening to events. They respond to certain methods for animation/dealing/receiving damage
  that the manager calls.

  Ultimately the players should probably trigger 'Attack' events that the manager listens to, but as currently
  implemented, the TextFragmentComponent ends up triggering 'TextFragmentCompleted' which the manager listens to.

  Ideas:
    Can have a base player/enemy entity that responds to all of the battle-required methods (currently calculateDamage, deliverAttack, handleBeingAttacked)

---
### DONE - 

  Give the active text fragment z-index > all others

  Add a sprite for the enemy.
    Add animation for enemy sprite when hit.
    Add animation for when they attack

  Add hit points to enemy

  Move the enemy (in the scene) to the right a bit.

  Keep track of the current (active) fragment.  Maybe there should be an
  active pointer/instance var.

  When a spawner generates a new fragment, ensure that it doesn't get
  activated if another fragment is already active

  When a fragment is completed, if there is another live fragment, activate
  the next one in the array.


  Finish the first draft of the text fragment component
