export const sentenceExercisesSelector = (state) =>
  state.sentenceConstruction.exercises;

export const sentenceExercisesLoadingSelector = (state) =>
  state.sentenceConstruction.loadingExercises;

export const sentenceExercisesErrorSelector = (state) =>
  state.sentenceConstruction.exercisesError;

export const currentSentenceExerciseSelector = (state) =>
  state.sentenceConstruction.currentExercise;

export const sentenceExerciseDetailLoadingSelector = (state) =>
  state.sentenceConstruction.loadingExerciseDetail;

export const sentenceExerciseDetailErrorSelector = (state) =>
  state.sentenceConstruction.exerciseDetailError;

export const sentenceSubmittingSelector = (state) =>
  state.sentenceConstruction.submitting;

export const sentenceSubmitErrorSelector = (state) =>
  state.sentenceConstruction.submitError;

export const sentenceLastResultSelector = (state) =>
  state.sentenceConstruction.lastResult;

export const sentenceLastSubmittedExerciseIdSelector = (state) =>
  state.sentenceConstruction.lastSubmittedExerciseId;
