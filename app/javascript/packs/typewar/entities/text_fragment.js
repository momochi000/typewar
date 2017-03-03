/* Text Fragment Module.
 *
 * When the text fragment is activated, it obtains a keyboard listener
 * which watches for input from the user.  It then keeps track of correct
 * and incorrect characters typed by the user.  When the fragment has been
 * fully typed, an optional complete callback is fired.
 * TODO: instead of registering a completed callback, fire a completed event.
 * 
 * There are three parts that make this work:
 * 1) Backbone model - The backbone model lives inside the crafty entity and
 *    will provide a mechanism(s) for communicating to the server
 * 2) Crafty component/entity - Registers events and talking with other Crafty
 *    components in order to interact with other bits of the 'game'.  It also
 *    handles some of the rendering and keeping track of collisions/motion/
 *    keyboard inputs, etc.
 * 3) Backbone view - The view allows the text fragment to easily render and
 *    update itself.  A pure crafty solution would be inconvenient as there
 *    is no facility for creating or managing complex DOM structures or other
 *    content.
 */


export default class TextFragment {
  constructor(entity){
    this._entity = entity;
  }

  activate(){
    this._entity.activate();
  }

  deactivate(){
    this._entity.deactivate();
  }

  remove(){
    this.deactivate()
    this._entity.destroy();
  }
}

//var TextFragmentModel = BaseEntity.extend({
//  defaults: { },
//
//  initialize: function (){
//    return this;
//  },
//
//  activate: function (){
//    this.get("entity").activate();
//  },
//
//  deactivate: function (){
//    this.get("entity").deactivate();
//  },
//
//  remove: function (){
//    var entity;
//    entity = this.getEntity();
//    entity.deactivate();
//    entity.destroy();
//  }
//});
