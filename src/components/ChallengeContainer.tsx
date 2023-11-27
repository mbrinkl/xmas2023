import { ArrowBackIcon } from '@chakra-ui/icons';
import { Container, Flex, IconButton, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { IChallenge } from '../store/mainstore';

interface IBodyContainer {
  noFlexCenter?: boolean;
  children: React.ReactNode;
}

const BodyContainer = (props: IBodyContainer): JSX.Element => {
  return props.noFlexCenter ? (
    <>{props.children}</>
  ) : (
    <Flex h="100%" alignItems="center">
      {props.children}
    </Flex>
  );
};

interface IChallengeContainer {
  challenge: IChallenge;
  noFlexCenter?: boolean;
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
    <Container maxW="4xl" h="100%" centerContent>
      <IconButton
        aria-label="Back"
        icon={<ArrowBackIcon />}
        pos="absolute"
        top="15px"
        left="15px"
        onClick={() => navigate('/')}
      />
      <BodyContainer noFlexCenter={props.noFlexCenter}>{body}</BodyContainer>
    </Container>
  );
};
