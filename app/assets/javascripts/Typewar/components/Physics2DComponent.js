/* A simple 2d physics component
 * Governs velocity and acceleration on a 2D plane.
 * Requires the 2D component
 */ 
Crafty.c("Physics2D", {
  _spd_x: 0,
  _spd_y: 0,
  _x_accel: 0,
  _y_accel: 0,
  _mass: 1,
  _timestep_size: undefined, // in milliseconds

  init: function (){
    this.requires("2D");
  },

  physics2D: function (){
    var self, fps;
    self = this;
    fps = Crafty.timer.getFPS();
    
    this._timestep_size = 1/fps;
    this.bind('EnterFrame', function () {
      self.updateVel(); //calculate new velocity based on accel
      self.updatePos(); //calculate new position based on velocity
    });
    return this;
  },

  setAccel: function (new_x_accel, new_y_accel){
    this._x_accel = _new_x_accel;
    this._y_accel = _new_y_accel;
  },

  setSpeed: function (new_x_spd, new_y_spd){
    this._spd_x = new_x_spd;
    this._spd_y = new_y_spd;
  },

  //TODO: Rather than simply multiply by timestep, we need to check against
  //the previous frame to see if we've skipped or lost any frames.
  updatePos: function (){ //update the entity position
    this.x += (this._spd_x * this._timestep_size); 
    this.y += (this._spd_y * this._timestep_size);
  },

  updateVel: function (){ //update the velocity given accel
    this._spd_x += (this._x_accel * this._timestep_size);
    this._spd_y += (this._y_accel * this._timestep_size);
  },

  zeroVel: function (){
    this._spd_x = 0;
    this._spd_y = 0;
  }
});
