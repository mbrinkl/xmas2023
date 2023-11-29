import { useCallback, useEffect, useMemo, useState } from 'react';
import { generate } from 'sudoku-core';
import SudokuWorker from '../workers/SudokuWorker?worker';
import { Box, Grid, Spinner, Text, VStack, Wrap } from '@chakra-ui/react';
import { ChallengeContainer, ProgressStatus } from './ChallengeContainer';
import { useChallengeStore } from '../store/challengeStore';
import { DeleteIcon } from '@chakra-ui/icons';

type Board = ReturnType<typeof generate>;

const getNonNullIndices = (arr: unknown[]) => {
  const indices = [];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] !== null) {
      indices.push(i);
    }
  }
  return indices;
};

interface IControlButton {
  onClick: () => void;
  children: React.ReactNode;
}

const ControlButton = (props: IControlButton): JSX.Element => {
  return (
    <Box
      borderWidth={2}
      borderColor="gray.500"
      px={2}
      fontWeight="bold"
      cursor="pointer"
      _hover={{ bg: 'gray.200' }}
      onClick={props.onClick}
    >
      {props.children}
    </Box>
  );
};

interface ISudokuSection {
  index: number;
  val: number | null;
  disabledIndices: number[];
  selectedIndex: number | null;
  selectedValue: number | null;
  setSelectedIndex: (index: number) => void;
}

const SudokuSection = (props: ISudokuSection): JSX.Element => {
  const isDisabled = props.disabledIndices.includes(props.index);
  const isSelected = props.selectedIndex === props.index;
  const isValueSelected =
    props.val !== null && props.selectedValue === props.val;
  return (
    <Box
      w={33}
      h={33}
      borderWidth={1}
      borderColor="gray.500"
      cursor={isDisabled ? 'default' : 'pointer'}
      bg={isSelected ? 'blue.300' : isValueSelected ? 'blue.100' : 'white'}
      onClick={
        isDisabled
          ? undefined
          : () => {
              props.setSelectedIndex(props.index);
            }
      }
    >
      <Text
        textAlign="center"
        fontWeight="bold"
        textColor={isDisabled ? 'black' : 'blue.600'}
      >
        {props.val}
      </Text>
    </Box>
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
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const setUserBoardAtIndex = (value: number | null, index: number) => {
    setUserBoard(
      (prev) =>
        prev?.map((i, ind) => {
          if (ind !== index) {
            return i;
          }
          return value;
        }) as Board,
    );
  };

  const handleKeydown = useCallback(
    (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === 'Backspace') {
        setUserBoardAtIndex(null, selectedIndex);
      } else if (/^[1-9]$/i.test(e.key)) {
        setUserBoardAtIndex(Number(e.key), selectedIndex);
      }
    },
    [selectedIndex],
  );

  // keybindings
  useEffect(() => {
    document.addEventListener('keydown', handleKeydown);
    return () => document.removeEventListener('keydown', handleKeydown);
  }, [handleKeydown]);

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
    if (!userBoard || !solution || userBoard.some((x) => x === null)) {
      setProgress('in-progress');
    } else if (JSON.stringify(userBoard) === JSON.stringify(solution)) {
      setProgress('success');
    } else {
      setProgress('failure');
    }
  }, [solution, userBoard]);

  const disabledIndices: number[] = useMemo(
    () => (board ? getNonNullIndices(board) : []),
    [board],
  );

  return (
    <ChallengeContainer challenge={challenge} progress={progress}>
      {!board || !userBoard ? (
        <Spinner />
      ) : (
        <VStack>
          <Grid
            templateRows="1fr 1fr 1.1fr 1fr 1fr 1.1fr 1fr 1fr 1fr"
            templateColumns="1fr 1fr 1.1fr 1fr 1fr 1.1fr 1fr 1fr 1fr"
            bg="gray.500"
            p={1}
          >
            {userBoard.map((val, index) => (
              <SudokuSection
                key={index}
                val={val}
                index={index}
                disabledIndices={disabledIndices}
                selectedIndex={selectedIndex}
                selectedValue={
                  selectedIndex !== null ? userBoard[selectedIndex] : null
                }
                setSelectedIndex={setSelectedIndex}
              />
            ))}
          </Grid>
          <Wrap>
            {[...'123456789'].map((num) => (
              <ControlButton
                key={num}
                onClick={() =>
                  handleKeydown(new KeyboardEvent('keydown', { key: num }))
                }
              >
                {num}
              </ControlButton>
            ))}
            <ControlButton
              onClick={() => {
                handleKeydown(
                  new KeyboardEvent('keydown', { key: 'Backspace' }),
                );
              }}
            >
              <DeleteIcon boxSize={4} pb={1} color="red.500" />
            </ControlButton>
          </Wrap>
        </VStack>
      )}
    </ChallengeContainer>
  );
};
