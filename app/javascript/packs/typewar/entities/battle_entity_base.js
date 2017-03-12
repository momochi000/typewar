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
