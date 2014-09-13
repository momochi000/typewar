Crafty.c("AudioManager", {
  init: function (){ },

  audioManager: function (){
    Crafty.bind("sound_effect", function (data){
      Crafty.audio.play(data);
    });
    return this;
  },

  initAudioModule: function (module_id){
    switch(module_id){
      case("input"):
        this._initInputAudio();
      default:
        console.log("ERROR: attempting to initialize invalid audio module: ", module_id);
    }
  },

  // private

  _initInputAudio: function (){
    Crafty.audio.add({
      letter_typed: ["assets/typewriter-key-1.mp3", "assets/typewriter-key-1.wav"]
    });
  }
});
