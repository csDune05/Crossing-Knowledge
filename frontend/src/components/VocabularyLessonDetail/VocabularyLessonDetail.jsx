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

const LETTER_ALIASES = {
  a: ['a', 'ay'],
  b: ['b', 'be', 'bee', 'bo'],
  c: ['c', 'xe', 'ce', 'see', 'sea', 'co'],
  d: ['d', 'de', 'dee', 'do'],
  e: ['e', 'ee'],
  f: ['f', 'ef', 'ep', 'fo'],
  g: ['g', 'gee', 'go', 'ji'],
  h: ['h', 'aitch', 'hat', 'ho'],
  i: ['i', 'eye'],
  j: ['j', 'jay', 'gi'],
  k: ['k', 'kay', 'ka', 'ca'],
  l: ['l', 'el', 'lo'],
  m: ['m', 'em', 'mo'],
  n: ['n', 'en', 'no'],
  o: ['o', 'oh'],
  p: ['p', 'pee', 'pe', 'po'],
  q: ['q', 'cue', 'queue', 'quy'],
  r: ['r', 'ar', 'are', 'ro'],
  s: ['s', 'ess', 'et', 'es', 'so'],
  t: ['t', 'tee', 'te', 'to'],
  u: ['u', 'you'],
  v: ['v', 'vee', 've', 'vo'],
  w: ['w', 'double u', 'double you', 've kep', 'vekep'],
  x: ['x', 'ex', 'ich'],
  y: ['y', 'why', 'i dai', 'idai', 'y dai', 'ydai'],
  z: ['z', 'zee', 'zed', 'det', 'zet'],
};

const toGithubRaw = (url = '') =>
  url && url.includes('github.com') && url.includes('/blob/')
    ? url.replace('https://github.com/', 'https://raw.githubusercontent.com/').replace('/blob/', '/')
    : url;

