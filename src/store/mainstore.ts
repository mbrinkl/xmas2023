import { create } from 'zustand';
// import { persist } from 'zustand/middleware';

export interface IChallenge {
  name: string;
  status: 'locked' | 'unlocked' | 'completed';
}

interface IChallengeStore {
  challenges: IChallenge[];
  updateChallenge: (updatedChallenge: IChallenge) => void;
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
        status: 'locked',
      },
      {
        name: 'jigsaw',
        status: 'unlocked',
      },
      {
        name: 'wordle',
        status: 'locked',
      },
      {
        name: 'sudoku',
        status: 'locked',
      },
      {
        name: 'rubix',
        status: 'locked',
      },
    ],
    updateChallenge: (updatedChallenge) => {
      set((state) => ({
        challenges: state.challenges.map((challenge) => {
          if (challenge.name !== updatedChallenge.name) {
            return challenge;
          }
          return updatedChallenge;
        }),
      }));
    },
  }),
  // {
  //   name: 'challenge-store',
  // },
  //),
);
