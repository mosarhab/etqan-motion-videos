import React, { useMemo } from "react";
import * as T from "three";
import { Box, Cyl, Line, Bolt } from "./Parts";
import { concrete, steel, brushed, navy, water, glass } from "./Materials";
import { smooth } from "./Math";
export function Curing({ t }: { t: number }) {
  const volume = useMemo(
    () =>
      new T.MeshPhysicalMaterial({
        color: "#b4d4d8",
        roughness: 0.12,
        transparent: true,
        opacity: 0.025,
        depthWrite: false,
      }),
    [],
  );
  const lower = smooth((t - 27.4) / 2.4),
    rack = 2.2 - lower * 1.2;
  const g = useMemo(() => {
    const g = new T.PlaneGeometry(5.65, 3.55, 80, 56);
    g.rotateX(-Math.PI / 2);
    const p = g.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i),
        z = p.getZ(i),
        r = Math.hypot(x, z);
      p.setY(
        i,
        0.006 * Math.sin(r * 12 - t * 2.3) * Math.exp(-r * 0.3) +
          0.003 * Math.sin(x * 8 + z * 7 + t),
      );
    }
    g.computeVertexNormals();
    return g;
  }, [t]);
  return (
    <group>
      <Box p={[0, 0.25, 0]} s={[6.0, 0.48, 3.9]} mat={navy} />
      <Box p={[0, 0.57, 0]} s={[5.92, 0.16, 3.84]} mat={brushed} />
      <Box p={[0, 1.86, -1.86]} s={[5.92, 2.6, 0.12]} mat={brushed} />
      {[-1, 1].map((s) => (
        <group key={s}>
          <Box p={[s * 2.91, 1.86, 0]} s={[0.12, 2.6, 3.85]} mat={brushed} />
          <Cyl p={[s * 2.72, 3.15, -1.61]} r={0.035} h={0.8} mat={steel} />
        </group>
      ))}
      <Box p={[0, 1.83, 1.86]} s={[5.94, 2.54, 0.07]} mat={glass} />
      <Box p={[0, 0.64, 1.89]} s={[5.94, 0.16, 0.14]} mat={brushed} />
      <Box p={[0, 3.1, 1.89]} s={[5.94, 0.16, 0.14]} mat={brushed} />
      {[-2.86, 2.86].map((x) => (
        <Box key={x} p={[x, 1.8, 1.89]} s={[0.12, 2.43, 0.14]} mat={steel} />
      ))}
      <group position={[0, rack, 0]}>
        <Box p={[0, 0, 0]} s={[5.25, 0.09, 3.18]} mat={steel} />
        {[-1.68, 0, 1.68].flatMap((x) =>
          [-0.8, 0.8].map((z) => (
            <Box
              key={`${x}${z}`}
              p={[x, 0.805, z]}
              s={[1.48, 1.48, 1.48]}
              mat={concrete(true)}
              r={0.018}
            />
          )),
        )}
        {[-2.5, 2.5].map((x) => (
          <Line
            key={x}
            points={[
              [x, 0, -1.4],
              [x, 2.45, -1.4],
              [x, 2.45, 1.4],
              [x, 0, 1.4],
            ]}
            r={0.027}
            mat={steel}
          />
        ))}
      </group>
      <mesh geometry={g} position={[0, 3.08, 0]} material={water} />
      <Box p={[0, 1.86, 0]} s={[5.65, 2.35, 3.55]} mat={volume} r={0.01} />
      <Box p={[0, 3.13, -1.91]} s={[5.98, 0.08, 0.2]} mat={steel} />
    </group>
  );
}
