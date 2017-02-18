import GameManager from "./managers/game_manager"
require('crafty');

export default class TypewarMain {
  constructor (container, options){
    console.log("DEBUG: typewar Main being initialized");

    if(!container) {
      throw new Error("No container provided to house the game window");
    }
    this.container = container;
    this.$container = $(this.container);
    this.options = options || {};

    this._setupContainer();
    this._initCrafty();
    //_initBox2d();
    this._initManagers();

    this.managers.gameManager.start();
  }

  _initBox2d(){
    var PTM_RATIO = 2; //32

    Crafty.box2D.init(0, 10, PTM_RATIO, true);
    world = Crafty.box2D.world;
    //Crafty.box2D.showDebugInfo(); //Start the Box2D debugger
  }

  _initCrafty(){
    console.log("DEBUG: initializing Crafty");
    Crafty.init(this.viewportWidth, this.viewportHeight);
    Crafty.viewport.init(this.viewportWidth, this.viewportHeight);
    Crafty.background("blue");
  }

  _initManagers(){
    this.managers = {};
    this.managers.gameManager = new GameManager(this.managers.sceneManager);
  }

  _setupContainer(){
    switch(this.options.containerSize){
      case('standard'):
        this.viewportWidth=1080;
        this.viewportHeight=480;
        break;
      default:
        this.viewportWidth=1080;
        this.viewportHeight=480;
    }
    this.$container.css({
      "margin": "auto",
      "width" : (this.viewportWidth + 'px')
    });
  }
}
