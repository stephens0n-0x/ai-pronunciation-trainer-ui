/* src/attempts/store.ts */
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Attempt = {
  id: string;
  date: number;
  blob: Blob;
  score: number;
  highlights: string[];
};

type State = {
  attempts: Attempt[];
  addAttempt: (a: Attempt) => void;
};

export const useAttempts = create<State>()(
  persist(
    (set) => ({
      attempts: [],
      addAttempt: (a) => set((s) => ({ attempts: [a, ...s.attempts] })),
    }),
    {
      name: "pronunciation-history", // localStorage key
      partialize: (state) => ({
        // ⬇︎ serialize everything *except* the Blob (can’t store that)
        attempts: state.attempts.map(({ blob, ...rest }) => rest),
      }),
    }
  )
);
