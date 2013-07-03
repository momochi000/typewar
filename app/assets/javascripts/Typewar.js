var TypewarGame = {};

TypewarGame.initGame = function (viewportHeight, viewportWidth){
  Crafty.init(viewportHeight, viewportWidth);
  Crafty.viewport.init(viewportHeight, viewportWidth);
  Crafty.background("blue");
  // Initialize the first scene or something
};

TypewarGame.startGame = function (){ 
  Crafty.scene("main");
};
