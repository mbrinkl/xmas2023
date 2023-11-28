import { useCallback, useEffect, useState } from 'react';
import {
  Box,
  HStack,
  PinInput,
  PinInputField,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { ChallengeContainer, ProgressStatus } from './ChallengeContainer';
import { useChallengeStore } from '../store/challengeStore';
import wordleWords from '../assets/text/wordleWords.txt?raw';
import wordleValidGuesses from '../assets/text/wordleValidGuesses.txt?raw';

const WORD_LENGTH = 5;
const NUM_GUESSES = 5;
const possibleAnswers: string[] = wordleWords.split(/\r?\n/);
const validGuesses: string[] = wordleValidGuesses.split(/\r?\n/);

const getRandomAnswer = (): string =>
  possibleAnswers[
    Math.floor(Math.random() * possibleAnswers.length)
  ].toUpperCase();

const isValidGuess = (guess: string): boolean =>
  validGuesses.includes(guess.toLowerCase());

export const WordleChallenge = (): JSX.Element => {
  const challenge = useChallengeStore(
    (s) => s.challenges.find((c) => c.name === 'wordle')!,
  );

  const toast = useToast();
  const [progress, setProgress] = useState<ProgressStatus>('in-progress');
  const [currentRow, setCurrentRow] = useState<number>(0);
  const [currentGuess, setCurrentGuess] = useState<string>('');
  const [guesses, setGuesses] = useState<string[]>(Array(NUM_GUESSES).fill(''));
  const [answer, setAnswer] = useState<string>(getRandomAnswer());

  const keyboardRows: string[][] = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Backspace', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Enter'],
  ];

  const submitCurrentGuess = useCallback(() => {
    if (currentGuess.length !== WORD_LENGTH) {
      return;
    }

    if (!isValidGuess(currentGuess)) {
      toast({
        title: 'Not a Valid Word',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setGuesses((prev) =>
      prev.map((g, index) => {
        if (currentRow !== index) {
          return g;
        }
        return currentGuess;
      }),
    );
    setCurrentGuess('');
    setCurrentRow((prev) => prev + 1);
  }, [
    currentGuess,
    currentRow,
    toast,
    setGuesses,
    setCurrentGuess,
    setCurrentRow,
  ]);

  const isLetter = (test: string) => {
    const ascii = test.charCodeAt(0);
    return (ascii >= 65 && ascii <= 90) || (ascii >= 97 && ascii <= 122);
  };

  const handleKeydown = useCallback(
    (e: KeyboardEvent) => {
      e.preventDefault();

      if (e.key === 'Enter') {
        submitCurrentGuess();
      } else if (e.key === 'Backspace') {
        setCurrentGuess((prev) => prev.slice(0, -1));
      } else if (e.key.length === 1 && isLetter(e.key)) {
        setCurrentGuess((prev) =>
          prev.length < WORD_LENGTH ? prev + e.key.toUpperCase() : prev,
        );
      }
    },
    [submitCurrentGuess],
  );

  // solve detection and restart on fail
  useEffect(() => {
    if (guesses.includes(answer)) {
      setProgress('success');
    } else if (guesses.every((guess) => guess !== '')) {
      const restartTime = 3000;
      setProgress('failure');
      toast({
        title: `Correct Answer: ${answer}`,
        status: 'error',
        duration: restartTime,
        isClosable: true,
      });
      setTimeout(() => {
        setProgress('in-progress');
        setAnswer(getRandomAnswer());
        setGuesses(Array(NUM_GUESSES).fill(''));
        setCurrentRow(0);
        setCurrentGuess('');
      }, restartTime);
    }
  }, [guesses, answer, toast]);

  // keybindings
  useEffect(() => {
    document.addEventListener('keydown', handleKeydown);
    return () => document.removeEventListener('keydown', handleKeydown);
  }, [handleKeydown]);

  const getKeyBgColor = (letter: string): string | undefined => {
    if (guesses.some((g) => g.includes(letter))) {
      if (
        guesses.some((g) =>
          [...g].some(
            (guessLetter, index) =>
              answer[index] === guessLetter && guessLetter === letter,
          ),
        )
      ) {
        return 'green.500';
      } else if (answer.includes(letter)) {
        return 'yellow.500';
      } else {
        return 'red.500';
      }
    }
    return undefined;
  };

  const getPinInputBgColor = (
    guess: string,
    letterIndex: number,
  ): string | undefined => {
    if (!guess) return undefined;

    const letter = guess[letterIndex];
    const numLettersInAnswer = answer.split(letter).length - 1;

    if (letter === answer[letterIndex]) return 'green.500';
    if (numLettersInAnswer === 0) return undefined;

    let numCorrect = 0;
    const misplacedIndices: number[] = [];
    for (let i = 0; i < answer.length; i++) {
      if (guess[i] === letter) {
        if (answer[i] === letter) {
          numCorrect++;
        } else {
          misplacedIndices.push(i);
        }
      }
    }

    while (misplacedIndices.length + numCorrect > numLettersInAnswer) {
      misplacedIndices.pop();
    }

    if (misplacedIndices.includes(letterIndex)) {
      return 'yellow.500';
    }

    return undefined;
  };

  return (
    <ChallengeContainer challenge={challenge} progress={progress}>
      <VStack>
        <VStack>
          {guesses.map((guess, index) => (
            <HStack key={index}>
              <PinInput
                value={currentRow !== index ? guess : currentGuess}
                isDisabled={currentRow !== index}
                type="alphanumeric"
                manageFocus={false}
              >
                {[...answer].map((_, pinIndex) => (
                  <PinInputField
                    key={pinIndex}
                    backgroundColor={getPinInputBgColor(guess, pinIndex)}
                    onMouseDown={(e) => e.preventDefault()}
                    cursor="default"
                  />
                ))}
              </PinInput>
            </HStack>
          ))}
        </VStack>
        <VStack>
          {keyboardRows.map((row) => (
            <HStack key={row[0]}>
              {row.map((letter) => (
                <Box
                  key={letter}
                  bg={getKeyBgColor(letter)}
                  cursor="pointer"
                  borderWidth={1}
                  borderColor="gray.600"
                  borderRadius={5}
                  px={2}
                  onClick={() =>
                    handleKeydown(new KeyboardEvent('keydown', { key: letter }))
                  }
                >
                  {letter}
                </Box>
              ))}
            </HStack>
          ))}
        </VStack>
      </VStack>
    </ChallengeContainer>
  );
};
