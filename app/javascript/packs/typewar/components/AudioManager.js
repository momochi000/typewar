Crafty.c("AudioManager", {
  _audioQueue: null,
  init: function (){ },

  audioManager: function (sounds){
    this._audioQueue = [];
    return this;
  },

  getAudioQueue: function (){
    return this._audioQueue;
  },
  setAudioQueue: function (new_q){
    this._audioQueue = new_q;
  }
});
