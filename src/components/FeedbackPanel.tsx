"use client";

type Props = {
  score: number;
  highlights: string[];
};

export default function FeedbackPanel({ score, highlights }: Props) {
  return (
    <div className="border rounded p-6 space-y-4">
      <h3 className="font-semibold text-lg">AI Feedback</h3>

      {/* simple radial */}
      <div className="relative w-24 h-24 mx-auto">
        <svg viewBox="0 0 36 36" className="w-full h-full">
          <path
            d="M18 2.084a 15.916 15.916 0 1 1 0 31.832a 15.916 15.916 0 1 1 0 -31.832"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="2"
          />
          <path
            d="M18 2.084a 15.916 15.916 0 0 1 0 31.832"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
            strokeDasharray={`${score},100`}
            strokeLinecap="round"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center font-semibold">
          {score}%
        </span>
      </div>

      <ul className="list-disc pl-5 space-y-1 text-sm">
        {highlights.map((h) => (
          <li key={h}>{h}</li>
        ))}
      </ul>
    </div>
  );
}
