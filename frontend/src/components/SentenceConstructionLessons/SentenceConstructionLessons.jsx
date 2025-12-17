import { useEffect } from "react";
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
import { MOCK_SENTENCE_EXERCISES } from "../../mock/sentenceConstructionMock";

const SentenceConstructionLessons = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //   const exercises = useSelector(sentenceExercisesSelector) || [];
  const exercisesFromApi = useSelector(sentenceExercisesSelector) || [];
  const exercises =
    exercisesFromApi && exercisesFromApi.length > 0
      ? exercisesFromApi
      : MOCK_SENTENCE_EXERCISES;
  const loading = useSelector(sentenceExercisesLoadingSelector);
  const error = useSelector(sentenceExercisesErrorSelector);

  useEffect(() => {
    dispatch(fetchSentenceExercisesThunk());
  }, [dispatch]);

  const handleCardClick = (exerciseId) => {
    navigate(`/sentence-construction/${exerciseId}`);
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
      ) : !exercises.length ? (
        <div className="sentence-lessons-empty">
          <Empty description="Hiện chưa có bài luyện diễn đạt nào." />
        </div>
      ) : (
        <Row gutter={[24, 24]} className="sentence-lessons-grid">
          {exercises.map((exercise, index) => (
            <Col key={exercise.id} xs={24} sm={12} md={12} lg={6}>
              <SentenceConstructionCard
                index={index}
                exercise={exercise}
                onClick={() => handleCardClick(exercise.id)}
              />
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default SentenceConstructionLessons;
