import "./SentenceConstructionLessonDetail.css";
import { useState } from "react";
import { Button, Divider } from "antd";

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
  const numberOfQuestions = MOCK_SENTENCE_EXERCISES.length;

  /* 
  one lesson has several questions 
  */
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const currentQuestion = MOCK_SENTENCE_EXERCISES[currentQuestionIndex];

  const scrambledWords = currentQuestion.scrambledWords;
  /* 
  [false, true, false,...] => true means the word has been selected
  */
  const [scrambledWordsStatus, setScrambleWordsStatus] = useState(
    Array(scrambledWords.length).fill(false)
  );
  /*  
  use index of scrambled words to display 
  */
  const [selectedWordsIndex, setSelectedWordsIndex] = useState([]);

  // console.log(
  //   "in sentence construction lesson detail, scrambledWordsStatus = ",
  //   scrambledWordsStatus
  // );

  const handleScrambledWordClick = (index) => {
    // console.log(index);

    /* 
    if the word is already selected, return
    */
    if (scrambledWordsStatus[index]) {
      return;
    }

    const newScrambledWordsStatus = scrambledWordsStatus.map((status, id) => {
      if (id === index) {
        return true;
      } else return status;
    });
    setScrambleWordsStatus(newScrambledWordsStatus);

    console.log(newScrambledWordsStatus);

    const newSelectedWordsIndex = [...selectedWordsIndex, index];
    setSelectedWordsIndex(newSelectedWordsIndex);
  };

  const handleSelectedWordClick = (index) => {
    /*
    original index of that word
    */
    const scrambledWordIndex = selectedWordsIndex[index];

    /*
    give the word back to the scrambled words array
    */
    const newScrambledWordsStatus = scrambledWordsStatus.map((status, id) => {
      if (id === scrambledWordIndex) {
        return false;
      } else return status;
    });
    setScrambleWordsStatus(newScrambledWordsStatus);

    /*
    delete that word from seleted words array
    */
    const newSelectedWordsIndex = selectedWordsIndex.filter(
      (_, id) => id != index
    );
    setSelectedWordsIndex(newSelectedWordsIndex);
  };

  const handleButtonClick = () => {
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

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
            {selectedWordsIndex.map((scrambledWordIndex, index) => {
              return (
                <div
                  className="selected-word"
                  key={index}
                  onClick={() => handleSelectedWordClick(index)}
                >
                  {scrambledWords[scrambledWordIndex]}
                </div>
              );
            })}
          </div>
          <div className="scrambled-words-wrapper">
            {scrambledWordsStatus.map((status, index) => {
              return (
                <div
                  className={`scrambled-word scrambled-word${
                    status ? "--selected" : ""
                  }`}
                  key={index}
                  onClick={() => handleScrambledWordClick(index)}
                >
                  {status ? "" : scrambledWords[index]}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="result-area">
        {/* <Divider /> */}
        <Button type="primary" onClick={handleButtonClick}>
          Kiem tra
        </Button>
      </div>
    </div>
  );
};

export default SentenceConstructionLessonDetail;
