/* ─── src/components/Waveform.tsx ─────────────────────────────── */
/* Live waveform during recording, static waveform after stop */
"use client";

import { useEffect, useRef } from "react";
import WaveSurfer from "wavesurfer.js";
// <-- import from the plugins folder (no /dist path)
import RecordPlugin from "wavesurfer.js/plugins/record";

type Props = { blob: Blob | null; isRecording: boolean };

export default function Waveform({ blob, isRecording }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wsRef        = useRef<WaveSurfer>();
  const recRef       = useRef<ReturnType<typeof RecordPlugin.create>>();

  /* 1) Initialize WaveSurfer and register Record plugin */
  useEffect(() => {
    if (!containerRef.current) return;

    wsRef.current = WaveSurfer.create({
      container: containerRef.current,
      waveColor: "#cbd5e1",
      progressColor: "#3b82f6",
      barWidth: 2,
      cursorWidth: 0,
      height: 80,
    });

    // register the Record (mic) plugin and keep its instance
    recRef.current = wsRef.current.registerPlugin(
      RecordPlugin.create({
        // plugin options go here if you need them
      })
    );

    return () => {
      wsRef.current?.destroy();
    };
  }, []);

  /* 2) Kick off / tear down live mic capture */
  useEffect(() => {
    if (!recRef.current) return;
    if (isRecording)   recRef.current.startRecording();
    else               recRef.current.stopRecording();
  }, [isRecording]);

  /* 3) Once we have the blob, draw the static waveform */
  useEffect(() => {
    if (blob && wsRef.current) {
      wsRef.current.loadBlob(blob);
    }
  }, [blob]);

  return <div ref={containerRef} className="w-full" />;
}
