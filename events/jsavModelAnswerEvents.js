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

async function modelAnswerEventHandledSuccesfully(exercise,eventData,modelAnswer) {
  const openSet = () => setModelAnswerOpenedAndReady(eventData,modelAnswer);
  const initHandled = () => modelAnswerInitHandled(exercise,eventData,modelAnswer);
  const forwardHandled = async () => await forwardHandledComposer(exercise,eventData,modelAnswer)
  const ifAnswerOpened = () => {
    return modelAnswerOpenedEvents(exercise,eventData,modelAnswer);
  }
  const ifAnswerNotOpened = async () => {
    return openSet() || initHandled() || await forwardHandled();
  }
  return await ifAnswerNotOpened() || ifAnswerOpened();
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
  const isRightEvent = eventData.type === 'jsav-exercise-model-init';
  const speedSet = () => setSpeed(exercise, modelAnswer);
  const recordStep = () => def_func.modelAnswer.recordStep(exercise);
  const wasHandled = () => speedSet() && recordStep() && stepForward()
  return isRightEvent && answerNotOpened && wasHandled();
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

function forwardHandledComposer(exercise,eventData,modelAnswer) {
  const isRightEvent = eventData.type === 'jsav-exercise-model-forward';
  const composer = async () => {
    return modelAnswerForwardHandled(modelAnswer,exercise)
    .then(res => res )
    .catch(err => {
      console.warn('Exercise Recorder, handinling model answer step forward', err);
      return false;
    })
  }
  return isRightEvent && composer;
}

async function modelAnswerForwardHandled(modelAnswer,eventData) {
  const recordReady = modelAnswer.ready;
  const answerNotOpened = !modelAnswer.opened;
  const step = new Promise( (res, rej) => {
    setTimeout(() => {
      try {
        const wasHandled = () => def_func.modelAnswer.recordStep(exercise);
        modelAnswer.ready = !wasHandled;
        res(wasHandled() && stepForward());
      } catch (err) {
        console.warn('Exercise Recorder, handinling model answer step forward', err);
        rej(err);
      }
    }, modelAnswer.recordingSpeed);
  })
  return isRightEvent && answerNotOpened && !recordReady && step;
}

function modelAnswerOpenedEvents(exercise,eventData,modelAnswer) {
    const isRightEvent = eventData.type.match(/^jsav-exercise-model-.*/);
    const answerOpened = modelAnswer.opened;
    const wasHandled = () => anim_func.handleModelAnswer(exercise,eventData);
    return isRightEvent && answerOpened && wasHandled();
}

module.exports = {
  handled: modelAnswerEventHandledSuccesfully
}
