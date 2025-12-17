import { useNavigate, useLocation } from "react-router-dom";
import { Outlet } from "react-router-dom";
import "./AppLayout.css";
import logo from "../assets/logo.png";
import icProgress from "../assets/sider-tag/tien-do-hoc-tap.png";
import icVocab from "../assets/sider-tag/hoc-tu-vung.png";
import icListen from "../assets/sider-tag/luyen-nghe.png";
import icSpeak from "../assets/sider-tag/luyen-dien-dat.png";
import icProfile from "../assets/sider-tag/profile.png";

const menu = [
  {
    id: "progress",
    label: "Tiến độ học tập",
    icon: icProgress,
    path: "/progress",
  },
  { id: "vocabulary", label: "Học từ vựng", icon: icVocab, path: "/vocabulary" },
  { id: "listening-comprehension", label: "Luyện nghe phân biệt", icon: icListen, path: "/listening-comprehension" },
  {
    id: "sentence-construction",
    label: "Luyện diễn đạt",
    icon: icSpeak,
    path: "sentence-construction",
  },
  { id: "profile", label: "Profile", icon: icProfile, path: "profile" },
];

export default function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const getActiveMenu = () => {
    const pathMap = {
      "/progress": "progress",
      "/vocabulary": "vocabulary",
      "/listening-comprehension": "listening-comprehension",
      "/sentence-construction": "sentence-construction",
      "/profile": "profile",
    };
    return pathMap[location.pathname] || "progress";
  };

  const activeMenu = getActiveMenu();

  const handleMenuClick = (path) => {
    navigate(path);
  };

  return (
    <div className="app-layout-container">
      <aside className="app-layout-aside">
        <div className="app-layout-logo">
          <img src={logo} alt="Crossing Knowledge" />
        </div>

        <nav className="app-layout-menu">
          {menu.map((item) => (
            <button
              key={item.id}
              className={`app-layout-item ${activeMenu === item.id ? "is-active" : ""}`}
              onClick={() => handleMenuClick(item.path)}
            >
              <img
                className="app-layout-icon"
                src={item.icon}
                alt={item.label}
              />
              <span className="app-layout-label">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      <main className="app-layout-content">
        <Outlet />
      </main>
    </div>
  );
}
