const helpers = require('../utils/helperFunctions');
const submission = require('../submission/submission');
const modelAnswer = require('./model-answer/model-answer-definitions.js');

function setExerciseOptions(eventData) {
  return submission.addDefinitionSuccesfully.options({
    'title': getExerciseTitle(eventData.initialHTML),
    'instructions': getExerciseInstructions(eventData.initialHTML),
  });
}

function setDefinitions(exercise) {
  try {
    modelAnswer.recordModelAnswerFunction(exercise.options.model.toString());
  } catch (error) {
    console.warn(`Could not set model answer when recording animation: ${error.message}`);
    return false;
  }
  return true
}

function setFinalGrade(eventData) {
  return submission.addDefinitionSuccesfully.score({ ...eventData.score });
}

function getExerciseTitle(initialHTML) {
  let title;
  try {
    title = helpers.extractTextByTagName(initialHTML, 'h1');
  } catch (err) {
    console.warn('Could not get exercise title, was it set within the jsavcontainer div?'
    + '\nReturning empty string: ' + err);
    title = ''
  }
  return title;
}

function getExerciseInstructions(initialHTML) {
  let instructions;
  try {
    instructions = helpers.extractTextByClassName(initialHTML, 'instructions');
  } catch (err) {
    console.warn('Could not get exercise instruction, was it set within the jsavcontainer div?'
    + '\nReturning empty string: ' + err)
    instructions = '';
  }
  return instructions;
}


module.exports = {
  setExerciseOptions,
  setDefinitions,
  setFinalGrade,
  modelAnswer: {
    recordFunction: modelAnswer.recordModelAnswerFunction,
    recordStep: modelAnswer.recordModelAnswerStep,
    progress: modelAnswer.modelAnswerProgress
  }
}
