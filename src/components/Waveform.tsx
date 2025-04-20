// Live waveform during recording, static waveform after stop 
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

    recRef.current = wsRef.current.registerPlugin(
      RecordPlugin.create({
        // plugin options go here if you need them
      })
    );

    return () => {
      wsRef.current?.destroy();
    };
  }, []);

  useEffect(() => {
    if (!recRef.current) return;
    if (isRecording)   recRef.current.startRecording();
    else               recRef.current.stopRecording();
  }, [isRecording]);

  useEffect(() => {
    if (blob && wsRef.current) {
      wsRef.current.loadBlob(blob);
    }
  }, [blob]);

  return <div ref={containerRef} className="w-full" />;
}
