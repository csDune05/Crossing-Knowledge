import React from 'react';
import './Vocabulary.css';
import VocabularyLessonDetail from '../VocabularyLessonDetail/VocabularyLessonDetail';
import { useNavigate, useParams } from 'react-router-dom';

import frameImg from '../../assets/vocabulary/frame.png';
import chuCaiIcon from '../../assets/vocabulary/Chu-cai/chu-cai.png';
import mauSacIcon from '../../assets/vocabulary/Mau-sac/mau-sac.png';
import soDemIcon from '../../assets/vocabulary/So-dem/so-dem.png';
import hinhDangIcon from '../../assets/vocabulary/Hinh-dang/hinh-dang.png';
import thucAnIcon from '../../assets/vocabulary/Thuc-an/thuc-an.png';
import camXucIcon from '../../assets/vocabulary/Cam-xuc/cam-xuc.png';
import quanAoIcon from '../../assets/vocabulary/Quan-ao/quan-ao.png';
import dongVatIcon from '../../assets/vocabulary/Dong-vat/dong-vat.png';
import truongLopIcon from '../../assets/vocabulary/Truong-lop/truong-lop.png';
import coTheIcon from '../../assets/vocabulary/Co-the/co-the.png';
import nhaCuaIcon from '../../assets/vocabulary/Nha-cua/nha-cua.png';
import giaoThongIcon from '../../assets/vocabulary/Giao-thong/giao-thong.png';

const lessons = [
  { routeId: 1, id: 'chu-cai', title: 'Chữ cái', icon: chuCaiIcon },
  { routeId: 2, id: 'mau-sac', title: 'Màu sắc', icon: mauSacIcon },
  { routeId: 3, id: 'so-dem', title: 'Số đếm', icon: soDemIcon },
  { routeId: 4, id: 'hinh-dang', title: 'Hình dạng', icon: hinhDangIcon },
  { routeId: 5, id: 'thuc-an', title: 'Thức ăn', icon: thucAnIcon },
  { routeId: 6, id: 'cam-xuc', title: 'Cảm xúc', icon: camXucIcon },
  { routeId: 7, id: 'quan-ao', title: 'Quần áo', icon: quanAoIcon },
  { routeId: 8, id: 'dong-vat', title: 'Động vật', icon: dongVatIcon },
  { routeId: 9, id: 'truong-lop', title: 'Trường lớp', icon: truongLopIcon },
  { routeId: 10, id: 'co-the', title: 'Cơ thể', icon: coTheIcon },
  { routeId: 11, id: 'nha-cua', title: 'Nhà cửa', icon: nhaCuaIcon },
  { routeId: 12, id: 'giao-thong', title: 'Giao thông', icon: giaoThongIcon },
];

export default function Vocab() {
  const navigate = useNavigate();
  const { lessonId } = useParams(); 

  const selectedLesson = lessonId
    ? lessons.find((l) => String(l.routeId) === String(lessonId))
    : null;

  if (lessonId && !selectedLesson) {
    return (
      <div className="vocab-container">
        <div className="vocab-wrap">
          <h1 className="vocab-title">Học từ vựng</h1>
          <div style={{ marginTop: 12 }}>
            Không tìm thấy bài học.{' '}
            <button onClick={() => navigate('/vocabulary')}>Quay lại</button>
          </div>
        </div>
      </div>
    );
  }

  if (selectedLesson) {
    return (
      <VocabularyLessonDetail
        lesson={selectedLesson}
        onBack={() => navigate('/vocabulary')}
      />
    );
  }

  return (
    <div className="vocab-container">
      <div className="vocab-wrap">
        <h1 className="vocab-title">Học từ vựng</h1>

        <div className="vocab-grid">
          {lessons.map((lesson) => (
            <div
              key={lesson.id}
              className="vocab-card"
              onClick={() => navigate(`/vocabulary/${lesson.routeId}`)} 
            >
              <img src={frameImg} alt="frame" className="vocab-frame" />
              <div className="vocab-content">
                <span className="vocab-label">{lesson.title}</span>
                <img src={lesson.icon} alt={lesson.title} className="vocab-icon" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
