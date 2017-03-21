export function initBattleStatusSystem(Crafty) { }

export function battleStatusSystem(Crafty) {
  var status_entities;

  status_entities = Crafty("BattleStatus").get();

  _.each(status_entities, (curr) => {
    if(curr.isStatusDirty()){
      curr.renderStatus();
      curr.resetStatusDirty();
    }else{
      // TODO:
      // determine if status has changed
      // see, this won't be possible as long as side effects
      // are happening in these systems.
      // Eventually, all changes to game state will happen
      // outside of system functions and systems will merely
      // return changes which will then be compiled and pushed
      // all at once each frame.  
      // in that case, we can look at the pending changes
      // and determine if the status needs to be updated.
    }
  });
}


