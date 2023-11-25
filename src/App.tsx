import { Grid, GridItem } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

interface IChallenge {
  name: string;
  route: string;
  completed: boolean;
  locked: boolean;
}

export const App = (): JSX.Element => {
  const challenges: IChallenge[] = [
    {
      name: 'puzzle',
      route: 'c1',
      completed: false,
      locked: false,
    },
    {
      name: 'fight',
      route: 'c2',
      completed: false,
      locked: false,
    },
  ];

  return (
    <Grid templateColumns="repeat(3, 1fr)" gap={1} w="100%" h="100%">
      {challenges.map((challenge) => (
        <Link to={challenge.route}>
          <GridItem w="100%" h="100%" bg="gray.500">
            {challenge.name}
          </GridItem>
        </Link>
      ))}
    </Grid>
  );
};
