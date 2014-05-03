Crafty.c("BattleNPCAttack", {
  attacker: null,
  defender: null,

  init: function (){
    this.requires("2D, DOM, Collision");
  },

  battleNPCAttack: function (opts){
    this.attacker               = opts.attacker;
    this.defender               = opts.defender;
    this._attack_object         = opts;
    this._recordStartTime();
    this._recordStartPos();
    this._initMovement();
    this._bindStageEdgeCollisionEvent();
    this._bindUnitCollisionListeners();
    this._bindCompletionListenerForBattleAttack();
    return this;
  },

  // private 

  _bindCompletionListenerForBattleAttack: function (){
    var self=this;
    this.bind("Completed", function (){
      self.removeComponent("Collision", true);
      self.y = -9999999999; 
      self.z = -100;
    });
  },

  _bindMovementFunction: function (){
    if(this._attack_object.positionFunc) { 
      this.bind("EnterFrame", this._handleMovement);
    }
  },

  _bindStageEdgeCollisionEvent: function (){
    this.bind("EnterFrame", this._handleStageEdgeCollision);
  },

  _bindUnitCollisionListeners: function (){
    this.bind("EnterFrame", this._handleNPCCollision);
    this.bind("EnterFrame", this._handlePlayerCollision);
  },

  _currentTime: function (){
    return (Crafty.frame() - this._startFrame);
  },

  _evalPositionFunc: function (){
    var req, opt;
    // TODO: figure out how to configure optional arguments here

    req = {
      start_x: this._start_x,
      start_y: this._start_y,
      time: this._currentTime(),
      context: this
    };
    opt = {
      direction: this._attack_object.direction,
      difficulty_multiplier: this._attack_object.difficulty_multiplier,
      speed: this._attack_object.speed
    }
    return this._attack_object.positionFunc(req,opt);
  },

  _handleMovement: function (){
    this._evalPositionFunc();
  },

  _handleNPCCollision: function (evt){
    var collision_data;
    collision_data = this.hit("BattleNPCEnemy")
    if(collision_data){
      if(this.attacker.has("BattleNPCEnemy")){return null;} //ignore a collision with the one who spawned the fragment
      this.removeFromPlay();
      Crafty.trigger("TextFragmentHitUnit", {text_fragment: this, collision_data: collision_data});
    }
  },

  _handlePlayerCollision: function (evt){
    var collision_data;
    collision_data = this.hit("BattlePlayer");
    if(collision_data){
      if(this.attacker.has("BattlePlayer")){return null;} //ignore a collision with the one who spawned the fragment
      this.removeFromPlay();
      Crafty.trigger("TextFragmentHitUnit", {text_fragment: this, collision_data: collision_data});
    }
    
  },

  _handleStageEdgeCollision: function (evt){
    if(this.hit("BattleStageEdge")){
      this.removeFromPlay();
      Crafty.trigger("TextFragmentExitedStage", {text_fragment: this});
    }
  },

  _initMovement: function (){
    this._bindMovementFunction();
    if(this._attack_object.initialMovement){ //execute initial movement directive
      this._attack_object.initialMovement({x: this.x, y: this.y, context: this});
    }
  },

  _recordStartPos: function (){
    this._start_x = this.x;
    this._start_y = this.y;
  },

  _recordStartTime: function (){
    this._startFrame = Crafty.frame();
  },

  _unbindMovementFunction: function (){
    this.unbind("EnterFrame", this._handleMovement);
  },

  _unbindStageEdgeCollision: function (){
    this.unbind("EnterFrame", this._handleStageEdgeCollision);
  },

  _unbindUnitCollisionListeners: function (){
    this.unbind("EnterFrame", this._handleNPCCollision);
    this.unbind("EnterFrame", this._handlePlayerCollision);
  },

  _unbindAll: function (){
    this._unbindMovementFunction();
    this._unbindStageEdgeCollision();
    this._unbindUnitCollisionListeners();
  }
});
