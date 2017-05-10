require("../components/Tutorial");
require("../components/ui/UiCallout");

const TUTORIAL_DATA = {
  steps: [
    {type: 'wait', duration: 3000},
    {type: 'modal', modalData: {
      headerContent: "Welcome to typewarrior!",
      modalContent: "This is a fighting game featuring typing.",
      footerContent: "Press space to continue..."
    }},
    {type: 'wait_input', input: "SPACE"},

    {type: 'modal', modalData: {
      headerContent: "How to play: Defeat your opponent!",
      modalContent: "Type the words to attack and defend.  Successful attacks will deplete the enemy's health.  Successful attacks against you will deplete your health.  Reduce the enemy's health to zero before you are defeated. In this stage we'll show you how to attack.",
      footerContent: "Press space to continue..."
    }},
    {type: 'wait_input', input: "SPACE"},

    {type: 'modal', modalData: {
      headerContent: "How to play: Opponent's health",
      modalContent: "Here's your opponent's health bar.  As you attack, this bar will deplete.  Bring it to zero and you've won!",
      footerContent: "Press space to continue..."
    }, highlightSelectors: ".entity-status-training-dummy"},
    {type: 'wait_input', input: "SPACE"},

    {type: 'modal', modalData: {
      headerContent: "How to play: Your skills",
      modalContent: "Here are your skills, type the word or words shown here to attack.  There will be a cooldown after you've used a given skill where it won't yet be ready.",
      footerContent: "Press space to continue..."
    }, highlightSelectors: ".battle-skill"},
    {type: 'wait_input', input: "SPACE"},

    {type: 'modal', modalData: {
      headerContent: "How to play: Prepare to fight",
      modalContent: "This training dummy won't fight back.  Just keep hitting it to get the hang of attacking.",
      footerContent: "Ready? Press space to continue..."
    }},
    {type: 'wait_input', input: "SPACE"},
    {type: 'end'}
  ]
};

export function initTutorialSystem(Crafty, data){
  var tutorial_ent;

  tutorial_ent = generateTutorialEntity(Crafty, TUTORIAL_DATA);
  handleStep(tutorial_ent, Crafty);
}

export function tutorialSystem(Crafty){
  //  var tutorial_ent, 
  //    input_ent, input_queue, target_input, didFindTargetInput;
  //
  //  tutorial_ent = Crafty("Tutorial");
  //  if(tutorial_ent.length < 1){ return; }
  //  if(tutorial_ent.isListeningForInput()){
  //    didFindTargetInput = false;
  //    input_ent = Crafty("BattleInput");
  //    input_queue = input_ent.getInputQueue();
  //
  //    // TODO: actually, should not return, we want to keep processing tutorial but not do any more input processing.  Since the tutorial currently only deals with waiting for input...
  //    if(input_queue.length == 0) { return; } 
  //
  //
  //    target_input = tutorial_ent.getCurrTutorialStep().input;
  //    if(!target_input) { 
  //      throw new Error("Error, tutorial is waiting for input but tutorial state is not on an input step!!"); 
  //    }
  //
  //    input_queue.forEach((currInput) => {
  //      if(currInput == target_input) { didFindTargetInput = true; }
  //    });
  //
  //    input_ent.clearInputQueue();
  //
  //    if(didFindTargetInput){
  //      tutorial_ent.stopListeningForInput();
  //      tutorial_ent.incrementTutorialStep();
  //      handleStep(tutorial_ent, Crafty);
  //    }
  //  }
}

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
  console.log("DEBUG: TUTORIALSYSTEM: handleStep().. running -> ", entity.getCurrTutorialStep());

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

    case "wait_trigger":
      return;

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

  console.log("DEBUG: got a key input!!! ---> ", evt, Crafty.keydown);
  if(Crafty.keydown[Crafty.keys[curr_step.input]]){
    $(window).off("keydown", bound_function);
    entity.incrementTutorialStep();
    cleanupModal(Crafty);
    unhighlightUiElements();
    Crafty.pause();
    handleStep(entity, Crafty);
  }
}

function highlightUiElements(targetSelectors){
  console.log("DEBUG: in highlightUiElements with arg --> ", targetSelectors);
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

  console.log("DEBUG: TUTORIAL SYSTEM: Game paused, awaiting input ---> ", entity.getCurrTutorialStep().input);

  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // TODO: This doesn't seem to work once the crafty stage has focus.  Need to also bind on crafty OR use Crafty's keyboard listener or something.
  // Then be sure to unbind both when the time comes
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  $(window).on("keydown", handleWaitKeyDown.bind({Crafty: Crafty, entity: entity, boundFunc: handleWaitKeyDown}));
}

function unhighlightUiElements(){
  _.each($(".ui-callout-target"), (curr_el) => {
    $(curr_el).removeClass("ui-callout-target");
  });
}
