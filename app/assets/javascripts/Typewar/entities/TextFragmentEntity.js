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
    var attack_properties, hitbox;

    attack_properties = this.get("attack_properties");
    hitbox = attack_properties.hitbox;
    
    var entity = Crafty.e("2D, DOM, Collision, TextFragment, TextFragmentDisplay, BattleNPCAttack")
      .attr({
        x: this.get('x') || 0, 
        y: this.get('y') || 0, 
        z: this.get('z') || 0, 
        //w: hitbox.w || 5, 
        //h: hitbox.h || 5
        w: 5, 
        h: 5
      })
      .collision(this._generateCollisionPolyFromRect(attack_properties.hitbox))

    if(attack_properties.box2d){ 
      entity.addComponent("Box2D");
      entity.box2d(attack_properties.box2d); 
    }
    entity.textFragment()
      .textFragmentDisplay({text: attack_properties.text, classesFunc: attack_properties.classesFunc})
      .battleNPCAttack(attack_properties);
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

  // TODO: put this in a library or something, or maybe make it a crafty module
  _generateCollisionPolyFromRect: function (rect){
    return new Crafty.polygon([0,0],[rect.w,0],[rect.w,rect.h],[0,rect.h]);
  }
});
