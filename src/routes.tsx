import { createBrowserRouter } from 'react-router-dom';
import { App } from './App';
import { JigsawChallenge } from './components/JigsawChallenge';
import { PunchoutChallenge } from './components/PunchoutChallenge';
import { ChainReactionChallenge } from './components/ChainReactionChallenge';
import { WordleChallenge } from './components/WorldeChallenge';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/jigsaw',
    element: <JigsawChallenge />,
  },
  {
    path: '/punchout',
    element: <PunchoutChallenge />,
  },
  {
    path: '/sudoku',
    element: <PunchoutChallenge />,
  },
  {
    path: '/chain-reaction',
    element: <ChainReactionChallenge />,
  },
  {
    path: '/wordle',
    element: <WordleChallenge />,
  },
]);
