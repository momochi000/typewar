var SceneManager = Backbone.Model.extend({
  defaults: {scene_map: null},

  initialize: function (){},

  loadScene: function (scene_id, args){
    var new_scene, desired_scene;

    args = args || null
    if(this.has('current_scene')){ this.unloadScene(); }
    desired_scene = this.get('scene_map')[scene_id];
    new_scene = new desired_scene(args);
    new_scene.play();
    this.set('current_scene', new_scene);
  },

  unloadScene: function (){
    this.get('current_scene').stop();
    this.unset('current_scene');
  }
});
