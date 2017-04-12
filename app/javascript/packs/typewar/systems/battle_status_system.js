require("../components/BattleStatusBarView");

const MODE_ICON_VERTICAL_OFFSET = -40;
export function initBattleStatusSystem(Crafty) { 
  var status_entities, status_bar;

  status_bar = Crafty.e("BattleStatusBarView").battleStatusBarView();

  status_entities = Crafty("BattleStatus").get();
  _.each(status_entities, (curr_ent) => {
    var curr_icon;

    curr_ent.renderStatus(); // initialize the status view for each entity

    status_bar.getView().insertChild(curr_ent.getStatusView());

    // Create mode icons for each and attach them to the entity correctly
    curr_icon = Crafty.e("ModeIcon, 2D, DOM")
      .attr({
        x: curr_ent._x + 16, 
        y: curr_ent._y+MODE_ICON_VERTICAL_OFFSET, 
        w: 32, h: 32
      });
    curr_ent.attach(curr_icon);
	renderIcon(curr_ent);

    // Bind removal of the status view when the entity is destroyed
    curr_ent.bind("Remove", function (){ 
      this.getStatusView().remove();
    });
  });

  status_bar.render();

  bindCleanupStatusBar(status_bar);
}

export function battleStatusSystem(Crafty) {
  var status_entities;

  status_entities = Crafty("BattleStatus").get();

  _.each(status_entities, (curr) => {
    if(curr.isStatusDirty()){
      curr.renderStatus();
      renderIcon(curr);
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

function bindCleanupStatusBar(statusBar){
  var status_bar_view;

  statusBar.bind("Remove", function () {
    status_bar_view = statusBar.getView();
    status_bar_view.cleanupChildViews();
    status_bar_view.remove()
    statusBar._view = null;
    statusBar.destroy();
  });
}

function renderIcon(entity){
  var icon_ent, icon_asset, icon_content;

  icon_ent = _.find(entity._children, (curr) => {return (curr.has && curr.has("ModeIcon"))});
  if(!icon_ent) { return; }
  icon_asset = stanceToIconAsset(entity.getStance());
  icon_content = iconContent(icon_asset);
  $(icon_ent._element).html(icon_content);
}

function iconContent(asset){
  return `<img class="battle-status-icon battle-character-stance" src="${asset}"></img>`;
}

function stanceToIconAsset(stance){
  switch(stance){
    case "offense":
      return "assets/Typewar/icons/crossed-swords.svg"
      break;
    case "defense":
      return "assets/Typewar/icons/checked-shield.svg"
      break;
    default:
      return "assets/Typewar/icons/checked-shield.svg"
  };
}
