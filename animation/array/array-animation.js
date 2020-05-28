const submission = require('../../submission/submission');
const helpers = require('../../utils/helperFunctions');
const dataStructures = require('../../dataStructures/dataStructures');

function handleArrayEvents(exercise, eventData, exerciseHTML) {
  const dataStructuresState = dataStructures.getDataStructuresFromExercise(exercise);
  const clickDataSource = {
    tstamp: eventData.tstamp,
    currentStep: eventData.currentStep,
    dataStructuresState,
    animationHTML: helpers.getExerciseHTML(exercise)
    }
  switch(eventData.type) {
    case 'jsav-array-click':
    const clickDataTarget = {
      type: 'array-click',
      index: eventData.index,
    };
    if(eventData.arrayid) clickDataTarget.arrayid = eventData.arrayid;
    if(eventData.binaryHeapId) clickDataTarget.binaryHeapId = eventData.binaryHeapId;
      try {
        return submission.addAnimationStepSuccesfully.dsClick({ ...clickDataTarget, ...clickDataSource });
      } catch (error) {
        console.warn(`Could not set array click in animation: ${error}`);
        return false;
      }
  }
}

module.exports = {
  handleArrayEvents
}
