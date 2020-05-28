/*
Handling of the following events:
'jsav-exercise-undo',
'jsav-exercise-gradeable-step',
'jsav-exercise-reset',
'jsav-exercise-grade-button',
'jsav-exercise-grade'
*/

const anim_func = require('../animation/animation');
const def_func = require('../definitions/definitions');
const submission = require('../submission/submission');

function exerciseStepsEventHandledSuccesfully(exercise, eventData) {
  const exerciseRecorded = typeof(exercise) === 'object';
  return (exerciseRecorded && atLeastOneHandled(exercise, eventData)) || grade(eventData);
}

function atLeastOneHandled(exercise, eventData) {
  const undo = () => undoEventHandled(exercise, eventData);
  const gradeableStep = () => gradeableStepEventHandled(exercise, eventData);
  const reset = () => resetEventHandled(eventData);
  const gradeButton = () => gradeButtonEventHandled(eventData);
  return undo() || gradeableStep() || reset() || gradeButton();
}

function undoEventHandled(exercise, eventData) {
  const isRightEvent = eventData.type === 'jsav-exercise-undo';
  const wasHandled = anim_func.handleGradableStep;
  return isRightEvent && wasHandled(exercise, eventData);
}

function gradeableStepEventHandled(exercise, eventData) {
  const isRightEvent = eventData.type === 'jsav-exercise-gradeable-step';
  const wasHandled = anim_func.handleGradableStep;
  return isRightEvent && wasHandled(exercise, eventData);
}

function resetEventHandled(eventData) {
  const isRightEvent = eventData.type === 'jsav-exercise-reset';
  const wasHandled = submission.reset;
  return isRightEvent && wasHandled();
}


function gradeButtonEventHandled(eventData) {
  const isRightEvent = eventData.type === 'jsav-exercise-grade-button';
  // Don't do anything with this event
  return isRightEvent;
}

function grade(eventData) {
  return (modelAnswer, finish) => {
    const isRightEvent = eventData.type === 'jsav-exercise-grade';
    const modalText = `Recording model answer steps\n ${def_func.modelAnswer.progress()}`;
    isRightEvent && !modelAnswer.opened && showModalWindow(modalText);
    return isRightEvent && finish(eventData);
  }
}

function showModalWindow(text) {
  try {
    $('body').append(helpers.getPopUp(text));
  } catch (err) {
    console.warn('Exercise Recorder, showing model answer record progress', err);
    return false;
  }
  return true;
}

module.exports = {
  handled: exerciseStepsEventHandledSuccesfully
}
