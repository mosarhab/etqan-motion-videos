import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Canvas, Camera, Stage, Box, Dust, Finish, ease, mix } from "../World";
import {
  CompressionMachine,
  Bench,
  SampleRack,
  Triaxial,
  Oven,
} from "../Equipment";
import { Title } from "../Type";
export function Laboratory() {
  const t = useCurrentFrame() / 30,
    a = ease(t / 7);
  return (
    <AbsoluteFill>
      <Canvas>
        <Camera
          position={[mix(5.1, 3.6, a), mix(3.5, 3, a), mix(11, 8.8, a)]}
          target={[mix(0, -0.4, a), 2.1, 0]}
          fov={42}
        />
        <Stage />
        <group position={[-1.25, 0, -0.5]}>
          <CompressionMachine time={t * 0.55} />
        </group>
        <group position={[-4.1, 0, -2.5]}>
          <Oven />
        </group>
        <Bench x={2.8} z={-0.7} />
        <group position={[2.4, 1.16, -0.7]} scale={0.65}>
          <Triaxial time={t} />
        </group>
        <Bench x={-1.4} z={3.9} />
        <group position={[-1.4, 1.17, 3.9]}>
          <SampleRack time={t} />
        </group>
        <Box p={[4.8, 1.3, -3]} s={[1.8, 2.6, 1.4]} mat="navy" />
        <Box p={[4.8, 2.65, -3]} s={[1.9, 0.1, 1.5]} mat="steel" />
        <Dust time={t} />
      </Canvas>
      <Finish />
      <Title text="الدقة في كل اختبار" duration={210} enter={26} />
    </AbsoluteFill>
  );
}
