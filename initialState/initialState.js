const recorder = require('../exerciseRecorder');
const submission = require('../submission/submission');
const helpers = require('../utils/helperFunctions');
const dataStructures = require('../dataStructures/dataStructures');

function setInitialDataStructures(exercise, passEvent) {
  const initialStructures = exercise.initialStructures;
  const dss = dataStructures.getDataStructuresFromExercise(exercise,passEvent);
  const dssSet = dss.map(ds => {
    return submission.addInitialStateSuccesfully.dataStructure(ds);
  });
  return dsSet.every(ds => ds === true;);
}

function moreThanOneDs(initialStructures) {
  return Array.isArray(initialStructures);
}

function handleMissingId(htmlElement, passEvent) {
  tempId = `tempid-${Math.random().toString().substr(2)}`;
  htmlElement.onclick = ((clickData) => {
    passEvent({
    type: 'recorder-set-id',
    tempId: tempId,
    newId: htmlElement.id
    })
    htmlElement.onclick = null;
  });
  return tempId;
}

function getDataStructureOptions(options) {
  const filteredOptions = {};
  for(const key in options) {
    const option = options[key];
    if(typeof(option) === 'function') {
      filteredOptions[key] = option.name;
    } else if (typeof(option) !== 'object') {
      filteredOptions[key] = option;
    }
  }
  return filteredOptions;
}

function setNewId(eventData) {
  const initialState = submission.state().initialState;
  const dsIndex = initialState.dataStructures.findIndex(ds => ds.id === eventData.tempId);
  if(dsIndex >= 0) {
    return submission.addInitialStateSuccesfully.setDsId(dsIndex, eventData.newId);
  }
  return false;
}

function setAnimationHTML(exercise) {
  const html = helpers.getExerciseHTML(exercise);
  return submission.addInitialStateSuccesfully.animationHTML(html);
}

module.exports = {
  // fixMissingIds,
  setInitialDataStructures,
  setNewId,
  setAnimationHTML,
  // someIdMissing,
}
