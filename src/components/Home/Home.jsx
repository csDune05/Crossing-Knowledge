import "./Home.css";
import logo from "../../assets/home/logo.png";
import startNow from "../../assets/home/start-now.png";

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
    </div>
  );
};

export default Home;
