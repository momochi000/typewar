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

Text fragment positionFunc needs to be able to handle a speed multiplier
so that the speed of the motion is adjustable based on player skill.

Vocabulary selection is a nontrivial problem.  Need to be able to choose
an item from the creature's vocabulary which is appropriate for the attack.
Fast attacks should have short words, some may even have single letters.
Slow powerful attacks might be sentences. Perhaps they're not even meant to
be fully typed but only partially blocked?  They would need to scale 
appropriately such that the travel time corresponds with player typing ability

Can the position func be generated by me drawing a line? Can a line be 
recorded and played back as a math function? Can a vector represent a
position func?

## Thinking out loud
Difficulty multiplier should be passed in as a WPM value
This function must be able to take that WPM value and scale the attack
speed appropriately.




---

## CURRENT

#### REFACTOR: pull out common battle entity behavior into a separate component
#### REFACTOR: Consider initializing box2d as part of Crafty's init 
not part of the scene init
#### Improve damage calculation
Use the properties of the attack (which will be carried by the text fragment)
when resolving damage dealt.  Should happen in the resolveAttack and 
resolveDefense private methods in the battle manager
#### Design shift/spike: Player attacks are a set of slots that can be typed anytime
+ Player has a set of slots for attacks
+ The slot is filled with some text which varies depending on the player stats
  and on their typing speed.
+ Player taps tab to switch between offense and defense
+ Different classes can have different skills/spells that can have various 
  effects
  * healing
  * area damage
  * damage over time
  * helper/option
+ Enemy hitting the player could break their attack depending on attack type,
  player stats/def/etc, player skills (passive or active)
+ Attack animation plays upon successful fragment typing

#### REFACTOR: Remove all convenience methods from NPC entity backbone model
Calls should only be made on the actual crafty entity
#### Display incorrect characters count typed along with correct characters.
This needs some sort of design such that it's intuitive as to what's happening.
I'm thinking 2 counters, 1 red 1 green or something equally opposing. One
counting correct and one incorrect characters.
#### Difficulty scale.
Need a system which adjusts the difficulty of the game mechanics.  I want
difficulty of gameplay to be separate from difficulty of the battle.  The
difficulty of fighting a particular monster should be based upon the 
stat/level difference between the player and that monster, but the difficulty
of typing the words (for example) should be scalable outside of that.  Will
need to make it harder for someone who can type really fast.
#### Properly animate text fragment when it transitions to various states
Need to make several stories out of this
Animate a successful hit
Animate a successful defense
Animate successful completion
+ player attacks that fail fade away when typed.
  on second thought don't do this because we're transitioning to the different
  style of player attacking (or at least testing it out first)
  * opacity 0 with transition (possibly flicker to off)
  * fragment immediately becomes ineffective (collision off)
+ player gets hit 
any more?
#### Tighten hitboxes (both of entities and of text fragments)
#### BUG: Edge case: multiple fragments with same starting text typod
NOTE: this algorithm allows the following edge case:
When multiple fragments are 'active' starting with the same text, e.g.
'fool' and 'foolish'.  If you type 'foox', it will deactivate all the fragments.
#### Add another attack to the monster
Make a position func that handles an arc path
Problem with using physics is I can't scale the speed of the attack.
Gravity's acceleration is fixed and the x speed is pretty much going to be
constant.  With a parabolic path (or similar) I can adjust the velocity and/or
acceleration from the battle manager.
#### Add a physics border on the ground so text fragments can bounce
#### Gather stats on player typing.
Create an object for each keypress with a timestamp. Send back to server and 
save.
#### Damage counters (numbers flying off hits) Show damage numbers above enemy when they take damage
#### Tweak balance so that text flies at the player more smoothly (from the npc)
#### REFACTOR: make event naming consistent.
Either camel case or underscored, pick one and run with it
#### REFACTOR: the way npc and players take damage
Need to pass in or identify the source of the damage.  For example when npc 
dies, the event it publishes/broadcasts should contain info about who killed
it.
#### REFACTOR Separate attack and text fragment as distinct components
#### Combos
If we go with the player attack slots idea, combos becomes easy. Combos would 
fit into a specific attack slot and you'd simply type one word and another 
would replace it which if you typed it quickly enough (could have a timer or
meter that empties out) then the combo continues. Typos would break the combo
Some combos (or all) would be broken by getting hit unless you had some 
specific skill(s)
#### Adjust game behavior based on stats from player and npc
#### Add devise and player model and allow people to create accounts and log in
#### Add hit effect sprite (sparkles when you hit, or get hit.  Different sparkles when you block)
#### Clear all TODO's in code
#### Create a module that governs the display of the battle. 
It needs to handle crafty's zoom level and move things around the scene 
appropriately.  This should probably go in the Camera component.  Currently, 
we want to set a higher zoom level because the 2d sprites we're using are 
small and on any decent display are too tiny and hard to see.  We want to 
scale up the scene but this means we have to move all the entities and the 
offset of the crafty stage.  The camera component should maintain a zoom level 
and be able to translate coordinates in scene space to screen space and vice versa.
This is may also need to handle setup of the viewport depending on device 
screen size and orientation etc.  Scaling the game appropriately.
#### BUG: when two text fragments have the same text, when you finish them only one dies
Not a high priority
#### PERFORMANCE: seems like dom nodes aren't getting properly removed when text fragments go away
Need to ensure that they do.
#### Make the battle over scene overlay on top of the battle scene.
#### Create a way for pausing the rudimentary AI, stopping the timers that create more text fragments
Better yet, have it listen for a Crafty.pause() where it then does the 
appropriate.  Better yet, make the timers count by Crafty frames.  This 
way pause will do the right thing.  Will need ot create a Timer object which 
binds to EnterFrame and increments itself.
#### REFACTOR: namespace our Sprite sheet properly under typewar 
#### Esc to bail out of typing a text fragment 
But only if you have the requisite skill
#### Consider making text fragments small when live and large when active
#### Build a better method of attaching css classes to text fragments
See TextFragmentEntity.js for TODO notes.
#### Add a state machine to text fragments and use that to keep track of whether they can be typed or not.
#### Make player stagger/stumble when one if their text fragments crosses untyped
#### Try giving the fragments acceleration instead of speed.
OOh better yet, give some a flat speed and some an accel.
#### Particle system setup
#### Rails backend loads text dictionaries and sends them to the game engine

