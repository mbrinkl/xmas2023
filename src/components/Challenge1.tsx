// @ts-expect-error No Types Available for headbreaker
import { Canvas, painters, outline } from 'headbreaker';
import { useEffect, useRef } from 'react';
import { ChallengeContainer } from './ChallengeContainer';

export const Challenge1 = (): JSX.Element => {
  const puzzleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!puzzleRef.current) return;

    const canvas = new Canvas(puzzleRef.current.id, {
      width: 400,
      height: 300,
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

    // canvas.adjustImagesToPuzzleHeight();

    canvas.autogenerate({
      horizontalPiecesCount: 2,
      verticalPiecesCount: 2,
      metadata: [
        { color: '#B83361' },
        { color: '#B87D32' },
        { color: '#A4C234' },
        { color: '#37AB8C' },
        // { color: '#37AB8C' },
        // { color: '#37AB8C' },
        // { color: '#37AB8C' },
        // { color: '#37AB8C' },
        // { color: '#37AB8C' },
        // { color: '#37AB8C' },
        // { color: '#37AB8C' },
        // { color: '#37AB8C' },
        // { color: '#37AB8C' },
        // { color: '#37AB8C' },
        // { color: '#37AB8C' },
        // { color: '#37AB8C' },
        // { color: '#37AB8C' },
        // { color: '#37AB8C' },
        // { color: '#37AB8C' },
        // { color: '#37AB8C' },
        // { color: '#37AB8C' },
        // { color: '#37AB8C' },
        // { color: '#37AB8C' },
        // { color: '#37AB8C' },
        // { color: '#37AB8C' },
      ],
    });

    // canvas.shuffle(0.7);

    canvas.draw();
    canvas.attachSolvedValidator();

    canvas.onValid(() => {
      console.log('DN');
    });
  }, []);

  return (
    <ChallengeContainer>
      <div ref={puzzleRef} id="jigsaw" style={{ border: '2px solid red' }} />
    </ChallengeContainer>
  );
};
