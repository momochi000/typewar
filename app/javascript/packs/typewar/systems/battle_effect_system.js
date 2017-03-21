export function initBattleEffectSystem(Crafty) {
}

export function battleEffectSystem(Crafty) {
  var effectable_entities;

  effectable_entities = Crafty("BattleEffectable").get();

  _.each(effectable_entities, (curr) => {
    processEffectQueue(curr);
  });
}

function processEffectQueue(entity) {
  var q;

  q = entity.getEffectQueue();
  for(;;){
    let curr_effect;

    if(_.isEmpty(q) || q.length < 1){ return; }
    curr_effect = q.pop();
    curr_effect(entity);
    entity.setStatusDirty();
  }
}
