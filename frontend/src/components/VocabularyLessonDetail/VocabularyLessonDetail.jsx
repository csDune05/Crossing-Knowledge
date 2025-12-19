import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './VocabularyLessonDetail.css';
import vocabularyApi from '../../apis/vocabularyApi';

import audioIcon from '../../assets/vocabulary/audio.png';
import slowIcon from '../../assets/vocabulary/slow.png';
import micIcon from '../../assets/vocabulary/mic.png';
import correctIcon from '../../assets/vocabulary/correct.png';
import closeIcon from '../../assets/vocabulary/close.png';
import incorrectIcon from '../../assets/vocabulary/incorrect.png';

const WAVE_BARS = Array.from({ length: 8 });

const RESULT_META = {
  correct: { barClass: 'correct', icon: correctIcon, text: 'Tuyệt!', actionText: 'TIẾP' },
  close: { barClass: 'close', icon: closeIcon, text: 'Gần đúng rồi! Con thử lại nhé', actionText: 'THỬ LẠI' },
  wrong: { barClass: 'wrong', icon: incorrectIcon, text: 'Con thử lại nhé!', actionText: 'THỬ LẠI' },
};

const toGithubRaw = (url = '') =>
  url && url.includes('github.com') && url.includes('/blob/')
    ? url.replace('https://github.com/', 'https://raw.githubusercontent.com/').replace('/blob/', '/')
    : url;

// Normalize tiếng Việt.
const normalizeText = (s = '') =>
  s
    .toLowerCase()
    .normalize('NFD')
    // .replace(/[\u0300-\u036f]/g, '')
    // .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

// So sánh gọn: exact/contains => correct, còn lại dùng Levenshtein để ra correct/close/wrong
const judgeSpeech = (expected, alternatives = []) => {
  const exp = normalizeText(expected);
  const cands = alternatives.map(normalizeText).filter(Boolean);

  if (!exp || cands.length === 0) return 'wrong';

  for (const c of cands) {
    if (c === exp) return 'correct';
    if (c.includes(exp) || exp.includes(c)) return 'correct';
  }

  const dist = (a, b) => {
    if (a === b) return 0;
    if (!a) return b.length;
    if (!b) return a.length;

    let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
    for (let i = 1; i <= a.length; i++) {
      const cur = [i];
      for (let j = 1; j <= b.length; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        cur[j] = Math.min(cur[j - 1] + 1, prev[j] + 1, prev[j - 1] + cost);
      }
      prev = cur;
    }
    return prev[b.length];
  };

  const sim = (a, b) => 1 - dist(a, b) / Math.max(a.length, b.length);

  let bestScore = 0;
  for (const c of cands) bestScore = Math.max(bestScore, sim(exp, c));

  if (bestScore >= 0.8) return 'correct';
  if (bestScore >= 0.6) return 'close';
  return 'wrong';
};

