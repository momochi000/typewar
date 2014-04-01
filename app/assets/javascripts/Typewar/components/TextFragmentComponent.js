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

  _generateRandomVal: function (){ // Should probably be moved into a library or something
    return Math.floor(Math.random()*1000000);
  }
});

Crafty.c("TextFragment", {
  attacker: null,
  defender: null,
  is_active: false,
  is_complete: false,
  type: 'attack',
  _correct_characters: '',
  _current_position: null,
  _incorrect_characters: '',
  _success_callback: undefined,
  _text: '',
  _view: null,
  _classes: null,

  init: function (){
    this.requires("2D, DOM, Physics2D, Collision");
    this.current_position = 0;
    this._classes = [];
  },

  textFragment: function (opts){
    this._text = opts.text;
    this.attacker = opts.attacker;
    this.defender = opts.defender;
    if(opts.success_callback) { this._success_callback = opts.success_callback; }
    this._bindStageEdgeCollisionEvent();
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
                         classes: this._getClasses()});
    } else {
      // TODO: Render completed text fragments differently
      //  For now, just dont' render completed ones

      //this._view.render({active: this.is_active,
      //                   typed: this._correct_characters, 
      //                   missed: this._incorrect_characters, 
      //                   rest: this._text.slice(this._current_position)});

    }
  },

  isAttack: function (){
    if(this.type === "attack"){ return true; }
    return false;
  },

  isComplete: function (){ // a convenience method
    return this.is_complete;
  },

  isDefense: function (){
    if(this.type === "defense"){ return true; }
    return false;
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
    //this.zeroVel();
    //this.removeComponent("Collision", true);
    //this.removeComponent("2D",        true);
    this.removeComponent("DOM",         true);
    this._unbindStageEdgeCollision();
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

    if(!this.is_complete) { return false; }
    if(this._incorrect_characters.length == 0) { return 100; }

    rating = this._incorrect_characters.length / this._correct_characters.length;
    rating = 1-rating;

    return (rating*100);
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

  _bindStageEdgeCollisionEvent: function (){
    var self = this;
    this.bind("EnterFrame", this._handleStageEdgeCollision);
  },

  _complete: function (){
    var output_data;
    this.is_complete = true
    this.deactivate();
    if(this._success_callback) { this._success_callback(); }
    this.drawSelf();

    output_data = {};
    output_data["text_fragment"] = this;
    output_data["success"] = (this._incorrect_characters.size == 0);
    Crafty.trigger("TextFragmentCompleted", output_data);
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

  _flickerEffect: function (){
    var self=this;
    if(this._classes.indexOf('typo') == -1){
      this._classes.push('typo');
      window.setTimeout(function (){
        self._classes = _.without(self._classes, 'typo');
        self.drawSelf();
      }, 200);
    }
  },

  _getClasses: function (){
    var output;
    output = _.reduce(this._classes, function (memo, curr_class){
      return(memo + ' ' + curr_class);
    }, '');
    return output;
  },

  _handleStageEdgeCollision: function (evt){
    if(this.hit("BattleStageEdge")){
      this.removeFromPlay();
      Crafty.trigger("TextFragmentExitedStage", {text_fragment: this});
    }
  },

  _unbindStageEdgeCollision: function (){
    this.unbind("EnterFrame", this._handleStageEdgeCollision);
  },

  _wrongInput: function (input){
    this._incorrect_characters += input;
    this._flickerEffect();
  }
});
