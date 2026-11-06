import { useSceneTime } from "../World";
import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import * as T from "three";
import {
  Canvas,
  Camera,
  Dust,
  Finish,
  Box,
  Cyl,
  Path,
  V3,
  View,
  smooth,
  mix,
  lerp3,
  worldPoint,
  metal,
  navy,
  gold,
  ivory,
  dark,
  glow,
} from "../World";
import { SoilMonolith, RockPatch } from "../Specimens";
import { Fonts, Header, Callout, Benefit } from "../Type";
import { soilBenefit } from "../Copy";
export function SoilFormation({ duration = 5 }: { duration?: number }) {
  const t = useSceneTime(duration, 5);
  const a = smooth(t / 6);
  const view: View = {
    position: lerp3([4.2, 4.5, 10.7], [3.4, 4.1, 9.8], a),
    target: [0, 2.9, 0],
    fov: 42,
  };
  const position: V3 = [0, 2.4, 0],
    rotation: V3 = [-0.12, -0.3 + t * 0.018, -0.12];
  const point = worldPoint(
    [-0.2, 0.65, 0.38],
    position,
    rotation,
    0.9 + 0.1 * smooth(t / 1.9),
  );
  return (
    <AbsoluteFill>
      <Fonts />
      <Canvas>
        <Camera view={view} />
        <group position={position} rotation={rotation}>
          <SoilMonolith t={t} />
        </group>
        <Dust t={t} />
      </Canvas>
      <Finish />
      <Callout
        text="تصنيف التربة"
        point={point}
        view={view}
        t={t}
        start={0.45}
        end={5.4}
        x={60}
        y={425}
        width={430}
        benefit={null}
      />
      <Callout
        text="التدرج الحبيبي"
        point={worldPoint([0.55, -0.15, 0.58], position, rotation)}
        view={view}
        t={t}
        start={2.4}
        end={5.4}
        x={590}
        y={425}
        width={430}
        side="right"
        benefit={null}
      />
      <Benefit text={soilBenefit} t={t} start={0.45} end={5.4} y={525} />
    </AbsoluteFill>
  );
}
function Gauge({ t }: { t: number }) {
  const z = smooth((t - 1.7) / 1.8);
  return (
    <group position={[0, 0.27, 0]}>
      <Box p={[0, 0.14, 0]} s={[1.1, 0.28, 0.73]} mat={ivory} />
      <Box p={[0, 0.3, 0]} s={[1.03, 0.09, 0.69]} mat={gold} />
      <Box p={[-0.13, 0.36, 0.06]} s={[0.48, 0.035, 0.31]} mat={dark} />
      <Box p={[-0.13, 0.383, 0.06]} s={[0.35, 0.006, 0.2]} mat={navy} />
      <Path
        points={[
          [-0.43, 0.37, -0.25],
          [-0.44, 0.82, -0.25],
          [0.21, 0.82, -0.25],
          [0.22, 0.37, -0.25],
        ]}
        width={0.038}
        mat={dark}
      />
      <Cyl p={[0.38, 0.52 - z * 0.22, 0]} r={0.045} h={0.9} mat={metal} />
      <Cyl p={[0.38, 0.97 - z * 0.22, 0]} r={0.08} h={0.09} mat={gold} />
      <Box p={[0.38, 0.88 - z * 0.22, 0]} s={[0.32, 0.055, 0.07]} mat={dark} />
      {[-0.26, -0.1, 0.06].map((x) => (
        <Cyl key={x} p={[x, 0.37, 0.24]} r={0.023} h={0.025} mat={metal} />
      ))}
      <Box p={[-0.52, 0.13, 0.2]} s={[0.025, 0.12, 0.25]} mat={navy} />
    </group>
  );
}
export function SoilDensity({ duration = 5 }: { duration?: number }) {
  const t = useSceneTime(duration, 5),
    a = smooth(t / 5);
  const view: View = {
    position: lerp3([5.4, 5.5, 8.4], [4.6, 4.9, 7.8], a),
    target: [0, 1.7, 0],
    fov: 38,
  };
  const pos: V3 = [0, 1.75, 0],
    rot: V3 = [0, -0.15 + t * 0.01, -0.06];
  const point = worldPoint([0.35, 0.78, 0.1], pos, rot);
  return (
    <AbsoluteFill>
      <Fonts />
      <Canvas>
        <Camera view={view} />
        <group position={pos} rotation={rot}>
          <RockPatch />
          <group position={[0, 0.075 + (1 - smooth(t / 1.4)) * 0.5, 0]}>
            <Gauge t={t} />
          </group>
          <Path
            points={[
              [-1.9, -0.35, 1.3],
              [-0.8, -0.34, 1.38],
              [0.5, -0.34, 1.4],
              [1.9, -0.35, 1.35],
            ]}
            width={0.008}
          />
        </group>
        <Dust t={t} />
      </Canvas>
      <Finish />
      <Callout
        text="الكثافة الحقلية"
        point={point}
        view={view}
        t={t}
        start={0.4}
        end={4.65}
        y={430}
      />
    </AbsoluteFill>
  );
}
export function SoilResistivity({ duration = 5 }: { duration?: number }) {
  const t = useSceneTime(duration, 5),
    a = smooth(t / 5);
  const view: View = {
    position: lerp3([4.8, 5.4, 8.8], [4.1, 4.8, 8.2], a),
    target: [0.3, 1.6, 0],
    fov: 38,
  };
  const pos: V3 = [0, 1.65, 0],
    rot: V3 = [0, -0.2, -0.04];
  const point = worldPoint([0.35, 0.65, 0.0], pos, rot);
  return (
    <AbsoluteFill>
      <Fonts />
      <Canvas>
        <Camera view={view} />
        <group position={pos} rotation={rot}>
          <RockPatch width={4.4} depth={2.65} />
          {[-1.35, -0.45, 0.45, 1.35].map((x, i) => (
            <group key={x}>
              <Cyl p={[x, 0.35, 0]} r={0.025} h={0.75} />
              <Cyl
                p={[x, 0.73, 0]}
                r={0.05}
                h={0.055}
                mat={i % 2 ? gold : ivory}
              />
              <Path
                points={[
                  [x, 0.74, 0],
                  [x, 0.83, -0.25],
                  [1.3, 0.72, -0.9],
                  [1.65, 0.57, -0.85],
                ]}
                width={0.012}
                mat={i % 2 ? gold : dark}
              />
            </group>
          ))}
          <group position={[1.4, 0.46, -0.8]} rotation={[-0.12, -0.2, 0]}>
            <Box s={[0.66, 0.26, 0.47]} mat={navy} />
            <Box p={[0, 0.145, 0]} s={[0.58, 0.04, 0.39]} mat={ivory} />
            <Box p={[-0.1, 0.17, 0]} s={[0.27, 0.012, 0.2]} mat={dark} />
            <Cyl p={[0.18, 0.19, 0.02]} r={0.04} h={0.04} mat={gold} />
            <Path
              points={[
                [-0.25, 0, -0.2],
                [-0.3, 0.3, -0.2],
                [0.3, 0.3, -0.2],
                [0.25, 0, -0.2],
              ]}
              width={0.023}
              mat={dark}
            />
          </group>
          <Path
            points={[
              [-1.9, -0.35, 1.3],
              [-0.5, -0.34, 1.4],
              [1.9, -0.35, 1.3],
            ]}
            width={0.008}
          />
        </group>
        <Dust t={t} />
      </Canvas>
      <Finish />
      <Callout
        text="مقاومة التربة"
        point={point}
        view={view}
        t={t}
        start={0.4}
        end={4.65}
        y={500}
      />
    </AbsoluteFill>
  );
}
