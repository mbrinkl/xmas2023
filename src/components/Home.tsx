import { Grid, GridItem } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { IChallenge, useChallengeStore } from '../store/challengeStore';
import { LockIcon } from '@chakra-ui/icons';

const pin = '5427';

export const Home = (): JSX.Element => {
  const navigate = useNavigate();
  const { challenges } = useChallengeStore();

  const allComplete = challenges.every(
    (challenge) => challenge.status === 'completed',
  );

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
              {challenge.status === 'locked' ? <LockIcon /> : challenge.name}
            </GridItem>
          );
        })}
        <GridItem
          w="100%"
          h="100%"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          PIN: {allComplete ? pin : '****'}
        </GridItem>
      </Grid>
    </>
  );
};
