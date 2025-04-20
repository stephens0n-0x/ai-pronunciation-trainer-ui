import { create } from "zustand";

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

export const useAttempts = create<State>((set) => ({
  attempts: [],
  addAttempt: (a) => set((s) => ({ attempts: [a, ...s.attempts] })),
}));
