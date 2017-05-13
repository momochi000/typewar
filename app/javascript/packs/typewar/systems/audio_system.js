/* Audio manager system
 *
 * Currently this plays only 1 sound per frame to prevent crafty's audio 
 * system from getting overloaded.  This can be adjusted easily here.  
 */


require("../components/AudioManager");
import {SOUNDS} from "../constants/audio_constants"

export function initAudioSystem(Crafty, options){
  var audio_manager, audio_queue;

  var {audioData} = options;
  audio_manager = Crafty.e("AudioManager").audioManager();
  audio_queue = audio_manager.getAudioQueue();
  prepareSounds(audioData.sounds);
  bindCapturePlaySound(audio_manager);
}

// NOTE: Currently, the system is super simple, playing only a single sound 
// per frame.  Without a lot of sounds going on, this is ok for now
// The next better thing is to play and clear the whole audio queue every
// frame.  The queue probably won't be larger than 6 for any given frame
// but it's still possible.
// Finally, it should pop 6 sounds off the queue and play those every frame
// if less than 6 items in queue then you're done.  This ensures the queue
// is processed as quickly as possible but prevents sounds from being dropped
export function audioSystem(Crafty){
  var audio_manager, audio_queue, curr_sound;

  audio_manager = Crafty("AudioManager");
  if(audio_manager.length==0){ return; }
  audio_queue = audio_manager.getAudioQueue();
  if(audio_queue.length==0) { return; }

  curr_sound = audio_queue.pop()
  Crafty.audio.play(curr_sound);

  //  _.each(audio_queue, (curr_sound_to_play) => {
  //    Crafty.audio.play(curr_sound_to_play);
  //  });
  //
  //  audio_manager.setAudioQueue([]);
}

export function teardownAudioSystem(Crafty){
  Crafty("AudioManager").destroy();
}

// private

function bindCapturePlaySound(audio_manager){
  Crafty.bind("PlaySound", handlePlaySoundEvent.bind(audio_manager.getAudioQueue()));
}

function prepareSounds(sounds){
  _.each(sounds, (curr_sound_data) => {
    Crafty.audio.add(curr_sound_data, SOUNDS[curr_sound_data]);
  });
}

function handlePlaySoundEvent(evtData){
  this.push(evtData);
}
