const DEFAULT_SCREEN_SHAKE = {
  duration: 60, // milliseconds
  range: 2, // pixels
  timing: 4 // time between shakes, milliseconds
}

export default class Camera {
  constructor(options){
    this.options = _.cloneDeep(options);

    this._initViewport();
    this._initBackground();
  }

  shake(options){
    var args_copy, duration_counter, self;

    self = this;
    args_copy = _.merge(DEFAULT_SCREEN_SHAKE, options);
    duration_counter = 0;

    this._setBackgroundOffsetAsPixels();

    for(;;){
      if(duration_counter >= args_copy.duration) {
        window.setTimeout(() => {
          Crafty.viewport.x = self.originalViewportX;
          Crafty.viewport.y = self.originalViewportY;

          Crafty.stage.elem.style.backgroundPositionX = self.originalBackgroundOffsetX
          Crafty.stage.elem.style.backgroundPositionY = self.originalBackgroundOffsetY


        }, ((duration_counter+2)*args_copy.timing));

        return;
      }
    
      window.setTimeout(() => {
        var randomized_offset, temp_x, temp_y;
    
        randomized_offset = getRandomOffset(args_copy.range, args_copy.range);
        Crafty.viewport.x = (Crafty.viewport._x + randomized_offset[0]);
        Crafty.viewport.y = (Crafty.viewport._y + randomized_offset[1]);

        temp_x = _.parseInt(Crafty.stage.elem.style.backgroundPositionX);
        temp_y = _.parseInt(Crafty.stage.elem.style.backgroundPositionY);

        temp_x += randomized_offset[0];
        temp_y += randomized_offset[1];

        Crafty.stage.elem.style.backgroundPositionX = temp_x+"%";
        Crafty.stage.elem.style.backgroundPositionY = temp_y+"%";

      }, ((duration_counter+1)*args_copy.timing));
      duration_counter += args_copy.timing;
    }
  }

  //private
  _initBackground(){
    this.backgroundOffsetX = Crafty.stage.elem.style.backgroundPositionX;
    this.backgroundOffsetY = Crafty.stage.elem.style.backgroundPositionY;
    this.originalBackgroundOffsetX = this.backgroundOffsetX;
    this.originalBackgroundOffsetY = this.backgroundOffsetY;
  }

  _initViewport(){
    Crafty.viewport.scale(this.options.scale);
    Crafty.viewport.x += this.options.offsetX;
    Crafty.viewport.y += this.options.offsetY;

    this.originalViewportX = Crafty.viewport._x;
    this.originalViewportY = Crafty.viewport._y;
  }

  _setBackgroundOffsetAsPixels(){
    var temp_x, temp_y;

    temp_x = Crafty.stage.elem.style.backgroundPositionX;
    temp_y = Crafty.stage.elem.style.backgroundPositionY;

    if(temp_x == "center"){
      temp_x = "50%";
    }

    if(temp_y == "center"){
      temp_y = "50%";
    }

    Crafty.stage.elem.style.backgroundPositionX = temp_x;
    Crafty.stage.elem.style.backgroundPositionY = temp_y;
  }
}

function getRandomOffset(rangeX, rangeY){
  return [_.random(-rangeX, rangeX), _.random(-rangeY, rangeY)];
}
