import React from "react";
import "./ListeningComprehension.css";
import ListeningComprehensionDetail from "../ListeningComprehensionDetail/ListeningComprehensionDetail";
import { useNavigate, useParams } from "react-router-dom";

import frameImg from "../../assets/listening-comprehension/frame.png";

const lessons = Array.from({ length: 12 }).map((_, idx) => ({
  routeId: idx + 1,
  title: `Bài ${idx + 1}`,
}));

export default function Listening() {
  const navigate = useNavigate();
  const { lessonId } = useParams();

  const selectedLesson = lessonId
    ? lessons.find((l) => String(l.routeId) === String(lessonId))
    : null;

  if (lessonId && !selectedLesson) {
    return (
      <div className="listen-container">
        <div className="listen-wrap">
          <h1 className="listen-title">Luyện nghe phân biệt</h1>
          <div style={{ marginTop: 12 }}>
            Không tìm thấy bài học.{" "}
            <button onClick={() => navigate("/listening-comprehension")}>
              Quay lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (selectedLesson) {
    return (
      <ListeningComprehensionDetail
        lesson={selectedLesson}
        onBack={() => navigate("/listening-comprehension")}
      />
    );
  }

  return (
    <div className="listen-container">
      <div className="listen-wrap">
        <h1 className="listen-title">Luyện nghe phân biệt</h1>

        <div className="listen-grid">
          {lessons.map((lesson) => (
            <div
              key={lesson.routeId}
              className="listen-card"
              onClick={() =>
                navigate(`/listening-comprehension/${lesson.routeId}`)
              }
            >
              <img src={frameImg} alt="frame" className="listen-frame" />
              <div className="listen-content">
                <span className="listen-label">{lesson.title}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
