import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { Row, Col, Button, Spin } from "antd";

import {
  fetchSentenceExerciseDetailThunk,
  submitSentenceAnswerThunk,
  resetSentenceResult,
} from "../../redux/slices/sentenceConstructionSlice";

import {
  currentSentenceExerciseSelector,
  sentenceExerciseDetailLoadingSelector,
  sentenceSubmittingSelector,
  sentenceLastResultSelector,
} from "../../redux/selectors/sentenceConstructionSelectors";

import "./SentenceConstructionLessonDetail.css";

/* ===========================================================
   CONTAINER: fetch exercise, handle routing
   =========================================================== */

const SentenceConstructionLessonDetail = () => {
  const { exerciseId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const exercise = useSelector(currentSentenceExerciseSelector);
  const loadingExercise = useSelector(sentenceExerciseDetailLoadingSelector);
  const submitting = useSelector(sentenceSubmittingSelector);
  const lastResult = useSelector(sentenceLastResultSelector);

  useEffect(() => {
    if (exerciseId) {
      dispatch(fetchSentenceExerciseDetailThunk(Number(exerciseId)));
    }

    return () => {
      // clear result when leaving page
      dispatch(resetSentenceResult());
    };
  }, [dispatch, exerciseId]);

  const handleBackToList = () => {
    navigate("/sentence-construction");
  };

  return (
    <div className="sentence-lesson-detail-container">
      <Row justify="center">
        <Col xs={24} md={20} lg={16}>
          <div className="sentence-lesson-header">
            <div className="sentence-lesson-back" onClick={handleBackToList}>
              ← Quay lại danh sách bài
            </div>
            <h2 className="sentence-lesson-title">
              Bé hãy sắp xếp các từ dưới đây thành một câu đúng.
            </h2>
          </div>

          {loadingExercise || !exercise ? (
            <div className="sentence-lesson-loading">
              <Spin size="large" />
            </div>
          ) : (
            <SentenceExercisePlayer
              key={exercise.id} // remount when exercise changes
              exercise={exercise}
              submitting={submitting}
              lastResult={lastResult}
              onSubmit={(submittedWords) =>
                dispatch(
                  submitSentenceAnswerThunk({
                    exerciseId: exercise.id,
                    submittedWords,
                  })
                )
              }
            />
          )}
        </Col>
      </Row>
    </div>
  );
};

/* ===========================================================
   PRESENTATION: plays ONE sentence exercise
   =========================================================== */

const SentenceExercisePlayer = ({
  exercise,
  submitting,
  lastResult,
  onSubmit,
}) => {
  // init from props ONCE (thanks to key={exercise.id} on parent)
  const [availableWords, setAvailableWords] = useState(() =>
    exercise.scrambledWords.map((w, idx) => ({ id: idx, text: w }))
  );
  const [selectedWords, setSelectedWords] = useState([]);

  const answerSlotsCount = exercise.scrambledWords.length;

  const handleSelectWord = (id) => {
    const wordObj = availableWords.find((w) => w.id === id);
    if (!wordObj) return;
    setAvailableWords((prev) => prev.filter((w) => w.id !== id));
    setSelectedWords((prev) => [...prev, wordObj]);
  };

  const handleRemoveSelectedWord = (id) => {
    const wordObj = selectedWords.find((w) => w.id === id);
    if (!wordObj) return;
    setSelectedWords((prev) => prev.filter((w) => w.id !== id));
    setAvailableWords((prev) => [...prev, wordObj]);
  };

  const handleSubmit = () => {
    const submittedWords = selectedWords.map((w) => w.text);
    onSubmit(submittedWords);
  };

  return (
    <>
      {/* answer lines + slots */}
      <div className="sentence-lesson-answer-area">
        <div className="sentence-lesson-line" />
        <div className="sentence-lesson-line" />

        <div className="sentence-lesson-answer-slots">
          {Array.from({ length: answerSlotsCount }).map((_, index) => {
            const wordObj = selectedWords[index];
            return (
              <div
                key={index}
                className={"answer-slot" + (wordObj ? " filled" : "")}
                onClick={() => wordObj && handleRemoveSelectedWord(wordObj.id)}
              >
                {wordObj?.text}
              </div>
            );
          })}
        </div>
      </div>

      {/* word bank */}
      <div className="sentence-lesson-word-bank">
        {availableWords.map((word) => (
          <button
            key={word.id}
            className="word-chip"
            onClick={() => handleSelectWord(word.id)}
          >
            {word.text}
          </button>
        ))}
      </div>

      {/* footer: submit button */}
      <div className="sentence-lesson-footer">
        <Button
          type="primary"
          className="submit-btn"
          onClick={handleSubmit}
          loading={submitting}
          disabled={selectedWords.length === 0}
        >
          KIỂM TRA
        </Button>
      </div>

      {/* result bar */}
      {lastResult && (
        <div
          className={
            "sentence-lesson-result-bar " +
            (lastResult.correct ? "correct" : "incorrect")
          }
        >
          {lastResult.correct ? (
            <>
              <span className="result-icon">✓</span>
              <span className="result-text">
                Tuyệt! Câu đúng là:{" "}
                <strong>{lastResult.correctSentence}</strong>
              </span>
            </>
          ) : (
            <>
              <span className="result-icon">✕</span>
              <span className="result-text">
                Con thử lại nhé! Câu đúng là:{" "}
                <strong>{lastResult.correctSentence}</strong>
              </span>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default SentenceConstructionLessonDetail;
