/*
Handling of the following events:
'jsav-exercise-model-open',
'jsav-exercise-model-recorded',
'jsav-exercise-model-init',
'jsav-exercise-model-begin',
'jsav-exercise-model-forward',
'jsav-exercise-model-backward',
'jsav-exercise-model-end',
'jsav-exercise-model-close'
*/

const def_func = require('../definitions/definitions');
const anim_func = require('../animation/animation');

function modelAnswerEventHandledSuccesfully(exercise,eventData,modelAnswer) {
  const openSet = () => setModelAnswerOpenedAndReady(eventData,modelAnswer);
  const initHandled = () => modelAnswerInitHandled(exercise,eventData,modelAnswer);
  const forwardHandled = () => modelAnswerForwardHandled(exercise,eventData,modelAnswer)
  const ifAnswerOpened = () => {
    return ifUserOpenedModelAnswer(exercise,eventData,modelAnswer);
  }
  const ifAnswerNotOpened = () => {
    return openSet() || initHandled() || forwardHandled();
  }
  return ifAnswerNotOpened() || ifAnswerOpened();
}

function setModelAnswerOpenedAndReady(eventData,modelAnswer) {
  const isRightEvent = eventData.type === 'jsav-exercise-model-open';
  const set = () => {
    try {
      modelAnswer.opened = true;
      modelAnswer.ready = true;
    } catch (err) {
      console.warn('Exercise Recorder, setting model answer opened and ready', err);
      return false;
    }
    return true;
  }
  return isRightEvent && set();
}

function modelAnswerInitHandled(exercise, eventData,modelAnswer) {
  const answerNotOpened = !modelAnswer.opened;
  const isMAInitEvent = eventData.type === 'jsav-exercise-model-init';
  const isMARecEvent = eventData.type === 'jsav-exercise-model-recorded';
  const speedSet = () => setSpeed(exercise, modelAnswer);
  const recordStep = () => def_func.modelAnswer.recordStep(exercise);
  const wasHandled = () => speedSet() && recordStep() && stepForward()
  return (isMAInitEvent || isMARecEvent) && answerNotOpened && wasHandled();
}

function setSpeed(exercise,modelAnswer) {
  exercise.modelav.SPEED = modelAnswer.recordingSpeed +10;
  return exercise.modelav.SPEED === modelAnswer.recordingSpeed +10;
}

function stepForward(){
  try {
    $('.jsavmodelanswer .jsavforward').click();
  } catch (err) {
    console.warn('Exercise Recorder, recording model answer, stepping forward', err);
    return false;
  }
  return true;
}

function modelAnswerForwardHandled(exercise,eventData,modelAnswer) {
  const isRightEvent = eventData.type === 'jsav-exercise-model-forward';
  const recordReady = modelAnswer.ready;
  const answerNotOpened = !modelAnswer.opened;
  const step = () => {
    setTimeout(() => {
      try {
        const wasHandled = () => def_func.modelAnswer.recordStep(exercise);
        modelAnswer.ready = !wasHandled;
        return wasHandled() && stepForward();
      } catch (err) {
        console.warn('Exercise Recorder, handinling model answer step forward', err);
        return false;
      }
    }, modelAnswer.recordingSpeed);
    return true;
  };
  return isRightEvent && answerNotOpened && !recordReady && step();
}

function ifUserOpenedModelAnswer(exercise,eventData,modelAnswer) {
    const isRightEvent = eventData.type.match(/^jsav-exercise-model-.*/) !== null;
    const answerOpened = modelAnswer.opened;
    const wasHandled = () => anim_func.handleModelAnswer(exercise,eventData);
    return isRightEvent && answerOpened && wasHandled();
}

module.exports = {
  handled: modelAnswerEventHandledSuccesfully
}
