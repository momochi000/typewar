Crafty.c("BattleNPCAttack", {
  attacker: null,
  defender: null,

  init: function (){
    this.requires("2D, DOM, Collision");
    this._ATTACK_OBJECT_GENERATOR = Typewar.Models.AttackObject;
  },

  battleNPCAttack: function (opts){
    this.attacker               = opts.attacker;
    this.defender               = opts.defender;
    this._attack_properties     = opts;

    this._recordStartTime();
    this._recordStartPos();
    this._initMovement();
    this._bindStageEdgeCollisionEvent();
    this._bindUnitCollisionListeners();
    this._bindCompletionListenerForBattleAttack();
    this._bindRemoveListenerForBattleAttack();
    return this;
  },

  // private 

  _bindCompletionListenerForBattleAttack: function (){
    var self=this;
    this.bind("Completed", function (e){
      Crafty.trigger("BattleNPCAttackCompleted", self._generateAttackObject());
      self._removeFromPlay();
    });
  },

  _bindMovementFunction: function (){
    if(this._attack_properties.positionFunc) { 
      this.bind("EnterFrame", this._handleMovement);
    }
  },

  _bindRemoveListenerForBattleAttack: function (){
    this.bind("RemoveTextFragFromPlay", _.bind(this._removeFromPlay, this));
  },

  _bindStageEdgeCollisionEvent: function (){
    this.bind("EnterFrame", this._handleStageEdgeCollision);
  },

  _bindUnitCollisionListeners: function (){
    this.bind("EnterFrame", this._handleBattleEntityCollision);
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
      direction: this._attack_properties.direction,
      difficulty_multiplier: this._attack_properties.difficulty_multiplier,
      speed: this._attack_properties.speed
    };
    return this._attack_properties.positionFunc(req,opt);
  },

  _generateAttackObject: function (){
    return this._ATTACK_OBJECT_GENERATOR.create({
      properties: this._attack_properties.properties,
      target: this.defender,
      attacker: this.attacker,
      text_fragment: this
    });
  },

  _handleMovement: function (){
    this._evalPositionFunc();
  },

  // TODO: replace the npc and player collision callbacks with this single callback
  _handleBattleEntityCollision: function (evt){
    var collision_data, npc_collision, player_collision;

    collision_data = null;
    npc_collision = this.hit("BattleNPCEnemy");
    player_collision = this.hit("BattlePlayer");
    if(npc_collision){
      if(this.attacker.has("BattleNPCEnemy")){return null;} 
      collision_data = npc_collision;
    }else if(player_collision){
      if(this.attacker.has("BattlePlayer")){return null;}
      collision_data = player_collision;
    }
    if(collision_data){
      console.log("DEBUG: BATTLENPCATTACKCOMPONENT: handling battle entity collision, collision detected");
      this.removeFromPlay();
      Crafty.trigger("TextFragmentHitUnit", this._generateAttackObject());
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
    if(this._attack_properties.initialMovement){ //execute initial movement directive
      this._attack_properties.initialMovement({x: this.x, y: this.y, context: this});
    }
  },

  _recordStartPos: function (){
    this._start_x = this.x;
    this._start_y = this.y;
  },

  _recordStartTime: function (){
    this._startFrame = Crafty.frame();
  },

  _removeFromPlay: function (){
    this.removeComponent("Collision", true);
    this.y = -9999999999; 
    this.z = -100;
  },

  _unbindCompletionListenerForBattleAttack: function (){
    this.unbind("Completed", this._removeFromPlay);
  },

  _unbindMovementFunction: function (){
    this.unbind("EnterFrame", this._handleMovement);
  },

  _unbindRemoveListenerForBattleAttack: function(){
    this.unbind("RemoveTextFragFromPlay", this._removeFromPlay);
  },

  _unbindStageEdgeCollision: function (){
    this.unbind("EnterFrame", this._handleStageEdgeCollision);
  },

  _unbindUnitCollisionListeners: function (){
    this.unbind("EnterFrame", this._handleBattleEntityCollision);
  },

  _unbindAll: function (){
    this._unbindCompletionListenerForBattleAttack();
    this._unbindMovementFunction();
    this._unbindRemoveListenerForBattleAttack();
    this._unbindStageEdgeCollision();
    this._unbindUnitCollisionListeners();
  }
});
