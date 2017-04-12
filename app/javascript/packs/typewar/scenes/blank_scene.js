// A blank scene for testing purposes, I want to see what lives after the battle scene ends
export default class BlankScene {
  constructor(sceneId, sceneData){
    Crafty.scene('blank', function (){
      console.log("DEBUG: initializing blank sene.....");
    });
  }

  play(){
    Crafty.scene('blank');
  }
}
