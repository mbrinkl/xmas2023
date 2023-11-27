import { HStack, PinInput, PinInputField, VStack } from '@chakra-ui/react';
import { ChallengeContainer } from './ChallengeContainer';
import { useChallengeStore } from '../store/mainstore';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface IChainWord {
  answer: string;
  value: string;
  completed: boolean;
}

const initialChainWords: IChainWord[] = [
  {
    answer: 'ROCKET',
    value: 'ROCKET',
    completed: true,
  },
  {
    answer: 'SCIENCE',
    value: 'S',
    completed: false,
  },
  {
    answer: 'FAIR',
    value: 'F',
    completed: false,
  },
  {
    answer: 'TRADE',
    value: 'T',
    completed: false,
  },
  {
    answer: 'SECRET',
    value: 'S',
    completed: false,
  },
  {
    answer: 'AGENT',
    value: 'AGENT',
    completed: true,
  },
];

export const ChainReactionChallenge = (): JSX.Element => {
  // const pinInputRefs = useRef<HTMLElement[]>([]);

  const navigate = useNavigate();
  const completeChallenge = useChallengeStore((s) => s.completeChallenge);
  const challenge = useChallengeStore(
    (s) =>
      s.challenges.find((challenge) => challenge.name === 'chain-reaction')!,
  );
  const [chainWords, setChainWords] = useState<IChainWord[]>(initialChainWords);

  useEffect(() => {
    let id: number | undefined;
    if (chainWords.every((chainWord) => chainWord.completed)) {
      id = setTimeout(() => {
        completeChallenge(challenge);
        navigate('/');
      }, 2000);
    }
    return () => clearTimeout(id);
  }, [chainWords, challenge, navigate, completeChallenge]);

  const onChangePinInput = (chainWord: IChainWord, value: string) => {
    setChainWords((prev) =>
      prev.map((w) => {
        if (w.answer !== chainWord.answer) {
          return w;
        }

        const answerAttempt = value.toUpperCase();
        if (answerAttempt.length === 0) {
          return { ...chainWord, value: chainWord.answer[0] };
        }
        if (answerAttempt === chainWord.answer) {
          return { ...chainWord, completed: true, value: answerAttempt };
        }
        return { ...chainWord, value: answerAttempt };
      }),
    );
  };

  return (
    <ChallengeContainer challenge={challenge}>
      <VStack align="start">
        {chainWords.map((w, index) => (
          <HStack>
            <PinInput
              // ref={el => pinInputRefs.current[index] = el}
              value={w.value}
              isDisabled={
                // ty short circuit evalutation lol
                w.completed ||
                (!w.completed &&
                  !chainWords[index - 1].completed &&
                  !chainWords[index + 1].completed)
              }
              type="alphanumeric"
              onChange={(value) => {
                onChangePinInput(w, value);
              }}
            >
              {[...w.answer].map(() => (
                <PinInputField />
              ))}
            </PinInput>
          </HStack>
        ))}
      </VStack>
    </ChallengeContainer>
  );
};
