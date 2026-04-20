'use client';
import { useState, useRef, useEffect, useCallback } from 'react';

export default function AudioPlayer({ src, title, genre, producer }) {
  const audioRef = useRef(null);
  const progressRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onLoaded = () => { setDuration(audio.duration); setLoaded(true); };
    const onTime = () => setCurrentTime(audio.currentTime);
    const onEnded = () => setPlaying(false);

    audio.addEventListener('loadedmetadata', onLoaded);
    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', onLoaded);
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('ended', onEnded);
    };
  }, []);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) { audio.pause(); } else { audio.play(); }
    setPlaying(!playing);
  }, [playing]);

  const seek = useCallback((e) => {
    const audio = audioRef.current;
    const bar = progressRef.current;
    if (!audio || !bar || !duration) return;
    const rect = bar.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audio.currentTime = pct * duration;
  }, [duration]);

  const fmt = (s) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const pct = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="audio-player">
      <audio ref={audioRef} src={src} preload="metadata" />

      <button className="audio-player-btn" onClick={toggle} aria-label={playing ? 'Pause' : 'Play'}>
        {playing ? (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
            <rect x="4" y="3" width="3.5" height="12" rx="1" />
            <rect x="10.5" y="3" width="3.5" height="12" rx="1" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
            <path d="M5 3.5v11l9.5-5.5z" />
          </svg>
        )}
      </button>

      <div className="audio-player-meta">
        <div className="audio-player-top">
          <span className="audio-player-title">{title}</span>
          <span className="audio-player-genre">{genre}</span>
          {producer && <span className="audio-player-producer">{producer}</span>}
        </div>
        <div className="audio-player-bar-wrap" ref={progressRef} onClick={seek}>
          <div className="audio-player-bar">
            <div className="audio-player-bar-fill" style={{ width: `${pct}%` }} />
          </div>
        </div>
        <div className="audio-player-times">
          <span>{fmt(currentTime)}</span>
          <span>{loaded ? fmt(duration) : '--:--'}</span>
        </div>
      </div>
    </div>
  );
}
