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

const undoEventHandled = (exercise, event) => {
  const isRightEvent = event.type === 'jsav-exercise-undo';
  const wasHandled = anim_func.handleGradableStep(exercise, event);
  return isRightEvent && wasHandled(exercise, event);
}

const gradeableStepEventHandled = (exercise, event) => {
  const isRightEvent = event.type === 'jsav-exercise-gradeable-step';
  const wasHandled = anim_func.handleGradableStep(exercise, event);
  return isRightEvent && wasHandled(exercise, event);
}

const resetEventHandled = (event) => {
  const isRightEvent = event.type === 'jsav-exercise-reset';
  const wasHandled = submission.reset();
  return isRightEvent && wasHandled();
}

const gradeButtonEventHandled = (event) => {
  const isRightEvent = event.type === 'jsav-exercise-grade-button';
  // Don't do anything with this event
  return isRightEvent;
}

const atLeastOneExerciseEventHandled = (exercise, event) => {
  const undo = () => undoEventHandled(exercise, event);
  const gradeableStep = () => gradeableStepEventHandled(exercise, event);
  const reset = () => resetEventHandled(event);
  const gradeButton = () => gradeButtonEventHandled(event);
  return undo() || gradeableStep() || reset() || gradeButton();
}

const gradeOrOtherEventHandled = (exercise, event) => {
  const grade = (exercise, event) => {
    return (modelAnswer, finish) => {
      const isRightEvent = event.type === 'jsav-exercise-grade';
      const modalText = `Recording model answer steps\n ${def_func.modelAnswer.progress()}`;
      isRightEvent && !modelAnswer.opened && showModalWindow(modalText);
      return isRightEvent && finish();
    }
  }
  return atLeastOneExerciseEventHandled(exercise, event) || grade(exercise, event);
}

const exerciseStepsEventHandledSuccesfully = (exercise, event) => {
  const exerciseRecorded = typeof(exercise) === 'object';
  return exerciseRecorded && gradeOrOtherEventHandled(exercise, event);
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
