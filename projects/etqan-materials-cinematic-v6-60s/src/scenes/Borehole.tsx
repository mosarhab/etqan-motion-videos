import React, { useMemo, useRef, useLayoutEffect } from "react";
import * as T from "three";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import {
  Canvas,
  Camera,
  Dust,
  Finish,
  View,
  V3,
  smooth,
  lerp3,
  worldPoint,
  Cyl,
  Box,
  Path,
  metal,
  navy,
  gold,
  rand,
  dark,
} from "../World";
import { surface, noise } from "../Surfaces";
import { Fonts, Callout } from "../Type";

/** Visible bore through three unnumbered strata; no invented bore log. */
function Stratum({ y, tint }: { y: number; tint: string }) {
  const geo = useMemo(() => {
    const shape = new T.Shape();
    shape.moveTo(-1.65, -1.05);
    shape.lineTo(1.65, -1.05);
    shape.lineTo(1.65, 1.05);
    shape.lineTo(-1.65, 1.05);
    shape.closePath();
    const hole = new T.Path();
    hole.absarc(0, 0, 0.235, 0, Math.PI * 2, true);
    shape.holes.push(hole);
    const result = new T.ExtrudeGeometry(shape, {
      depth: 0.65,
      bevelEnabled: true,
      bevelSize: 0.02,
      bevelThickness: 0.02,
      bevelSegments: 2,
      curveSegments: 48,
      steps: 5,
    });
    const p = result.attributes.position;
    for (let i = 0; i < p.count; i++) {
      p.setZ(
        i,
        p.getZ(i) + 0.022 * Math.sin(p.getX(i) * 2.2 + p.getY(i) * 2.8),
      );
    }
    result.computeVertexNormals();
    return result;
  }, []);
  const mat = useMemo(() => {
    const m = surface("soil").clone();
    m.color.set(tint);
    return m;
  }, [tint]);
  return (
    <mesh
      position={[0, y, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
      geometry={geo}
      material={mat}
      castShadow
      receiveShadow
    />
  );
}
function FaceGrains() {
  const ref = useRef<T.InstancedMesh>(null);
  useLayoutEffect(() => {
    if (!ref.current) return;
    const o = new T.Object3D(),
      c = new T.Color();
    for (let i = 0; i < 580; i++) {
      const side = i % 3 === 0,
        x = side ? 1.665 : (rand(i * 4) - 0.5) * 3.25,
        z = side ? (rand(i * 4 + 2) - 0.5) * 2.08 : 1.065,
        y = 0.98 + rand(i * 4 + 1) * 1.86;
      o.position.set(x, y, z);
      o.rotation.set(i * 1.7, i * 0.8, i * 0.3);
      const r = 0.004 + Math.pow(rand(i * 4 + 3), 4) * 0.032;
      o.scale.set(r, r * 0.65, r * 0.8);
      o.updateMatrix();
      ref.current.setMatrixAt(i, o.matrix);
      c.set(["#a78e66", "#88714f", "#c6af86", "#5d5545"][i % 4]);
      ref.current.setColorAt(i, c);
    }
    ref.current.instanceMatrix.needsUpdate = true;
    if (ref.current.instanceColor) ref.current.instanceColor.needsUpdate = true;
  }, []);
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, 580]} castShadow>
      <icosahedronGeometry args={[1, 0]} />
      <meshStandardMaterial roughness={0.94} />
    </instancedMesh>
  );
}
export function SoilBorehole() {
  const { fps } = useVideoConfig();
  const t = useCurrentFrame() / fps;
  const down = smooth((t - 0.2) / 1.35),
    up = smooth((t - 1.75) / 1.75);
  const barrelY = 4.45 - down * 1.25 + up * 1.7;
  const view: View = {
    position: lerp3([4.9, 5.1, 11.3], [4.1, 4.9, 10.8], smooth(t / 4)),
    target: [0, 2.9, 0],
    fov: 40,
  };
  const rot: V3 = [0, -0.18, 0];
  const point = worldPoint([0, barrelY - 0.48, 0.18], [0, 0, 0], rot);
  const soil = useMemo(() => surface("soil").clone(), []);
  return (
    <AbsoluteFill>
      <Fonts />
      <Canvas>
        <Camera view={view} />
        <group rotation={rot}>
          <Stratum y={0.95} tint="#c1aa8c" />
          <Stratum y={1.6} tint="#d7c195" />
          <Stratum y={2.25} tint="#b99d71" />
          <FaceGrains />
          <group position={[0, barrelY, 0]}>
            <group rotation={[0, t * 3.4, 0]}>
              <Cyl p={[0, 0.73, 0]} r={0.075} h={0.6} />
              <Cyl p={[0, 1.11, 0]} r={0.23} h={0.21} mat={navy} />
              <Cyl p={[0, 1.23, 0]} r={0.17} h={0.08} mat={gold} />
              <Cyl r={0.205} h={1.25} open />
              <Cyl p={[0, -0.65, 0]} r={0.22} h={0.08} mat={gold} open />
              {Array.from({ length: 8 }, (_, i) => (
                <Box
                  key={i}
                  p={[
                    Math.cos((i * Math.PI) / 4) * 0.2,
                    -0.7,
                    Math.sin((i * Math.PI) / 4) * 0.2,
                  ]}
                  s={[0.06, 0.08, 0.06]}
                  mat={metal}
                />
              ))}
            </group>
            <group visible={t > 1.75}>
              <mesh
                material={soil}
                position={[0, -0.65 - up * 0.28, 0]}
                castShadow
              >
                <cylinderGeometry args={[0.177, 0.177, 0.9, 48, 12]} />
              </mesh>
              <Cyl p={[0, -0.3, 0]} r={0.202} h={0.06} mat={navy} />
            </group>
          </group>
          <Path
            points={[
              [-1.5, 0.89, 1.1],
              [-0.5, 0.89, 1.13],
              [0.5, 0.89, 1.13],
              [1.5, 0.89, 1.1],
            ]}
            width={0.008}
          />
        </group>
        <Dust t={t} />
      </Canvas>
      <Finish />
      <Callout
        text="جسات التربة"
        point={point}
        view={view}
        t={t}
        start={0.3}
        end={3.95}
        y={425}
        x={65}
        width={610}
      />
    </AbsoluteFill>
  );
}
