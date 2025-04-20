"use client";

import { useAttempts } from "@/attempts/store";
import { useEffect, useState } from "react";

export default function History() {
  const attempts = useAttempts((s) => s.attempts);
  const [playing, setPlaying] = useState<string | null>(null);

  if (!attempts.length)
    return <p className="p-10 text-center">No attempts yet.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">History</h2>
      <table className="w-full text-sm">
        <thead className="text-left">
          <tr className="border-b">
            <th className="py-2">Date</th>
            <th>Score</th>
            <th>Feedback</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {attempts.map((a) => (
            <tr key={a.id} className="border-b">
              <td className="py-2">
                {new Date(a.date).toLocaleString()}
              </td>
              <td>{a.score}%</td>
              <td>{a.highlights.join(", ")}</td>
              <td>
                <button
                  onClick={() => {
                    const url = URL.createObjectURL(a.blob);
                    const audio = new Audio(url);
                    setPlaying(a.id);
                    audio.play();
                    audio.onended = () => setPlaying(null);
                  }}
                  className="underline"
                >
                  {playing === a.id ? "Playing…" : "Play"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
