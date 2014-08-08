Typewar.Engine.Managers.SceneManager = Backbone.Model.extend({
  defaults: {scene_defs: null},

  initialize: function (){},

  getCurrentScene: function (){
    return this.get('current_scene');
  },

  loadScene: function (scene, args){
    var new_scene;

    args = args || null
    if(this.has('current_scene')){ this.unloadScene(); }
    new_scene = new scene(args);
    new_scene.play();
    this.set('current_scene', new_scene);
  },

  unloadScene: function (){
    this.get('current_scene').stop();
    this.unset('current_scene');
  }
});
