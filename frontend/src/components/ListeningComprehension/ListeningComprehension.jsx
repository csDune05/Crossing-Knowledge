import React,{ useState } from "react";
import "./ListeningComprehension.css";
import ListeningComprehensionDetail from "../ListeningComprehensionDetail/ListeningComprehensionDetail";

import frameImg from "../../assets/listening-comprehension/frame.png"

const lessons = [
  { id: 'bai1', title: 'Bài 1'},
  { id: 'bai2', title: 'Bài 2'},
  { id: 'bai3', title: 'Bài 3'},
  { id: 'bai4', title: 'Bài 4'},
  { id: 'bai5', title: 'Bài 5'},
  { id: 'bai6', title: 'Bài 6'},
  { id: 'bai7', title: 'Bài 7'},
  { id: 'bai8', title: 'Bài 8'},
  { id: 'bai9', title: 'Bài 9'},
  { id: 'bai10', title: 'Bài 10'},
  { id: 'bai11', title: 'Bài 11'},
  { id: 'bai12', title: 'Bài 12'},
];

export default function Listening() {
    const [selectedLesson, setSelectedLesson] = useState(null);

    if (selectedLesson) {
        return (
            <ListeningComprehensionDetail 
            lesson={selectedLesson} 
            onBack={() => setSelectedLesson(null)}
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
                  key={lesson.id}
                  className="listen-card"
                  onClick={() => setSelectedLesson(lesson)}
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