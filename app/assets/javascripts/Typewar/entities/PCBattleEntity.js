var global_player, global_player_m;
var PCBattleEntity = BaseEntity.extend({
  defaults: { },
  urlRoot: '/characters',

  initialize: function (){
    var player;

    player = Crafty.e("2D, DOM, BattlePlayer, BattlePlayerZeroAnim, plz_st0")
    player.attr({ x: 20, y: 180 })
      .battlePlayerZeroAnim()
      .battlePlayer();

    this.set('entity', player);

    global_player = player;
    global_player_m = this;

    return this;
  }
});
