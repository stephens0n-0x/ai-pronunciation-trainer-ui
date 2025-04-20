"use client";

import { useState, useRef, useEffect } from "react";
import { useAttempts, Attempt } from "@/attempts/store";
import FeedbackPanel from "@/components/FeedbackPanel";
import Waveform from "@/components/Waveform";

export default function AudioRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [feedback, setFeedback] = useState<null | { score: number; highlights: string[] }>(null);
  const [level, setLevel] = useState(0);

  const mediaRecorder = useRef<MediaRecorder>();
  const analyser = useRef<AnalyserNode>();
  const dataArray = useRef<Uint8Array>();
  const audioRef = useRef<HTMLAudioElement>(null);
  const raf = useRef<number>();

  const addAttempt = useAttempts((s) => s.addAttempt);

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

  async function handleRecord() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mime = pickMime();

    mediaRecorder.current = new MediaRecorder(
      stream,
      mime ? { mimeType: mime } : undefined
    );
    const chunks: Blob[] = [];

    mediaRecorder.current.ondataavailable = (e) => chunks.push(e.data);
    mediaRecorder.current.onstop = () => {
      const blob = new Blob(chunks, { type: mime || "audio/webm" });
      setAudioBlob(blob);
      stream.getTracks().forEach((t) => t.stop());
      cancelAnimationFrame(raf.current!);
      setLevel(0);
    };

    const ctx = new AudioContext();
    const source = ctx.createMediaStreamSource(stream);
    analyser.current = ctx.createAnalyser();
    analyser.current.fftSize = 256;
    dataArray.current = new Uint8Array(analyser.current.frequencyBinCount);
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

  useEffect(() => {
    if (audioBlob && audioRef.current) {
      audioRef.current.src = URL.createObjectURL(audioBlob);
    }
  }, [audioBlob]);

  async function handleSubmit() {
    if (!audioBlob) return;
    setIsSubmitting(true);
    const res = await fetch("/api/analyze", { method: "POST", body: audioBlob });
    const data = await res.json();
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

  return (
    <section className="space-y-6 w-full">
      <div className="h-3 bg-slate-200 rounded">
        <div
          className="h-full bg-blue-600 transition-all duration-75"
          style={{ width: `${Math.min(level * 200, 100)}%` }}
        />
      </div>

      <Waveform blob={audioBlob} isRecording={isRecording} />

      <div className="flex flex-wrap items-center gap-4 justify-center">
        {!isRecording && !audioBlob && (
          <button
            onClick={handleRecord}
            className="px-6 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Record
          </button>
        )}
        {isRecording && (
          <button
            onClick={handleStop}
            className="px-6 py-2 rounded bg-red-600 text-white animate-pulse transition"
          >
            Stop
          </button>
        )}

        {audioBlob && !isRecording && (
          <>
            <button
              onClick={() => audioRef.current?.play()}
              className="px-4 py-2 rounded border border-blue-600 text-blue-600 hover:bg-blue-50 transition focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              ▶︎ Play
            </button>
            <button
              onClick={() => setAudioBlob(null)}
              className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-100 transition focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              ↺ Retry
            </button>
          </>
        )}
      </div>

      {audioBlob && !isRecording && !feedback && (
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="px-6 py-2 rounded bg-green-600 text-white disabled:opacity-50 transition"
        >
          {isSubmitting ? "Analyzing…" : "Submit"}
        </button>
      )}

      {feedback && <FeedbackPanel {...feedback} />}

      <audio ref={audioRef} controls className="hidden" />
    </section>
  );
}
