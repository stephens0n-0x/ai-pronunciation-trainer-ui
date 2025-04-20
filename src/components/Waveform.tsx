"use client";

import { useEffect, useRef } from "react";
import WaveSurfer from "wavesurfer.js";

type Props = {
  audioBlob: Blob | null;
  isRecording: boolean;
};

export default function Waveform({ audioBlob, isRecording }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const ws = useRef<WaveSurfer>();

  // init on mount
  useEffect(() => {
    if (!containerRef.current) return;

    ws.current = WaveSurfer.create({
      container: containerRef.current,
      waveColor: "#cbd5e1",
      progressColor: "#3b82f6",
      barWidth: 2,
      cursorWidth: 0,
      height: 80,
    });

    return () => ws.current?.destroy();
  }, []);

  // load audio when we stop recording
  useEffect(() => {
    if (audioBlob && ws.current) {
      ws.current.loadBlob(audioBlob);
    }
  }, [audioBlob]);

  // simple glow while recording
  useEffect(() => {
    if (!ws.current) return;
    ws.current.setOptions({
      progressColor: isRecording ? "#ef4444" : "#3b82f6",
    });
  }, [isRecording]);

  return <div ref={containerRef} className="w-full" />;
}
