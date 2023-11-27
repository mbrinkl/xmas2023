import { Canvas, Euler, Vector3 } from '@react-three/fiber';
import { ChallengeContainer } from './ChallengeContainer';
import { useChallengeStore } from '../store/mainstore';
import { Plane, OrbitControls } from '@react-three/drei';
// @ts-expect-error No types available for cubejs
import Cube from 'cubejs';

export const RubiksChallenge = (): JSX.Element => {
  const challenge = useChallengeStore(
    (s) => s.challenges.find((challenge) => challenge.name === 'rubiks')!,
  );

  const colorMap: Record<string, string> = {
    U: 'white',
    D: 'yellow',
    F: 'blue',
    R: 'orange',
    B: 'green',
    L: 'red',
  };

  const getCoords = (value: number): [number, number] => {
    const mod3 = value % 3;
    const mod9 = value % 9;
    const a = mod3 === 0 ? -2 : mod3 === 1 ? 0 : 2;
    const b = mod9 < 3 ? -2 : mod9 < 6 ? 0 : 2;
    return [a, b];
  };

  const getPosition = (index: number): [Vector3, Euler] => {
    const planeDistance = 3;
    let position: Vector3 = [0, 0, 0];
    let rotation: Euler = [0, 0, 0];
    // 0-8 up | 9-17 right | 18-26 front | 27-35 down | 36-44 left | 45-53 back
    if (index >= 0 && index <= 8) {
      const [x, z] = getCoords(index);
      position = [x, planeDistance, z];
      rotation = [-Math.PI / 2, 0, 0];
    } else if (index >= 9 && index <= 17) {
      const [y, z] = getCoords(index);
      position = [planeDistance, y * -1, z];
      rotation = [0, Math.PI / 2, 0];
    }
    return [position, rotation];
  };

  // Create a new solved cube instance
  const cube = Cube.random();
  const cubeString: string = cube.asString();
  console.log(cubeString.substring(0, 8));
  console.log(cubeString.substring(8, 17));

  return (
    <ChallengeContainer challenge={challenge} progress="in-progress">
      <Canvas>
        <OrbitControls />
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        {[...cubeString].map((c, index) => {
          const [position, rotation] = getPosition(index);
          return (
            <Plane args={[2, 2]} position={position} rotation={rotation}>
              <meshStandardMaterial color={colorMap[c]} />
            </Plane>
          );
        })}
      </Canvas>
    </ChallengeContainer>
  );
};
