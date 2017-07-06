import BattleScene from "../scenes/battle_scene"
import TrainingScene from "../scenes/training_scene"
import trainingScene1Data from "../scenes/data/training/training_scene1"
import trainingScene2Data from "../scenes/data/training/training_scene2"
import trainingScene3Data from "../scenes/data/training/training_scene3"
import basicSlimeBattleData from "../scenes/data/basic_slime_battle"
import rainSlimeBattleData from "../scenes/data/rain_slime_battle"
import protoBattleSceneData from "../scenes/data/proto_battle_scene"
import * as Transitions from "../models/effects/transitions"
import {SCENE_TRANSITION_EVT} from "../constants/scene_constants";

export default class SceneManager {
  constructor(){
    this._prepareSceneGraph();
    this._bindSceneListeners();
  }

  get currentScene(){
    return this._currentScene;
  }

  // For debugging only
  //  set currentScene(scene){
  //    this._currentScene = scene;
  //  }

  playScene(sceneId){
    var scene_data, scene_klass, new_scene;

    if(!sceneId) { this.loadScene(this._sceneGraph[0]); }
    if((typeof sceneId) === "number"){ this.loadScene(this._sceneGraph[sceneId]); }
    if((typeof sceneId) === "string"){ this.loadScene(this._findSceneFromId(sceneId)); }

    this._currentScene.play();
  }

  loadScene(scene){
    this._currentScene = new scene.sceneKlass(scene.id, scene.sceneData);
    this._currentSceneIndex = _.indexOf(this._sceneGraph, scene);
  }

  // private

  _bindSceneListeners(){
    Crafty.bind(SCENE_TRANSITION_EVT, this._handleSceneTransition.bind(this))
  }

  _findSceneFromId(sceneId){
    return _.find(this._sceneGraph, (curr) => {
      return (curr.id == sceneId);
    });
  }

  _getCurrentSceneId(){
    return this._currentScene.get("scene_id");
  }

  _handleSceneTransition(evt){
    var transition_directive;

    transition_directive = this._sceneGraph[this._currentSceneIndex].transitions[evt];

    this._playTransitionSequence(transition_directive, 0);
  }

  _playTransitionSequence(seq, curr_step){
    var self, transition_sequence, temp_promise;
    self = this;
    if(!seq) {
      console.log(`DEBUG: there is no transition directive declared for the ${evt} event`);
      // TODO: play game over scene
      return;
    }


    //prep sequence into a list of promises
    transition_sequence = _.map(seq, (curr_transition_directive) => {
      return self._promiseFromTransition(curr_transition_directive);
    });

    //execute the promise sequence
    temp_promise = Promise.resolve();
    _.each(transition_sequence, (curr_transition_promise) => {
      temp_promise = temp_promise.then(curr_transition_promise.bind(self));
    });
  }

  _prepareSceneGraph(){
    this._sceneGraph = [
      {
        id: "training_scene_1",
        sceneKlass: TrainingScene,
        sceneData: trainingScene1Data,
        transitions: {
          victory: ["fadeout", "next"],
          defeat: null // TODO: this should play the "you died" scene
        }
      },
      {
        id: "training_scene_2",
        sceneKlass: TrainingScene,
        sceneData: trainingScene2Data,
        transitions: {
          victory: ["fadeout", "next"],
          defeat: null // TODO: this should play the "you died" scene
        }
      },
      {
        id: "training_scene_3",
        sceneKlass: TrainingScene,
        sceneData: trainingScene3Data,
        transitions: {
          victory: ["fadeout", "next"],
          defeat: null // TODO: this should play the "you died" scene
        }
      },
      {
        id: "baby_slime",
        sceneKlass: BattleScene,
        sceneData: basicSlimeBattleData,
        transitions: {
          victory: ["next"],
          defeat: null // TODO: this should play the "you died" scene
        }
      },
      {
        id: "slime_blaster",
        sceneKlass: BattleScene,
        sceneData: rainSlimeBattleData,
        transitions: {
          victory: ["next"],
          defeat: null // TODO: this should play the "you died" scene
        }
      },
      {
        id: "prototype_battle",
        sceneKlass: BattleScene,
        sceneData: protoBattleSceneData,
        transitions: {
          victory: ["next"],
          defeat: null // TODO: this should play the "you died" scene
        }
      },
    ]
  }

  _promiseFromTransition(transitionDirective){
    var self = this;

    switch(transitionDirective){
      case "fadeout":
        return _tdFadeout;
      case "next":
        if(!this._sceneGraph[this._currentSceneIndex+1]){
          // TODO: no scene to transition to, need to handle this
          //   play the end credits or something
          throw new Error("This is the end of the game! we're working on new levels");
        }
        return _tdNext;

      case "default":
        throw new Error("Error, invalid transition declared ---> ", transitionDirective);
        return;

    }
  }
}

function _tdFadeout(){
  return new Promise((fulfill, reject) => {
    Transitions.Fadeout.execute({fulfill: fulfill, reject: reject});
  });
}

function _tdNext(){
  var self = this;
  return new Promise((fulfill, reject) => {
    self.playScene(self._currentSceneIndex+1);
    fulfill();
  });
}
