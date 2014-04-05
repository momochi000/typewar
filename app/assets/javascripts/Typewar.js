Typewar.Engine = {};

Typewar.initGame = function (viewportWidth, viewportHeight){
  Crafty.init(viewportWidth, viewportHeight);
  Crafty.viewport.init(viewportWidth, viewportHeight);
  Crafty.background("blue");
  this.viewportHeight = viewportHeight;
  this.viewportWidth = viewportWidth;
  Typewar.Engine.scenemanager = new SceneManager({scene_map: {battle_scene: ProtoBattleScene, battle_over: BattleOverScene}});
};

Typewar.startGame = function (){ 
  Typewar.Engine.scenemanager.loadScene('battle_scene');
};

Typewar.battleOver = function (is_win){
  is_win = is_win || false;
  Typewar.Engine.scenemanager.loadScene('battle_over', {is_win: is_win});
};
