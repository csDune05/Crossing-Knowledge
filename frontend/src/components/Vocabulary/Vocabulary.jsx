import React, { useState } from 'react';
import './Vocabulary.css';
import VocabularyLessonDetail from '../VocabularyLessonDetail/VocabularyLessonDatail';

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
  { id: 'chu-cai', title: 'Chữ cái', icon: chuCaiIcon },
  { id: 'mau-sac', title: 'Màu sắc', icon: mauSacIcon },
  { id: 'so-dem', title: 'Số đếm', icon: soDemIcon },
  { id: 'hinh-dang', title: 'Hình dạng', icon: hinhDangIcon },
  { id: 'thuc-an', title: 'Thức ăn', icon: thucAnIcon },
  { id: 'cam-xuc', title: 'Cảm xúc', icon: camXucIcon },
  { id: 'quan-ao', title: 'Quần áo', icon: quanAoIcon },
  { id: 'dong-vat', title: 'Động vật', icon: dongVatIcon },
  { id: 'truong-lop', title: 'Trường lớp', icon: truongLopIcon },
  { id: 'co-the', title: 'Cơ thể', icon: coTheIcon },
  { id: 'nha-cua', title: 'Nhà cửa', icon: nhaCuaIcon },
  { id: 'giao-thong', title: 'Giao thông', icon: giaoThongIcon },
];

export default function Vocab() {
  const [selectedLesson, setSelectedLesson] = useState(null);

  if (selectedLesson) {
    return (
      <VocabularyLessonDetail 
        lesson={selectedLesson} 
        onBack={() => setSelectedLesson(null)}
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
              onClick={() => setSelectedLesson(lesson)}
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