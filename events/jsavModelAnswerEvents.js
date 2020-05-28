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

async function modelAnswerEventHandledSuccesfully(exercise,eventData) {
  const answerOpened = modelAnswer.opened;
  const openSet = () => setModelAnswerOpenedAndReady(eventData);
  const initHandled = () => modelAnswerInitHandled(exercise,eventData);
  const forwardHAndled = async () => await forwardHandledComposer(exercise,eventData)
  const ifAnswerOpened = () => {
    return answerOpened && modelAnswerOpenedEvents(exercise,eventData);
  }
  const ifAnswerNotOpened = async () => {
    return !answerOpened && (openSet() || initHandled() || await forwardHAndled());
  }
  return ifAnswerOpened() || await ifAnswerNotOpened();
}

function setModelAnswerOpenedAndReady(modelAnswer, eventData) {
  return (modelAnswer) => {
    modelAnswer.opened = eventData.type === 'jsav-exercise-model-open';
    modelAnswer.ready = eventData.type === 'jsav-exercise-model-open';
    return modelAnswer.opened && modelAnswer.ready;
  }
}

function modelAnswerInitHandled(exercise, eventData) {
  return (modelAnswer) => {
    const isRightEvent = eventData.type === 'jsav-exercise-model-init';
    const speedSet = () => setSpeed(exercise, modelAnswer);
    const recordStep = () => def_func.modelAnswer.recordStep(exercise);
    const wasHandled = () => speedSet() && recordStep() && stepForward()
    return isRightEvent && answerNotOpened && wasHandled();
  }
}

function setSpeed(exercise) {
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

function forwardHandledComposer(exercise,eventData) {
  const isRightEvent = eventData.type === 'jsav-exercise-model-forward';
  const composer = async (modelAnswer) => {
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
  return isRightEvent && !recordReady && step;
}

function modelAnswerOpenedEvents(exercise, eventData) {
  return (modelAnswer) => {
    const isRightEvent = eventData.type.match(/^jsav-exercise-model-.*/);
    const wasHandled = anim_func.handleModelAnswer;
    return isRightEvent && wasHandled();
  }
}

module.exports = {
  handled: modelAnswerEventHandledSuccesfully
}
