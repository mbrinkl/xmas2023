// @ts-expect-error No Types Available for headbreaker
import { Canvas, painters, outline } from 'headbreaker';
import { useEffect, useRef, useState } from 'react';
import { ChallengeContainer, ProgressStatus } from './ChallengeContainer';
import { useChallengeStore } from '../store/challengeStore';
import { Box, useMediaQuery } from '@chakra-ui/react';
import shrekPuzzleImage from '../assets/images/shrekPuzzle.jpg';

export const JigsawChallenge = (): JSX.Element => {
  const challenge = useChallengeStore(
    (s) => s.challenges.find((challenge) => challenge.name === 'jigsaw')!,
  );
  const puzzleRef = useRef<HTMLDivElement>(null);
  const [isLargeSize] = useMediaQuery('(min-width: 600px)');

  const [progress, setProgress] = useState<ProgressStatus>('in-progress');

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
        setProgress('success');
      });
    };
  }, [isLargeSize]);

  return (
    <ChallengeContainer challenge={challenge} progress={progress}>
      <Box ref={puzzleRef} id="jigsaw" backgroundColor="gray.300" />
    </ChallengeContainer>
  );
};
