import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import RegisterForm from "./components/RegisterForm/RegisterForm.jsx";
import LoginForm from "./components/LoginForm/LoginForm.jsx";
import AppLayout from "./layouts/AppLayout.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import VocabPage from "./pages/VocabPage.jsx";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegisterForm />} />
      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/vocab" element={<VocabPage />} />
      </Route>
    </Routes>
  );
};

export default App;
