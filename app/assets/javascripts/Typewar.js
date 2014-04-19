Typewar.Engine = {};

Typewar.initGame = function (viewportWidth, viewportHeight){
  var world, PTM_RATIO;
  Crafty.init(viewportWidth, viewportHeight);
  Crafty.viewport.init(viewportWidth, viewportHeight);
  Crafty.background("blue");
  this.viewportHeight = viewportHeight;
  this.viewportWidth = viewportWidth;

  PTM_RATIO = 2; //32
  Crafty.box2D.init(0, 10, PTM_RATIO, true);
  world = Crafty.box2D.world;
  //Crafty.box2D.showDebugInfo(); //Start the Box2D debugger

  Typewar.Engine.scenemanager = new SceneManager({scene_map: {battle_scene: ProtoBattleScene, battle_over: BattleOverScene}});
};

Typewar.startGame = function (){ 
  Typewar.Engine.scenemanager.loadScene('battle_scene');
};

Typewar.battleOver = function (is_win){
  is_win = is_win || false;
  Typewar.Engine.scenemanager.loadScene('battle_over', {is_win: is_win});
};
