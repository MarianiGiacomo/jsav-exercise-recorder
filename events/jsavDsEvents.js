/*
Handling of the following events:
'jsav-array-*',
'jsav-node-*',
'jsav-edge-*',
'recorder-set-id',
*/

const init_state_func = require('../initialState/initialState');
const anim_func = require('../animation/animation');

const arrayEventHandled = (exercise, event) => {
  const isRightEvent = event.type.match(/^jsav-array-.*/);
  const wasHandled = anim_func.handleArrayEvents;
  return isRightEvent && wasHandled(exercise, event);
}

const nodeEventHandled = (exercise, event) => {
  const isRightEvent = event.type.match(/^jsav-node-.*/);
  const wasHandled = anim_func.handleNodeEvents;
  return isRightEvent && wasHandled(exercise, event);
}

const edgeEventHandled = (exercise, event) => {
  const isRightEvent = event.type.match(/^jsav-edge-.*/);
  const wasHandled = anim_func.handleEdgeEvents;
  return isRightEvent && wasHandled(exercise, event);
}

const missinIdUpdated = (event) => {
  const isRightEvent = event.type === 'recorder-set-id';
  const wasHandled = init_state_func.setNewId;
  return isRightEvent && wasHandled(exercise, event);
}

const atLeastOneDsEventHandled = (exercise, event) => {
  const arrayEvent = () => arrayEventHandled(exercise, event);
  const nodeEvent = () => nodeEventHandled(exercise, event);
  const edgeEvent = () => edgeEventHandled(exercise, event);
  const missingId = () => missinIdUpdated(event);
  return arrayEvent || nodeEvent || edgeEvent || missingId;
}

const dsEventHandledSuccesfully = (exercise, event) => {
  const exerciseRecorded = typeof(exercise) === 'object';
  return exerciseRecorded && atLeastOneDsEventHandled(exercise, event);
}

module.exports = {
  handled: dsEventHandledSuccesfully
}
