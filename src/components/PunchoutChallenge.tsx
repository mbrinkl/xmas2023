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
import { Box } from '@chakra-ui/react';
import { useChallengeStore } from '../store/mainstore';

interface IDroppable {
  id: string;
  children: React.ReactNode;
}

export function Droppable(props: IDroppable) {
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
}

interface IDraggable {
  id: string;
  boxerName: string;
}

const Draggable = (props: IDraggable) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: props.id,
  });
  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <button ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {props.boxerName}
    </button>
  );
};

export const PunchoutChallenge = (): JSX.Element => {
  const challenge = useChallengeStore(
    (s) => s.challenges.find((challenge) => challenge.name === 'punchout')!,
  );

  const containers = ['A', 'B', 'C'];
  const [parent, setParent] = useState<UniqueIdentifier | null>(null);
  const draggable = <Draggable id="draggable" boxerName="asdf" />;

  function handleDragEnd({ over }: DragEndEvent) {
    setParent(over ? over.id : null);
  }

  return (
    <ChallengeContainer challenge={challenge}>
      <DndContext onDragEnd={handleDragEnd}>
        {parent === null ? draggable : null}

        {containers.map((id) => (
          <Droppable key={id} id={id}>
            {parent === id ? draggable : 'Drop here'}
          </Droppable>
        ))}
      </DndContext>
    </ChallengeContainer>
  );
};
