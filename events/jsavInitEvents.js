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
  const wasHandled = () => def_func.setExerciseOptions(eventData);
  return isRightEvent && wasHandled();
}

function setDefinitions(eventData) {
  const isRightEvent = eventData.type === 'jsav-exercise-init';
  const wasHandled = () => def_func.setDefinitions(eventData.exercise);
  return isRightEvent && wasHandled();
}

function setDataStructures(eventData, passEvent) {
  const isRightEvent = eventData.type === 'jsav-exercise-init';
  const wasHandled = () => {
    return init_state_func.setInitialDataStructures(eventData.exercise, passEvent);
  }
  return isRightEvent && wasHandled();
}

function setInitialHtml(eventData) {
  const isRightEvent = eventData.type === 'jsav-exercise-init';
  const wasHandled = () => init_state_func.setAnimationHTML(eventData.exercise);
  return isRightEvent && wasHandled();
}

module.exports = {
  handled: initEventHandledSuccesfully
}
