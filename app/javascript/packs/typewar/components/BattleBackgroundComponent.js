

Crafty.c("BattleBackground", {
  _height: undefined,
  _width: undefined,
  _path: '', 
  init: function (){
    this.requires("2D, DOM, Image");
  },
  battleBackground: function (path, height, width){
    this.h = height;
    this.w = width;
    this.image(path, "no-repeat");
    return this;
  }
});
