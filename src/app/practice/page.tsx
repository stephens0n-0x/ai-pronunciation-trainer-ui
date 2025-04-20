import AudioRecorder from "@/components/AudioRecorder";

export default function Practice() {
  return (
    <div className="mx-auto max-w-2xl p-6 space-y-10">
      <h2 className="text-2xl font-bold text-center">Practice</h2>
      <AudioRecorder />
      {/* AI feedback panel will go here in round 3‑B */}
    </div>
  );
}
