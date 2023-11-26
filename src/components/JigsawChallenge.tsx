// @ts-expect-error No Types Available for headbreaker
import { Canvas, painters, outline } from 'headbreaker';
import { useEffect, useRef, useState } from 'react';
import { ChallengeContainer } from './ChallengeContainer';
import { useChallengeStore } from '../store/mainstore';
import { Box } from '@chakra-ui/react';
import shrekPuzzleImage from '../assets/shrek-puzzle.jpg';

export const JigsawChallenge = (): JSX.Element => {
  const challenge = useChallengeStore(
    (s) => s.challenges.find((challenge) => challenge.name === 'jigsaw')!,
  );
  const puzzleRef = useRef<HTMLDivElement>(null);

  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (!puzzleRef.current) return;

    const image = new Image();
    image.src = shrekPuzzleImage;
    image.onload = () => {
      const canvas = new Canvas(puzzleRef.current!.id, {
        width: 600,
        height: 400,
        image,
        pieceSize: 50,
        proximity: 20,
        borderFill: 10,
        strokeWidth: 2,
        lineSoftness: 0.18,
        painter: new painters.Konva(),
        outline: new outline.Rounded(),
        preventOffstageDrag: true,
        fixed: true,
      });

      canvas.adjustImagesToPuzzleHeight();

      canvas.autogenerate({
        horizontalPiecesCount: 6,
        verticalPiecesCount: 6,
      });

      canvas.shuffle(0.7);

      canvas.draw();
      canvas.attachSolvedValidator();

      canvas.onValid(() => {
        setCompleted(true);
      });
    };
  }, []);

  return (
    <ChallengeContainer challenge={challenge}>
      <Box
        ref={puzzleRef}
        id="jigsaw"
        p={2}
        borderWidth={2}
        borderRadius={5}
        borderColor={completed ? 'green.500' : 'red.500'}
      />
    </ChallengeContainer>
  );
};
