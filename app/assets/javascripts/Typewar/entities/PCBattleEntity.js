var global_player, global_player_m;
var PCBattleEntity = BaseEntity.extend({
  defaults: { },
  urlRoot: '/characters/players',

  initialize: function (){
    var player;

    player = Crafty.e("2D, DOM, BattlePlayer, BattlePlayerZeroAnim, plz_st0")
    player.attr({ x: 20, y: 180 })
      .battlePlayerZeroAnim()
      .battlePlayer();

    if(!this.has('skip_fetch')) { this.getFromServer() };

    this.set('entity', player);

    global_player = player; // FOR DEBUGGING
    global_player_m = this;

    return this;
  },

  deallocate: function (){
    this.getEntity().deallocate();
    this.clear();
  },

  getFromServer: function (){
    var self = this;

    this.fetch({
      success: function (model, response){
        console.log("SUCCESSFUL FETCH FROM SERVER.  MODEL WAS =====> ");
        console.log(model);
        self.processDataFromServer(response);
      },

      error: function (model, response, options) {
        console.log("ERROR OBTAINING PLAYER DATA FROM SERVER. RESPONSE WAS ==> ");
        console.log(response);
        console.log("model ====> ");
        console.log(model);
      }
    });
  },

  processDataFromServer: function (resp){
    var char_sheet, properties, vocab, stats, name, status;

    vocab = this.get('vocabulary');
    stats = this.get('stats');
    status = this.get('status');
    properties = this.get('properties');
    name = resp.name;

    char_sheet = new Typewar.Models.CharacterSheet({
      name:       name || this.name, 
      status:     status,
      stats:      stats,
      vocabulary: vocab
    });

    this.getEntity().char_sheet = char_sheet;
    this.getEntity().updateStatus();
  }
});
