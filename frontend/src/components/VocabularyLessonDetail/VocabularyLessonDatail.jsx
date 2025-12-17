import React from 'react';
import './VocabularyLessonDetail.css';

export default function VocabularyLessonDetail({ lesson, onBack }) {
  return (
    <div className="lesson-detail">
      <button onClick={onBack} className="back-button">
        Quay lại
      </button>
      <h1 className="lesson-title">{lesson.title}</h1>
    </div>
  );
}