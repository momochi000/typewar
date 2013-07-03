/* View which represents text fragments.  Not sure if we want to 
   display text fragments as backbone views
     - gives flexibility with markup and style
     - Less reliance on crafty
   or as crafty entities
     - easier to manage
   Probably want to do backbone views.. they'll need to display text in many
   different divs or spans.  Text which was already typed, incorrect text, 
   text which hasn't been typed, a destroyed or finished view, etc.
*/

var TextFragmentView = Backbone.View.extend({
  tagName: 'div',
  className: 'text-fragment',

    // Since there are going to be a lot of these views, the ids will have to
    // be unique. Generate id based on some heuristic that ensures uniqueness
  id: this._generateUniqueId(),
    
  _template_id: "#text_fragment_template",
  render: function (){
    console.log("Running render of TextFragmentView, my id is -------> " + this.id);
    if(!_.any($(this.id))){
      this.$el.html(_.template($(this._template_id).html(), args));
      $('body').append(this.el);
    }else{
      console.log("DEBUG: TextFragmentView already exists on the page");
    }
  },
  // private
  
  _generateUniqueId: function (){
    var u_id;
    //u_id = "text_fragment_" + this._generateRandomVal();
    u_id = "text_fragment_" + this._generateRandomVal();
    //while(!_.any($('#'+u_id))){
    //  if(!_.any($('#'+u_id))) { u_id = "text_fragment_" + this._generateRandomVal(); }
    //}
    return u_id;
  },

  _generateRandomVal: function (){
    return Math.floor(Math.random()*1000000);
  }
});


Crafty.c("TextFragment", {
  _correct_characters: '',
  _current_position: null,
  _incorrect_characters: '',
  _text: '',
  _view: null,


  init: function (){
    this.current_position = 0;
  },

  textFragment: function (text){
    // initialized with a string 
    this._text = text;
    return this;
  },

  attachKeyboardHandler: function (){
    this.bind('KeyDown', this._getKeyInput);
  },

  detachKeyboardHandler: function (){
    this.unbind('KeyDown', this._getKeyInput);
  },

  // A test function for debug purposes
  drawSelf: function (){
    this._view = new TextFragmentView;
    this._view.render();
  },

  //private
  _getKeyInput: function (keyEvent){
    console.log("In getKeyInput on TextFragment, key Event is =>");
    console.log(keyEvent);
  },
  _wrongInput: function (input){
    this._incorrect_characters += this._text[_current_position];
  },
  _correctInput: function (input){
    // validate input? check the input against the current position in _text
    this._correct_characters += this._text[_current_position];
    this._current_position++;
  }
});


/**
  Brainstorm..
  What I want is, an entity that contains some fragment of text.  The entity
  should display itself and might also have keyboard focus.
  When it has keyboard focus, it should have a set of behavior around taking
  key inputs and matching letters among the internal string.
 */
