import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Canvas, Camera, Stage, Dust, Finish, ease, mix } from "../World";
import { CompressionMachine, Bench, SampleRack } from "../Equipment";
import { Title } from "../Type";
export function Concrete() {
  const t = useCurrentFrame() / 30,
    a = ease(t / 10);
  return (
    <AbsoluteFill>
      <Canvas>
        <Camera
          position={[mix(-5.1, -2.9, a), mix(3.4, 2.8, a), mix(9.3, 7.6, a)]}
          target={[0, 2.15, 0]}
          fov={39}
        />
        <Stage />
        <CompressionMachine time={t} />
        <Bench x={4.7} z={-2.6} />
        <group position={[4.7, 1.17, -2.6]}>
          <SampleRack />
        </group>
        <Dust time={t} />
      </Canvas>
      <Finish />
      <Title text="فحوصات الخرسانة" duration={300} enter={26} bottom={220} />
    </AbsoluteFill>
  );
}
