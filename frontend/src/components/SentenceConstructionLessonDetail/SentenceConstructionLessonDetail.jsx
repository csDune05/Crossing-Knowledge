import "./SentenceConstructionLessonDetail.css";
import { useEffect, useMemo, useState } from "react";
import { Button, Spin } from "antd";
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
  const { exerciseId } = useParams(); // lessonId in FE
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

  // Ensure we have list data (works on refresh)
  useEffect(() => {
    if (!exercises.length) dispatch(fetchSentenceExercisesThunk());
  }, [dispatch, exercises.length]);

  // When lesson changes, reset question index + result
  useEffect(() => {
    if (!Number.isFinite(lessonId)) return;
    setCurrentQuestionIndex(0);
    dispatch(resetSentenceResult());
  }, [dispatch, lessonId]);

  // Only show result if it belongs to current QUESTION id
  const isCorrect =
    currentQuestion && lastSubmittedExerciseId === currentQuestion.id
      ? (lastResult?.correct ?? null)
      : null;

  // Reset UI when question changes
  useEffect(() => {
    setScrambleWordsStatus(Array(scrambledWords.length).fill(false));
    setSelectedWordsIndex([]);
    setCheckableButton(false);
    dispatch(resetSentenceResult());
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
    if (scrambledWordsStatus[index]) return;

    // if wrong then user edits -> clear result + force re-check flow
    if (isCorrect === false) {
      dispatch(resetSentenceResult());
    }

    const newStatus = scrambledWordsStatus.map((s, i) =>
      i === index ? true : s
    );
    setScrambleWordsStatus(newStatus);

    const newSelected = [...selectedWordsIndex, index];
    setSelectedWordsIndex(newSelected);

    setCheckableButton(newSelected.length === scrambledWords.length);
  };

  const handleSelectedWordClick = (index) => {
    const scrambledWordIndex = selectedWordsIndex[index];

    if (isCorrect === false) {
      dispatch(resetSentenceResult());
    }

    const newStatus = scrambledWordsStatus.map((s, i) =>
      i === scrambledWordIndex ? false : s
    );
    setScrambleWordsStatus(newStatus);

    const newSelected = selectedWordsIndex.filter((_, i) => i !== index);
    setSelectedWordsIndex(newSelected);

    setCheckableButton(newSelected.length === scrambledWords.length);
  };

  const handleButtonClick = () => {
    // correct -> next
    if (isCorrect === true) {
      goNextQuestion();
      return;
    }

    // not enough words -> skip
    if (!checkableButton) {
      goNextQuestion();
      return;
    }

    if (!currentQuestion) return;

    const submittedWords = selectedWordsIndex.map((idx) => scrambledWords[idx]);

    dispatch(
      submitSentenceAnswerThunk({
        exerciseId: currentQuestion.id, // QUESTION id
        submittedWords,
      })
    );
  };

  const buttonText =
    isCorrect === true ? "Tiếp" : checkableButton ? "Kiểm tra" : "Bỏ qua";

  // UI states
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
          Đã xảy ra lỗi khi tải bài: {error}
        </div>
      </div>
    );
  }

  if (!numberOfQuestions) {
    return (
      <div className="sentence-construction-lesson-detail-container">
        <div className="sentence-lessons-error">Không có dữ liệu bài.</div>
      </div>
    );
  }

  return (
    <div className="sentence-construction-lesson-detail-container">
      <div className="progress-blocks">
        {questions.map((q, index) => (
          <div
            key={q.id}
            style={{ width: `${100 / numberOfQuestions}%` }}
            className={`progress-block progress-block${
              index < currentQuestionIndex ? "--completed" : "--pending"
            }`}
          />
        ))}
      </div>

      <div className="question-content">
        <div className="prompt">
          Bé hãy sắp xếp các từ dưới đây thành một câu đúng.
        </div>

        <div className="main-question-wrapper">
          <div className="selected-words-wrapper">
            {selectedWordsIndex.map((scrambledWordIndex, index) => (
              <div
                className="selected-word"
                key={index}
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
                key={index}
                onClick={() => handleScrambledWordClick(index)}
              >
                {status ? "" : scrambledWords[index]}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        className={`result-area result-area${
          isCorrect == true
            ? "--correct"
            : isCorrect == false
              ? "--incorrect"
              : ""
        }`}
      >
        <div className="result-text-wrapper">
          {isCorrect == true ? (
            <>
              <CheckCircleFilled className="icon icon--correct" />
              <div className="text text--correct">Tuyệt!</div>
            </>
          ) : isCorrect == false ? (
            <>
              <ImCross className="icon icon--incorrect" />
              <div className="text text--incorrect">Con thử lại nhé!!</div>
            </>
          ) : (
            ""
          )}
        </div>

        <Button
          className={`btn 
            btn${checkableButton ? "--checkable" : "--uncheckable"}
            btn${isCorrect == true ? "--correct" : isCorrect == false ? "--incorrect" : ""}`}
          onClick={handleButtonClick}
          disabled={submitting}
        >
          {buttonText}
        </Button>
      </div>

      {submitError ? (
        <div style={{ textAlign: "center", color: "red", marginTop: 8 }}>
          {submitError}
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default SentenceConstructionLessonDetail;
