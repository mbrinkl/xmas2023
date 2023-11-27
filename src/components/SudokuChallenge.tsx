import { useEffect, useMemo, useState } from 'react';
import { generate } from 'sudoku-core';
import SudokuWorker from '../workers/SudokuWorker?worker';
import { Box, Grid, Spinner } from '@chakra-ui/react';
import { ChallengeContainer, ProgressStatus } from './ChallengeContainer';
import { useChallengeStore } from '../store/mainstore';

type Board = ReturnType<typeof generate>;
const CHUNK_SIZE = 9;

const chunkArray = <T,>(arr: T[], chunkSize: number): T[][] => {
  const chunks: T[][] = [];
  let i = 0;

  while (i < arr.length) {
    chunks.push(arr.slice(i, (i += chunkSize)));
  }

  return chunks;
};

const getNonNullIndices = (arr: unknown[]) => {
  const indices = [];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] !== null) {
      indices.push(i);
    }
  }
  return indices;
};

interface ISudokuSection {
  sectionNumber: number;
  vals: (number | null)[];
  disabledIndices: number[];
}

const SudokuSection = (props: ISudokuSection): JSX.Element => {
  return (
    <Grid templateColumns="repeat(3, 1fr)" w={100} textAlign="center" m={0.5}>
      {props.vals.map((v, index) => {
        const isDisabled = props.disabledIndices.includes(
          index + props.sectionNumber * CHUNK_SIZE,
        );
        return (
          <Box
            key={`${index}section${props.sectionNumber}`}
            w={33}
            h={33}
            borderWidth={1}
            borderColor="gray.500"
            cursor="pointer"
            bg="white"
            _hover={isDisabled ? undefined : { bg: 'blue.200' }}
          >
            {v}
          </Box>
        );
      })}
    </Grid>
  );
};

export const SudokuChallenge = (): JSX.Element => {
  const challenge = useChallengeStore(
    (s) => s.challenges.find((challenge) => challenge.name === 'sudoku')!,
  );
  const [progress, setProgress] = useState<ProgressStatus>('in-progress');
  const [board, setBoard] = useState<Board | null>(null);
  const [userBoard, setUserBoard] = useState<Board | null>(null);
  const [solution, setSolution] = useState<Board | null>(null);

  // sudoku generation
  useEffect(() => {
    const worker = new SudokuWorker();

    worker.onmessage = (e: MessageEvent<{ board: Board; solution: Board }>) => {
      const { board: generatedBoard, solution: generatedSolution } = e.data;
      setBoard(generatedBoard);
      setUserBoard(generatedBoard);
      setSolution(generatedSolution);
    };
    worker.postMessage(null);

    return () => {
      worker.terminate();
    };
  }, []);

  // solve detection
  useEffect(() => {
    if (
      userBoard === null ||
      solution === null ||
      userBoard.some((x) => x === null)
    ) {
      setProgress('in-progress');
    } else if (JSON.stringify(userBoard) === JSON.stringify(solution)) {
      setProgress('success');
    } else {
      setProgress('failure');
    }
  }, [solution, userBoard]);

  const disabledIndices: number[] = useMemo(() => {
    if (board) {
      return getNonNullIndices(board);
    }
    return [];
  }, [board]);

  return (
    <ChallengeContainer challenge={challenge} progress={progress}>
      {!board || !userBoard ? (
        <Spinner />
      ) : (
        <Grid templateColumns="repeat(3, 1fr)" bg="gray.500" p={0.5}>
          {chunkArray(userBoard, CHUNK_SIZE).map((chunk, index) => (
            <SudokuSection
              key={index}
              vals={chunk}
              sectionNumber={index}
              disabledIndices={disabledIndices}
            />
          ))}
        </Grid>
      )}
    </ChallengeContainer>
  );
};
