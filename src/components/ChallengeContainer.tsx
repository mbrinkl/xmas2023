import { ArrowBackIcon } from '@chakra-ui/icons';
import { Container, IconButton } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

interface IChallengeContainer {
  children: React.ReactNode;
}

export const ChallengeContainer = (props: IChallengeContainer): JSX.Element => {
  const navigate = useNavigate();

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
      {props.children}
    </Container>
  );
};
