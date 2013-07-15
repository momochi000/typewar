/* Text Fragment Module.
 * 
 * This code creates text fragments which are typed by the user.
 * When the text fragment is activated, it obtains a keyboard listener
 * which watches for input from the user.  It then keeps track of correct
 * and incorrect characters typed by the user.  When the fragment has been
 * fully typed, an optional complete callback is fired.
 * TODO: instead of registering a completed callback, fire a completed event.
 * 
 * There are three parts that make this work:
 * 1) Backbone model - The model wraps the entire functionality and provides
 *    an easy interface to interacting with the text fragments.  It also allows
 *    for easily gathering text fragments into a Collection
 * 2) Crafty component/entity - The crafty piece lives inside and ties itself
 *    into the game engine.  Registering events and talking with other Crafty
 *    components in order to interact with other bits of the 'game'.  It also
 *    handles some of the rendering and keeping track of collisions/motion/
 *    keyboard inputs, etc.
 * 3) Backbone view - The view allows the text fragment to easily render and
 *    update itself.  A pure crafty solution would be inconvenient as there
 *    is no facility for creating or managing complex DOM structures or other
 *    content.
 */


var TextFragmentEntity = BaseEntity.extend({
  defaults: {
    text: 'Default text, please initialize with real text'
  },

  initialize: function (){
    var entity = Crafty.e("2D, DOM, TextFragment, Physics2D")
      .attr({
        x: this.get('x') || 0, 
        y: this.get('y') || 0, 
        z: this.get('z') || 0, 
        w: this.get('w') || 5, 
        h: this.get('h') || 5
      })
      .physics2D()
      .textFragment(this.get("text"));

    if(this.get('type')){ entity.type = this.get('type') }
    this.set("entity", entity);
    return this;
  },

  activate: function (){
    this.get("entity").activate();
  },

  deactivate: function (){
    this.get("entity").deactivate();
  },

  remove: function (){
    var entity;
    entity = this.getEntity();
    entity.deactivate();
    entity.destroy();
  },
});