export default function VocabularyLessonDetail({ lesson, onBack }) {
  const [words, setWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isRecording, setIsRecording] = useState(false);
  const [checkResult, setCheckResult] = useState(null);
  const [recognizedText, setRecognizedText] = useState('');
  const recognizedAlternativesRef = useRef([]);

  const recognitionRef = useRef(null);
  const audioPlayerRef = useRef(null);

  const currentWord = words?.[currentIndex] || null;
  const resultMeta = checkResult ? RESULT_META[checkResult] : null;

  const fetchVocabularyByTopic = useCallback(async () => {
    try {
      setLoading(true);
      const data = await vocabularyApi.getByTopic(lesson.title);
      setWords(Array.isArray(data) ? data : []);
      setCurrentIndex(0);
      setError(null);
    } catch (err) {
      console.error('Error fetching vocabulary:', err);
      setError('Không thể tải dữ liệu từ vựng');
      setWords([]);
    } finally {
      setLoading(false);
    }
  }, [lesson.title]);

  useEffect(() => {
    fetchVocabularyByTopic();
  }, [fetchVocabularyByTopic]);

  useEffect(() => {
    return () => {
      try {
        recognitionRef.current?.stop?.();
      } catch (_) {}

      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
        audioPlayerRef.current.src = '';
      }
    };
  }, []);

  const playWordAudio = useCallback(
    (rate = 1) => {
      const src = toGithubRaw(currentWord?.audio || '');
      if (!src) return;

      if (!audioPlayerRef.current) audioPlayerRef.current = new Audio();

      const player = audioPlayerRef.current;
      player.pause();
      player.currentTime = 0;
      player.src = src;
      player.playbackRate = rate;

      player.play().catch((e) => {
        console.error('Audio play error:', e);
      });
    },
    [currentWord?.audio]
  );

  const resetAttempt = useCallback(() => {
    setCheckResult(null);
    setRecognizedText('');
    recognizedAlternativesRef.current = [];
  }, []);

  const cancelRecording = useCallback(() => {
    try {
      recognitionRef.current?.stop?.();
    } catch (_) {}
    setIsRecording(false);
  }, []);

  const startRecording = useCallback(() => {
    resetAttempt();

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      alert('Trình duyệt không hỗ trợ SpeechRecognition (Web Speech API).');
      return;
    }

    const rec = new SR();
    recognitionRef.current = rec;

    rec.lang = 'vi-VN';
    rec.continuous = false;
    rec.interimResults = false;
    rec.maxAlternatives = 5;

    rec.onresult = (e) => {
      const res = e.results[e.results.length - 1];
      const alts = Array.from(res)
        .map((a) => (a.transcript || '').trim())
        .filter(Boolean);

      recognizedAlternativesRef.current = alts;
      setRecognizedText(alts[0] || '');
    };

    rec.onerror = () => setIsRecording(false);
    rec.onend = () => setIsRecording(false);

    setIsRecording(true);
    try {
      rec.start();
    } catch (_) {
      setIsRecording(false);
    }
  }, [resetAttempt]);

  const stopRecording = useCallback(() => {
    try {
      recognitionRef.current?.stop?.();
    } catch (_) {}
    setIsRecording(false);
  }, []);

  const checkPronunciation = useCallback(() => {
    const expected = (currentWord?.word || '').trim();

    const alts =
      recognizedAlternativesRef.current?.length > 0
        ? recognizedAlternativesRef.current
        : recognizedText
          ? [recognizedText]
          : [];

    if (!alts.length) {
      alert('Vui lòng bấm mic và nói trước.');
      return;
    }

    if (!expected) {
      setCheckResult('close');
      return;
    }

    const result = judgeSpeech(expected, alts);
    setCheckResult(result);
  }, [currentWord?.word, recognizedText]);

  const goToNextWord = useCallback(() => {
    if (audioPlayerRef.current) audioPlayerRef.current.pause();
    if (isRecording) cancelRecording();

    setCurrentIndex((i) => (i >= (words?.length || 0) - 1 ? i : i + 1));
    resetAttempt();
  }, [cancelRecording, isRecording, resetAttempt, words?.length]);

  const goToPrevWord = useCallback(() => {
    if (audioPlayerRef.current) audioPlayerRef.current.pause();
    if (isRecording) cancelRecording();

    setCurrentIndex((i) => (i <= 0 ? 0 : i - 1));
    resetAttempt();
  }, [cancelRecording, isRecording, resetAttempt]);

  const retryPronunciation = useCallback(() => {
    resetAttempt();
  }, [resetAttempt]);

  const actionHandler = useMemo(() => {
    if (!checkResult) return null;
    return checkResult === 'correct' ? goToNextWord : retryPronunciation;
  }, [checkResult, goToNextWord, retryPronunciation]);

  if (loading) return <div className="lesson-loading">Đang tải dữ liệu...</div>;
  if (error) return <div className="lesson-error">{error}</div>;
  if (!words?.length) return <div className="lesson-no-data">Chưa có từ vựng nào</div>;

  return (
    <div className="vocab-lesson-detail">
      <div className="detail-header">
        <button onClick={onBack} className="back-btn" type="button">
          Quay lại
        </button>

        <div className="progress-dots">
          {words.map((_, index) => (
            <div
              key={index}
              className={[
                'progress-dot',
                index < currentIndex ? 'completed' : '',
                index === currentIndex ? 'active' : '',
              ].join(' ')}
            />
          ))}
        </div>
      </div>

      <div className="vocab-main-content">
        <div className="vocab-image-container">
          {currentWord?.image ? (
            <img
              src={toGithubRaw(currentWord.image)}
              alt={currentWord.word}
              className="vocab-large-image"
            />
          ) : null}
        </div>

        <div className="vocab-audio-section">
          <div className="vocab-audio-card">
            <div className="audio-card-content">
              <button className="audio-icon-btn" type="button" onClick={() => playWordAudio(1)}>
                <img src={audioIcon} alt="audio" className="icon-img" />
              </button>

              <button className="audio-icon-btn" type="button" onClick={() => playWordAudio(0.7)}>
                <img src={slowIcon} alt="slow" className="icon-img" />
              </button>

              <span className="vocab-word-text">{currentWord?.word}</span>
            </div>
          </div>

          <div className="vocab-audio-card">
            <div className="audio-card-content">
              <button
                type="button"
                className={`audio-icon-btn ${isRecording ? 'recording' : ''}`}
                onClick={isRecording ? stopRecording : startRecording}
              >
                <img src={micIcon} alt="mic" className="icon-img" />
              </button>

              {recognizedText && !isRecording ? (
                <div className="waveform" title={recognizedText}>
                  {WAVE_BARS.map((_, i) => (
                    <div key={i} className="wave-bar" />
                  ))}
                </div>
              ) : null}

              {isRecording ? <span className="recording-text">Đang nghe...</span> : null}
            </div>

            {/* {recognizedText && !isRecording ? (
              <div className="recognized-text">Con nói: {recognizedText}</div>
            ) : null} */}
          </div>
        </div>
      </div>

      {!checkResult ? (
        <div className="vocab-check-section">
          <button type="button" className="btn-prev" onClick={goToPrevWord}>
            TỪ TRƯỚC
          </button>

          <button
            type="button"
            className="btn-check"
            onClick={checkPronunciation}
            disabled={!recognizedText || isRecording}
          >
            KIỂM TRA
          </button>
        </div>
      ) : (
        <div className={`result-bar ${resultMeta.barClass}`}>
          <div className="result-content">
            <span className="result-icon">
              <img src={resultMeta.icon} alt={checkResult} className="result-icon-img" />
            </span>
            <span className="result-text">{resultMeta.text}</span>
          </div>

          <button
            type="button"
            className={checkResult === 'correct' ? 'btn-next' : 'btn-retry'}
            onClick={actionHandler}
          >
            {resultMeta.actionText}
          </button>
        </div>
      )}
    </div>
  );
}
