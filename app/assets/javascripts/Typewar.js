// TODO: wrap this in a closure

Typewar.Engine = {};
Typewar.Data = {};
Typewar.Views = {};
Typewar.Initializer = (function (Typewar){
  var init,
    // private class methods
      setupContainer, initCrafty, initBox2d, initSceneManager,
    // private class variables
      container_selector, options, viewportWidth, viewportHeight;
  
  init = function (container, opts){
    container_selector = container;
    options = opts;

    setupContainer();
    initCrafty();
    initBox2d();
    initSceneManager();
  };

  initBox2d = function (){
    var PTM_RATIO = 2; //32
    Crafty.box2D.init(0, 10, PTM_RATIO, true);
    world = Crafty.box2D.world;
    //Crafty.box2D.showDebugInfo(); //Start the Box2D debugger
  };

  initCrafty = function (){
    Crafty.init(viewportWidth, viewportHeight);
    Crafty.viewport.init(viewportWidth, viewportHeight);
    Crafty.background("blue");
  };

  initSceneManager = function (){
    Typewar.Engine.scenemanager = new SceneManager({scene_map: {battle_scene: ProtoBattleScene, battle_over: BattleOverScene}});
  };

  setupContainer = function (){
    container_selector = container_selector       || 'body';
    viewportWidth      = options.viewportWidth    || 1080;
    viewportHeight     = options.viewportHeight   || 480;

    Typewar.Engine.ContainerSelector = container_selector;
    Typewar.Engine.$container = $(container_selector);

    Typewar.Engine.$container.css({
      "margin": "auto",
      "width" : (viewportWidth + 'px')
    });
  };

  return {init: init};
  
})(Typewar);



Typewar.initGame = function (container_selector, options){
  Typewar.Initializer.init(container_selector, options);
};

Typewar.startGame = function (){ 
  Typewar.Engine.scenemanager.loadScene('battle_scene');
};

Typewar.battleOver = function (is_win){
  is_win = is_win || false;
  Typewar.Engine.scenemanager.loadScene('battle_over', {is_win: is_win});
};
