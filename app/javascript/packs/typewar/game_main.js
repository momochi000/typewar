import SceneManager from "./managers/scene_manager"
import ServerCaller from "./util/server_caller"

export default class GameMain {
  constructor(container, options){
    if(!container) {
      throw new Error("No container provided to house the game window");
    }
    this.container = container;
    this.$container = $(this.container);
    this.options = options || {};

    this._setupApi(options);
    this._setupContainer();
    this._initCrafty();
    this._initManagers();

    this.sceneManager.playScene('baby_slime');
  }

  _initCrafty(){
    console.log("DEBUG: initializing Crafty");
    Crafty.init(this.viewportWidth, this.viewportHeight);
    Crafty.viewport.init(this.viewportWidth, this.viewportHeight);
    Crafty.background("blue");
  }

  _initManagers(){
    this.managers = {};
    this.sceneManager = new SceneManager();
  }

  _setupApi(options) {
    window.serverCaller = new ServerCaller(options);
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
