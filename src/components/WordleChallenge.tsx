import { useCallback, useEffect, useState } from 'react';
import { HStack, Kbd, PinInput, PinInputField, VStack } from '@chakra-ui/react';
import { ChallengeContainer } from './ChallengeContainer';
import { useChallengeStore } from '../store/mainstore';

export const WordleChallenge = (): JSX.Element => {
  const challenge = useChallengeStore(
    (s) => s.challenges.find((c) => c.name === 'wordle')!,
  );

  const [currentRow, setCurrentRow] = useState<number>(0);
  const [currentGuess, setCurrentGuess] = useState<string>('');
  const [guesses, setGuesses] = useState<string[]>(Array(5).fill(''));
  const answer: string = 'NUTTY';

  const keyboardRows: string[][] = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Enter', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Backspace'],
  ];

  const submitCurrentGuess = useCallback(() => {
    console.log('submitting', currentGuess);
    if (currentGuess.length !== 5) return;
    console.log('submitting 2');
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
  }, [currentGuess, currentRow, setGuesses, setCurrentGuess, setCurrentRow]);

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
          prev.length < answer.length ? prev + e.key.toUpperCase() : prev,
        );
      }
    },
    [submitCurrentGuess],
  );

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

    if (guess[letterIndex] === answer[letterIndex]) {
      return 'green.500';
    } else if (answer.includes(guess[letterIndex])) {
      return 'yellow.500';
    }

    return undefined;
  };

  return (
    <ChallengeContainer challenge={challenge}>
      <VStack>
        <VStack>
          {guesses.map((guess, index) => (
            <HStack key={index}>
              <PinInput
                value={currentRow !== index ? guess : currentGuess}
                isDisabled={currentRow !== index}
                type="alphanumeric"
              >
                {[...answer].map((_, pinIndex) => (
                  <PinInputField
                    backgroundColor={getPinInputBgColor(guess, pinIndex)}
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
                <Kbd
                  key={letter}
                  backgroundColor={getKeyBgColor(letter)}
                  onClick={() =>
                    handleKeydown(new KeyboardEvent('keydown', { key: letter }))
                  }
                  cursor="pointer"
                >
                  {letter}
                </Kbd>
              ))}
            </HStack>
          ))}
        </VStack>
      </VStack>
    </ChallengeContainer>
  );
};
