require("../components/Tutorial");
require("../components/ui/UiCallout");

export function initTutorialSystem(Crafty, data){
  var tutorial_ent;

  tutorial_ent = generateTutorialEntity(Crafty, data);
  handleStep(tutorial_ent, Crafty);
}

export function tutorialSystem(Crafty){ }

export function teardownTutorialSystem(Crafty){
  var t = Crafty("Tutorial");
  if(t.length > 0) { t.destroy(); }
}

function cleanupModal(Crafty){
  _.each(Crafty("UICallout").get(), (curr_modal) => {
    curr_modal.cleanup();
    curr_modal.destroy();
  });
}

function generateModalEntity(Crafty, modalData){
  Crafty.e("UICallout")
    .uiCallout()
    .render(modalData);
}

function generateTutorialEntity(Crafty, data){
  return Crafty.e("Tutorial, Delay")
    .tutorial(data);
}

function handleStep(entity, Crafty){

  if(!entity.getCurrTutorialStep()){ 
    entity.destroy();
    return; 
  }

  switch(entity.getCurrTutorialStep().type){
    case "modal":
      stepModal(entity, Crafty);
      return;

    case "wait":
      stepWait(entity, Crafty);
      return;

    case "wait_input":
      stepWaitInput(entity, Crafty);
      return;

      //    case "wait_trigger":
      //      return;

    case "end":
      entity.destroy();
      return;

    default:
      entity.destroy();
      return;
  }
}

function handleWaitKeyDown(evt){
  var Crafty, bound_function, curr_step, entity;

  Crafty = this.Crafty;
  entity = this.entity;
  curr_step = entity.getCurrTutorialStep();
  bound_function = this.boundFunc;

  if(Crafty.keydown[Crafty.keys[curr_step.input]]){
    Crafty("UICallout").removeComponent("Keyboard", false);
    entity.incrementTutorialStep();
    cleanupModal(Crafty);
    unhighlightUiElements();
    Crafty.pause();
    handleStep(entity, Crafty);
  }
}

function highlightUiElements(targetSelectors){
  if(!targetSelectors) { return; }
  if((typeof targetSelectors) === "string"){
    $(targetSelectors).addClass("ui-callout-target");
  }else{
    _.each(targetSelectors, (curr_selector) => {
      $(curr_selector).addClass("ui-callout-target");
    });
  }
}

function onStep(){
  handleStep(this.entity, this.Crafty);
}

function stepModal(entity, Crafty){
  var modal_entity, curr_step;

  curr_step = entity.getCurrTutorialStep();

  modal_entity = generateModalEntity(Crafty, curr_step.modalData);

  highlightUiElements(curr_step.highlightSelectors);

  entity.incrementTutorialStep();
  handleStep(entity, Crafty);
}

function stepWait(entity, Crafty){
  var curr_step;

  curr_step = entity.getCurrTutorialStep();
  Crafty.pause();

  window.setTimeout( () => {
    entity.incrementTutorialStep();
    Crafty.pause();
    handleStep(entity, Crafty);
  }, curr_step.duration);
}

function stepWaitInput(entity, Crafty){
  Crafty.pause();

  Crafty("UICallout").addComponent("Keyboard").bind('KeyDown', handleWaitKeyDown.bind({Crafty: Crafty, entity: entity, boundFunc: handleWaitKeyDown}));
}

function unhighlightUiElements(){
  _.each($(".ui-callout-target"), (curr_el) => {
    $(curr_el).removeClass("ui-callout-target");
  });
}
