/* TODO: this should move to it's own directory */
/* There's a potential bug here where two fragments get created with
 * the same DOM id because our unique id generator is pretty garbage
 */

import Backbone from "backbone"

require('crafty');

var Handlebars = require("handlebars");

var TextFragmentView = Backbone.View.extend({
  tagName: 'div',
  className: 'text-fragment',
  _templateId: "#text_fragment_template",
  initialize: function (options){
    this.options = options;
    this._template = Handlebars.compile($(this._templateId).html());
  },
  render: function (opts){
    if(!this.id) { this.id = this._generateUniqueId(); }

    opts.activeClass = opts.active ? 'active' : 'inactive'
    if($(this.id).length === 0){
      this.$el.html(this._template(opts));
      if(this.options.entityId) {
        $("#"+this.options.entityId).append(this.$el);
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

/*TODO: REFACTOR 
 * rename this to the TextFragmentAttackDisplay or something
 */
Crafty.c("TextFragmentDisplay", {
  _view: null,
  _classes: null,

  init: function (){
    this.requires("2D, DOM, Collision, TextFragment");
    this.current_position = 0;
    this._classes = [];
  },

  textFragmentDisplay: function (opts){
    this._classesFunc    = opts.classesFunc;
    this._bindIncorrectInput();
    this._bindRedrawListener();
    this._bindCompletionListenerForTextFragmentDisplay();
    this._bindRemovalListenerForTextFragmentDisplay();
    return this;
  },

  remove: function (){
    this._view.remove(); //destroy the view.  May need to unbind additional events by hand
  },

  addClass: function (css_class) { // add css class to text fragment
    this.addClasses([css_class]);
  },
  
  addClasses: function (classes) { // add css classes to text fragment
    if(!classes.concat || !(classes.length>0)) {throw "Invalid argument to addClasses on TextFragmentComponent, must be array"}
    this._classes = this._classes.concat(classes);
  },

  drawSelf: function (){
    if(!this._view) { 
      this._view = new TextFragmentView({entityId: this.getDomId()});
    }
    if(!this.is_complete) {
      // TODO: refactor this to use getTextStatus
      this._view.render({active: this.is_active,
                         typed: this._correct_characters, 
                         missed: this._incorrect_characters, 
                         rest: this._text.slice(this._current_position),
                         cssClasses: this._getClassesForDom()});
    } else {
      // TODO: Render completed text fragments differently
      //  For now, just dont' render completed ones
    }
  },

  //private

  _bindCompletionListenerForTextFragmentDisplay: function (){
    var self=this;
    this.bind("Completed", function (){ self._view.remove(); });
  }, 

  _bindIncorrectInput: function (){
    this.bind("InputIncorrect", this._flickerEffect);
  },

  _bindRedrawListener: function (){
    this.bind("Redraw", _.bind(this.drawSelf, this));
  },

  _bindRemovalListenerForTextFragmentDisplay: function (){
    var self=this;
    this.bind("RemoveTextFragFromPlay", function (){ self._view.remove(); });
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
    return this._classes.concat(this._classesFunc(this._currentTime()));
  },

  _getClassesForDom: function (){
    var output;
    output = _.reduce(this._getClasses(), function (memo, curr_class){
      return(memo + ' ' + curr_class);
    }, '');
    return output;
  }
});
