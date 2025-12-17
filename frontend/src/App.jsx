// src/App.jsx
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import RegisterForm from "./components/RegisterForm/RegisterForm.jsx";
import LoginForm from "./components/LoginForm/LoginForm.jsx";
import AppLayout from "./layouts/AppLayout.jsx";
import VocabPage from "./pages/VocabularyPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import ProgressPage from "./pages/ProgressPage.jsx";
import SentenceConstructionPage from "./pages/SentenceConstructionPage.jsx";
import SentenceConstructionLessonDetail from "./components/SentenceConstructionLessonDetail/SentenceConstructionLessonDetail.jsx";
import ListenPage from "./pages/ListeningComprehensionPage.jsx";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegisterForm />} />

      <Route element={<AppLayout />}>
        <Route path="/progress" element={<ProgressPage />} />
        <Route path="/vocabulary" element={<VocabPage />} />
        <Route path="/listening-comprehension" element={<ListenPage />} />
        <Route
          path="/sentence-construction"
          element={<SentenceConstructionPage />}
        />
        <Route
          path="/sentence-construction/:exerciseId"
          element={<SentenceConstructionLessonDetail />}
        />

        <Route path="/profile" element={<ProfilePage />} />
      </Route>
    </Routes>
  );
};

export default App;
