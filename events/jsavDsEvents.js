/*
Handling of the following events:
'jsav-array-*',
'jsav-node-*',
'jsav-edge-*',
'recorder-set-id',
*/

const init_state_func = require('../initialState/initialState');
const anim_func = require('../animation/animation');

function dsEventHandledSuccesfully(exercise, eventData) {
  const exerciseRecorded = typeof(exercise) === 'object';
  return exerciseRecorded && atLeastOneDsEventHandled(exercise, eventData);
}

function atLeastOneDsEventHandled(exercise, eventData) {
  const arrayEvent = () => arrayEventHandled(exercise, eventData);
  const nodeEvent = () => nodeEventHandled(exercise, eventData);
  const edgeEvent = () => edgeEventHandled(exercise, eventData);
  const missingId = () => missingIdUpdated(eventData);
  return arrayEvent() || nodeEvent() || edgeEvent() || missingId();
}


function arrayEventHandled(exercise, eventData) {
  const isRightEvent = eventData.type.match(/^jsav-array-.*/);
  const wasHandled = () => anim_func.handleArrayEvents(exercise, eventData);
  return isRightEvent && wasHandled();
}

function nodeEventHandled(exercise, eventData) {
  const isRightEvent = eventData.type.match(/^jsav-node-.*/);
  const wasHandled = anim_func.handleNodeEvents(exercise, eventData);
  return isRightEvent && wasHandled();
}

function edgeEventHandled(exercise, eventData) {
  const isRightEvent = eventData.type.match(/^jsav-edge-.*/);
  const wasHandled = () => anim_func.handleEdgeEvents(exercise, eventData);
  return isRightEvent && wasHandled();
}

function missingIdUpdated(eventData) {
  const isRightEvent = eventData.type === 'recorder-set-id';
  const wasHandled = () => init_state_func.setNewId(exercise, eventData);
  return isRightEvent && wasHandled();
}

module.exports = {
  handled: dsEventHandledSuccesfully
}
