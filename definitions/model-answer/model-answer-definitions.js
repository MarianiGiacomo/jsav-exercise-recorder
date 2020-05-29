const submission = require('../../submission/submission');

// Adds the model answer function as string
function recordModelAnswerFunction(modelAnswerFunction) {
  try {
    submission.addDefinitionSuccesfully.modelAnswerFunction(modelAnswerFunction);
  } catch (error) {
    throw error;
  }
  return true;
}

function recordModelAnswerStep(exercise) {
  const redoArray = exercise.modelav._redo;
  if(redoArray.length >= 0) {
    const dataStructures = recordModelAnswerStepDataStructuresValues(exercise);
    const operations =  redoArray.length === 0? [] : getModelAnswerStepOperations(redoArray[0].operations);
    const html = getModelAnswerStepHTML();
    const modelAnswerStep = { dataStructures, operations, html };
    submission.addDefinitionSuccesfully.modelAnswerStep(modelAnswerStep);
    if(redoArray.length === 0) return false;
    return true;
  }
  return false;
}

function recordModelAnswerStepDataStructuresValues(exercise) {
  const modelStructures = exercise.modelStructures;
  const stepDSvalues = [];
  if(Array.isArray(modelStructures)) {
    modelStructures.forEach((item) => {
      stepDSvalues.push([ ...item._values || 'undefined' ]);
    });
  } else {
    stepDSvalues.push([ ...modelStructures._values || 'undefined' ]);
  }
  return stepDSvalues;
}

function getModelAnswerStepOperations(operations) {
  const stepOperations = []
  for(const op in operations) {
    stepOperations.push({
      args: getFormattedOperationArgs(operations[op].args),
      effect: operations[op].effect.toString(),
    })
  }
  return stepOperations;
}

function getFormattedOperationArgs(args) {
  const formattedArgs = {}
  for(const arg in args) {
    const handledArray = () => Array.isArray(args[arg]) && getFormattedOperationArgs(args);
    const handledNonObjects = () => typeof(args[arg]) !== 'object' && args[arg];
    const convertedToString = () => `Converted to string when recording to avoid cyclic object value: ${args[arg].toString()}`
    formattedArgs[arg] = handledArray || handledNonObjects || convertedToString;
  }
  return formattedArgs;
}

function getModelAnswerStepHTML() {
  let counterHTML = $('.jsavmodelanswer .jsavcounter').html();
  let outputHTML = $('.jsavmodelanswer .jsavoutput').html();
  let canvasHTML = $('.jsavmodelanswer .jsavcanvas').html();
  return {counterHTML,  outputHTML, canvasHTML };
}

function modelAnswerProgress() {
  return submission.state().definitions.modelAnswer.steps.slice(-1)[0].html.counterHTML;
}


module.exports = {
  recordModelAnswerFunction,
  recordModelAnswerStep,
  modelAnswerProgress,
}
