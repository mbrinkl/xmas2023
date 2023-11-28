import { ArrowBackIcon } from '@chakra-ui/icons';
import { Box, Container, Flex, IconButton, Text } from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import { IChallenge, useChallengeStore } from '../store/challengeStore';
import { useEffect } from 'react';

export type ProgressStatus = 'in-progress' | 'failure' | 'success';

interface IBodyContainer {
  noFlexCenter?: boolean;
  progress: ProgressStatus;
  children: React.ReactNode;
}

const BodyContainer = (props: IBodyContainer): JSX.Element => {
  const colors: Record<ProgressStatus, string> = {
    'in-progress': 'yellow.500',
    failure: 'red.500',
    success: 'green.500',
  };

  const mainBody = (
    <Box
      p={3}
      borderWidth={2}
      borderRadius={15}
      borderColor={colors[props.progress]}
    >
      {props.children}
    </Box>
  );

  return props.noFlexCenter ? (
    mainBody
  ) : (
    <Flex h="100%" alignItems="center">
      {mainBody}
    </Flex>
  );
};

interface IChallengeContainer {
  challenge: IChallenge;
  noFlexCenter?: boolean;
  progress: ProgressStatus;
  children: React.ReactNode;
}

export const ChallengeContainer = (props: IChallengeContainer): JSX.Element => {
  const navigate = useNavigate();
  const completeChallenge = useChallengeStore((s) => s.completeChallenge);

  useEffect(() => {
    let id: number | undefined;
    if (props.progress === 'success') {
      id = setTimeout(() => {
        completeChallenge(props.challenge);
        navigate('/');
      }, 2000);
    }
    return () => clearTimeout(id);
  }, [props.progress, props.challenge, navigate, completeChallenge]);

  if (props.challenge.status === 'locked' && props.progress !== 'success') {
    return (
      <Text>
        Challenge Locked <Link to="/">Go Home</Link>
      </Text>
    );
  } else if (
    props.challenge.status === 'completed' &&
    props.progress !== 'success'
  ) {
    return (
      <Text>
        Challenge Already Completed <Link to="/">Go Home</Link>
      </Text>
    );
  }

  return (
    <Container maxW="4xl" h="100%" centerContent userSelect="none">
      <IconButton
        aria-label="Back"
        icon={<ArrowBackIcon />}
        pos="absolute"
        top="15px"
        left="15px"
        onClick={() => navigate('/')}
      />
      <BodyContainer
        noFlexCenter={props.noFlexCenter}
        progress={props.progress}
      >
        {props.children}
      </BodyContainer>
    </Container>
  );
};
