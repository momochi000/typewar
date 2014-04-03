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

# DEV NOTES

## Design Ideas/Brainstorm
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

Make monsters have a progress bar that fills up when they are preparing to 
attack. The player should have a similar bar, perhaps allowing the player to
attack without fully charging it (to make weaker but faster attacks).
Once the monster's bar fills up, they 'cast' a text fragment.

To add variety to the enemies attack, fragments could have acceleration rather
than a flat speed. They could also have deceleration, so the player might think
to target one first only to be fooled into wasting time when it might take
longer overall

Text fragments could be wrapped around objects that in a more broader sense,
represent attacks. They could have a type (physical, magic, electrical, acid)
have properties (piercing, crushing, burning, etc), have a damage value and
other attributes. 

---

## CURRENT

#### Create a battle over scene for the winner
#### Fix the issue with the text fragment width
The width should probably be set to the length of the string or something
#### Display incorrect characters typed along with correct characters.
This needs some sort of design such that it's intuitive as to what's happening.
I'm thinking 2 counters, 1 red 1 green or something equally opposing. One
counting correct and one incorrect characters
#### Add devise and player model and allow people to create accounts and log in
#### Adjust game behavior based on stats from player and npc
#### Gather stats on player typing.
Create an object for each keypress with a timestamp. Send back to server and 
save.
#### Tweak balance so that text flies at the player more smoothly (from the npc)
#### Create a module that governs the display of the battle. 
It needs to handle crafty's zoom level and move things around the scene 
appropriately.  This should probably go in the Camera component.  Currently, 
we want to set a higher zoom level because the 2d sprites we're using are 
small and on any decent display are too tiny and hard to see.  We want to 
scale up the scene but this means we have to move all the entities and the 
offset of the crafty stage.  The camera component should maintain a zoom level 
and be able to translate coordinates in scene space to screen space and vice versa.
#### PERFORMANCE: seems like dom nodes aren't getting properly removed when text fragments go away.  
Need to ensure that they do.
#### Create a way for pausing the rudimentary AI, stopping the timers that create more text fragments.  
Better yet, have it listen for a Crafty.pause() where it then does the 
appropriate.  Better yet, make the timers count by Crafty frames.  This 
way pause will do the right thing.  Will need ot create a Timer object which 
binds to EnterFrame and increments itself.
#### Esc to bail out of typing a text fragment 
But only if you have the requisite skill
#### Consider making text fragments small when live and large when active
#### Build a better method of attaching css classes to text fragments.
See TextFragmentEntity.js for TODO notes.
#### Add a state machine to text fragments and use that to keep track of whether they can be typed or not.
#### Make player stagger/stumble when one if their text fragments crosses untyped
#### Try giving the fragments acceleration instead of speed.
OOh better yet, give some a flat speed and some an accel.
#### Particle system setup
#### Damage counters (numbers flying off hits) Show damage numbers above enemy when they take damage
#### Rails backend loads text dictionaries and sends them to the game engine
#### text fragments should have a pointer to it's collection, and the collection should have a pointer to it's owner. The spawner should as well.
#### Add hit effect sprite (sparkles when you hit, or get hit.  Different sparkles when you block)

---

## DONE

#### Use a different attack animation from slime (something more visible)
#### Hook up the player character to retrieve data from the server including a vocabulary
#### Don't show incorrect characters, just flash red or something.
#### BUG: Prevent spacebar from scrolling down.
I want to bundle up all the browser keyboard control overrides.  Do this in the
same place that I handle backspace override.
#### BUG: Disregard returns
#### Distinguish somehow the difference between player cast text fragments and npc sent ones (appearance)..
#### BUG: when multiple fragments are 'active' deactivate any that get a wrong input
#### Improve the way text fragments display, make them show spaces properly
#### BUG: backspace triggers back in the browser
#### Handle dashes
#### BUG: player/enemy health switches places. Whoever takes more damage appears on the right
#### The player should be able to activate any text fragment by typing.
Need a text input manager that watches for keyboard inputs and selects the
correct active fragments.
  + Handle the case where multiple fragments start with the same word.
    - I think we'll want to defer this and allow different skills to handle
    this situation in various ways.
  + Need to clean up fragments when dead (at least put them in the graveyard)
  + Ensure the proper arrays get the right fragments placed in them
