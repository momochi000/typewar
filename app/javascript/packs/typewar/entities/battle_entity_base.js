// IN PROGRESS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// This needs to be refactored to use es6 models rather than backbone

//var BaseEntity = Backbone.Model.extend({
//  defaults: { 
//    'entity' : null 
//  },
//  initialize: function (){
//    //I guess we'll override this in any custom models that need
//  },
//
//  getEntity: function (){    
//    return this.get('entity');      
//  },
//
//  remove: function (){       
//    var entity = this.getEntity();  
//
//    if (entity){
//      console.debug('about to destroy entity');
//      entity.destroy();  
//    }
//  }
//});

export default class BattleEntityBase {
  constructor(opts) { 
    var entity
    this._entity = opts.entity || null;
  }

  get entity(){
    return this._entity;
  }

  set entity(newent){
    this._entity = newent;
  }

  deallocate(){
    this._entity = null;
  }
}
