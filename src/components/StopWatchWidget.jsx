import React, { useEffect, useRef, useState, useCallback } from "react";

/**
 * StopwatchWidget
 * - Start / Pause (Space)
 * - Lap (L)
 * - Reset (R)
 * - Persists per-widget by `id` in localStorage
 * - Accessible + keyboard friendly
 * - Tailwind styled, no external hooks required
 */
export default function StopwatchWidget({ id = "default", title = "Stopwatch", onClose }) {
  const storageKey = `stopwatch-${id}`;

  const [isRunning, setIsRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0); // in ms
  const [laps, setLaps] = useState([]); // [{id, t}]

  const startRef = useRef(0); // epoch ms when (re)started
  const timerRef = useRef(null);

  // Load saved state
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const saved = JSON.parse(raw);
        setElapsed(saved.elapsed || 0);
        setLaps(Array.isArray(saved.laps) ? saved.laps : []);
        setIsRunning(!!saved.isRunning);
        // If it was running, recompute from saved start
        if (saved.isRunning && saved.startTime) {
          startRef.current = saved.startTime;
          setElapsed(Math.max(0, Date.now() - saved.startTime));
          startTimer();
        } else if (saved.startTime) {
          startRef.current = saved.startTime;
        }
      }
    } catch (e) {
      // ignore corrupted storage
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  // Persist state
  useEffect(() => {
    const state = {
      isRunning,
      elapsed,
      laps,
      startTime: startRef.current,
      updatedAt: Date.now(),
    };
    try {
      localStorage.setItem(storageKey, JSON.stringify(state));
    } catch {}
  }, [isRunning, elapsed, laps, storageKey]);

  const tick = useCallback(() => {
    setElapsed(Date.now() - startRef.current);
  }, []);

  const startTimer = useCallback(() => {
    if (timerRef.current) return;
    timerRef.current = setInterval(tick, 50); // 20fps is smooth enough, light on CPU
  }, [tick]);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const handleStartPause = useCallback(() => {
    if (isRunning) {
      stopTimer();
      setIsRunning(false);
    } else {
      startRef.current = Date.now() - elapsed;
      startTimer();
      setIsRunning(true);
    }
  }, [elapsed, isRunning, startTimer, stopTimer]);

  const handleReset = useCallback(() => {
    stopTimer();
    setIsRunning(false);
    setElapsed(0);
    setLaps([]);
    startRef.current = 0;
  }, [stopTimer]);

  const handleLap = useCallback(() => {
    setLaps((prev) => [{ id: crypto.randomUUID?.() || String(Date.now()), t: elapsed }, ...prev]);
  }, [elapsed]);

  // Keep time accurate when tab visibility changes (prevents drift)
  useEffect(() => {
    const onVis = () => {
      if (isRunning && startRef.current) setElapsed(Date.now() - startRef.current);
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [isRunning]);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e) => {
      if (e.target && ["INPUT", "TEXTAREA"].includes(e.target.tagName)) return;
      if (e.code === "Space") {
        e.preventDefault();
        handleStartPause();
      } else if (e.key.toLowerCase() === "l") {
        handleLap();
      } else if (e.key.toLowerCase() === "r") {
        handleReset();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleStartPause, handleLap, handleReset]);

  // Helpers
  const formatTime = (ms) => {
    const totalMs = Math.max(0, Math.floor(ms));
    const cs = Math.floor((totalMs % 1000) / 10); // centiseconds
    const totalSeconds = Math.floor(totalMs / 1000);
    const s = totalSeconds % 60;
    const m = Math.floor(totalSeconds / 60) % 60;
    const h = Math.floor(totalSeconds / 3600);
    const pad = (n, len = 2) => String(n).padStart(len, "0");
    return h > 0
      ? `${h}:${pad(m)}:${pad(s)}.${pad(cs)}`
      : `${m}:${pad(s)}.${pad(cs)}`;
  };

  return (
    <div
      className="group w-full h-full bg-white/70 dark:bg-slate-900/70 backdrop-blur rounded-2xl shadow p-4 flex flex-col gap-3 border border-slate-200 dark:border-slate-800"
      role="region"
      aria-label={`${title} widget`}
    >
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" aria-hidden />
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h2>
        </div>
        <div className="flex items-center gap-2">
          <kbd className="text-xs px-1.5 py-0.5 rounded border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300">Space</kbd>
          <span className="text-xs text-slate-500 dark:text-slate-400">Start/Pause</span>
          {onClose && (
            <button
              onClick={onClose}
              className="ml-2 px-2 py-1 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Close stopwatch"
            >
              ✕
            </button>
          )}
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center select-none">
        <div className="tabular-nums tracking-tight text-5xl sm:text-6xl font-bold text-slate-900 dark:text-slate-50" aria-live="polite">
          {formatTime(elapsed)}
        </div>
      </div>

      <div className="flex items-center justify-center gap-2">
        <button
          onClick={handleStartPause}
          className={`px-4 py-2 rounded-2xl shadow-sm border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition ${
            isRunning
              ? "bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-300 hover:bg-amber-500/20"
              : "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20"
          }`}
          aria-pressed={isRunning}
          aria-label={isRunning ? "Pause" : "Start"}
        >
          {isRunning ? "Pause" : "Start"}
        </button>
        <button
          onClick={handleLap}
          className="px-4 py-2 rounded-2xl shadow-sm border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          aria-label="Lap"
        >
          Lap
        </button>
        <button
          onClick={handleReset}
          className="px-4 py-2 rounded-2xl shadow-sm border border-rose-400/40 text-rose-700 dark:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
          aria-label="Reset"
        >
          Reset
        </button>
      </div>

      <div className="max-h-40 overflow-auto rounded-xl border border-slate-200 dark:border-slate-800">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-slate-50 dark:bg-slate-800/70 text-slate-600 dark:text-slate-300">
            <tr>
              <th className="text-left px-3 py-2 font-medium">Lap</th>
              <th className="text-right px-3 py-2 font-medium">Time</th>
              <th className="w-10 px-2"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {laps.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-3 py-3 text-slate-500 dark:text-slate-400 text-center">No laps yet. Press “L”.</td>
              </tr>
            ) : (
              laps.map((lap, idx) => (
                <tr key={lap.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/50">
                  <td className="px-3 py-2 text-slate-700 dark:text-slate-200">#{laps.length - idx}</td>
                  <td className="px-3 py-2 text-right tabular-nums text-slate-900 dark:text-slate-100">{formatTime(lap.t)}</td>
                  <td className="px-1 py-1 text-right">
                    <button
                      onClick={() => setLaps((prev) => prev.filter((l) => l.id !== lap.id))}
                      className="px-2 py-1 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800"
                      aria-label={`Delete lap ${laps.length - idx}`}
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <footer className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-3">
          <span><kbd className="px-1 rounded border border-slate-300 dark:border-slate-700">L</kbd> Lap</span>
          <span><kbd className="px-1 rounded border border-slate-300 dark:border-slate-700">R</kbd> Reset</span>
        </div>
        <div className="opacity-70">persists automatically</div>
      </footer>
    </div>
  );
}
