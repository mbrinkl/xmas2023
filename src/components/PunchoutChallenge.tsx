import { useEffect, useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  UniqueIdentifier,
  useDraggable,
  useDroppable,
} from '@dnd-kit/core';
import { ChallengeContainer, ProgressStatus } from './ChallengeContainer';
import { CSS } from '@dnd-kit/utilities';
import { Box, Grid, Text, VStack, Wrap, useMediaQuery } from '@chakra-ui/react';
import { useChallengeStore } from '../store/challengeStore';

interface IDroppable {
  id: string;
  children: React.ReactNode;
}

const DroppableBank = (props: IDroppable): JSX.Element => {
  const { setNodeRef } = useDroppable({
    id: props.id,
  });

  return <Wrap ref={setNodeRef}>{props.children}</Wrap>;
};

const DroppableAnswerZone = (props: IDroppable) => {
  const { isOver, setNodeRef } = useDroppable({
    id: props.id,
  });

  return (
    <Box
      ref={setNodeRef}
      borderWidth={1}
      borderRadius={15}
      borderColor={isOver ? 'gray.300' : 'gray.500'}
      w="100%"
      h={9}
      lineHeight={9}
      textAlign="center"
      boxSizing="content-box"
    >
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
      style={{ ...style, touchAction: 'none' }}
      {...listeners}
      {...attributes}
      borderWidth={1}
      borderColor="blue.500"
      borderRadius={15}
      textAlign="center"
      px={3}
      lineHeight={9}
      textOverflow="clip"
      overflow="hidden"
      whiteSpace="nowrap"
    >
      {props.id}
    </Box>
  );
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
  const [isLargeScreen] = useMediaQuery('(min-width: 850px)');
  const [progress, setProgress] = useState<ProgressStatus>('in-progress');
  const [parents, setParents] = useState<
    Map<UniqueIdentifier, UniqueIdentifier>
  >(new Map());

  const draggables: JSX.Element[] = shuffledBoxers.map((boxer) => (
    <Draggable key={boxer} id={boxer} />
  ));

  useEffect(() => {
    if (parents.size === boxers.length) {
      let isCorrect = true;
      parents.forEach((value, key) => {
        const arrIndex = boxers.findIndex((b) => b === key.toString());
        const zoneIndex = arrIndex % 4;
        const zone = zones[Math.floor(arrIndex / 4)];
        if (value !== `${zone}${zoneIndex + 1}`) {
          isCorrect = false;
        }
      });
      if (isCorrect) {
        setProgress('success');
      } else {
        setProgress('failure');
      }
    } else {
      setProgress('in-progress');
    }
  }, [parents]);

  const handleDragEnd = ({ over, active }: DragEndEvent) => {
    setParents((prev) => {
      const map = new Map(prev);
      if (!over || over.id === 'bank') {
        map.delete(active.id);
      } else {
        // todo: handle answer dropzone swap
        map.forEach((_, key) => {
          if (map.get(key) === over.id) {
            const currParentOfActive = map.get(active.id);
            if (currParentOfActive) {
              map.set(key, currParentOfActive);
            } else {
              map.delete(key);
            }
          }
        });
        map.set(active.id, over.id);
      }
      return map;
    });
  };

  return (
    <ChallengeContainer challenge={challenge} progress={progress} noFlexCenter>
      <DndContext onDragEnd={handleDragEnd}>
        <VStack spacing={5} mt={75}>
          <Grid
            templateColumns={`repeat(${isLargeScreen ? 4 : 2}, 1fr)`}
            gap={3}
          >
            {zones.map((zone) => (
              <VStack key={zone} w={isLargeScreen ? 200 : 125}>
                <Text>{zone}</Text>
                {[...'1234'].map((num) => (
                  <DroppableAnswerZone key={num} id={`${zone}${num}`}>
                    {draggables.find(
                      (d) => parents.get(d.props.id) === `${zone}${num}`,
                    ) ?? num}
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
