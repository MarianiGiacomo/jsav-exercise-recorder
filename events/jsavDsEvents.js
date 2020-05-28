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
  const missingId = () => missinIdUpdated(eventData);
  return arrayEvent() || nodeEvent() || edgeEvent() || missingId();
}


function arrayEventHandled(exercise, eventData) {
  const isRightEvent = eventData.type.match(/^jsav-array-.*/);
  const wasHandled = anim_func.handleArrayEvents;
  return isRightEvent && wasHandled(exercise, eventData);
}

function nodeEventHandled(exercise, eventData) {
  const isRightEvent = eventData.type.match(/^jsav-node-.*/);
  const wasHandled = anim_func.handleNodeEvents;
  return isRightEvent && wasHandled(exercise, eventData);
}

function edgeEventHandled(exercise, eventData) {
  const isRightEvent = eventData.type.match(/^jsav-edge-.*/);
  const wasHandled = anim_func.handleEdgeEvents;
  return isRightEvent && wasHandled(exercise, eventData);
}

function missinIdUpdated(event) {
  const isRightEvent = eventData.type === 'recorder-set-id';
  const wasHandled = init_state_func.setNewId;
  return isRightEvent && wasHandled(exercise, eventData);
}

module.exports = {
  handled: dsEventHandledSuccesfully
}
