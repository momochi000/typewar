require("../components/Tutorial");
require("../components/ui/UiCallout");
require("../components/TWHighlight");

import {SCENE_TRANSITION_EVT, BATTLE_VICTORY_COND} from "../constants/scene_constants";

export function initTutorialSystem(Crafty, options){
  var tutorial_ent;

  tutorial_ent = generateTutorialEntity(Crafty, options.tutorialData);
  handleStep(tutorial_ent, Crafty);
}

export function tutorialSystem(Crafty){ }

export function teardownTutorialSystem(Crafty){
  var tutorial;

  tutorial = Crafty("Tutorial");
  if(tutorial.length > 0) { tutorial.destroy(); }
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

    case "wait_event":
      stepWaitEvent(entity, Crafty);
      return;

    case "end":
      entity.destroy();
      Crafty.trigger(SCENE_TRANSITION_EVT, BATTLE_VICTORY_COND);
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
    unhighlightEntities();
    unhighlightUiElements();
    Crafty.pause();
    handleStep(entity, Crafty);
  }
}

function highlightEntities(entitySelectors){
  if(!entitySelectors) { return; }
  if((typeof entitySelectors) === "string"){
    _.each(Crafty(entitySelectors).get(), (curr_entity) => {
      curr_entity.addComponent("TWHighlight").tWHighlight();
    });
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
  highlightEntities(curr_step.highlightEntities);

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

function stepWaitEvent(entity, Crafty){
  var curr_step = entity.getCurrTutorialStep();

  Crafty.one(curr_step.eventTarget, () => {
    entity.incrementTutorialStep();
    handleStep(entity, Crafty);
  });
}

function stepWaitInput(entity, Crafty){
  Crafty.pause();

  Crafty("UICallout").addComponent("Keyboard").bind('KeyDown', handleWaitKeyDown.bind({Crafty: Crafty, entity: entity, boundFunc: handleWaitKeyDown}));
}

function unhighlightEntities(){
  _.each(Crafty("TWHighlight").get(), (curr_highlighted_entity) => {
    curr_highlighted_entity.removeTWHighlight();
    curr_highlighted_entity.removeComponent("TWHighlight");
  });
}

function unhighlightUiElements(){
  _.each($(".ui-callout-target"), (curr_el) => {
    $(curr_el).removeClass("ui-callout-target");
  });
}
