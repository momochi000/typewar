import BattleScene from "../scenes/battle_scene"
import TrainingScene from "../scenes/training_scene"
import PlayerLoseScene from "../scenes/player_lose_scene"
import basicSlimeBattleData from "../scenes/data/basic_slime_battle"
import rainSlimeBattleData from "../scenes/data/rain_slime_battle"
import protoBattleSceneData from "../scenes/data/proto_battle_scene"
import trainingScene1Data from "../scenes/data/training/training_scene1"
import trainingScene2Data from "../scenes/data/training/training_scene2"
import trainingScene3Data from "../scenes/data/training/training_scene3"
import * as Transitions from "../models/effects/transitions";

import {
  SCENE_TRANSITION_EVT,
  TRN_FADEOUT,
  TRN_NEXT,
  TRN_LOSE,
  SID_TRAINING1,
  SID_TRAINING2,
  SID_TRAINING3,
  SID_BABY_SLIME,
  SID_SLIME_BLAST,
  SID_PROTOTYPE_BATTLE,
  SID_PL_LOSE
} from "../constants/scene_constants";

const DEFAULT_SCENE_GRAPH = [
  {
    id: SID_TRAINING1,
    sceneKlass: TrainingScene,
    sceneData: trainingScene1Data,
    transitions: {
      victory: [TRN_FADEOUT, TRN_NEXT],
      defeat: [TRN_LOSE]
    }
  },
  {
    id: SID_TRAINING2,
    sceneKlass: TrainingScene,
    sceneData: trainingScene2Data,
    transitions: {
      victory: [TRN_FADEOUT, TRN_NEXT],
      defeat: [TRN_LOSE]
    }
  },
  {
    id: SID_TRAINING3,
    sceneKlass: TrainingScene,
    sceneData: trainingScene3Data,
    transitions: {
      victory: [TRN_FADEOUT, TRN_NEXT],
      defeat: [TRN_LOSE]
    }
  },
  {
    id: SID_BABY_SLIME,
    sceneKlass: BattleScene,
    sceneData: basicSlimeBattleData,
    transitions: {
      victory: [TRN_NEXT],
      defeat: [TRN_LOSE]
    }
  },
  {
    id: SID_SLIME_BLAST,
    sceneKlass: BattleScene,
    sceneData: rainSlimeBattleData,
    transitions: {
      victory: [TRN_NEXT],
      defeat: [TRN_LOSE]
    }
  },
  {
    id: SID_PROTOTYPE_BATTLE,
    sceneKlass: BattleScene,
    sceneData: protoBattleSceneData,
    transitions: {
      victory: [TRN_NEXT],
      defeat: [TRN_LOSE]
    }
  },
  {
    id: SID_PL_LOSE,
    sceneKlass: PlayerLoseScene
  }
]

export default class SceneManager {
  constructor(){
    this._initSceneGraph();
    this._bindSceneListeners();
  }

  get currentScene(){
    return this._currentScene;
  }

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
    Crafty.bind(SCENE_TRANSITION_EVT, this._handleSceneTransition.bind(this));
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
      console.log(`DEBUG: there is no transition directive declared for the event`);
      // TODO: play game over scene
      //    No.. i think the game over scene should be explicitly turned to.
      //    This is probably an exception.
      return; }


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

  _initSceneGraph(){
    this._sceneGraph = DEFAULT_SCENE_GRAPH;
  }

  _promiseFromTransition(transitionDirective){
    var self = this;

    switch(transitionDirective){
      case TRN_FADEOUT:
        return _tdFadeout;
      case TRN_NEXT:
        if(!this._sceneGraph[this._currentSceneIndex+1]){
          // TODO: no scene to transition to, need to handle this
          //   play the end credits or something
          throw new Error("This is the end of the game! we're working on new levels");
        }
        return _tdNext;

      case TRN_LOSE:
        return _tdLose;
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

function _tdLose(){
  var self = this;
  return new Promise((fulfill, reject) => {
    self.playScene(SID_PL_LOSE);
  });
}
