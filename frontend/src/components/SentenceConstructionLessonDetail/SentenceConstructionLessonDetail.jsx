import "./SentenceConstructionLessonDetail.css";
import { useEffect, useState } from "react";
import { Button, Spin } from "antd";
import { CheckCircleFilled } from "@ant-design/icons";
import { ImCross } from "react-icons/im";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchSentenceExerciseDetailThunk,
  submitSentenceAnswerThunk,
  resetSentenceResult,
} from "../../redux/slices/sentenceConstructionSlice";

import {
  currentSentenceExerciseSelector,
  sentenceExerciseDetailLoadingSelector,
  sentenceExerciseDetailErrorSelector,
  sentenceSubmittingSelector,
  sentenceSubmitErrorSelector,
  sentenceLastResultSelector,
  sentenceLastSubmittedExerciseIdSelector,
} from "../../redux/selectors/sentenceConstructionSelectors";

const SentenceConstructionLessonDetail = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { exerciseId } = useParams(); // this could be lessonId OR exerciseId depending on BE
  const idFromRoute = Number(exerciseId);

  const data = useSelector(currentSentenceExerciseSelector); // could be lesson or single exercise
  const loading = useSelector(sentenceExerciseDetailLoadingSelector);
  const error = useSelector(sentenceExerciseDetailErrorSelector);

  const submitting = useSelector(sentenceSubmittingSelector);
  const submitError = useSelector(sentenceSubmitErrorSelector);
  const lastResult = useSelector(sentenceLastResultSelector);
  const lastSubmittedExerciseId = useSelector(
    sentenceLastSubmittedExerciseIdSelector
  );

  /* one lesson has several questions */
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // local UI state (same as your original)
  const [scrambledWordsStatus, setScrambleWordsStatus] = useState([]);
  const [selectedWordsIndex, setSelectedWordsIndex] = useState([]);
  const [checkableButton, setCheckableButton] = useState(false);

  useEffect(() => {
    if (!Number.isFinite(idFromRoute)) return;
    dispatch(fetchSentenceExerciseDetailThunk(idFromRoute));
    dispatch(resetSentenceResult());
    setCurrentQuestionIndex(0);
  }, [dispatch, idFromRoute]);

  // ===== normalize API shape =====
  // Case A: BE returns a lesson: { id, level, questionCount, questions: [...] }
  // Case B: BE returns a single exercise: { id, level, scrambledWords, correctSentences }
  const questions = Array.isArray(data?.questions)
    ? data.questions
    : data?.scrambledWords
      ? [
          {
            id: data.id,
            level: data.level,
            scrambledWords: data.scrambledWords,
            correctSentences: data.correctSentences,
          },
        ]
      : [];

  const numberOfQuestions = questions.length;
  const currentQuestion = questions[currentQuestionIndex];
  const scrambledWords = currentQuestion?.scrambledWords || [];

  // only show result if it belongs to current question id
  const isCorrect =
    currentQuestion && lastSubmittedExerciseId === currentQuestion.id
      ? (lastResult?.correct ?? null)
      : null;

  // reset UI when question changes
  useEffect(() => {
    setScrambleWordsStatus(Array(scrambledWords.length).fill(false));
    setSelectedWordsIndex([]);
    setCheckableButton(false);
    dispatch(resetSentenceResult());
    // keep it consistent with your comments/logic
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
    /* if the word is already selected, return */
    if (scrambledWordsStatus[index]) return;

    // if previous result is incorrect, user edits → clear result UI
    if (isCorrect === false) {
      dispatch(resetSentenceResult());
    }

    const newScrambledWordsStatus = scrambledWordsStatus.map((status, id) =>
      id === index ? true : status
    );
    setScrambleWordsStatus(newScrambledWordsStatus);

    const newSelectedWordsIndex = [...selectedWordsIndex, index];
    setSelectedWordsIndex(newSelectedWordsIndex);

    /*check status of button */
    setCheckableButton(newSelectedWordsIndex.length === scrambledWords.length);
  };

  const handleSelectedWordClick = (index) => {
    /*original index of that word*/
    const scrambledWordIndex = selectedWordsIndex[index];

    // if previous result is incorrect, user edits → clear result UI
    if (isCorrect === false) {
      dispatch(resetSentenceResult());
    }

    /*give the word back to the scrambled words array*/
    const newScrambledWordsStatus = scrambledWordsStatus.map((status, id) =>
      id === scrambledWordIndex ? false : status
    );
    setScrambleWordsStatus(newScrambledWordsStatus);

    /*delete that word from seleted words array*/
    const newSelectedWordsIndex = selectedWordsIndex.filter(
      (_, id) => id !== index
    );
    setSelectedWordsIndex(newSelectedWordsIndex);

    /*check status of button */
    setCheckableButton(newSelectedWordsIndex.length === scrambledWords.length);
  };

  const handleButtonClick = () => {
    // only correct → next
    if (isCorrect === true) {
      goNextQuestion();
      return;
    }

    // not enough words → skip
    if (!checkableButton) {
      goNextQuestion();
      return;
    }

    if (!currentQuestion) return;

    const submittedWords = selectedWordsIndex.map((idx) => scrambledWords[idx]);

    dispatch(
      submitSentenceAnswerThunk({
        exerciseId: currentQuestion.id, // IMPORTANT: question id
        submittedWords,
      })
    );
  };

  const buttonText =
    isCorrect === true ? "Tiếp" : checkableButton ? "Kiểm tra" : "Bỏ qua";

  // ===== UI states =====
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

  // ===== keep your DOM structure to not break CSS =====
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
          ></div>
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
