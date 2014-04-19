/* TODO: this should move to it's own directory */
var TextFragmentView = Backbone.View.extend({
  tagName: 'div',
  className: 'text-fragment',
  _template_id: "#text_fragment_template",
  render: function (opts){
    if(!this.id) { 
      this.id = this._generateUniqueId(); 
    }
    if(!_.any($(this.id))){
      this.$el.html(_.template($(this._template_id).html(), opts));
      if(this.options.entity_id) {
        $("#"+this.options.entity_id).append(this.el);
      } else {
        $('body').append(this.el);
      }
    }
  },

  // private
  
  _generateUniqueId: function (){
    var u_id;
    u_id = "text_fragment_" + this._generateRandomVal();
    return u_id;
  },

  _generateRandomVal: function (){ // TODO: move into a library or something
    return Math.floor(Math.random()*1000000);
  }
});

Crafty.c("TextFragment", {
  attacker: null,
  defender: null,
  is_active: false,
  is_complete: false,
  _correct_characters: '',
  _current_position: null,
  _incorrect_characters: '',
  _text: '',
  _view: null,
  _classes: null,

  init: function (){
    this.requires("2D, DOM, Collision");
    this.current_position = 0;
    this._classes = [];
  },

  textFragment: function (opts){
    this._text                  = opts.text;
    this.attacker               = opts.attacker;
    this.defender               = opts.defender;
    this._attack_object         = opts;
    this._recordStartTime();
    this._recordStartPos();
    this._initMovement();
    this._bindStageEdgeCollisionEvent();
    this._bindUnitCollisionListeners();
    return this;
  },

  activate: function (){ 
    if(!this.is_active){
      this._current_position = 0;
      this.is_active = true; 
      this.z = 99999;
      Crafty.trigger("TextFragmentActivated", this);
      this.drawSelf();
    }
  },

  addClass: function (css_class) { // add css class to text fragment
    this.addClasses([css_class]);
  },
  
  addClasses: function (classes) { // add css classes to text fragment
    if(!classes.concat || !(classes.length>0)) {throw "Invalid argument to addClasses on TextFragmentComponent, must be array"}
    this._classes = this._classes.concat(classes);
  },

  deactivate: function (){ 
    this.is_active = false; 
    this.z = 0;
    this._current_position = null;
    this.drawSelf();
  },

  deallocate: function (){
    this.deactivate();
    this._unbindAll();
    this._view.remove(); //destroy the view.  May need to unbind additional events by hand
    this.destroy();
  },

  // A test function for debug purposes
  drawSelf: function (){
    if(!this._view) { 
      this._view = new TextFragmentView({entity_id: this.getDomId()});
    }
    if(!this.is_complete) {
      this._view.render({active: this.is_active,
                         typed: this._correct_characters, 
                         missed: this._incorrect_characters, 
                         rest: this._text.slice(this._current_position),
                         classes: this._getClassesForDom()});
    } else {
      // TODO: Render completed text fragments differently
      //  For now, just dont' render completed ones

      //this._view.render({active: this.is_active,
      //                   typed: this._correct_characters, 
      //                   missed: this._incorrect_characters, 
      //                   rest: this._text.slice(this._current_position)});

    }
  },

  isComplete: function (){ // a convenience method
    return this.is_complete;
  },

  // Return true if the given character matches the first one in the text frag
  matchFirstChar: function (chr){
    return (this._text[0] == chr);
  },

  /* We want to call this when the fragment is no longer to be displayed.
   * The fragment doesn't get destroyed yet, it may have reached the player or
   * it may have been correctly typed.  Either way, we remove it from the
   * battle scene.
   */
  removeFromPlay: function (){
    this._view.remove();
    this.removeComponent("Collision", true);
    this.removeComponent("Physics2D", true);
    this.y = -9999999999;
    this.z = -100;
    this._unbindAll();
  },

  reset: function (){
    this.is_complete = false;
    this._incorrect_characters = '';
    this._correct_characters = '';
    this.deactivate();
  },

  /* Returns a percentage of how correctly was the fragment typed 
   * returns false if the fragment isn't yet completed.
   * When we allow backspacing, this should include backspaces in
   * the success percentage. There should be a skill that allows
   * a certain number of backspaces to get 100%
   */
  successPct: function (){
    var rating;

    //console.log("DEBUG: calculating success Percentage.. =================================> ");
    //console.log("DEBUG: incorrect_characters -->" + this._incorrect_characters.length);
    //console.log("DEBUG: correct_characters ---->" + this._correct_characters.length);
    //console.log("DEBUG: text_length ----------->" + this._text.length);
    if(this.is_complete) {
      return (100 * (1 - (this._incorrect_characters.length / this._correct_characters.length)));
    }else{
      return (100 * ((this._correct_characters.length - this._incorrect_characters.length) / this._text.length));
    }
  },

  /* The means of feeding characters to the text fragment. Correct characters
   * move the fragment closer to completion, incorrect characters are tracked
   * as well.
   * return true if the input was correct else false
   */
  takeInput: function (chr){
    if(this._text[this._current_position] == chr){
      this._correctInput();
      this._checkForCompletion();
      this.drawSelf();
      return true
    }else{
      this._wrongInput(chr);
      this.drawSelf();
      return false;
    }
  },

  wasPerfect: function (){
    if(this.successPct() >= 99.9) { return true; }
    return false;
  },

  //private

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

  _complete: function (){
    this.is_complete = true
    this.deactivate();
    this.drawSelf();

    Crafty.trigger("TextFragmentCompleted", this);
    this.removeFromPlay();
    return this;
  },

  _checkForCompletion: function (){
    if(this._correct_characters.length == this._text.length){
      this._complete();
    }
  },

  _correctInput: function (input){
    // TODO: validate input? check the input against the current position in _text
    this._correct_characters += this._text[this._current_position];
    this._current_position++;
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

  _flickerEffect: function (){
    var self, FLICKER_ANIMATION_DURATION;
    self = this;
    FLICKER_ANIMATION_DURATION = 350;
    if(this._classes.indexOf('typo') == -1){
      this._classes.push('typo');
      window.setTimeout(function (){
        self._classes = _.without(self._classes, 'typo');
        self.drawSelf();
      }, FLICKER_ANIMATION_DURATION);
    }
  },

  _getClasses: function (){
    return this._classes.concat(this._attack_object.classesFunc(this._currentTime()));
  },

  _getClassesForDom: function (){
    var output;
    output = _.reduce(this._getClasses(), function (memo, curr_class){
      return(memo + ' ' + curr_class);
    }, '');
    return output;
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
  },

  _wrongInput: function (input){
    this._incorrect_characters += input;
    this._flickerEffect();
  }
});
