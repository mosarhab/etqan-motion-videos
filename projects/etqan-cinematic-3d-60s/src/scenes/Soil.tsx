import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Canvas, Camera, Stage, Dust, Finish, ease, mix } from "../World";
import { SoilRig, Bench, SampleRack } from "../Equipment";
import { Title } from "../Type";
export function Soil() {
  const t = useCurrentFrame() / 30,
    a = ease(t / 10);
  return (
    <AbsoluteFill>
      <Canvas>
        <Camera
          position={[mix(7.8, 5.4, a), mix(5.4, 4.6, a), mix(12.3, 9.4, a)]}
          target={[0.1, 2.4, 0]}
          fov={39}
        />
        <Stage />
        <SoilRig time={t} />
        <Bench x={-4.4} z={-3} />
        <group position={[-4.4, 1.17, -3]}>
          <SampleRack />
        </group>
        <Dust time={t} />
      </Canvas>
      <Finish />
      <Title text="فحوصات التربة" duration={300} enter={28} bottom={220} />
    </AbsoluteFill>
  );
}
