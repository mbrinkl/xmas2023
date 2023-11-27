import { create } from 'zustand';
// import { persist } from 'zustand/middleware';

export interface IChallenge {
  name: string;
  status: 'locked' | 'unlocked' | 'completed';
}

interface IChallengeStore {
  challenges: IChallenge[];
  completeChallenge: (completedChallenge: IChallenge) => void;
}

export const useChallengeStore = create<IChallengeStore>()(
  //persist(
  (set) => ({
    challenges: [
      {
        name: 'chain-reaction',
        status: 'unlocked',
      },
      {
        name: 'punchout',
        status: 'unlocked',
      },
      {
        name: 'jigsaw',
        status: 'unlocked',
      },
      {
        name: 'wordle',
        status: 'unlocked',
      },
      {
        name: 'sudoku',
        status: 'unlocked',
      },
      {
        name: 'rubiks',
        status: 'unlocked',
      },
    ],
    completeChallenge: (completedChallenge) => {
      set((state) => ({
        challenges: state.challenges.map((challenge) => {
          if (challenge.name !== completedChallenge.name) {
            return challenge;
          }
          return { ...challenge, status: 'completed' };
        }),
      }));
    },
  }),
  // {
  //   name: 'challenge-store',
  // },
  //),
);
