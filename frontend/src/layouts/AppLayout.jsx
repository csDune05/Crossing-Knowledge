import { useNavigate, useLocation } from "react-router-dom";
import { Outlet } from "react-router-dom";
import "./AppLayout.css";
import logo from "../assets/home/logo.png";
import icProgress from "../assets/sider-tag/tien-do-hoc-tap.png";
import icVocab from "../assets/sider-tag/hoc-tu-vung.png";
import icListen from "../assets/sider-tag/luyen-nghe.png";
import icSpeak from "../assets/sider-tag/luyen-dien-dat.png";
import icProfile from "../assets/sider-tag/profile.png";

const menu = [
  { id: "dashboard", label: "Tiến độ học tập", icon: icProgress, path: "/dashboard" },
  { id: "vocab", label: "Học từ vựng", icon: icVocab, path: "/vocab" },
  { id: "listening", label: "Luyện nghe phân biệt", icon: icListen, path: "" },
  { id: "speaking", label: "Luyện diễn đạt", icon: icSpeak, path: "" },
  { id: "profile", label: "Profile", icon: icProfile, path: "" },
];

export default function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const getActiveMenu = () => {
    const pathMap = {
      "/dashboard": "dashboard",
      "/vocab": "vocab",
      "/listening": "listening",
      "/speaking": "speaking",
      "/profile": "profile",
    };
    return pathMap[location.pathname] || "dashboard";
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
                        <img className="app-layout-icon" src={item.icon} alt={item.label} />
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
