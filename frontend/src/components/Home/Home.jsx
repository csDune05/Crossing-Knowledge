import "./Home.css";
import logo from "../../assets/home/logo.png";
import startNow from "../../assets/home/start-now.png";
import aboutUsImage from "../../assets/home/about-us.png";
import giaoDienThanThien from "../../assets/home/giao-dien-than-thien.png";
import hocTapThongMinh from "../../assets/home/hoc-tap-thong-minh.png";
import traiNghiemThuVi from "../../assets/home/trai-nghiem-thu-vi.png";
import webPresenceImage from "../../assets/home/web-presence.png";
import { Carousel } from "antd";

import { CheckCircleOutlined } from "@ant-design/icons";

const Home = () => {
  return (
    <div className="home-container">
      <div className="header">
        <div className="header-item header-logo">
          <img src={logo} alt="Logo" className="logo-image" />
        </div>
        <div className="header-item home-page">Trang chủ</div>
        <div className="header-item about-us">About Us</div>
        <div className="header-item buttons">
          <button className="btn signup-btn">Đăng ký</button>
          <button className="btn login-btn">Đăng nhập</button>
        </div>
      </div>
      <div className="home-page-container">
        <div className="image-wrapper">
          <img src={startNow} alt="Start Now" className="start-now-image" />
          <button className="start-now-btn">Bắt đầu ngay!</button>
        </div>
      </div>
      <div className="about-us-container">
        <div className="image-wrapper">
          <img src={aboutUsImage} alt="About Us" className="about-us-image" />
        </div>
        <div className="about-us-text">
          <div className="question">
            Con sẽ nhận lại được gì sau khi học tại Crossing Knowledge?
          </div>
          <div className="answer-item">
            <CheckCircleOutlined className="answer-item-icon" />
            <div className="answer-text">
              Cải thiện cách phát âm và vốn từ vựng
            </div>
          </div>
          <div className="answer-item">
            <CheckCircleOutlined className="answer-item-icon" />
            <div className="answer-text">Nâng cao kỹ năng nghe và diễn đạt</div>
          </div>
          <div className="answer-item">
            <CheckCircleOutlined className="answer-item-icon" />
            <div className="answer-text">
              Giao diện thân thiện giúp con hứng thú học
            </div>
          </div>
        </div>
      </div>
      <div className="reason-container">
        <div className="reason-content-wrapper">
          <div className="question">
            Tại sao bạn nên chọn Crossing Knowledge?
          </div>
          <div className="answer-blocks">
            <div className="answer-block">
              <div className="image-wrapper">
                <img src={hocTapThongMinh} alt="" className="answer-image" />
              </div>
              <div className="answer-text">
                <div className="direct-answer">Học tập thông minh</div>
                <div className="answer-description">
                  AI hỗ trợ phát âm, phản hồi và theo dõi tiến trình được cá
                  nhân hóa
                </div>
              </div>
            </div>
            <div className="answer-block">
              <div className="image-wrapper">
                <img src={traiNghiemThuVi} alt="" className="answer-image" />
              </div>
              <div className="answer-text">
                <div className="direct-answer">Trải nghiệm thú vị</div>
                <div className="answer-description">
                  Trò chơi vui nhộn, hình ảnh sống động và phương pháp học tập
                  tương tác giúp trẻ em luôn hứng thú
                </div>
              </div>
            </div>
            <div className="answer-block">
              <div className="image-wrapper">
                <img src={giaoDienThanThien} alt="" className="answer-image" />
              </div>
              <div className="answer-text">
                <div className="direct-answer">Giao diện thân thiện</div>
                <div className="answer-description">
                  Giao diện thân thiện với trẻ em, phản hồi tích cực và động lực
                  thông qua phần thưởng
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="experience-container">
        <div className="questions">
          <div className="main-question">
            Các con sẽ được trải nghiệm nhưng gì tại Crossing Knowledge?
          </div>
          <div className="quick-answer">
            Các bài học tương tác thú vị kết hợp từ vựng, phát âm và luyện nghe
            — được hỗ trợ bởi AI và thiết kế vui nhộn
          </div>
        </div>
        <div className="web-presence">
          <div className="image-wrapper">
            <img
              src={webPresenceImage}
              alt="Giao diện"
              className="web-presence-image"
            />
          </div>
        </div>
        <div className="lesson-blocks">
          <div className="lesson-block">Học từ vựng</div>
          <div className="lesson-block">Luyện nghe phân biệt</div>
          <div className="lesson-block">Luyện diễn đạt</div>
        </div>
      </div>
      <div className="parent-evaluation-container">
        <div className="content-wrapper">
          <div className="title">
            Đánh giá của phụ huynh về Crossing Knowledge
          </div>
          <div className="carousel-wrapper">
            <Carousel
              arrows
              className="evaluation-carousel"
              infinite={false}
              autoplay
              slidesToShow={3}
            >
              <div>
                <div className="carousel-item">content 1</div>
              </div>
              <div>
                <div className="carousel-item special">content 2</div>
              </div>
              <div>
                <div className="carousel-item">content 3</div>
              </div>
              <div>
                <div className="carousel-item special">content 4</div>
              </div>
            </Carousel>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
