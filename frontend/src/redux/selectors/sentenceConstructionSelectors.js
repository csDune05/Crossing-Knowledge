import { createSelector } from "@reduxjs/toolkit";

export const sentenceExercisesSelector = (state) =>
  state.sentenceConstruction.exercises;

export const sentenceExercisesLoadingSelector = (state) =>
  state.sentenceConstruction.loadingExercises;

export const sentenceExercisesErrorSelector = (state) =>
  state.sentenceConstruction.exercisesError;

export const sentenceSubmittingSelector = (state) =>
  state.sentenceConstruction.submitting;

export const sentenceSubmitErrorSelector = (state) =>
  state.sentenceConstruction.submitError;

export const sentenceLastResultSelector = (state) =>
  state.sentenceConstruction.lastResult;

export const sentenceLastSubmittedExerciseIdSelector = (state) =>
  state.sentenceConstruction.lastSubmittedExerciseId;

/* =======================================================
   NEW: derive lessons from exercises (24 questions -> 12 lessons)
   Each lesson has 2 questions, based on sorted exercise.id
   ======================================================= */

const QUESTIONS_PER_LESSON = 2;

export const sentenceLessonsSelector = createSelector(
  [sentenceExercisesSelector],
  (exercises = []) => {
    const sorted = [...exercises].sort((a, b) => (a?.id ?? 0) - (b?.id ?? 0));

    const lessons = [];
    for (let i = 0; i < sorted.length; i += QUESTIONS_PER_LESSON) {
      const q1 = sorted[i];
      const q2 = sorted[i + 1];
      const questions = [q1, q2].filter(Boolean);

      lessons.push({
        id: i / QUESTIONS_PER_LESSON + 1, // lessonId: 1..N
        level: q1?.level || q2?.level || "easy",
        questionCount: questions.length,
        questions,
        // keep for Card (so Card won't break)
        scrambledWords: q1?.scrambledWords || q2?.scrambledWords || [],
      });
    }

    return lessons;
  }
);

export const sentenceLessonByIdSelector = createSelector(
  [sentenceLessonsSelector, (_, lessonId) => Number(lessonId)],
  (lessons, lessonId) => lessons.find((l) => l.id === lessonId) || null
);
