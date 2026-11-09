import React, { useMemo } from "react";
import * as T from "three";
import { Box, Cyl, Line, Bolt } from "./Parts";
import { concrete, steel, brushed, navy, rubber, rand } from "./Materials";
import { clamp, smooth, V3 } from "./Math";
export function Stream({
  t,
  from,
  to,
  visible = true,
  r = 0.2,
}: {
  t: number;
  from: V3;
  to: V3;
  visible?: boolean;
  r?: number;
}) {
  const g = useMemo(() => {
    const pts = [];
    for (let i = 0; i < 7; i++) {
      const q = i / 6;
      pts.push(
        new T.Vector3(
          from[0] +
            (to[0] - from[0]) * q +
            Math.sin(q * 8 + t * 9) * 0.025 * Math.sin(q * Math.PI),
          from[1] + (to[1] - from[1]) * q,
          from[2] +
            (to[2] - from[2]) * q +
            Math.cos(q * 9 + t * 7) * 0.02 * Math.sin(q * Math.PI),
        ),
      );
    }
    const geo = new T.TubeGeometry(
      new T.CatmullRomCurve3(pts),
      36,
      r,
      14,
      false,
    );
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      pos.setX(i, pos.getX(i) + 0.02 * Math.sin(i * 2.1 + t * 12));
      pos.setZ(i, pos.getZ(i) + 0.015 * Math.sin(i * 1.7 + t * 10));
    }
    geo.computeVertexNormals();
    return geo;
  }, [t, ...from, ...to, r]);
  return (
    <mesh
      geometry={g}
      material={concrete(true)}
      visible={visible}
      castShadow
      receiveShadow
    />
  );
}
export function PourPan({ p, rot = 0 }: { p: V3; rot?: number }) {
  return (
    <group position={p} rotation={[0.25, 0, rot]}>
      <Box s={[1.9, 0.1, 1.1]} mat={brushed} />
      <Box p={[0, 0.25, -0.53]} s={[1.9, 0.5, 0.07]} mat={steel} />
      <Box p={[-0.9, 0.25, 0]} s={[0.08, 0.5, 1.1]} mat={steel} />
      <Box p={[0.9, 0.25, 0]} s={[0.08, 0.5, 1.1]} mat={steel} />
      <Box p={[0, 0.1, 0]} s={[1.5, 0.16, 0.85]} mat={concrete(true)} />
    </group>
  );
}
export function Cone({ p = [0, 0, 0] }: { p?: V3 }) {
  const geo = useMemo(
    () =>
      new T.LatheGeometry(
        [
          new T.Vector2(0.969, 0),
          new T.Vector2(1, 0),
          new T.Vector2(0.5, 3),
          new T.Vector2(0.469, 3),
          new T.Vector2(0.969, 0),
        ],
        96,
      ),
    [],
  );
  return (
    <group position={p}>
      <mesh geometry={geo} material={steel} castShadow receiveShadow />
      <Cyl p={[0, 3, 0]} r={0.505} h={0.035} open mat={brushed} />
      <Cyl p={[0, 0.02, 0]} r={1.008} h={0.035} open mat={brushed} />
      {[-1, 1].map((s) => (
        <group key={s}>
          <Line
            points={[
              [s * 0.77, 1.65, 0],
              [s * 1.02, 1.65, 0],
              [s * 1.07, 1.18, 0],
              [s * 0.84, 1.18, 0],
            ]}
            r={0.035}
            mat={brushed}
          />
          <Box p={[s * 1.03, 0.035, 0]} s={[0.48, 0.065, 0.3]} mat={brushed} />
        </group>
      ))}
    </group>
  );
}
function profile(u: number) {
  const a = 0.045;
  if (u < a) return (u * u) / (2 * a * (1 - a));
  if (u > 1 - a) return 1 - (1 - u) ** 2 / (2 * a * (1 - a));
  return (u - a / 2) / (1 - a);
}
export function SlumpStation({
  t,
  hero = false,
}: {
  t: number;
  hero?: boolean;
}) {
  const fill = hero ? 0 : smooth((t - 4.5) / 2.4),
    settle = hero ? 0 : smooth((t - 10.6) / 3.7);
  const h = (3.0 - settle * 0.74) * Math.max(0.025, fill),
    r = 0.465 + settle * 0.2;
  const V = (3.0 / 3) * (0.955 * 0.955 + 0.955 * 0.465 + 0.465 * 0.465);
  const R =
    settle > 0
      ? (-r + Math.sqrt((12 * V) / (3.0 - settle * 0.74) - 3 * r * r)) / 2
      : 0.955;
  const g = useMemo(() => {
    const geo = new T.CylinderGeometry(r, R, h, 80, 28, false);
    const p = geo.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i),
        y = p.getY(i),
        z = p.getZ(i),
        n = Math.sin(x * 17 + z * 13) * Math.cos(y * 20 + z * 8) * 0.007;
      p.setXYZ(
        i,
        x + n,
        y + Math.sin(x * 12 - z * 15) * 0.006 * (1 + settle),
        z + n,
      );
    }
    geo.computeVertexNormals();
    return geo;
  }, [h, R, r, settle]);
  const lift = hero
    ? 0
    : 3.25 * profile(clamp((t - 8.3) / 5)) * (1 - smooth((t - 14.8) / 1.7));
  const side = hero ? 0 : -2.9 * smooth((t - 13.45) / 1.1);
  return (
    <group>
      <Box p={[0, 0.055, 0]} s={[4.2, 0.11, 3.7]} mat={brushed} />
      <Box p={[0, 0.006, 0]} s={[4.0, 0.015, 3.5]} mat={rubber} />
      {[-1, 1].flatMap((x) =>
        [-1, 1].map((z) => (
          <Bolt key={`${x}${z}`} p={[x * 1.85, 0.12, z * 1.6]} scale={0.65} />
        )),
      )}
      {!hero && (
        <mesh
          geometry={g}
          material={concrete(true)}
          position={[0, 0.112 + h / 2, 0]}
          castShadow
          receiveShadow
        />
      )}
      <Cone p={[side, 0.115 + lift, 0]} />
      {!hero && (
        <group visible={t < 13.5} position={[0, lift, 0]}>
          {[-1, 1].map((s) => (
            <Line
              key={s}
              points={[
                [s * 0.99, 1.54, 0],
                [s * 0.99, 4.4, 0],
                [s * 0.6, 4.65, 0],
              ]}
              r={0.018}
              mat={brushed}
            />
          ))}
          <Box p={[0, 4.68, 0]} s={[1.25, 0.12, 0.2]} mat={navy} />
        </group>
      )}
      {!hero && (
        <group visible={t > 4.3 && t < 7.3}>
          <PourPan p={[-0.3, 4.5, -0.4]} rot={-0.18} />
          <Stream
            t={t}
            from={[-0.15, 4.45, 0.0]}
            to={[0, 0.15 + h, 0]}
            visible={t > 4.5 && t < 6.95}
            r={0.2}
          />
        </group>
      )}
    </group>
  );
}
