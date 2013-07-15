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

Text fragments fly at the player not unlike song chords in beatmania/ddr/et al
typing the fragment correctly should reduce it to an icon that continues on 
it's path. When the icon reaches the player, the motion and calculations get
executed. For example: A slime throws an attack fragment at the player. The
player types it. The fragment text collapses and what remains is a slime ball
(representing the slime's attack) continues flying towards the player at the
same trajectory as the original text fragment box. Once it reaches the player,
because the player typed it correctly, the player avatar does a block animation
and receives no damage (or slight damage if the enemy is much stronger.. etc).

---

---

### LEFT OFF - TODO: Turn these into tracker stories

#### Beef up text fragment spawner

  Add second stream of text fragments from enemy (spawner). 
    Player shouldn't swing sword on successful defense. Only attack
    Make sure behavior functions correctly on both parties for attack and def.
    text fragments should have a pointer to it's collection, and the collection
    should have a pointer to it's owner. The spawner should as well.

  Text fragments should answer to TextFragment#success() that reports a percent
  of how quickly you typed it.

  Attacker and defender should be linked to on each text fragment

  The player should be triggering attacks on the monster(s).
  Refactor the way attacking and defending works. The text fragments should be
  labeled with attacker and defender and they should resolve separately and
  instructions should be sent to each party.
  There should be a battlecomputer component or module that takes the attacker,
  the defender, and a completed text fragment and does whatever magical math
  and our logic to figure out what happened in that round.
  With this, we can probably ditch the dual spawners on the enemy npc. The
  enem(y/ies) should still hold the spawner, but no longer need 2, attacks
  and defenses should still be sent from the enemy's spawner

  Make player attack do damage to enemy

  Add defend animation and insert appropriately

  Change player sprite (current one is crap)

  Show damage numbers above enemy when they take damage

  Show health status for enemy.

  Do not auto activate the 'next' text fragment (in collection). The player 
  should be able to activate one by typing.

  Add hit effect sprite (sparkles when you hit, or get hit.  Different sparkles
  when you block)

  Gather stats on player typing.
    Create an object for each keypress with a timestamp. Send back to server 
    and save.

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

  Add second stream of text fragments from enemy (spawner). 
    Enemy should have two spawners: attack and defense.
    Modify text fragment spawner to be able to pass in options when generating a text fragment. Make text fragments able to accept arguments which affect the way they behave and are displayed.

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
