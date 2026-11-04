import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Canvas, Camera, Stage, Dust, Finish, ease, mix } from "../World";
import { CompressionMachine, Triaxial, AsphaltMachine } from "../Equipment";
import { Title } from "../Type";
export function Confidence() {
  const t = useCurrentFrame() / 30;
  const a = ease(t / 4);
  const part = Math.floor(t / 1.33);
  return (
    <AbsoluteFill>
      <Canvas>
        <Camera
          position={
            part === 0
              ? [2.8, 2.4, 4.3]
              : part === 1
                ? [-3.4, 2.7, 5.1]
                : [3.3, 2.8, 5.2]
          }
          target={part === 0 ? [0, 1.4, 0] : [0, 2, 0]}
          fov={42}
        />
        <Stage />
        {part === 0 ? (
          <group rotation={[0, t * 0.12, 0]}>
            <Triaxial time={t + 6} />
          </group>
        ) : part === 1 ? (
          <group rotation={[0, -0.1, 0]}>
            <CompressionMachine time={6 + t} />
          </group>
        ) : (
          <AsphaltMachine time={t + 4} />
        )}
        <Dust time={t} />
      </Canvas>
      <Finish />
      <Title
        text="نتائج تدعم القرار الهندسي"
        duration={120}
        size={61}
        enter={4}
        bottom={240}
      />
    </AbsoluteFill>
  );
}
