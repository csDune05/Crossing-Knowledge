import "./SentenceConstructionCard.css";
import lessonCardBackground from "../../assets/lesson-card-background.png";

const SentenceConstructionCard = ({ index, exercise, onClick }) => {
  console.log("Rendering SentenceConstructionCard with exercise:", exercise);
  return (
    <div className="sentence-card-container" onClick={onClick}>
      <div
        className="sentence-card-inner"
        style={{ backgroundImage: `url(${lessonCardBackground})` }}
      >
        <div className="lesson-label">BÀI {index + 1}</div>
      </div>
    </div>
  );
};

export default SentenceConstructionCard;
