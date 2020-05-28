/*
Handling of the following events:
'jsav-init',
'jsav-exercise-init',
'jsav-recorded',
*/

const def_func = require('../definitions/definitions');
const init_state_func = require('../initialState/initialState');

function initEventHandledSuccesfully(eventData, passEvent) {
  const doNothing = eventData.type === 'jsav-recorded';
  const optionsSet = () => setOptions(eventData);
  const exerciseExists = () => typeof(eventData.exercise) === 'object';
  const definitionsSet = () => setDefinitions(eventData);
  const dataStructuresSet = () => setDataStructures(eventData, passEvent);
  const initialHtmlSet = () =>  setInitialHtml(eventData);
  //If definitionSet && initialHtmlSet, then return the exercise object
  const handleThenReturnExercise = () => {
    return definitionsSet() && dataStructuresSet() && initialHtmlSet() && eventData.exercise;
  };
  return doNothing || optionsSet() || ( exerciseExists() && handleThenReturnExercise() );
}

function setOptions(eventData) {
  const isRightEvent = eventData.type === 'jsav-init';
  const wasHandled = def_func.setExerciseOptions;
  return isRightEvent && wasHandled(eventData);
}

function setDefinitions(eventData) {
  const isRightEvent = eventData.type === 'jsav-exercise-init';
  const wasHandled = def_func.setDefinitions;
  return isRightEvent && wasHandled(eventData.exercise);
}

function setDataStructures(eventData, passEvent) {
  const isRightEvent = eventData.type === 'jsav-exercise-init';
  const wasHandled = init_state_func.setInitialDataStructures;
  return isRightEvent && wasHandled(eventData.exercise, passEvent);
}

function setInitialHtml(eventData) {
  const isRightEvent = eventData.type === 'jsav-exercise-init';
  const wasHandled = init_state_func.setAnimationHTML;
  return isRightEvent && wasHandled(eventData.exercise);
}

module.exports = {
  handled: initEventHandledSuccesfully
}
