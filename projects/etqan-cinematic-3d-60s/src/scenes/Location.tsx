import React, { useMemo } from "react";
import * as T from "three";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import geography from "../geography.json";
import {
  Canvas,
  Camera,
  Dust,
  Finish,
  Box,
  Cyl,
  Ring,
  C,
  random,
  ease,
  mix,
  mats,
} from "../World";
import { Title } from "../Type";
const countries = [
  "Saudi Arabia",
  "Yemen",
  "Oman",
  "United Arab Emirates",
  "Qatar",
  "Kuwait",
  "Jordan",
  "Iraq",
  "Iran",
  "Egypt",
  "Israel",
  "Palestine",
  "Eritrea",
  "Sudan",
  "Syria",
  "Lebanon",
  "Turkey",
];
function Relief() {
  const objects = useMemo(
    () =>
      geography
        .filter((f) => countries.includes(f.name || ""))
        .flatMap((f) => {
          const polys =
            f.geometry.type === "Polygon"
              ? [f.geometry.coordinates]
              : f.geometry.coordinates;
          return polys.map((poly: any) => {
            const shape = new T.Shape();
            poly[0].forEach((p: any, i: number) =>
              i
                ? shape.lineTo((p[0] - 45) * 0.23, (p[1] - 24) * 0.23)
                : shape.moveTo((p[0] - 45) * 0.23, (p[1] - 24) * 0.23),
            );
            shape.closePath();
            const g = new T.ExtrudeGeometry(shape, {
              depth: f.name === "Saudi Arabia" ? 0.3 : 0.14,
              bevelEnabled: true,
              bevelSize: 0.015,
              bevelThickness: 0.015,
              bevelSegments: 2,
              steps: 1,
            });
            return { name: f.name, g };
          });
        }),
    [],
  );
  return (
    <group rotation={[-Math.PI / 2, 0, 0]}>
      {objects.map((o, i) => (
        <mesh
          key={i}
          geometry={o.g}
          material={o.name === "Saudi Arabia" ? mats.gold : mats.navy}
          castShadow
          receiveShadow
        />
      ))}
    </group>
  );
}
function City({ time }: { time: number }) {
  const growth = ease((time - 4) / 3);
  return (
    <group position={[0.384, 0.31, -0.164]}>
      <group scale={[growth, growth, growth]}>
        {Array.from({ length: 70 }, (_, i) => {
          const x = (random(i * 3) - 0.5) * 1.8,
            z = (random(i * 3 + 1) - 0.5) * 1.7;
          if (Math.abs(x) < 0.17 && Math.abs(z) < 0.17) return null;
          const h = 0.04 + random(i * 3 + 2) * 0.32;
          return (
            <group key={i}>
              <Box
                p={[x, h / 2, z]}
                s={[0.045 + random(i) * 0.08, h, 0.045 + random(i + 8) * 0.06]}
                mat={i % 9 === 0 ? "gold" : "white"}
              />
            </group>
          );
        })}
        <Box p={[0.25, 0.33, -0.14]} s={[0.09, 0.66, 0.09]} mat="steel" />
        <Box p={[-0.4, 0.25, 0.32]} s={[0.11, 0.5, 0.08]} mat="steel" />
      </group>
      <Ring
        r={0.14 + Math.sin(time * 1.8) * 0.02}
        tube={0.009}
        p={[0, 0.015, 0]}
        mat="goldglow"
      />
      <Ring r={0.31} tube={0.004} p={[0, 0.012, 0]} mat="goldglow" />
      <group position={[0, 0.35 + Math.sin(time * 2) * 0.025, 0]}>
        <mesh rotation={[0, 0, Math.PI]} material={mats.goldglow}>
          <coneGeometry args={[0.065, 0.2, 24]} />
        </mesh>
        <Cyl p={[0, 0.13, 0]} r={0.078} h={0.1} mat="gold" />
      </group>
    </group>
  );
}
export function Location() {
  const t = useCurrentFrame() / 30;
  const z = ease((t - 1.5) / 8);
  return (
    <AbsoluteFill>
      <Canvas>
        <Camera
          position={[mix(6, 1.25, z), mix(10, 3.9, z), mix(10, 4.3, z)]}
          target={[mix(0, 0.384, z), 0.1, mix(0, -0.164, z)]}
          fov={40}
        />
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          receiveShadow
          position={[0, -0.1, 0]}
        >
          <planeGeometry args={[80, 80]} />
          <meshStandardMaterial
            color="#081626"
            metalness={0.6}
            roughness={0.28}
          />
        </mesh>
        <Relief />
        <City time={t} />
        <Dust time={t} />
      </Canvas>
      <Finish />
      <Title
        text="مختبر اتقان البناء لفحص التربة و المواد"
        sub="الرياض – المملكة العربية السعودية"
        size={49}
        bottom={230}
        duration={300}
        enter={30}
      />
    </AbsoluteFill>
  );
}
