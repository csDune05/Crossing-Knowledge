import "./SentenceConstructionLessonDetail.css";
import { useState } from "react";
import { Button } from "antd";
import { CheckCircleFilled } from "@ant-design/icons";
import { ImCross } from "react-icons/im";
import { useNavigate } from "react-router-dom";

const MOCK_SENTENCE_EXERCISES = [
  {
    id: 1,
    level: "easy",
    scrambledWords: ["Hôm", "nay,", "bé", "đi", "học."],
    correctSentence: "Hôm nay, bé đi học.",
  },
  {
    id: 2,
    level: "easy",
    scrambledWords: ["Bé", "đã", "làm", "bài", "tập."],
    correctSentence: "Bé đã làm bài tập.",
  },
  // tạm thời các id khác dùng lại bài 1
];

const SentenceConstructionLessonDetail = () => {
  const navigate = useNavigate();
  const numberOfQuestions = MOCK_SENTENCE_EXERCISES.length;

  /* one lesson has several questions */
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const currentQuestion = MOCK_SENTENCE_EXERCISES[currentQuestionIndex];

  const scrambledWords = currentQuestion.scrambledWords;
  /* [false, true, false,...] => true means the word has been selected*/
  const [scrambledWordsStatus, setScrambleWordsStatus] = useState(
    Array(scrambledWords.length).fill(false)
  );
  /* use index of scrambled words to display */
  const [selectedWordsIndex, setSelectedWordsIndex] = useState([]);
  const [checkableButton, setCheckableButton] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);

  const resetForNextQuestion = (nextIndex) => {
    const nextQuestion = MOCK_SENTENCE_EXERCISES[nextIndex];
    const nextWords = nextQuestion.scrambledWords;

    setScrambleWordsStatus(Array(nextWords.length).fill(false));
    setSelectedWordsIndex([]);
    setCheckableButton(false);
    setIsCorrect(null);
  };

  const goNextQuestion = () => {
    if (currentQuestionIndex >= numberOfQuestions - 1) {
      navigate(-1);
      return;
    }
    const nextIndex = currentQuestionIndex + 1;
    setCurrentQuestionIndex(nextIndex);
    resetForNextQuestion(nextIndex);
  };

  const handleScrambledWordClick = (index) => {
    /* if the word is already selected, return */
    if (scrambledWordsStatus[index]) {
      return;
    }

    // if previous result is incorrect, user edits → clear result UI
    if (isCorrect === false) {
      setIsCorrect(null);
    }

    const newScrambledWordsStatus = scrambledWordsStatus.map((status, id) => {
      if (id === index) {
        return true;
      } else return status;
    });
    setScrambleWordsStatus(newScrambledWordsStatus);

    const newSelectedWordsIndex = [...selectedWordsIndex, index];
    setSelectedWordsIndex(newSelectedWordsIndex);

    /*check status of button */
    setCheckableButton(newSelectedWordsIndex.length == scrambledWords.length);
  };

  const handleSelectedWordClick = (index) => {
    /*original index of that word*/
    const scrambledWordIndex = selectedWordsIndex[index];

    // if previous result is incorrect, user edits → clear result UI
    if (isCorrect === false) {
      setIsCorrect(null);
    }

    /*give the word back to the scrambled words array*/
    const newScrambledWordsStatus = scrambledWordsStatus.map((status, id) => {
      if (id === scrambledWordIndex) {
        return false;
      } else return status;
    });
    setScrambleWordsStatus(newScrambledWordsStatus);

    /*delete that word from seleted words array*/
    const newSelectedWordsIndex = selectedWordsIndex.filter(
      (_, id) => id != index
    );
    setSelectedWordsIndex(newSelectedWordsIndex);

    /*check status of button */
    setCheckableButton(newSelectedWordsIndex.length == scrambledWords.length);
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

    /*Check answer result */
    const result = selectedWordsIndex
      .map((idx) => scrambledWords[idx])
      .join(" ");

    setIsCorrect(result === currentQuestion.correctSentence);
  };

  const buttonText =
    isCorrect === true ? "Tiếp" : checkableButton ? "Kiểm tra" : "Bỏ qua";

  return (
    <div className="sentence-construction-lesson-detail-container">
      <div className="progress-blocks">
        {MOCK_SENTENCE_EXERCISES.map((question, index) => (
          <div
            key={question.id}
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
        >
          {buttonText}
        </Button>
      </div>
    </div>
  );
};

export default SentenceConstructionLessonDetail;