---

## DONE

#### BUG: slime sprite is off
#### REFACTOR: ensure all events triggered are CapitalCased
#### Generate a new smaller vocabulary for monsters
Temporary, since we want to test faster paced action
#### Capture single quotes
#### BUG: Ran into an issue while playing where key input was no longer registering
Seems to be while typing a fragment that sinks through the ground
Fixed: problem was there was no border along the floor of the stage
#### Make enemy npc play animation upon their attack
Player animation behavior doesn't change
#### Add an npc attack that arcs
Looks like adding box2d might not be the way to go, it doesn't allow for 
variable speeds. I'm sure I can find some uses for it.
Design a way to pass optional arguments to positionFunc
Add randomization so the enemy npc fires attacks of either type
Fix the force used on the arcing fragment to reach the player
Add some randomization to the force so it misses some percent of the time
#### Make player hit animations play instantly (no delay)
#### BUG: when 2 fragments begin with the same text and one wins
This is probably an acceptable bug for now... just need to capture it
This is probably an acceptable bug for now... just need to capture it
It appears to skip a character.  For example:
abcdef
abcdff
abcdff
if you type abcd, all 3 fragments should activate.  As soon as you type f, the
first fragment should deactivate (go back to 'live') and the 2 final ones 
should have abcdf as completed, but instead will only have abcd still complete.
Thought: could this be solved the same as the previous problem, by duping one
of the arrays?
#### EPIC: Typewar battle evolution
The (battle) scene initializes the battle manager.
The battle manager keeps track of the two sides of battle (typically the player
and opponents). The battle manager has the attack manager module which 
determines how to generate text fragments based on difficulty level, stat
differences between the players, etc etc.
It's also eventually going to keep track of any environmental effects during
battle.

+ (DONE)player/npc.initiateAttackOn should call the battle manager
  Battle manager then generates options for the text fragment spawner
+ (DONE)player is assigned a number of attacks (the AI will have to know about
  these)
+ (DONE)player generates attack object from stored attacks.
  * (DONE)stored attack contains:
  * (DONE)position func
  * (DONE)classes func
  * (DONE)hitbox over time (just constant for now)
+ (DONE)attack object is used to build initial fragment property list
  * (DONE)player attributes + attack profile = initial fragment prop list
+ (DONE)Fragment is created with a property list
+ (DONE)Fragment's behavior is governed by that property list
  * (DONE)damage object
  * (DONE)text
  * (DONE)position over time
  * (DONE)classes(css) over time
  * (DONE)hitbox size over time (shape we don't care for now)
+ (DONE)TextFragmentCompleted event should trigger with the text fragment itself as
  an option/argument. More specifically, it's attack object
+ (DONE)characters have hitboxes
+ (DONE)Fragment damage is resolved when the fragment's hitbox intersects with the
  defender's
+ (DONE)enemy attacks damage reduced based on correctness of typing.
  * What I mean is, If a text fragment is partially typed at the time of impact
    it should affect the damage dealt/taken.  I believe this already works but
    must be tested
+ (DONE)enemy attacks that reach the player do damage
+ (DONE)fragments that leave the play field are destroyed
#### Decrase the time between on/off within the flicker
#### BUG: when player dies, it doesn't do the game over screen
#### BUG: player text appears too high on the screen sometimes
#### BUG: when 2 fragments starting with the same text are typed, when one wins
For example:
    South Dakota
    South Carolina
Once you type 'South ' now you press D, South Carolina deactivates but it won't
register the D press for south dakota.
This feature just seems to be broken.
My ramblings investigating this issue: 
I've turned off player and npc battle ai so I can manually send text
fragments through the console.  Using initiateAttackOn() from each of them
I'll send abcdefg from player and abcdfff from monster.
I should be able to type a and have both activate but it isn't doing it.

Upon further investigation, it looks like what's happening is the first
live fragment gets processed (activate). then the event gets triggered
TextFragmentActivated which in this manager moves it out of the live array
and into active.  This happens before the second fragment can be processed
and we're done ?? wait no.. that doesn't sound right.  it should still run
over the _ .each loop......
more digging needed

Upon further investigation, what I theorize is happening is that _ .each
is (may be) doing a traditional for loop, looping over the array until
the itor is >= array length.  The shuffling of the arrays pushes one
item out of the live array into the active array so now the length is
equal to the itor and the loop bails out. I'll need to verify because the
implementation sets a variable length = obj.length so i'm thinking it 
shouldn't keep checking object length but instead cache that value

Final investigation, after digging into underscore, it looks like _ .each
uses native [].forEach if available.  [].forEach will not visit each item
in the array if the array is modified during execution.
#### Fix the issue with the text fragment width
The width should probably be set to the length of the string or something
Might need some javascript to set the width of the text fragment wrapper
#### Create a battle over scene for the winner
Create a scene manager that handles loading different scenes
The scene manager lives inside the core engine which handles the logistics of
setting up and breaking down the various game modes
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
#### REFACTOR: The player should be triggering attacks on the monster(s).
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
