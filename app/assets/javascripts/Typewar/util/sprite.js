/* Sprite: a model encapsulating all the sprites in the project.
 * This is basically little more than a data container and can probably
 * degrade down to a json.. however this also handles creation of the
 * sprite.
 */
/**
    examples:             
    'sprites_name' : {
         'file' : 'path/to/file',
         'tile' : width,
         'tileh' : height,
         'elements': {
             'sprite_name' : [0, 0]
         }
    },
**/

// TODO: Namespace this properly under Typewar
var Sprite = Backbone.Model.extend({
  initialize: function () {}
},{
  // check this against the boilerplate code, I don't remember this being in
  // there but the code apparently references it...
  static_images: {},
  images:{
    'player': {
      'file': 'assets/Typewar/sprites/player_test01.png',
      'tile': 108,
      'tileh': 76,
      'elements': {
        'pl_st0':   [0,0],
        'pl_st1':   [1,0],
        'pl_st2':   [2,0],
        'pl_st3':   [3,0],
        'pl_st4':   [4,0],
        'pl_st5':   [5,0],
        'pl_st6':   [6,0],
        'pl_hit0':  [0,1],
        'pl_hit1':  [1,1],
        'pl_hit2':  [2,1],
        'pl_hit3':  [3,1],
        'pl_hit4':  [4,1],
        'pl_hit5':  [5,1],
        'pl_hit6':  [6,1],
        'pl_att00': [0,2],
        'pl_att01': [1,2],
        'pl_att02': [2,2],
        'pl_att03': [3,2],
        'pl_att04': [4,2],
        'pl_att05': [5,2],
        'pl_att06': [6,2]
      }
    },

    'slime': {
      'file': 'assets/Typewar/sprites/b_npc_slime01.png',
      'tile': 36,
      'elements': {
        'slime_st0':   [0,0],
        'slime_st1':   [1,0],
        'slime_st2':   [2,0],
        'slime_st3':   [3,0],
        'slime_st4':   [4,0],
        'slime_hit0':  [0,1],
        'slime_hit1':  [1,1],
        'slime_hit2':  [2,1],
        'slime_hit3':  [3,1],
        'slime_hit4':  [4,1],
        'slime_hit5':  [5,1],
        'slime_hit6':  [6,1],
        'slime_hit6':  [7,1],
        'slime_att00': [0,2],
        'slime_att01': [1,2],
        'slime_att02': [2,2],
        'slime_att03': [3,2],
        'slime_att04': [4,2],
        'slime_att05': [5,2],
        'slime_att06': [6,2],
        'slime_att06': [7,2],
        'slime_blk00': [0,3],
        'slime_blk01': [1,3],
        'slime_blk02': [2,3],
        'slime_blk03': [3,3],
        'slime_blk04': [4,3],
        'slime_blk05': [5,3],
        'slime_blk06': [6,3],
        'slime_blk07': [7,3]
      }
    }
  },


  create: function(key){
    if(key != undefined){
      element = this.images[key];
      if(element['tileh'] == undefined)
          Crafty.sprite(element['tile'], element['file'], element['elements']);
      else
          Crafty.sprite(element['tile'], element['tileh'], element['file'], element['elements']);
      
      return true;
    };
  },

  getPaths: function(){
    var array = [], i=0;
    _.each(this.images, function(element, key){ 
        array[i] = element['file']
        i++;
    });
    return array;
  }
});

