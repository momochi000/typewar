require("../components/Tutorial");

const TUTORIAL_DATA = {
  steps: [
    {type: 'wait', duration: 800},
    {type: 'wait', duration: 2000},
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
  var tutorial_ent, 
    input_ent, input_queue, target_input, didFindTargetInput;

  tutorial_ent = Crafty("Tutorial");
  if(tutorial_ent.length < 1){ return; }
  if(tutorial_ent.isListeningForInput()){
    didFindTargetInput = false;
    input_ent = Crafty("BattleInput");
    input_queue = input_ent.getInputQueue();

    // TODO: actually, should not return, we want to keep processing tutorial but not do any more input processing.  Since the tutorial currently only deals with waiting for input...
    if(input_queue.length == 0) { return; } 


    target_input = tutorial_ent.getCurrTutorialStep().input;
    if(!target_input) { 
      throw new Error("Error, tutorial is waiting for input but tutorial state is not on an input step!!"); 
    }

    input_queue.forEach((currInput) => {
      console.log("DEBUG: Processing input queue.. curr input ----> ", currInput);
      if(currInput == target_input) { didFindTargetInput = true; }
    });

    input_ent.clearInputQueue();

    if(didFindTargetInput){
      tutorial_ent.stopListeningForInput();
      tutorial_ent.incrementTutorialStep();
      handleStep(tutorial_ent, Crafty);
    }
  }
}

export function teardownTutorialSystem(Crafty){
  var t = Crafty("Tutorial");
  if(t.length > 0) { t.destroy(); }
}

function generateTutorialEntity(Crafty, data){
  return Crafty.e("Tutorial, Delay")
    .tutorial(data);
}

function handleStep(entity, Crafty){
  console.log("DEBUG: TUTORIAL HANDLE STEP ~~~~~~~~~~~~~~~~~~~~~~~~~~~ bout to kick off a "+entity.getCurrTutorialStep().type+" step");

  if(!entity.getCurrTutorialStep()){ 
    entity.destroy();
    return; 
  }

  switch(entity.getCurrTutorialStep().type){
    case "modal":
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
      console.log("DEBUG Tutorial has ended, cleaning up...");
      entity.destroy();
      return;

    default:
      console.log("DEBUG: ended up with an unknown tutorial step");
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
    $(window).off("keydown", bound_function);
    entity.incrementTutorialStep();
    Crafty.pause();
    handleStep(entity, Crafty);
  }
}

function onStep(){
  handleStep(this.entity, this.Crafty);
}

function stepWait(entity, Crafty){
  var curr_step;

  curr_step = entity.getCurrTutorialStep();
  Crafty.pause();
  console.log("DEBUG: Waiting with a delay of --------------------", curr_step.duration);

  window.setTimeout( () => {
    console.log("DEBUG: the wait is over!!!");
    entity.incrementTutorialStep();
    Crafty.pause();
    handleStep(entity, Crafty);
  }, curr_step.duration);
}

function stepWaitInput(entity, Crafty){
  Crafty.pause();
  $(window).on("keydown", handleWaitKeyDown.bind({Crafty: Crafty, entity: entity, boundFunc: handleWaitKeyDown}));
}

