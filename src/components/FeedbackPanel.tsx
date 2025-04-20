"use client";

type Props = {
  score: number;
  highlights: string[];
};

export default function FeedbackPanel({ score, highlights }: Props) {
  return (
    <div className="border rounded p-6 space-y-4 text-center">
      <h3 className="font-semibold text-lg">AI Feedback</h3>
      {/* BIG number */}
      <div className="text-5xl font-bold text-blue-600">{score}%</div>

      {highlights.length > 0 && (
        <ul className="list-disc pl-5 space-y-1 text-sm text-left">
          {highlights.map((h) => (
            <li key={h}>{h}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
