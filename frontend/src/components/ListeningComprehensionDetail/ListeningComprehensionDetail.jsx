import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./ListeningComprehensionDetail.css";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import listeningComprehensionApi from "../../apis/listeningComprehensionApi";

import audioIcon from "../../assets/listening-comprehension/audio.png";
import correctIcon from "../../assets/listening-comprehension/correct.png";
import incorrectIcon from "../../assets/listening-comprehension/incorrect.png";

const toGithubRaw = (url = "") =>
  url && url.includes("github.com") && url.includes("/blob/")
    ? url.replace("https://github.com/", "https://raw.githubusercontent.com/").replace("/blob/", "/")
    : url;

export default function ListeningComprehensionDetail({ lesson, onBack }) {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [item, setItem] = useState(null);

  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState(null);
  const [checking, setChecking] = useState(false);

  const audioPlayerRef = useRef(null);

  const step = useMemo(() => {
    const n = Number(lessonId || 1);
    return Number.isFinite(n) && n > 0 ? n : 1;
  }, [lessonId]);

  const goToStep = useCallback(
    (n, replace = false) => {
      const safe = Math.max(1, n);
      const parts = location.pathname.split("/").filter(Boolean);
      if (!parts.length) return;
      parts[parts.length - 1] = String(safe);
      navigate("/" + parts.join("/"), { replace });
    },
    [location.pathname, navigate]
  );

  const total = useMemo(() => {
    return items?.length ? items.length : item ? 1 : 0;
  }, [items?.length, item]);

  const activeIndex = useMemo(() => {
    if (!total) return 0;
    return Math.min(Math.max(step - 1, 0), total - 1);
  }, [step, total]);

  const isLast = total > 0 && activeIndex === total - 1;
  const isCompleted = !!result?.correct && isLast;

  useEffect(() => {
    return () => {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
        audioPlayerRef.current.src = "";
      }
    };
  }, []);

  useEffect(() => {
    const fetchList = async () => {
      try {
        let list = null;

        if (typeof listeningComprehensionApi.getByTopic === "function" && lesson?.title) {
          list = await listeningComprehensionApi.getByTopic(lesson.title);
        } else if (typeof listeningComprehensionApi.getByLessonId === "function" && lesson?.id) {
          list = await listeningComprehensionApi.getByLessonId(lesson.id);
        } else if (typeof listeningComprehensionApi.getAll === "function") {
          list = await listeningComprehensionApi.getAll();
        }

        if (Array.isArray(list) && list.length) setItems(list);
      } catch (e) {
        console.error(e);
      }
    };

    fetchList();
  }, [lesson?.id, lesson?.title]);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true);
        setSelected(null);
        setResult(null);
        setChecking(false);

        if (items?.length) {
          const idx = Math.min(activeIndex, items.length - 1);
          if (idx !== activeIndex) goToStep(idx + 1, true);
          setItem(items[idx] || null);
          return;
        }

        const data = await listeningComprehensionApi.getById(lessonId);
        setItem(data || null);
      } catch (e) {
        console.error(e);
        setItem(null);
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [activeIndex, goToStep, items, lessonId]);

  const playAudio = useCallback(() => {
    const src = toGithubRaw(item?.audio || "");
    if (!src) return;

    if (!audioPlayerRef.current) audioPlayerRef.current = new Audio();

    const p = audioPlayerRef.current;
    p.pause();
    p.currentTime = 0;
    p.src = src;

    p.play().catch((e) => console.error("Audio play error:", e));
  }, [item?.audio]);

  const chooseOption = useCallback(
    (opt) => {
      if (!item || result) return;
      setSelected(opt);
    },
    [item, result]
  );

  const checkAnswer = useCallback(async () => {
    if (!item || !selected || checking) return;

    try {
      setChecking(true);
      const res = await listeningComprehensionApi.submit({
        itemId: item.id,
        selectedOption: selected,
      });
      setResult({
        correct: !!res?.correct,
        correctOption: res?.correctOption ?? null,
      });
    } catch (e) {
      console.error(e);
      alert("Lỗi khi chấm kết quả!");
    } finally {
      setChecking(false);
    }
  }, [checking, item, selected]);

  const retry = useCallback(() => {
    setSelected(null);
    setResult(null);
    setChecking(false);
  }, []);

  const goPrev = useCallback(() => {
    if (total <= 0) return;
    goToStep(step - 1);
    retry();
  }, [goToStep, retry, step, total]);

  const goNext = useCallback(() => {
    if (total <= 0) return;
    goToStep(step + 1);
    retry();
  }, [goToStep, retry, step, total]);

  const selectedClass = (opt) => (selected === opt ? "selected" : "");
  const resultClass = (opt) => {
    if (!result) return "";
    if (result.correctOption === opt) return "correct";
    if (selected === opt && result.correctOption !== opt) return "wrong";
    return "";
  };

  const resultText = useMemo(() => {
    if (!result) return "";
    if (isCompleted) return "Hoàn thành bài học!";
    return result.correct ? "Tuyệt!" : "Con thử lại nhé!";
  }, [isCompleted, result]);

  const actionLabel = useMemo(() => {
    if (!result) return "";
    if (isCompleted) return "CÂU TRƯỚC";
    return result.correct ? "TIẾP" : "THỬ LẠI";
  }, [isCompleted, result]);

  const onAction = useMemo(() => {
    if (!result) return null;
    if (isCompleted) return goPrev;
    return result.correct ? goNext : retry;
  }, [goNext, goPrev, isCompleted, result, retry]);

  if (loading) return <div className="lc-detail">Đang tải...</div>;
  if (!item) return <div className="lc-detail">Không có dữ liệu bài nghe.</div>;

  return (
    <div className="lc-detail">
      <div className="detail-header">
        {!isCompleted ? (
          <button onClick={onBack} className="back-btn" type="button">
            Quay lại
          </button>
        ) : (
          <div className="back-btn-placeholder" />
        )}

        <div className="progress-dots">
          {Array.from({ length: Math.max(total, 1) }).map((_, index) => (
            <div
              key={index}
              className={[
                "progress-dot",
                index < activeIndex ? "completed" : "",
                index === activeIndex ? "active" : "",
              ].join(" ")}
            />
          ))}
        </div>
      </div>

      <div className="lc-content">
        <h1 className="lc-title">Bé hãy nghe và chọn từ đúng bên dưới nhé!</h1>

        <div className="lc-audio-wrap">
          <button className="audio-icon-btn" type="button" onClick={playAudio} disabled={!item?.audio}>
            <img src={audioIcon} alt="audio" className="icon-img" />
          </button>
        </div>

        <div className="lc-options">
          <button
            type="button"
            className={`lc-card ${selectedClass(1)} ${resultClass(1)}`}
            onClick={() => chooseOption(1)}
            disabled={!!result}
          >
            {item.option1}
          </button>

          <button
            type="button"
            className={`lc-card ${selectedClass(2)} ${resultClass(2)}`}
            onClick={() => chooseOption(2)}
            disabled={!!result}
          >
            {item.option2}
          </button>
        </div>
      </div>

      {!result ? (
        <div className="lc-check-section">
          <button type="button" className="btn-prev" onClick={goPrev}>
            CÂU TRƯỚC
          </button>

          <button type="button" className="btn-check" onClick={checkAnswer} disabled={!selected || checking}>
            KIỂM TRA
          </button>
        </div>
      ) : (
        <div className={`lc-result-bar ${result.correct ? "correct" : "wrong"}`}>
          <div className="lc-result-content">
            <span className="lc-result-icon">
              <img
                src={result.correct ? correctIcon : incorrectIcon}
                alt={result.correct ? "correct" : "incorrect"}
                className="lc-result-icon-img"
              />
            </span>
            <span className="lc-result-text">{resultText}</span>
          </div>

          <button
            type="button"
            className={`lc-result-action ${isCompleted ? "prev" : result.correct ? "ok" : "bad"}`}
            onClick={onAction || undefined}
          >
            {actionLabel}
          </button>
        </div>
      )}
    </div>
  );
}
