import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Row, Col, Spin, Empty } from "antd";

import SentenceConstructionCard from "../SentenceConstructionCard/SentenceConstructionCard";
import { fetchSentenceExercisesThunk } from "../../redux/slices/sentenceConstructionSlice";
import {
  sentenceExercisesSelector,
  sentenceExercisesLoadingSelector,
  sentenceExercisesErrorSelector,
} from "../../redux/selectors/sentenceConstructionSelectors";

import "./SentenceConstructionLessons.css";

const SentenceConstructionLessons = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const exercises = useSelector(sentenceExercisesSelector) || [];
  const loading = useSelector(sentenceExercisesLoadingSelector);
  const error = useSelector(sentenceExercisesErrorSelector);

  useEffect(() => {
    dispatch(fetchSentenceExercisesThunk());
  }, [dispatch]);

  // 24 exercises -> 12 lessons, each lesson has 2 questions
  const lessons = useMemo(() => {
    const res = [];
    for (let i = 0; i < exercises.length; i += 2) {
      const q1 = exercises[i];
      const q2 = exercises[i + 1];

      res.push({
        id: i / 2 + 1, // lessonId: 1..12
        level: q1?.level || "easy",
        // keep this field name so Card won't break if it expects scrambledWords
        scrambledWords: q1?.scrambledWords || [],
        // store real questions for detail page usage if needed later
        questions: [q1, q2].filter(Boolean),
        questionCount: [q1, q2].filter(Boolean).length,
      });
    }
    return res;
  }, [exercises]);

  const handleCardClick = (lessonId) => {
    // lessonId, NOT exerciseId
    navigate(`/sentence-construction/${lessonId}`);
  };

  return (
    <div className="sentence-lessons-container">
      <div className="sentence-lessons-header">
        <h2 className="sentence-lessons-title">Luyện diễn đạt</h2>
      </div>

      {loading ? (
        <div className="sentence-lessons-loading">
          <Spin size="large" />
        </div>
      ) : error ? (
        <div className="sentence-lessons-error">
          Đã xảy ra lỗi khi tải bài tập: {error}
        </div>
      ) : !lessons.length ? (
        <div className="sentence-lessons-empty">
          <Empty description="Hiện chưa có bài luyện diễn đạt nào." />
        </div>
      ) : (
        <Row gutter={[24, 24]} className="sentence-lessons-grid">
          {lessons.map((lesson, index) => (
            <Col key={lesson.id} xs={24} sm={12} md={12} lg={6}>
              <SentenceConstructionCard
                index={index}
                exercise={lesson}
                onClick={() => handleCardClick(lesson.id)}
              />
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default SentenceConstructionLessons;
