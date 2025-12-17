import React from 'react';
import './Progress.css';
import hocTuVungIcon from '../../assets/progress/hoc-tu-vung.png';
import luyenNgheIcon from '../../assets/progress/luyen-nghe-phan-biet.png';
import luyenDienDatIcon from '../../assets/progress/luyen-dien-dat.png';

const Progress = () => {
  const learnedStats = [
    { value: 2, total: 12, label: "Học từ vựng", icon: hocTuVungIcon },
    { value: 10, total: 12, label: "Luyện nghe phân biệt", icon: luyenNgheIcon },
    { value: 5, total: 12, label: "Luyện diễn đạt", icon: luyenDienDatIcon },
  ];

  const accuracyStats = [
    { percent: 30, label: "Học từ vựng" },
    { percent: 60, label: "Luyện nghe phân biệt" },
    { percent: 75, label: "Luyện diễn đạt" },
  ];

  return (
    <div className="progress-page">
      <div className="progress-wrap">
        <h2 className="progress-title">Số bài đã học</h2>

        <div className="learned-card">
          {learnedStats.map((item, idx) => (
            <div key={idx} className="learned-item" data-last={idx === 2}>
              <div className="learned-main">
                <span className="learned-value">{item.value}/{item.total}</span>
                <img className="learned-icon" src={item.icon} alt={item.label} />
              </div>
              <div className="learned-label">{item.label.toUpperCase()}</div>
            </div>
          ))}
        </div>

        <div className="accuracy-panel">
          <h3 className="accuracy-title">Tỉ lệ làm đúng</h3>

          <div className="accuracy-grid">
            {accuracyStats.map((item, idx) => (
              <div key={idx} className="accuracy-item">
                <div 
                  className="ring"
                  style={{
                    background: `conic-gradient(from -90deg, #18E6FF 0deg, #0B65FF ${item.percent * 3.6}deg, #d6d9de 0)`
                  }}
                >
                  <div className="ring-center">
                    <span className="ring-text">{item.percent}%</span>
                  </div>
                </div>
                <div className="accuracy-label">{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="progress-bottom-space" />
      </div>
    </div>
  );
};

export default Progress;