const submission = require('./submission/submission');
const metad_func = require('./metadata/metadata');
const dsEventsHandler = require('./events/jsavDsEvents')
const def_func = require('./definitions/definitions');
const services = require('./rest-service/services');
const helpers = require('./utils/helperFunctions');

let exercise;
let exerciseHTML = "";
// LMS defines: used if grading asynchronously
let submission_url;
// LMS defines: where to post the submission
let post_url;
const modelAnswer = {
  opened: false,
  ready: false,
  recordingSpeed: 20,
}
Object.seal(modelAnswer);

initialize();

function initialize() {
  setSubmissionAndPostUrl();
  submission.reset();
  metad_func.setExerciseMetadata(getMetadataFromURLparams())
  try {
    $(document).off("jsav-log-event");
    $(document).on("jsav-log-event",  function (event, eventData) {
      setTimeout( () => passEvent(eventData), 50);
    });
  } catch (error) {
    console.warn(error)
  }
}

// According to https://github.com/apluslms/a-plus/blob/master/doc/GRADERS.md
function setSubmissionAndPostUrl() {
  // LMS defines: used if grading asynchronously
  submission_url = new URL(location.href).searchParams.get('submission_url');
  // LMS defines: where to post the submission
  post_url = new URL(location.href).searchParams.get('post_url');
}

// According to https://github.com/apluslms/a-plus/blob/master/doc/GRADERS.md
function getMetadataFromURLparams() {
  // set in LMS
  const max_points = new URL(location.href).searchParams.get('max_points');
  // User identifier
  const uid = new URL(location.href).searchParams.get('uid');
  // Ordinal number of the submission which has not yet been done
  const ordinal_number = new URL(location.href).searchParams.get('ordinal_number');
  return { max_points, uid, ordinal_number };
}

function saveExerciseObject(data) {
  exercise = typeof(data) === 'object' && data;
  return data;
}


const exerciseModelEvents = [
  'jsav-exercise-model-open',
  'jsav-exercise-model-recorded',
  'jsav-exercise-model-init',
  'jsav-exercise-model-begin',
  'jsav-exercise-model-forward',
  'jsav-exercise-model-backward',
  'jsav-exercise-model-end',
  'jsav-exercise-model-close'
];
// const isExerciseModelEvents = (event) => exerciseModelEvents.includes(event.type);
function setModelAnswerOpened(event) {
  modelAnswer.opened = event.type === 'jsav-exercise-model-open';
  modelAnswer.ready = event.type === 'jsav-exercise-model-open';
  return modelAnswer.opened && modelAnswer.ready;
}

function setSpeed(exercise) {
  exercise.modelav.SPEED = modelAnswer.recordingSpeed +10;
  return exercise.modelav.SPEED === modelAnswer.recordingSpeed +10;
}

const modelAnswerInitEventHandled = (exercise, event) => {
  const setSpeed = () => setSpeeds(exercise, event);
  const recordStep = () => def_func.modelAnswer.recordStep(exercise);
  const stepForward = () => $('.jsavmodelanswer .jsavforward').click();
  const isRightEvent = () => event.type === 'jsav-exercise-model-init';
  const wasHandled = () => !modelAnswer.opened && setSpeed() && recordStep() && stepForward()
  return isRightEvent && wasHandled(exercise, event);
}

const modelAnswerEventHandledSuccesfully = (exercise, event) => {

}

function passEvent(eventData) {
  saveExerciseObject(initEventHandledSuccesfully(eventData));
  const wasDataStructureEvent = dsEventsHandler.handled(exercise, eventData);
  const wasExerciseEvent = exerciseStepsEventHandledSuccesfully(exercise, eventData);
  const wasModelAnswerEvent = modelAnswerEventHandledSuccesfully(exercise, eventData);
}

function passEvent(eventData) {
  console.log('EVENT DATA', eventData);
  switch(eventData.type){
    case 'jsav-init':
      def_func.setExerciseOptions(eventData);
      break;
    case 'jsav-recorded':
      break;
    case 'jsav-exercise-init':
      exercise = eventData.exercise;
      jsav = exercise.jsav;
      def_func.setDefinitions(exercise);
      // init_state_func.fixMissingIds(exercise, passEvent);
      // if(init_state_func.someIdMissing(exercise)) {
      //   init_state_func.fixMissingIds(exercise, passEvent);
      // }
      init_state_func.setInitialDataStructures(exercise, passEvent);
      init_state_func.setAnimationHTML(exercise);
      break;
    case String(eventData.type.match(/^jsav-array-.*/)):
      anim_func.handleArrayEvents(exercise, eventData);
      break;
    case String(eventData.type.match(/^jsav-node-.*/)):
      anim_func.handleNodeEvents(exercise, eventData);
      break;
    case String(eventData.type.match(/^jsav-edge-.*/)):
      anim_func.handleEdgeEvents(exercise, eventData);
      break;
    // This is fired by the initialState.js if the DS ID is set only on first click
    case 'recorder-set-id':
      init_state_func.setNewId(eventData);
      break;
    case 'jsav-exercise-undo':
      setTimeout(() => anim_func.handleGradableStep(exercise, eventData), 100);
      break;
    case 'jsav-exercise-gradeable-step':
      anim_func.handleGradableStep(exercise, eventData);
      break;
    case 'jsav-exercise-model-open':
      modelAnswer.opened = true;
      modelAnswer.ready = true;
    case 'jsav-exercise-model-init':
      if(!modelAnswer.opened) {
        exercise.modelav.SPEED = modelAnswer.recordingSpeed +10;
        modelAnswer.ready = !def_func.modelAnswer.recordStep(exercise);
        $('.jsavmodelanswer .jsavforward').click();
        break;
      }
    case 'jsav-exercise-model-forward':
      if(!modelAnswer.opened && !modelAnswer.ready) {
        setTimeout(() => {
          modelAnswer.ready = !def_func.modelAnswer.recordStep(exercise);
          $('.jsavmodelanswer .jsavforward').click();
        }, modelAnswer.recordingSpeed);
        break;
      }
    case String(eventData.type.match(/^jsav-exercise-model-.*/)):
      if (modelAnswer.opened) anim_func.handleModelAnswer(exercise, eventData);
      break;
    case 'jsav-exercise-grade-button':
      break;
    case 'jsav-exercise-grade':
      if(!modelAnswer.opened) {
        const popUpText = `Recording model answer steps\n ${def_func.modelAnswer.progress()}`;
        const popUp = helpers.getPopUp(popUpText);
        $('body').append(popUp);
      }
      finish(eventData);
      break;
    case 'jsav-exercise-reset':
      submission.reset();
      break;
    default:
      console.warn('UNKNOWN EVENT', eventData);
  }
}

function finish(eventData) {
  if(modelAnswer.ready) {
    anim_func.handleGradeButtonClick(eventData);
    def_func.setFinalGrade(eventData) && services.sendSubmission(submission.state(), post_url);
    submission.reset();
    if(!modelAnswer.opened) {
      $('#popUpDiv').remove();
    }
    $(document).off("jsav-log-event");
  } else {
    $('#popUpContent').text(`Recording model answer steps\n ${def_func.modelAnswer.progress()}`);
    setTimeout(() => finish(eventData), modelAnswer.recordingSpeed);
  }
}
