Crafty.c("AudioManager", {
  init: function (){ },

  audioManager: function (){
    Crafty.bind("sound_effect", function (data){
      Crafty.audio.play(data);
    });
  }
});
