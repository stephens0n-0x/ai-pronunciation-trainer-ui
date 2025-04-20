/* ─── src/components/AudioRecorder.tsx ─────────────────────────── */
"use client";

import { useState, useRef, useEffect } from "react";
import { useAttempts } from "@/attempts/store";
import FeedbackPanel from "@/components/FeedbackPanel";
import Waveform from "@/components/Waveform";

export default function AudioRecorder() {
  /* ── local state ─────────────────────────────────────────────── */
  const [isRecording, setIsRecording]   = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [audioBlob, setAudioBlob]       = useState<Blob | null>(null);
  const [feedback, setFeedback]         = useState<null | { score: number; highlights: string[] }>(null);
  const [level, setLevel]               = useState(0);   // live RMS for level bar

  /* ── refs ─────────────────────────────────────────────────────── */
  const mediaRecorder = useRef<MediaRecorder>();
  const analyser      = useRef<AnalyserNode>();
  const dataArray     = useRef<Uint8Array>();
  const audioRef      = useRef<HTMLAudioElement>(null);
  const raf           = useRef<number>();

  /* ── zustand store action ─────────────────────────────────────── */
  const addAttempt = useAttempts((s) => s.addAttempt);

  /* ── helpers ──────────────────────────────────────────────────── */
  /** choose a replayable mime type */
  const pickMime = () => {
    const list = [
      "audio/webm",
      'audio/mp4;codecs="opus"',
      "audio/mp4",
      "audio/ogg",
      "audio/wav",
    ];
    return list.find((m) => MediaRecorder.isTypeSupported(m)) || "";
  };

  /* ── recording flow ───────────────────────────────────────────── */
  async function handleRecord() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    /* media‑recorder */
    const mime = pickMime();
    mediaRecorder.current = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
    const chunks: Blob[] = [];

    mediaRecorder.current.ondataavailable = (e) => chunks.push(e.data);
    mediaRecorder.current.onstop = () => {
      const blob = new Blob(chunks, { type: mime || "audio/webm" });
      setAudioBlob(blob);
      stream.getTracks().forEach((t) => t.stop());
      cancelAnimationFrame(raf.current!);
      setLevel(0);
    };

    /* live RMS level */
    const ctx     = new AudioContext();
    const source  = ctx.createMediaStreamSource(stream);
    analyser.current   = ctx.createAnalyser();
    analyser.current.fftSize = 256;
    dataArray.current  = new Uint8Array(analyser.current.frequencyBinCount);
    source.connect(analyser.current);

    const tick = () => {
      analyser.current!.getByteTimeDomainData(dataArray.current!);
      const rms = Math.sqrt(
        dataArray.current!.reduce((s, v) => {
          const n = v / 128 - 1;
          return s + n * n;
        }, 0) / dataArray.current!.length
      );
      setLevel(rms);
      raf.current = requestAnimationFrame(tick);
    };
    tick();

    mediaRecorder.current.start();
    setIsRecording(true);
    setFeedback(null);
  }

  function handleStop() {
    mediaRecorder.current?.stop();
    setIsRecording(false);
  }

  /* ── hook up playback URL ─────────────────────────────────────── */
  useEffect(() => {
    if (audioBlob && audioRef.current) {
      audioRef.current.src = URL.createObjectURL(audioBlob);
    }
  }, [audioBlob]);

  /* ── submit to mock API ───────────────────────────────────────── */
  async function handleSubmit() {
    if (!audioBlob) return;
    setIsSubmitting(true);
    const res  = await fetch("/api/analyze", { method: "POST", body: audioBlob });
    const data = await res.json(); // { score, highlights }
    setFeedback(data);

    addAttempt({
      id: crypto.randomUUID(),
      date: Date.now(),
      blob: audioBlob,
      score: data.score,
      highlights: data.highlights,
    });

    setIsSubmitting(false);
  }

  /* ── render ───────────────────────────────────────────────────── */
  return (
    <section className="space-y-6 w-full">
      {/* live level bar */}
      <div className="h-3 bg-slate-200 rounded">
        <div
          className="h-full bg-blue-600 transition-all duration-75"
          style={{ width: `${Math.min(level * 200, 100)}%` }}
        />
      </div>

      {/* waveform after recording stops */}
      {audioBlob && (
        <Waveform audioBlob={audioBlob} isRecording={isRecording} />
      )}

      {/* controls */}
      <div className="flex flex-wrap items-center gap-4 justify-center">
        {!isRecording && (
          <button
            onClick={handleRecord}
            className="px-6 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Record
          </button>
        )}

        {isRecording && (
          <button
            onClick={handleStop}
            className="px-6 py-2 rounded bg-red-600 text-white animate-pulse"
          >
            Stop
          </button>
        )}

        {audioBlob && !isRecording && (
          <>
            <button
              onClick={() => audioRef.current?.play()}
              className="px-4 py-2 rounded border"
            >
              ▶︎ Play
            </button>
            <button
              onClick={() => setAudioBlob(null)}
              className="px-4 py-2 rounded border"
            >
              ↺ Retry
            </button>
          </>
        )}
      </div>

      {/* submit + feedback */}
      {audioBlob && !isRecording && !feedback && (
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="px-6 py-2 rounded bg-green-600 text-white disabled:opacity-50"
        >
          {isSubmitting ? "Analyzing…" : "Submit"}
        </button>
      )}

      {feedback && <FeedbackPanel {...feedback} />}

      {/* hidden audio element */}
      <audio ref={audioRef} controls className="hidden" />
    </section>
  );
}
