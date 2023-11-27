import { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  UniqueIdentifier,
  useDraggable,
  useDroppable,
} from '@dnd-kit/core';
import { ChallengeContainer } from './ChallengeContainer';
import { CSS } from '@dnd-kit/utilities';
import { Box, Grid, Text, VStack, Wrap, useMediaQuery } from '@chakra-ui/react';
import { useChallengeStore } from '../store/mainstore';

interface IDroppable {
  id: string;
  children: React.ReactNode;
}

const DroppableBank = (props: IDroppable): JSX.Element => {
  const { isOver, setNodeRef } = useDroppable({
    id: props.id,
  });
  const style = {
    opacity: isOver ? 1 : 0.5,
  };

  return (
    <Wrap ref={setNodeRef} style={style}>
      {props.children}
    </Wrap>
  );
};

const DroppableAnswerZone = (props: IDroppable) => {
  const { isOver, setNodeRef } = useDroppable({
    id: props.id,
  });
  const style = {
    opacity: isOver ? 1 : 0.5,
  };

  return (
    <Box ref={setNodeRef} style={style}>
      {props.children}
    </Box>
  );
};

interface IDraggable {
  id: string;
}

const Draggable = (props: IDraggable) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: props.id,
  });
  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <Box
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      borderWidth={2}
      borderColor="blue.500"
      borderRadius={15}
      textAlign="center"
      px={3}
      py={1}
    >
      {props.id}
    </Box>
  );
};

const Placeholder = (props: { id: string }) => {
  return <Box h={9}>{props.id}</Box>;
};

const zones: string[] = [
  'Minor Circuit',
  'Major Circuit',
  'World Circuit',
  'Special Circuit',
];

const boxers: string[] = [
  'Gabby Jay',
  'Bear Hugger',
  'Piston Hurricane',
  'Bald Bull',
  'Bob Charlie',
  'Dragon Chan',
  'Masked Muscle',
  'Mr. Sandman',
  'Aran Ryan',
  'Heike Kagero',
  'Mad Clown',
  'Super Macho Man',
  'Narcis Prince',
  'Hoy Quarlow',
  'Rick Bruiser',
  'Nick Bruiser',
];

const shuffledBoxers = boxers
  .map((value) => ({ value, sort: Math.random() }))
  .sort((a, b) => a.sort - b.sort)
  .map(({ value }) => value);

export const PunchoutChallenge = (): JSX.Element => {
  const challenge = useChallengeStore(
    (s) => s.challenges.find((challenge) => challenge.name === 'punchout')!,
  );
  const [isLargerThan850] = useMediaQuery('(min-width: 850px)');

  const draggables: JSX.Element[] = shuffledBoxers.map((boxer) => (
    <Draggable key={boxer} id={boxer} />
  ));

  const [parents, setParents] = useState<
    Map<UniqueIdentifier, UniqueIdentifier>
  >(new Map());

  function handleDragEnd({ over, active }: DragEndEvent) {
    setParents((prev) => {
      const map = new Map(prev);
      if (!over?.id) {
        map.delete(active.id);
      } else {
        // todo: handle answer dropzone swap
        map.forEach((_, key) => {
          if (map.get(key) === over.id) {
            map.delete(key);
          }
        });
        map.set(active.id, over.id);
      }
      return map;
    });
  }

  return (
    <ChallengeContainer challenge={challenge}>
      <DndContext onDragEnd={handleDragEnd}>
        <VStack display="block">
          <Grid
            templateColumns={`repeat(${isLargerThan850 ? 4 : 2}, 1fr)`}
            gap={1}
          >
            {zones.map((zone) => (
              <VStack key={zone} w={200}>
                <Text>{zone}</Text>
                {[...'1234'].map((num) => (
                  <DroppableAnswerZone key={num} id={`${zone}${num}`}>
                    {draggables.find(
                      (d) => parents.get(d.props.id) === `${zone}${num}`,
                    ) ?? <Placeholder key={num} id={num} />}
                  </DroppableAnswerZone>
                ))}
              </VStack>
            ))}
          </Grid>
          <DroppableBank id="bank">
            {draggables.filter(
              (d) =>
                !parents.has(d.props.id) || parents.get(d.props.id) === 'bank',
            )}
          </DroppableBank>
        </VStack>
      </DndContext>
    </ChallengeContainer>
  );
};
