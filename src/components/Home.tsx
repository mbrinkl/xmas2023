import { Grid, GridItem, useDisclosure } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { IChallenge, useChallengeStore } from '../store/mainstore';
import { FinalPinModal } from './FinalPinModal';
import { useEffect } from 'react';

export const Home = (): JSX.Element => {
  const navigate = useNavigate();
  const { challenges } = useChallengeStore();
  const { isOpen, onOpen } = useDisclosure();

  useEffect(() => {
    if (challenges.every((challenge) => challenge.status === 'completed')) {
      onOpen();
    }
  }, [challenges, onOpen]);

  const getBgColor = (challenge: IChallenge): string => {
    if (challenge.status === 'completed') {
      return 'green.500';
    } else if (challenge.status === 'locked') {
      return 'gray.500';
    }
    return 'yellow.500';
  };

  return (
    <>
      <FinalPinModal isOpen={isOpen} />
      <Grid templateColumns="repeat(3, 1fr)" gap={1} w="100%" h="100%" p={2}>
        {challenges.map((challenge) => {
          const unlocked: boolean = challenge.status === 'unlocked';
          return (
            <GridItem
              key={challenge.name}
              w="100%"
              h="100%"
              display="flex"
              alignItems="center"
              justifyContent="center"
              bg={getBgColor(challenge)}
              onClick={unlocked ? () => navigate(challenge.name) : undefined}
              cursor={unlocked ? 'pointer' : 'default'}
              _hover={unlocked ? { bg: 'yellow.600' } : undefined}
            >
              {challenge.status === 'locked' ? '???' : challenge.name}
            </GridItem>
          );
        })}
      </Grid>
    </>
  );
};
