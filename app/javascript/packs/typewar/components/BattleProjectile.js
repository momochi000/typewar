
Crafty.c("BattleProjectile", {
  init: function (){ 
    this.requires("2D, Collision");
  },

  battleProjectile: function (){
    this.onHit("BattleStageBoundary", this._handleBattleBoundaryHit.bind(this));
    return this;
  },

  _handleBattleBoundaryHit: function (hitDatas){
    this.addComponent("BattleProjectileOutOfBounds");
  }
});
