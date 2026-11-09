import React, { useMemo } from "react";
import * as T from "three";
import { Box, Cyl, Line, Bolt, FrameBase } from "./Parts";
import {
  concrete,
  steel,
  brushed,
  navy,
  gold,
  rubber,
  dark,
} from "./Materials";
import { smooth, clamp } from "./Math";
import { fractureCells } from "./Fracture";
export function Compression({ t }: { t: number }) {
  const contact = smooth((t - 38.1) / 3.2),
    load = smooth((t - 41.3) / 4.5),
    failure = smooth((t - 45.65) / 1.45),
    press = 0.38 * contact + 0.0045 * load;
  const cells = useMemo(fractureCells, []),
    materials = useMemo(() => [concrete(false), concrete(false, true)], []);
  return (
    <group>
      <FrameBase w={4.15} d={3.25} />
      {[-1.6, 1.6].flatMap((x) =>
        [-1.09, 1.09].map((z) => (
          <group key={`${x}${z}`}>
            <Cyl p={[x, 2.57, z]} r={0.13} h={4.14} mat={steel} />
            <Cyl p={[x, 0.63, z]} r={0.23} h={0.25} mat={navy} />
            <Cyl p={[x, 4.5, z]} r={0.23} h={0.2} mat={navy} />
            <Bolt p={[x, 4.9, z]} scale={1.6} />
          </group>
        )),
      )}
      <Box p={[0, 4.65, 0]} s={[4.2, 0.48, 3.02]} mat={navy} />
      <Box p={[0, 4.39, 0]} s={[3.95, 0.05, 2.8]} mat={gold} />
      <Cyl p={[0, 0.72, 0]} r={1.12} h={0.42} mat={navy} />
      <Cyl p={[0, 0.91, 0]} r={1.11} h={0.12} mat={steel} />
      <group position={[0, 1.72, 0]}>
        {cells.map((cell) => {
          const c = cell.center,
            outer = Math.max(Math.abs(c.x), Math.abs(c.z)),
            offset = (outer > 0.25 ? 0.03 : 0.003) * failure,
            rot = new T.Euler(
              c.z * 0.012 * failure,
              cell.seed * 0.0002 * failure,
              c.x * 0.025 * failure,
            ),
            scale = 1 - 0.003 * load;
          cell.geometry.computeBoundingBox();
          const b = cell.geometry.boundingBox!;
          let min = Infinity,
            max = -Infinity;
          for (const x of [b.min.x, b.max.x])
            for (const y of [b.min.y, b.max.y])
              for (const z of [b.min.z, b.max.z]) {
                const p = new T.Vector3(x, y * scale, z).applyEuler(rot);
                min = Math.min(min, p.y);
                max = Math.max(max, p.y);
              }
          let y = c.y - (c.y + 0.75) * 0.003 * load;
          y = Math.max(-0.75 - min, Math.min(0.75 - 0.0045 * load - max, y));
          return (
            <mesh
              key={cell.seed}
              geometry={cell.geometry}
              material={materials}
              scale={[1, scale, 1]}
              castShadow
              receiveShadow
              position={[c.x + c.x * offset, y, c.z + c.z * offset]}
              rotation={rot}
            />
          );
        })}
        {Array.from({ length: 7 }, (_, i) => {
          const age = Math.max(0, (t - 45.95 - i * 0.055) * 0.2),
            r = 0.014 + (i % 3) * 0.006,
            y = Math.max(-0.75 + r, 0.1 + i * 0.08 - 2.5 * age * age);
          return (
            <mesh
              key={"crumb" + i}
              visible={age > 0}
              position={[-0.45 + i * 0.13, y, 0.78 + 0.35 * age]}
              rotation={[age * 2, i, age * 3]}
              material={concrete(false, true)}
              castShadow
            >
              <icosahedronGeometry args={[r, 0]} />
            </mesh>
          );
        })}
      </group>
      <group position={[0, -press, 0]}>
        <Cyl p={[0, 2.94, 0]} r={1.11} h={0.18} mat={steel} />
        <Cyl p={[0, 3.06, 0]} r={1.13} h={0.06} mat={navy} />
        <mesh position={[0, 3.09, 0]} material={steel} castShadow>
          <sphereGeometry
            args={[0.31, 48, 32, 0, Math.PI * 2, 0, Math.PI / 2]}
          />
        </mesh>
        <Cyl p={[0, 3.7, 0]} r={0.2} h={1.12} mat={steel} />
      </group>
      <Cyl p={[0, 4.02, 0]} r={0.43} h={0.62} mat={navy} />
      <Cyl p={[0, 3.71, 0]} r={0.44} h={0.07} mat={gold} />
      <group position={[2.65, 0.45, -0.35]}>
        <Box p={[0, 0.65, 0]} s={[0.95, 1.3, 1.2]} mat={navy} />
        <Box p={[0, 1.32, 0]} s={[0.96, 0.08, 1.21]} mat={brushed} />
        <Box p={[0, 1.39, 0]} s={[0.64, 0.045, 0.44]} mat={dark} />
        <Cyl p={[0.3, 1.39, 0.42]} r={0.07} h={0.05} mat={gold} />
        <Line
          points={[
            [0, 0.5, -0.5],
            [-0.7, 0.35, -1.2],
            [-1.7, 1.8, -1.25],
            [-2.65, 4.05, -0.2],
          ]}
          r={0.038}
          mat={rubber}
        />
      </group>
    </group>
  );
}
