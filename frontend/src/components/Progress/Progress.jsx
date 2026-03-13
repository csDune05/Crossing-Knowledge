import React from "react";
import "./Progress.css";
import hocTuVungIcon from "../../assets/progress/hoc-tu-vung.png";
import luyenNgheIcon from "../../assets/progress/luyen-nghe-phan-biet.png";
import luyenDienDatIcon from "../../assets/progress/luyen-dien-dat.png";

const Progress = () => {
  const learnedStats = [
    { value: 4, total: 12, label: "Học từ vựng", icon: hocTuVungIcon },
    { value: 10, total: 12, label: "Luyện nghe phân biệt", icon: luyenNgheIcon },
    { value: 5, total: 12, label: "Luyện diễn đạt", icon: luyenDienDatIcon },
  ];

  const accuracyStats = learnedStats.map((item) => ({
    label: item.label,
    percent: Math.round((item.value / item.total) * 100),
  }));

  return (
    <div className="progress-page">
      <div className="progress-wrap">
        <h2 className="progress-title">Số bài đã học</h2>

        <div className="learned-card">
          {learnedStats.map((item, idx) => (
            <div key={item.label} className="learned-item" data-last={idx === 2}>
              <div className="learned-main">
                <span className="learned-value">
                  {item.value}/{item.total}
                </span>
                <img className="learned-icon" src={item.icon} alt={item.label} />
              </div>
              <div className="learned-label">{item.label.toUpperCase()}</div>
            </div>
          ))}
        </div>

        <div className="accuracy-panel">
          <h3 className="accuracy-title">Tỉ lệ hoàn thành</h3>

          <div className="accuracy-grid">
            {accuracyStats.map((item) => (
              <div key={item.label} className="accuracy-item">
                <div
                  className="ring"
                  style={{
                    background: `conic-gradient(from 0deg, #18E6FF 0deg, #0B65FF ${
                      item.percent * 3.6
                    }deg, #d6d9de ${item.percent * 3.6}deg 360deg)`,
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
