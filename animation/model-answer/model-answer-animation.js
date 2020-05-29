const submission = require('../../submission/submission');
const modelAnswerDefinitions = require("../../definitions/model-answer/model-answer-definitions.js");

function handleModelAnswer(exercise, eventData) {
  const type = String(eventData.type.match(/model.*/))
  const currentStep = eventData.currentStep;
  switch(type) {
    case 'model-init':
      return true;
      break;
    case 'model-recorded':
      return true;
      break;
    default:
      if(exercise.modelDialog) {
        const newStep = {
          type,
          tstamp: eventData.tstamp || new Date(),
          currentStep,
          modelAnswerHTML: exercise.modelDialog[0].innerHTML
        };
        try {
          return submission.addAnimationStepSuccesfully.modelAnswer(newStep);
        } catch (error) {
          console.warn(`Could not add model answer step to animation: ${error}`)
          return false;
        }
      }
      break;
  }
}


module.exports = {
  handleModelAnswer,
}
