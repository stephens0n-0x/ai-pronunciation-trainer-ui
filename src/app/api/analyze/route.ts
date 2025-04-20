import { NextResponse } from "next/server";

export async function POST() {
  // sleep 1 s to mimic latency
  await new Promise((r) => setTimeout(r, 1000));

  // fake scoring
  const score = Math.floor(60 + Math.random() * 40);
  const tips = ["Focus on /θ/ vs /ð/", "Mind the word stress", "Slow down endings"];

  return NextResponse.json({
    score,
    highlights: tips.slice(0, Math.random() < 0.5 ? 2 : 3),
  });
}
