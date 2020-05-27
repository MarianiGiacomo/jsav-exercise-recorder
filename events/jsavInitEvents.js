const initEventHandledSuccesfully = (event) => {
  const optionsSet = () => {
    return event.type === 'jsav-init' && def_func.setExerciseOptions(event)
  };
  const definitionsSet = () => {
    return event.type === 'jsav-exercise-init' && def_func.setDefinitions(event.exercise);
  };
  const dataStructuresSet = () => {
    return init_state_func.setInitialDataStructures(event.exercise, passEvent);
  };
  const initialHTML = () => {
    init_state_func.setAnimationHTML(event.exercise);
  }
  return optionsSet || (definitionsSet && initialHTML && event.exercise);
}

module.exports = {
  handled: initEventHandledSuccesfully
}
