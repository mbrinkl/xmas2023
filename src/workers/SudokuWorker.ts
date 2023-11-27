import { generate, solve } from 'sudoku-core';

onmessage = () => {
  const board = generate('easy');
  const solution = solve(board);
  postMessage({ board, solution });
};
