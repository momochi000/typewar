// TODO: wrap this in a closure

Typewar.Engine = {Managers: {}};
Typewar.Data = {Skills: {}, Scenes: {}};
Typewar.Views = {};
Typewar.Util = {};
Typewar.Models = {Skills: {}};

Typewar.Game = (function (Crafty, $, _, Backbone, Typewar){
  var container_selector, options

  function init(container, opts){
    container_selector = container;
    options = opts;

    setupContainer();
    initCrafty();
    initBox2d();
    initSceneManager();
    initGameManager();
  };

  function start(){
    Typewar.Engine.gamemanager.start();
  };

  function stop(){
    // unload the scene
    // reset box2d?
    Typewar.Engine.scenemanager.unloadScene();
    // reset any external resources
  };

  function restart(){
    stop();
    start();
  };

  // private

  function initCrafty(){
    Crafty.init(viewportWidth, viewportHeight);
    Crafty.viewport.init(viewportWidth, viewportHeight);
    Crafty.background("blue");
  };

  function initBox2d(){
    var PTM_RATIO = 2; //32

    Crafty.box2D.init(0, 10, PTM_RATIO, true);
    world = Crafty.box2D.world;
    //Crafty.box2D.showDebugInfo(); //Start the Box2D debugger
  };

  function initSceneManager(){
    Typewar.Engine.scenemanager = new Typewar.Engine.Managers.SceneManager();
  };

  function initGameManager(){
    Typewar.Engine.gamemanager = new Typewar.Engine.Managers.GameManager();
  }

  function setupContainer(){
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

  return {
    init: init,
    start: start,
    stop: stop,
    restart: restart
  };
})(Crafty, $, _, Backbone, Typewar);
