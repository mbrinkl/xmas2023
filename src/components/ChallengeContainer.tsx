import { ArrowBackIcon } from '@chakra-ui/icons';
import { Container, IconButton, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { IChallenge } from '../store/mainstore';

interface IChallengeContainer {
  challenge: IChallenge;
  children: React.ReactNode;
}

export const ChallengeContainer = (props: IChallengeContainer): JSX.Element => {
  const navigate = useNavigate();

  let body: React.ReactNode;

  if (props.challenge.status === 'locked') {
    body = <Text>Challenge Locked</Text>;
  } else if (props.challenge.status === 'completed') {
    body = <Text>Challenge Already Completed</Text>;
  } else {
    body = props.children;
  }

  return (
    <Container
      maxW="2xl"
      h="100%"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <IconButton
        aria-label="Back"
        icon={<ArrowBackIcon />}
        pos="absolute"
        top="15px"
        left="15px"
        onClick={() => navigate('/')}
      />
      {body}
    </Container>
  );
};
