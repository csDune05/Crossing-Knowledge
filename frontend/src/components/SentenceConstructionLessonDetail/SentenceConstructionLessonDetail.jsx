import "./SentenceConstructionLessonDetail.css";
import { useEffect, useMemo, useState } from "react";
import { Spin } from "antd";
import { CheckCircleFilled } from "@ant-design/icons";
import { ImCross } from "react-icons/im";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchSentenceExercisesThunk,
  submitSentenceAnswerThunk,
  resetSentenceResult,
} from "../../redux/slices/sentenceConstructionSlice";

import {
  sentenceLessonByIdSelector,
  sentenceExercisesSelector,
  sentenceExercisesLoadingSelector,
  sentenceExercisesErrorSelector,
  sentenceSubmittingSelector,
  sentenceSubmitErrorSelector,
  sentenceLastResultSelector,
  sentenceLastSubmittedExerciseIdSelector,
} from "../../redux/selectors/sentenceConstructionSelectors";

const SentenceConstructionLessonDetail = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { exerciseId } = useParams();
  const lessonId = Number(exerciseId);

  const exercises = useSelector(sentenceExercisesSelector) || [];
  const loading = useSelector(sentenceExercisesLoadingSelector);
  const error = useSelector(sentenceExercisesErrorSelector);

  const lesson = useSelector((state) =>
    sentenceLessonByIdSelector(state, lessonId)
  );

  const submitting = useSelector(sentenceSubmittingSelector);
  const submitError = useSelector(sentenceSubmitErrorSelector);
  const lastResult = useSelector(sentenceLastResultSelector);
  const lastSubmittedExerciseId = useSelector(
    sentenceLastSubmittedExerciseIdSelector
  );

  const questions = useMemo(() => lesson?.questions || [], [lesson]);
  const numberOfQuestions = questions.length;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const currentQuestion = questions[currentQuestionIndex];
  const scrambledWords = currentQuestion?.scrambledWords || [];

  const [scrambledWordsStatus, setScrambleWordsStatus] = useState([]);
  const [selectedWordsIndex, setSelectedWordsIndex] = useState([]);
  const [checkableButton, setCheckableButton] = useState(false);

  useEffect(() => {
    if (!exercises.length) dispatch(fetchSentenceExercisesThunk());
  }, [dispatch, exercises.length]);

  useEffect(() => {
    if (!Number.isFinite(lessonId)) return;
    setCurrentQuestionIndex(0);
    dispatch(resetSentenceResult());
  }, [dispatch, lessonId]);

  const isCorrect =
    currentQuestion && lastSubmittedExerciseId === currentQuestion.id
      ? (lastResult?.correct ?? null)
      : null;

  const resetCurrentAttempt = () => {
    setScrambleWordsStatus(Array(scrambledWords.length).fill(false));
    setSelectedWordsIndex([]);
    setCheckableButton(false);
    dispatch(resetSentenceResult());
  };

  useEffect(() => {
    resetCurrentAttempt();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestionIndex, scrambledWords.length]);

  const goNextQuestion = () => {
    if (currentQuestionIndex >= numberOfQuestions - 1) {
      navigate(-1);
      return;
    }
    setCurrentQuestionIndex((prev) => prev + 1);
  };

  const handleScrambledWordClick = (index) => {
    if (scrambledWordsStatus[index] || isCorrect !== null) return;

    const newStatus = scrambledWordsStatus.map((status, currentIndex) =>
      currentIndex === index ? true : status
    );
    const newSelected = [...selectedWordsIndex, index];

    setScrambleWordsStatus(newStatus);
    setSelectedWordsIndex(newSelected);
    setCheckableButton(newSelected.length === scrambledWords.length);
  };

  const handleSelectedWordClick = (index) => {
    if (isCorrect !== null) return;

    const scrambledWordIndex = selectedWordsIndex[index];
    const newStatus = scrambledWordsStatus.map((status, currentIndex) =>
      currentIndex === scrambledWordIndex ? false : status
    );
    const newSelected = selectedWordsIndex.filter(
      (_, currentIndex) => currentIndex !== index
    );

    setScrambleWordsStatus(newStatus);
    setSelectedWordsIndex(newSelected);
    setCheckableButton(newSelected.length === scrambledWords.length);
  };

  const handleButtonClick = () => {
    if (isCorrect === true) {
      goNextQuestion();
      return;
    }

    if (isCorrect === false) {
      resetCurrentAttempt();
      return;
    }

    if (!checkableButton) {
      goNextQuestion();
      return;
    }

    if (!currentQuestion) return;

    const submittedWords = selectedWordsIndex.map((index) => scrambledWords[index]);

    dispatch(
      submitSentenceAnswerThunk({
        exerciseId: currentQuestion.id,
        submittedWords,
      })
    );
  };

  const buttonText =
    isCorrect === true
      ? "Tiếp"
      : isCorrect === false
        ? "Thử lại"
        : checkableButton
          ? "Kiểm tra"
          : "Bỏ qua";

  if (loading) {
    return (
      <div className="sentence-construction-lesson-detail-container">
        <div className="sentence-lessons-loading">
          <Spin size="large" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="sentence-construction-lesson-detail-container">
        <div className="sentence-lessons-error">
          Da xay ra loi khi tai bai: {error}
        </div>
      </div>
    );
  }

  if (!numberOfQuestions) {
    return (
      <div className="sentence-construction-lesson-detail-container">
        <div className="sentence-lessons-error">Khong co du lieu bai.</div>
      </div>
    );
  }

  return (
    <div className="sentence-construction-lesson-detail-container">
      <div className="progress-blocks">
        {questions.map((question, index) => (
          <div
            key={question.id}
            style={{ width: `${100 / numberOfQuestions}%` }}
            className={`progress-block progress-block${
              index < currentQuestionIndex ? "--completed" : "--pending"
            }`}
          />
        ))}
      </div>

      <div className="question-content">
        <div className="prompt">
          Be hay sap xep cac tu duoi day thanh mot cau dung.
        </div>

        <div className="main-question-wrapper">
          <div className="selected-words-wrapper">
            {selectedWordsIndex.map((scrambledWordIndex, index) => (
              <div
                className="selected-word"
                key={`${scrambledWordIndex}-${index}`}
                onClick={() => handleSelectedWordClick(index)}
              >
                {scrambledWords[scrambledWordIndex]}
              </div>
            ))}
          </div>

          <div className="scrambled-words-wrapper">
            {scrambledWordsStatus.map((status, index) => (
              <div
                className={`scrambled-word scrambled-word${
                  status ? "--selected" : ""
                }`}
                key={`${scrambledWords[index]}-${index}`}
                onClick={() => handleScrambledWordClick(index)}
              >
                {status ? "" : scrambledWords[index]}
              </div>
            ))}
          </div>
        </div>
      </div>

      {isCorrect === null ? (
        <div className="sentence-check-section">
          <button
            type="button"
            className={`sentence-action-btn ${
              checkableButton
                ? "sentence-action-btn--check"
                : "sentence-action-btn--skip"
            }`}
            onClick={handleButtonClick}
            disabled={submitting}
          >
            {buttonText}
          </button>
        </div>
      ) : (
        <div
          className={`sentence-result-bar ${
            isCorrect
              ? "sentence-result-bar--correct"
              : "sentence-result-bar--wrong"
          }`}
        >
          <div className="sentence-result-content">
            <span className="sentence-result-icon">
              {isCorrect ? (
                <CheckCircleFilled className="sentence-icon sentence-icon--correct" />
              ) : (
                <ImCross className="sentence-icon sentence-icon--wrong" />
              )}
            </span>

            <div className="sentence-result-text-block">
              <div className="sentence-result-text">
                {isCorrect ? "Tuyet!" : "Con thu lai nhe!"}
              </div>
            </div>
          </div>

          <button
            type="button"
            className={`sentence-result-action ${
              isCorrect
                ? "sentence-result-action--next"
                : "sentence-result-action--retry"
            }`}
            onClick={handleButtonClick}
            disabled={submitting}
          >
            {buttonText}
          </button>
        </div>
      )}

      {submitError ? (
        <div className="sentence-submit-error">{submitError}</div>
      ) : null}
    </div>
  );
};

export default SentenceConstructionLessonDetail;
