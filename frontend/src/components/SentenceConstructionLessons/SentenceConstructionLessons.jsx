import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Row, Col, Spin, Empty } from "antd";

import SentenceConstructionCard from "../SentenceConstructionCard/SentenceConstructionCard";
import { fetchSentenceExercisesThunk } from "../../redux/slices/sentenceConstructionSlice";
import {
  sentenceLessonsSelector,
  sentenceExercisesLoadingSelector,
  sentenceExercisesErrorSelector,
} from "../../redux/selectors/sentenceConstructionSelectors";

import "./SentenceConstructionLessons.css";

const SentenceConstructionLessons = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const lessons = useSelector(sentenceLessonsSelector) || [];
  const loading = useSelector(sentenceExercisesLoadingSelector);
  const error = useSelector(sentenceExercisesErrorSelector);

  useEffect(() => {
    dispatch(fetchSentenceExercisesThunk());
  }, [dispatch]);

  const handleCardClick = (lessonId) => {
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
