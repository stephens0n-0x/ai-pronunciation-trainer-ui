import Link from "next/link";

export default function Home() {
  return (
    <section className="mx-auto max-w-3xl py-20 text-center space-y-6">
      <h2 className="text-3xl font-bold">
        Welcome to your AI Pronunciation Coach
      </h2>
      <p className="text-lg">
        Record your speech, get instant feedback, and watch your skills improve.
      </p>
      <Link
        href="/practice"
        className="inline-block rounded-md bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
      >
        Start Practicing
      </Link>
    </section>
  );
}
