const submission = require('../../submission/submission');
const helpers = require('../../utils/helperFunctions');
const dataStructures = require('../../dataStructures/dataStructures');

function handleNodeEvents(exercise, eventData) {
  const dataStructuresState = dataStructures.getDataStructuresFromExercise(exercise);
  const clickDataSource = {
    tstamp: eventData.tstamp,
    currentStep: eventData.currentStep,
    nodeId:  eventData.objid,
    dataStructuresState,
    animationHTML: helpers.getExerciseHTML(exercise)
    }
  switch(eventData.type) {
    case 'jsav-node-click':
      const clickDataTarget = {
        type: 'node-click',
        nodeValue: eventData.objvalue
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
  handleNodeEvents
}
