// Scene transition effects

Crafty.c("FadeoutTransition", {
  init: function (){
    this.requires("2D, DOM");
  },
  fadeoutTransition: function (){return this;},
  fadeout: function (){
    return new Promise((fulfill, reject) => {
      // LEFT OFF ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      // * somehow do a css animation from transparent to black over a given time interval
      // * make it so that the fulfill happens afterwards
      // * in the system which triggers the scene transition, put the trigger in a .then()
      // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      fulfill();
    });
  }
});

export class Fadeout {
  static execute(args){
    // create a mask over the canvas and increase its opacity until black
    Crafty.e("FadeoutTransition, 2D, DOM").
      attr({x: 0, y: 0, w: Crafty.stage.elem.offsetWidth, h: Crafty.stage.elem.offsetHeight}).
      fadeoutTransition().
      fadeout();
  }
}
