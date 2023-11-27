// @ts-expect-error No Types Available for headbreaker
import { Canvas, painters, outline } from 'headbreaker';
import { useEffect, useRef, useState } from 'react';
import { ChallengeContainer } from './ChallengeContainer';
import { useChallengeStore } from '../store/mainstore';
import { Box, useMediaQuery } from '@chakra-ui/react';
import shrekPuzzleImage from '../assets/shrek-puzzle.jpg';
import { useNavigate } from 'react-router-dom';

export const JigsawChallenge = (): JSX.Element => {
  const completeChallenge = useChallengeStore((s) => s.completeChallenge);
  const challenge = useChallengeStore(
    (s) => s.challenges.find((challenge) => challenge.name === 'jigsaw')!,
  );
  const puzzleRef = useRef<HTMLDivElement>(null);
  const [isLargeSize] = useMediaQuery('(min-width: 600px)');
  const navigate = useNavigate();

  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    let id: number | undefined;
    if (completed) {
      id = setTimeout(() => {
        completeChallenge(challenge);
        navigate('/');
      }, 2000);
    }
    return () => clearTimeout(id);
  }, [completed, challenge, completeChallenge, navigate]);

  useEffect(() => {
    if (!puzzleRef.current) return;

    const image = new Image();
    image.src = shrekPuzzleImage;
    image.onload = () => {
      const canvas = new Canvas(puzzleRef.current!.id, {
        width: isLargeSize ? 600 : 320,
        height: 450,
        image,
        pieceSize: isLargeSize ? 40 : 35,
        proximity: 5,
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

      canvas.shuffleGrid();

      canvas.draw();
      canvas.attachSolvedValidator();

      canvas.onValid(() => {
        setCompleted(true);
      });
    };
  }, [isLargeSize]);

  return (
    <ChallengeContainer challenge={challenge}>
      <Box
        ref={puzzleRef}
        id="jigsaw"
        p={2}
        borderWidth={2}
        borderRadius={5}
        backgroundColor="gray.300"
        borderColor={completed ? 'green.500' : 'red.500'}
      />
    </ChallengeContainer>
  );
};