const normalizeText = (s = '') =>
  s
    .toLowerCase()
    .replace(/đ/g, 'd')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const levenshtein = (a = '', b = '') => {
  const x = a || '';
  const y = b || '';
  const n = x.length;
  const m = y.length;
  if (n === 0) return m;
  if (m === 0) return n;

  const dp = Array.from({ length: n + 1 }, () => Array(m + 1).fill(0));
  for (let i = 0; i <= n; i++) dp[i][0] = i;
  for (let j = 0; j <= m; j++) dp[0][j] = j;

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      const cost = x[i - 1] === y[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return dp[n][m];
};

const similarity = (a = '', b = '') => {
  const x = normalizeText(a);
  const y = normalizeText(b);
  if (!x || !y) return 0;
  const dist = levenshtein(x, y);
  return 1 - dist / Math.max(x.length, y.length);
};

const getBestMatch = (expected, alternatives) => {
  const exp = normalizeText(expected);
  const isLetter = /^[a-z]$/i.test((expected || '').trim());

  const candidates = (alternatives || []).flatMap((t) => {
    const norm = normalizeText(t);
    if (!norm) return [];
    const tokens = norm.split(' ');
    return [norm, ...tokens];
  });

  if (isLetter) {
    const aliases = LETTER_ALIASES[exp] || [exp];
    for (const c of candidates) {
      if (aliases.includes(c)) return { score: 1, heard: c };
    }
  }

  let best = { score: 0, heard: '' };
  for (const c of candidates) {
    const sc = similarity(exp, c);
    if (sc > best.score) best = { score: sc, heard: c };
  }
  return best;
};

export default function VocabularyLessonDetail({ lesson, onBack }) {
  const [words, setWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [recordedAudio, setRecordedAudio] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [checkResult, setCheckResult] = useState(null);

  const [recognizedText, setRecognizedText] = useState('');
  const recognizedAlternativesRef = useRef([]);

  const mediaRecorderRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const audioChunksRef = useRef([]);
  const discardRecordingRef = useRef(false);

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

      if (recordedAudio) URL.revokeObjectURL(recordedAudio);

      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((t) => t.stop());
        mediaStreamRef.current = null;
      }
    };
  }, [recordedAudio]);

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
    setRecordedAudio((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setCheckResult(null);
    setRecognizedText('');
    recognizedAlternativesRef.current = [];
  }, []);

  const listenOnce = useCallback((timeoutMs = 3500) => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return Promise.resolve([]);

    return new Promise((resolve) => {
      const rec = new SR();
      let done = false;

      const finish = (alts = []) => {
        if (done) return;
        done = true;
        try {
          rec.stop();
        } catch (_) {}
        resolve(alts);
      };

      const timer = setTimeout(() => finish([]), timeoutMs);

      rec.lang = 'vi-VN';
      rec.continuous = false;
      rec.interimResults = false;
      rec.maxAlternatives = 5;

      rec.onresult = (event) => {
        clearTimeout(timer);
        const alts = [];
        for (let i = 0; i < event.results.length; i++) {
          for (let j = 0; j < event.results[i].length; j++) {
            alts.push(event.results[i][j].transcript);
          }
        }
        finish(alts);
      };

      rec.onerror = () => {
        clearTimeout(timer);
        finish([]);
      };

      try {
        rec.start();
      } catch (_) {
        clearTimeout(timer);
        finish([]);
      }
    });
  }, []);

  const cancelRecording = useCallback(() => {
    discardRecordingRef.current = true;

    try {
      recognitionRef.current?.stop?.();
    } catch (_) {}

    try {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
    } catch (_) {}

    setIsRecording(false);
  }, []);

  const startRecording = useCallback(async () => {
    try {
      resetAttempt();
      discardRecordingRef.current = false;

      const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SR) {
        const rec = new SR();
        recognitionRef.current = rec;

        rec.lang = 'vi-VN';
        rec.continuous = false;
        rec.interimResults = false;
        rec.maxAlternatives = 5;

        rec.onresult = (event) => {
          const alts = [];
          for (let i = 0; i < event.results.length; i++) {
            for (let j = 0; j < event.results[i].length; j++) {
              alts.push(event.results[i][j].transcript);
            }
          }
          recognizedAlternativesRef.current = alts;
          setRecognizedText(alts[0] || '');
        };

        rec.onerror = () => {};
        try {
          rec.start();
        } catch (_) {}
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const s = mediaStreamRef.current;
        if (s) {
          s.getTracks().forEach((t) => t.stop());
          mediaStreamRef.current = null;
        }

        if (discardRecordingRef.current) {
          audioChunksRef.current = [];
          return;
        }

        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);

        setRecordedAudio((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return audioUrl;
        });
      };

      recorder.start();
      setIsRecording(true);
    } catch (err) {
      alert('Không thể truy cập microphone: ' + err.message);
    }
  }, [resetAttempt]);

  const stopRecording = useCallback(() => {
    discardRecordingRef.current = false;

    try {
      recognitionRef.current?.stop?.();
    } catch (_) {}

    try {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
    } catch (_) {}

    setIsRecording(false);
  }, []);

  const checkPronunciation = useCallback(async () => {
    if (!recordedAudio) {
      alert('Vui lòng ghi âm trước');
      return;
    }

    const expected = (currentWord?.word || '').trim();
    if (!expected) {
      setCheckResult('close');
      return;
    }

    let alts = recognizedAlternativesRef.current || [];

    if (!alts.length) {
      alts = await listenOnce(3500);
      recognizedAlternativesRef.current = alts;
      setRecognizedText(alts[0] || '');
    }

    if (!alts.length) {
      setCheckResult('close');
      return;
    }

    const best = getBestMatch(expected, alts);
    const exp = normalizeText(expected);
    const heard = normalizeText(best.heard || '');

    if (/^[a-z]$/i.test(exp)) {
      const aliases = LETTER_ALIASES[exp] || [exp];
      if (aliases.includes(heard)) {
        setCheckResult('correct');
        return;
      }
    }

    const score = Math.max(best.score || 0, similarity(exp, heard));
    const firstCharMatch = exp && heard && exp[0] === heard[0];
    const containsMatch = exp && heard && (heard.includes(exp) || exp.includes(heard));

    if (score >= 0.75 || containsMatch) setCheckResult('correct');
    else if (score >= 0.5 || firstCharMatch) setCheckResult('close');
    else setCheckResult('wrong');
  }, [currentWord?.word, listenOnce, recordedAudio]);

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

              {recordedAudio && !isRecording ? (
                <div className="waveform">
                  {WAVE_BARS.map((_, i) => (
                    <div key={i} className="wave-bar" />
                  ))}
                </div>
              ) : null}

              {isRecording ? <span className="recording-text">Đang ghi âm...</span> : null}
            </div>
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
            disabled={!recordedAudio || isRecording}
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
