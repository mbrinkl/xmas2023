import { createBrowserRouter } from 'react-router-dom';
import { Home } from './components/Home';
import { JigsawChallenge } from './components/JigsawChallenge';
import { PunchoutChallenge } from './components/PunchoutChallenge';
import { ChainReactionChallenge } from './components/ChainReactionChallenge';
import { WordleChallenge } from './components/WordleChallenge';
import { RubiksChallenge } from './components/RubiksChallenge';
import { SudokuChallenge } from './components/SudokuChallenge';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
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
    element: <SudokuChallenge />,
  },
  {
    path: '/chain-reaction',
    element: <ChainReactionChallenge />,
  },
  {
    path: '/wordle',
    element: <WordleChallenge />,
  },
  {
    path: '/rubiks',
    element: <RubiksChallenge />,
  },
]);
