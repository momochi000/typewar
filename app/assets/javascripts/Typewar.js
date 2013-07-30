Typewar.Engine = {};

Typewar.initGame = function (viewportHeight, viewportWidth){
  Crafty.init(viewportHeight, viewportWidth);
  Crafty.viewport.init(viewportHeight, viewportWidth);
  Crafty.background("blue");
  this.viewportHeight = viewportHeight;
  this.viewportWidth = viewportWidth;
};

Typewar.startGame = function (){ 
  var battle_scene;
  battle_scene = new ProtoBattleScene;
  battle_scene.play();
};
