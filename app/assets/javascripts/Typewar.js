Typewar.Engine = {};

Typewar.initGame = function (viewportWidth, viewportHeight){
  Crafty.init(viewportWidth, viewportHeight);
  Crafty.viewport.init(viewportWidth, viewportHeight);
  Crafty.background("blue");
  this.viewportHeight = viewportHeight;
  this.viewportWidth = viewportWidth;
};

Typewar.startGame = function (){ 
  var battle_scene;
  battle_scene = new ProtoBattleScene;
  battle_scene.play();
};
