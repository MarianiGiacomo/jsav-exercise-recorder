const submission = require('../../submission/submission');
const helpers = require('../../utils/helperFunctions');
const dataStructures = require('../../dataStructures/dataStructures');

function handleEdgeEvents(exercise, eventData) {
  const dataStructuresState = dataStructures.getDataStructuresFromExercise(exercise);
  const clickDataSource = {
    tstamp: eventData.tstamp,
    currentStep: eventData.currentStep,
    dataStructuresState,
    animationHTML: helpers.getExerciseHTML(exercise)
    }
  switch(eventData.type) {
    case 'jsav-edge-click':
      const clickDataTarget = {
        type: 'edge-click',
        startId:  eventData.startid,
        endId:  eventData.endid,
        startValue: eventData.startvalue,
        endValue: eventData.endvalue,
        }
      try {
        return submission.addAnimationStepSuccesfully.dsClick(Object.assign(clickDataTarget, clickDataSource));
      } catch (error) {
        console.warn(`Could not set node click in animation: ${error}`);
        return false;
      }
  }
}

module.exports = {
  handleEdgeEvents
}
