import React, { useMemo } from "react";
import * as T from "three";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import {
  Canvas,
  Camera,
  Dust,
  Finish,
  View,
  smooth,
  lerp3,
  Box,
  Cyl,
  Path,
  metal,
  navy,
  gold,
  dark,
} from "../World";
import { surface } from "../Surfaces";
import { Fonts, Callout } from "../Type";

function SlumpMould({ lift, side }: { lift: number; side: number }) {
  const geo = useMemo(
    () =>
      new T.LatheGeometry(
        [
          new T.Vector2(0.72, 0),
          new T.Vector2(0.36, 2.16),
          new T.Vector2(0.383, 2.16),
          new T.Vector2(0.744, 0),
          new T.Vector2(0.72, 0),
        ],
        80,
      ),
    [],
  );
  return (
    <group position={[side, 1.13 + lift, 0]} visible={side < 2.75}>
      <mesh geometry={geo} material={metal} castShadow receiveShadow />
      {[-1, 1].map((s) => (
        <group key={s}>
          <Box p={[s * 0.87, 0.045, 0]} s={[0.39, 0.09, 0.3]} mat={metal} />
          <Path
            points={[
              [s * 0.56, 1.07, 0],
              [s * 0.91, 1.15, 0],
              [s * 0.92, 1.5, 0],
              [s * 0.48, 1.62, 0],
            ]}
            width={0.04}
            mat={metal}
          />
        </group>
      ))}
      <Cyl p={[0, 2.17, 0]} r={0.38} h={0.04} mat={gold} open />
    </group>
  );
}
function FreshSpecimen({ settle }: { settle: number }) {
  const geo = useMemo(() => {
    const pts: T.Vector2[] = [];
    for (let i = 0; i <= 30; i++) {
      const u = i / 30;
      const radius =
        (0.72 - 0.36 * u) * (1 + settle * 0.12 * Math.sin(u * Math.PI));
      pts.push(new T.Vector2(radius, u * (2.16 - settle * 0.46)));
    }
    pts.push(new T.Vector2(0, 2.16 - settle * 0.46));
    const g = new T.LatheGeometry(pts, 80);
    const p = g.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i),
        y = p.getY(i),
        z = p.getZ(i);
      p.setY(
        i,
        y +
          settle *
            (0.026 * Math.sin(x * 13 + z * 11) + 0.012 * Math.sin(z * 32)) *
            Math.min(1, y * 4),
      );
    }
    g.computeVertexNormals();
    return g;
  }, [settle]);
  const mat = useMemo(() => {
    const m = surface("concrete").clone();
    m.roughness = 0.68;
    m.bumpScale = 0.012;
    m.color.set("#aaa99b");
    return m;
  }, []);
  return (
    <mesh
      position={[0, 1.13, 0]}
      geometry={geo}
      material={mat}
      castShadow
      receiveShadow
    />
  );
}

/** A continuous fresh-concrete shot: vertical cone lift, settling, then thermometer.
 * Illustrative motion only; screen is blank, no claimed test value. */
export function FreshConcrete({
  duration = 7,
  slumpDuration = 3.65,
}: {
  duration?: number;
  slumpDuration?: number;
}) {
  const { fps } = useVideoConfig();
  const actual = useCurrentFrame() / fps;
  const t =
    actual < slumpDuration
      ? (actual * 3.65) / slumpDuration
      : 3.65 + ((actual - slumpDuration) * 3.35) / (duration - slumpDuration);
  const lift = smooth((t - 0.7) / 1.9) * 2.6,
    side = smooth((t - 2.55) / 1) * 2.8;
  const settle = smooth((t - 1.45) / 1.45);
  const insert = smooth((t - 4.15) / 1.15),
    arrival = smooth((t - 3.45) / 0.7);
  const probeX = -0.12 + (1 - arrival) * 1.65,
    probeY = 4.7 - insert * 0.8;
  const view: View = {
    position: lerp3(
      [4.2, 5.4, 12.6],
      [2.7, 4.4, 9.8],
      smooth((t - 3.25) / 2.4),
    ),
    target: lerp3([0, 3.1, 0], [0, 2.5, 0], smooth((t - 3.25) / 2.4)),
    fov: 42,
  };
  return (
    <AbsoluteFill>
      <Fonts />
      <Canvas>
        <Camera view={view} />
        <Box p={[0, 1.05, 0]} s={[3.5, 0.13, 2.85]} mat={navy} />
        <Box p={[0, 1.125, 0]} s={[3.42, 0.025, 2.77]} mat={metal} />
        <FreshSpecimen settle={settle} />
        <SlumpMould lift={lift} side={side} />
        <group visible={t > 3.45} position={[probeX, probeY, 0]}>
          <Box s={[0.43, 0.66, 0.19]} mat={navy} />
          <Box p={[0, 0.04, 0.103]} s={[0.31, 0.22, 0.012]} mat={dark} />
          <Box p={[0, -0.25, 0.104]} s={[0.11, 0.05, 0.014]} mat={gold} />
          <Cyl p={[0, -0.94, 0]} r={0.022} h={1.22} />
          <Cyl p={[0, -1.56, 0]} r={0.015} h={0.035} />
        </group>
        <Dust t={t} />
      </Canvas>
      <Finish />
      <Callout
        text="اختبار الهبوط"
        point={[0.28, 2.6 - settle * 0.2, 0.48]}
        view={view}
        t={t}
        start={0.25}
        end={3.6}
        y={440}
        x={70}
        width={480}
      />
      <Callout
        text="درجة حرارة الخرسانة"
        point={[probeX, probeY - 0.9, 0.1]}
        view={view}
        t={t}
        start={3.65}
        end={6.95}
        y={440}
        x={65}
        width={600}
      />
    </AbsoluteFill>
  );
}
