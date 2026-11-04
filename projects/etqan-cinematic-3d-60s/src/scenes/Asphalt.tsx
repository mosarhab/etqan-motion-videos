import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Canvas, Camera, Stage, Dust, Finish, ease, mix } from "../World";
import { AsphaltMachine, Oven } from "../Equipment";
import { Title } from "../Type";
export function Asphalt() {
  const t = useCurrentFrame() / 30,
    a = ease(t / 8);
  return (
    <AbsoluteFill>
      <Canvas>
        <Camera
          position={[mix(5.6, 3.5, a), mix(3.2, 3.8, a), mix(9.5, 8.2, a)]}
          target={[-0.6, 1.9, 0]}
          fov={41}
        />
        <Stage />
        <AsphaltMachine time={t} />
        <group position={[-4.1, 0, -3]}>
          <Oven />
        </group>
        <Dust time={t} />
      </Canvas>
      <Finish />
      <Title
        text="فحوصات الأسفلت والمواد"
        duration={240}
        size={61}
        enter={22}
        bottom={230}
      />
    </AbsoluteFill>
  );
}
