import React, { useMemo } from "react";
import * as T from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { V3 } from "./Math";
import { steel, brushed, navy, gold, rubber } from "./Materials";
export function Box({
  p = [0, 0, 0],
  s = [1, 1, 1],
  mat = navy,
  rot = [0, 0, 0],
  r = 0.025,
}: {
  p?: V3;
  s?: V3;
  mat?: T.Material;
  rot?: V3;
  r?: number;
}) {
  const g = useMemo(
    () => new RoundedBoxGeometry(...s, 2, Math.min(r, Math.min(...s) * 0.18)),
    [...s, r],
  );
  return (
    <mesh
      position={p}
      rotation={rot}
      geometry={g}
      material={mat}
      castShadow
      receiveShadow
    />
  );
}
export function Cyl({
  p = [0, 0, 0],
  r = 0.1,
  h = 1,
  mat = steel,
  rot = [0, 0, 0],
  open = false,
}: {
  p?: V3;
  r?: number;
  h?: number;
  mat?: T.Material;
  rot?: V3;
  open?: boolean;
}) {
  return (
    <mesh position={p} rotation={rot} material={mat} castShadow receiveShadow>
      <cylinderGeometry args={[r, r, h, 64, 1, open]} />
    </mesh>
  );
}
export function Line({
  points,
  r = 0.02,
  mat = steel,
}: {
  points: V3[];
  r?: number;
  mat?: T.Material;
}) {
  const geo = useMemo(
    () =>
      new T.TubeGeometry(
        new T.CatmullRomCurve3(points.map((v) => new T.Vector3(...v))),
        48,
        r,
        10,
        false,
      ),
    [JSON.stringify(points), r],
  );
  return <mesh geometry={geo} material={mat} castShadow />;
}
export function Bolt({ p, scale = 1 }: { p: V3; scale?: number }) {
  return (
    <group position={p} scale={scale}>
      <Cyl r={0.07} h={0.04} mat={brushed} />
      <mesh position={[0, 0.043, 0]} material={steel} castShadow>
        <cylinderGeometry args={[0.049, 0.049, 0.058, 6]} />
      </mesh>
      <Cyl p={[0, 0.077, 0]} r={0.014} h={0.003} mat={rubber} />
    </group>
  );
}
export function FrameBase({ w = 4, d = 3 }: { w?: number; d?: number }) {
  return (
    <group>
      <Box p={[0, 0.25, 0]} s={[w, 0.4, d]} mat={navy} r={0.04} />
      <Box p={[0, 0.47, 0]} s={[w - 0.06, 0.045, d - 0.06]} mat={brushed} />
      <Box
        p={[0, 0.3, d / 2 + 0.003]}
        s={[w - 0.24, 0.035, 0.012]}
        mat={gold}
      />
      {[-1, 1].flatMap((x) =>
        [-1, 1].map((z) => (
          <Cyl
            key={`${x}${z}`}
            p={[x * (w / 2 - 0.35), 0.06, z * (d / 2 - 0.3)]}
            r={0.16}
            h={0.1}
            mat={rubber}
          />
        )),
      )}
    </group>
  );
}
