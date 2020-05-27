const submission = require('../submission/submission');
const arrayAnimation = require('./array/array-animation');
const nodeAnimation = require('./node/node-animation');
const edgeAnimation = require('./edge/edge-animation');
const modelAnswerAnimation = require('./model-answer/model-answer-animation');
const helpers = require('../utils/helperFunctions');
const dataStructures = require('../dataStructures/dataStructures');


function handleGradableStep(exercise, eventData) {
  const exerciseHTML = helpers.getExerciseHTML(exercise)
  const dsInExercise = dataStructures.getDataStructuresFromExercise(exercise);
  return dsInExercise.length > 0 && addStepToSubmission(eventData, dsInExercise, exerciseHTML);
}

// Returns an empthy array if there is not state change
function getDataStructuresState(dataStructures, exercise) {
  return dataStructures.map((ds, i) => {
    switch(ds.type) {
      case 'array':
        // TODO: make a function for this
        const arrayInExercise = Array.isArray(exercise.initialStructures) ?
        exercise.initialStructures.find(s => s.element['0'].id === ds.id) :
        exercise.initialStructures;
        return { id: ds.id, values: [ ...arrayInExercise._values ] };
        break;
      default:
        return `unknown ds type ${ds.type}`;
    }
  });
}

// TODO: support for other data structures
function submissionDataStructures() {
  const dataStructures = submission.state().initialState.dataStructures.map( ds => {
    return {
      type: ds.type,
      id: ds.id,
      values: ds.values
    };
  });
  return dataStructures;
}

function addStepToSubmission(eventData, dsInExercise, exerciseHTML) {
  const type = eventData.type === 'jsav-exercise-undo' ? 'undo' : 'gradeable-step';
  const newState = {
    type,
    tstamp: eventData.tstamp || new Date(),
    currentStep: eventData.currentStep || undefined,
    dsInExercise,
    animationHTML: exerciseHTML
  };
  try {
    return submission.addAnimationStepSuccesfully.gradableStep(newState);
  } catch (error) {
    console.warn(`Could not add state change to animatio: ${error}`)
    return false;
  }
}

function handleGradeButtonClick(eventData) {
  try {
    submission.addAnimationStepSuccesfully.gradeButtonClick({
      type: "grade",
      tstamp: eventData.tstamp,
      currentStep: eventData.currentStep,
      score: { ...eventData.score },

    });
  } catch (error) {
    console.warn(`Could not add grade button click to animation: ${error}`)
  }
}

module.exports = {
  handleArrayEvents: arrayAnimation.handleArrayEvents,
  handleNodeEvents: nodeAnimation.handleNodeEvents,
  handleEdgeEvents: edgeAnimation.handleEdgeEvents,
  handleGradableStep,
  handleGradeButtonClick,
  handleModelAnswer: modelAnswerAnimation.handleModelAnswer
}
