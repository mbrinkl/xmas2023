import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface IChallenge {
  name: string;
  status: 'locked' | 'unlocked' | 'completed';
}

interface IChallengeStore {
  challenges: IChallenge[];
  completeChallenge: (completedChallenge: IChallenge) => void;
}

export const useChallengeStore = create<IChallengeStore>()(
  persist(
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
          status: 'locked',
        },
        {
          name: 'wordle',
          status: 'locked',
        },
        {
          name: 'sudoku',
          status: 'locked',
        },
      ],
      completeChallenge: (completedChallenge) => {
        let nextChallengeUnlocked = false;
        set((state) => ({
          challenges: state.challenges.map((challenge) => {
            if (challenge.name !== completedChallenge.name) {
              if (!nextChallengeUnlocked && challenge.status === 'locked') {
                nextChallengeUnlocked = true;
                return { ...challenge, status: 'unlocked' };
              }
              return challenge;
            }
            return { ...challenge, status: 'completed' };
          }),
        }));
      },
    }),
    {
      name: 'challenge-store',
    },
  ),
);