#### BUG: Enemy name doesn't display
#### BUG: when a fragment that you're currently typing goes off screen, it never releases the keyboard focus (need to unbind)
On further investigation, my guess was correct: A text fragment had exited the 
battle area but was not deallocated.  Next experiment, we want to see if a 
text fragment is correctly being destroyed when it leaves the battle arena.
Will need to check Typewar.Engine.BattleManager.getAllLiveFragments() and 
ensure it's size is always equal to the number of fragments we see on screen.

I think I see the problem now.  When a text fragment goes live (enters the 
live queue), it does not get destroyed when it goes off the screen edge.  Now
let's trace why this might be.

I believe this bug is fixed but will need to keep an eye out for it because I
cannot verify this.
#### BUG: there is a bug where the input manager stops accepting inputs.
Seems to be fixed thanks to the above, but need to keep an eye out for it.
#### Switch to postgres to prepare for heroku deploy
#### Handle capital letters
#### Change player sprite (current one is crap)
#### Removing text fragments from the scene once they hit the edge.  
  Stuck on moving the fragment into the 'graveyard' on the battle manager.  
  Can't seem to find the fragment that comes back from the event.  However, 
  I suspect that the fragment has already been dealt with.. no wait it's 
  not in the graveyard either...  Well, maybe it's still being moved and 
  so the event is getting triggered many times.  Need to check to ensure 
  that the fragment is being deactivated properly.  In fact, perhaps it's
  being more than deactivated, it's being finished, or destroyed 
  or demolished. It should call deactivate, but also should remove the view,
  remove the 2D component, remove bindings, stop calculation of position.
#### Move completed text fragments to the graveyard as well.
#### Remove the 'type me' instruction text from text fragment partials (or make
  them less obtrusive)
#### Add a background.
#### Allow a method of stopping the AI. It would be nice if we could listen for
  the Crafty.pause() call and stop and start automatically.
#### Move the AI to the slime. Extract it out so it's a module I can attach to
  any monster, even swiching out. Perhaps the monster could have several
  behaviors that can be toggled. AI has many behaviors.
  For now, just set the behavior to attack at a constant rate
#### Zoom in on the characters, camera is too far out.
#### Player attacking the monster sends text fragment from the player to the enemy
#### Set up simple AI that manages battle flow
#### Show health status for enemy.
#### Add defend animation and insert appropriately
#### The player should be triggering attacks on the monster(s).
  Refactor the way attacking and defending works. The text fragments should be
  labeled with attacker and defender and they should resolve separately and
  instructions should be sent to each party.
  There should be a battlecomputer component or module that takes the attacker,
  the defender, and a completed text fragment and does whatever magical math
  and our logic to figure out what happened in that round.
  With this, we can probably ditch the dual spawners on the enemy npc.
#### Make player attack do damage to enemy
#### Attacker and defender should be linked to on each text fragment
#### Text fragments should answer to TextFragment#success() that reports a percent
  of how quickly you typed it.
#### Add second stream of text fragments from enemy (spawner). 
    Player shouldn't swing sword on successful defense. Only attack
    Make sure behavior functions correctly on both parties for attack and def.
#### Add second stream of text fragments from enemy (spawner). 
    Enemy should have two spawners: attack and defense.
    Modify text fragment spawner to be able to pass in options when generating 
    a text fragment. Make text fragments able to accept arguments which affect 
    the way they behave and are displayed.
#### Give the active text fragment z-index > all others
#### Add a sprite for the enemy.
    Add animation for enemy sprite when hit.
    Add animation for when they attack
#### Add hit points to enemy
#### Move the enemy (in the scene) to the right a bit.
#### Keep track of the current (active) fragment.  Maybe there should be an
  active pointer/instance var.
#### When a spawner generates a new fragment, ensure that it doesn't get
  activated if another fragment is already active
#### When a fragment is completed, if there is another live fragment, activate
  the next one in the array.
#### Finish the first draft of the text fragment component
