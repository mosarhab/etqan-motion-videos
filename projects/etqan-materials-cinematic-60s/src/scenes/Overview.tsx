import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import {
  Canvas,
  Camera,
  Dust,
  Finish,
  Path,
  View,
  smooth,
  lerp3,
} from "../World";
import { SoilMonolith, ConcreteCube, OrbitGrains } from "../Specimens";
import { AsphaltBlock } from "./Asphalt";
import { Fonts, Footer } from "../Type";
export function Overview() {
  const t = useCurrentFrame() / 30;
  const view: View = {
    position: lerp3([4.2, 4.3, 12.9], [3.5, 3.8, 12.1], smooth(t / 6)),
    target: [0, 2.55, 0],
    fov: 39,
  };
  return (
    <AbsoluteFill>
      <Fonts />
      <Canvas>
        <Camera view={view} />
        <group
          position={[-1.25, 3.8, -0.6]}
          rotation={[-0.08, -0.3 + t * 0.025, -0.2]}
          scale={0.52}
        >
          <SoilMonolith t={t + 6} />
        </group>
        <group
          position={[0.55, 2.5, 0.25]}
          rotation={[0.1, -0.35 - t * 0.018, 0.1]}
          scale={0.7}
        >
          <ConcreteCube />
        </group>
        <group
          position={[-0.65, 0.9, 1.1]}
          rotation={[0.12, -0.25 + t * 0.02, -0.14]}
          scale={0.52}
        >
          <AsphaltBlock t={t + 6} />
        </group>
        <Path
          points={[
            [-2.25, 4.7, 0.2],
            [-1.5, 3.8, 1.2],
            [0.6, 3.0, 1.7],
            [1.3, 2.1, 1.2],
            [-0.7, 1.4, 2],
            [-1.5, 0.45, 1.2],
          ]}
          width={0.01}
        />
        <Dust t={t} />
      </Canvas>
      <Finish />
      <Footer text="نتائج تدعم القرار الهندسي" t={t} start={0.8} end={5.7} />
    </AbsoluteFill>
  );
}
