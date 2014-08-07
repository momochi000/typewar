var BaseEntity = Backbone.Model.extend({
  defaults: { 
    'entity' : null 
  },
  initialize: function (){
    //I guess we'll override this in any custom models that need
  },

  getEntity: function (){    
    return this.get('entity');      
  },

  remove: function (){       
    var entity = this.getEntity();  

    if (entity){
      console.debug('about to destroy entity');
      entity.destroy();  
    }
  }
});
