/* Audio manager system
 *
 * Currently this plays only 1 sound per frame to prevent crafty's audio 
 * system from getting overloaded.  This can be adjusted easily here.  
 */

require("crafty");
require("../components/AudioManager");

export function initAudioSystem(Crafty, audioData) {
  var audio_manager, audio_queue;

  audio_manager = Crafty.e("AudioManager").audioManager();
  audio_queue = audio_manager.getAudioQueue();
  prepareSounds(audioData.sounds);
  bindCapturePlaySound(audio_manager);
}

export function audioSystem(Crafty) {
  var audio_manager, audio_queue, curr_sound;

  audio_manager = Crafty("AudioManager");
  audio_queue = audio_manager.getAudioQueue();

  curr_sound = audio_queue.pop()
  Crafty.audio.play(curr_sound);

  //  _.each(audio_queue, (curr_sound_to_play) => {
  //    Crafty.audio.play(curr_sound_to_play);
  //  });
  //
  //  audio_manager.setAudioQueue([]);
}

// private

function bindCapturePlaySound(audio_manager) {
  Crafty.bind("PlaySound", handlePlaySoundEvent.bind(audio_manager.getAudioQueue()));
}

function prepareSounds(sounds) {
  _.each(sounds, (curr_sound_data) => {
    Crafty.audio.add(curr_sound_data.soundId, curr_sound_data.soundUrls);
  });
}

function handlePlaySoundEvent(evtData) {
  this.push(evtData);
}
