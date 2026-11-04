import React, { useMemo } from "react";
import * as T from "three";
import {
  Box,
  Cyl,
  Ring,
  Bolt,
  Cable,
  mats,
  grain,
  random,
  ease,
  mix,
} from "./World";

export function Bench({ x = 0, z = 0 }: { x?: number; z?: number }) {
  return (
    <group position={[x, 0, z]}>
      <Box p={[0, 1.04, 0]} s={[3.7, 0.2, 1.7]} mat="steel" />
      <Box p={[0, 0.94, 0]} s={[3.6, 0.1, 1.6]} mat="navy" />
      {[-1.6, 1.6].map((a) =>
        [-0.65, 0.65].map((b) => (
          <Box
            key={a + "," + b}
            p={[a, 0.45, b]}
            s={[0.1, 0.9, 0.1]}
            mat="steel"
          />
        )),
      )}
      <Box p={[0, 0.45, 0.55]} s={[3.3, 0.07, 0.07]} mat="steel" />
    </group>
  );
}
export function SampleRack({ time = 0 }: { time?: number }) {
  return (
    <group>
      <Box p={[0, 0.1, 0]} s={[3, 0.16, 1.35]} mat="navy" />
      {Array.from({ length: 8 }, (_, i) => (
        <group
          key={i}
          position={[(i % 4) * 0.68 - 1.02, 0, Math.floor(i / 4) * 0.62 - 0.3]}
        >
          <Cyl
            p={[0, 0.42, 0]}
            r={0.22}
            h={0.6}
            mat={i < 4 ? "concrete" : "soil"}
          />
          <Cyl p={[0, 0.76, 0]} r={0.24} h={0.07} mat="steel" />
          <Ring p={[0, 0.4, 0]} r={0.225} tube={0.008} mat="gold" />
        </group>
      ))}
    </group>
  );
}
export function CompressionMachine({
  time = 0,
  compact = false,
}: {
  time?: number;
  compact?: boolean;
}) {
  const press = ease((time - 1.6) / 3.7);
  const release = ease((time - 7.4) / 1.8);
  const platen = 3.12 - 0.4 * press + 0.4 * release;
  const cracks = ease((time - 5.1) / 1.7);
  return (
    <group scale={compact ? 0.75 : 1}>
      {[-1.28, 1.28].map((x) =>
        [-0.85, 0.85].map((z) => (
          <group key={x + "," + z}>
            <Cyl p={[x, 0.13, z]} r={0.15} h={0.25} mat="rubber" />
            <Cyl p={[x, 0.28, z]} r={0.12} h={0.13} mat="steel" />
          </group>
        )),
      )}
      <Box p={[0, 0.48, 0]} s={[3.1, 0.42, 2.15]} mat="navy" />
      <Box p={[0, 0.72, 0]} s={[3.08, 0.07, 2.1]} mat="steel" />
      <Box p={[0, 0.53, 1.083]} s={[2.5, 0.08, 0.015]} mat="gold" />
      {[-1.14, 1.14].map((x) =>
        [-0.7, 0.7].map((z) => (
          <group key={x + "," + z}>
            <Cyl p={[x, 2.55, z]} r={0.115} h={3.75} />
            <Cyl p={[x, 0.84, z]} r={0.19} h={0.14} mat="navy" />
            <Cyl p={[x, 4.36, z]} r={0.19} h={0.13} segments={6} />
            <Cyl p={[x, 4.5, z]} r={0.12} h={0.15} segments={6} />
          </group>
        )),
      )}
      <Box p={[0, 4.12, 0]} s={[2.8, 0.42, 1.8]} mat="navy" />
      <Box p={[0, 4.36, 0]} s={[2.84, 0.08, 1.83]} mat="steel" />
      <Box p={[0, 3.88, 0]} s={[2.7, 0.045, 1.7]} mat="gold" />
      <Cyl p={[0, 3.87, 0]} r={0.4} h={0.44} mat="navy" />
      <Cyl p={[0, (3.65 + platen) / 2, 0]} r={0.23} h={3.65 - platen} />
      <Cyl p={[0, platen, 0]} r={0.84} h={0.22} />
      <Cyl p={[0, platen - 0.14, 0]} r={0.69} h={0.06} mat="dark" />
      <Cyl p={[0, 1.03, 0]} r={0.85} h={0.5} />
      <Cyl p={[0, 1.32, 0]} r={0.76} h={0.09} mat="dark" />
      <group position={[0, 1.37, 0]} scale={[1, 1 - cracks * 0.018, 1]}>
        <Cyl p={[0, 0.6, 0]} r={0.57} h={1.2} mat="concrete" />
        {Array.from({ length: 28 }, (_, i) => (
          <mesh
            key={i}
            position={[
              Math.sin(i * 2.4) * 0.51,
              random(i + 23) * 1.14 + 0.03,
              Math.cos(i * 2.4) * 0.51,
            ]}
            scale={[
              0.04 + random(i) * 0.07,
              0.025,
              0.04 + random(i + 8) * 0.05,
            ]}
          >
            <icosahedronGeometry args={[1, 0]} />
            <meshStandardMaterial
              color={i % 2 ? "#777d7c" : "#d0c7b3"}
              roughness={1}
            />
          </mesh>
        ))}
      </group>
      <Box p={[1.83, 1.5, -0.25]} s={[0.65, 1.68, 1.05]} mat="navy" />
      <Box
        p={[1.83, 2.37, -0.22]}
        s={[0.71, 0.12, 1.15]}
        mat="steel"
        rot={[-0.22, 0, 0]}
      />
      {[0, 1, 2].map((i) => (
        <Cyl
          key={i}
          p={[1.63 + i * 0.2, 2.48, -0.18]}
          r={0.055}
          h={0.07}
          mat={i === 1 ? "gold" : "dark"}
        />
      ))}
      <Cyl
        p={[2.18, 1.77, 0.13]}
        r={0.1}
        h={0.035}
        rot={[0, 0, Math.PI / 2]}
        mat="gold"
      />
      <Cable
        points={[
          [1.95, 1.3, -0.7],
          [2.4, 1.5, -1],
          [2, 3.6, -1],
          [0.3, 4.22, -0.5],
        ]}
      />
      <Box p={[0, 2.25, -0.82]} s={[1.85, 2.8, 0.025]} mat="glass" />
      {[-0.88, 0.88].map((x) => (
        <Box key={x} p={[x, 2.25, -0.85]} s={[0.028, 2.8, 0.04]} mat="steel" />
      ))}
      {[-1, 1].map((x) =>
        [-0.8, 0.8].map((z) => <Bolt key={x + "," + z} p={[x, 0.78, z]} />),
      )}
    </group>
  );
}
function Layer({
  y,
  h,
  color,
  seed,
}: {
  y: number;
  h: number;
  color: string;
  seed: number;
}) {
  const geometry = useMemo(() => {
    const g = new T.BoxGeometry(3.6, h, 2.6, 14, 2, 12);
    const p = g.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i),
        z = p.getZ(i);
      p.setY(
        i,
        p.getY(i) +
          0.045 * Math.sin(x * 3 + seed) +
          0.025 * Math.sin(z * 6 + seed + x * 5),
      );
    }
    g.computeVertexNormals();
    return g;
  }, [h, seed]);
  return (
    <mesh position={[0, y, 0]} geometry={geometry} castShadow receiveShadow>
      <meshStandardMaterial
        color={color}
        roughness={1}
        map={grain}
        bumpMap={grain}
        bumpScale={0.03}
      />
    </mesh>
  );
}
export function SoilRig({ time = 0 }: { time?: number }) {
  const down = ease((time - 0.5) / 2.5),
    up = ease((time - 4) / 3);
  const lift = 4.8 - down * 1.45 + up * 1.75;
  return (
    <group>
      <group position={[-0.35, 0, 0]}>
        <Box p={[0, 0.17, 0]} s={[4.05, 0.28, 3.05]} mat="navy" />
        <Layer y={0.61} h={0.6} color="#64564b" seed={1} />
        <Layer y={1.17} h={0.5} color="#9c7960" seed={2} />
        <Layer y={1.65} h={0.45} color="#73523b" seed={3} />
        <Layer y={2.07} h={0.4} color="#b59465" seed={4} />
        <Layer y={2.44} h={0.35} color="#766347" seed={5} />
        {[-1.15, 1.15].map((x) => (
          <group key={x}>
            <Cyl p={[x, 3.1, -1.15]} r={0.085} h={5.65} />
            <Box p={[x, 0.4, -1.15]} s={[0.45, 0.3, 0.5]} mat="steel" />
          </group>
        ))}
        <Box p={[0, 5.8, -1.15]} s={[2.9, 0.28, 0.6]} mat="navy" />
        <Box p={[0, 5.6, -1.15]} s={[2.9, 0.04, 0.65]} mat="gold" />
        <group position={[0, lift, -0.15]}>
          <Box p={[0, 0.1, -0.65]} s={[2.5, 0.34, 1.2]} mat="navy" />
          <Cyl p={[0, 0.5, 0]} r={0.3} h={0.68} mat="navy" />
          <Cyl p={[0, 0.88, 0]} r={0.33} h={0.12} mat="steel" />
          <group rotation={[0, time * 3.5, 0]}>
            <mesh position={[0, -0.75, 0]} castShadow material={mats.steel}>
              <cylinderGeometry args={[0.25, 0.25, 1.7, 48, 1, true]} />
            </mesh>
            {Array.from({ length: 6 }, (_, i) => (
              <Box
                key={i}
                p={[
                  Math.cos((i * Math.PI) / 3) * 0.24,
                  -1.6,
                  Math.sin((i * Math.PI) / 3) * 0.24,
                ]}
                s={[0.12, 0.13, 0.12]}
                mat="gold"
              />
            ))}
            <Ring p={[0, -0.12, 0]} r={0.26} tube={0.025} mat="steel" />
          </group>
          <Cyl p={[0, -1.6 - up * 0.35, 0]} r={0.205} h={1.15} mat="soil" />
        </group>
        <Cable
          points={[
            [0.3, 5.95, -1.2],
            [1.8, 5.4, -1.2],
            [1.6, lift + 0.3, -0.8],
            [0.3, lift + 0.65, -0.15],
          ]}
          r={0.035}
        />
        {Array.from({ length: 110 }, (_, i) => (
          <mesh
            key={i}
            position={[
              (random(i * 3) - 0.5) * 3.4,
              2.64 + (random(i * 3 + 1) - 0.5) * 0.05,
              (random(i * 3 + 2) - 0.5) * 2.45,
            ]}
            scale={[
              0.025 + random(i) * 0.04,
              0.02 + random(i + 9) * 0.035,
              0.03,
            ]}
            material={i % 3 ? mats.soil : mats.concrete}
          >
            <icosahedronGeometry args={[1, 0]} />
          </mesh>
        ))}
      </group>
      <group position={[2.5, 0, 0.3]}>
        <Triaxial time={time} />
      </group>
    </group>
  );
}
export function Triaxial({ time = 0 }: { time?: number }) {
  return (
    <group>
      <Cyl p={[0, 0.21, 0]} r={0.73} h={0.36} mat="navy" />
      <Cyl p={[0, 0.46, 0]} r={0.63} h={0.14} />
      <Cyl p={[0, 1.48, 0]} r={0.54} h={1.9} mat="glass" />
      <Cyl p={[0, 2.47, 0]} r={0.63} h={0.17} />
      {[-1, 1].map((x) =>
        [-1, 1].map((z) => (
          <Cyl
            key={x + "," + z}
            p={[x * 0.43, 1.45, z * 0.43]}
            r={0.035}
            h={2.15}
          />
        )),
      )}
      <Cyl p={[0, 1.04, 0]} r={0.25} h={1.0} mat="soil" />
      <Cyl p={[0, 1.58, 0]} r={0.28} h={0.1} />
      <Cyl p={[0, 2.15 - ease(time / 8) * 0.12, 0]} r={0.09} h={1.0} />
      <Cyl p={[0, 2.73, 0]} r={0.23} h={0.3} mat="navy" />
      <Cable
        points={[
          [0.3, 0.4, 0],
          [0.8, 0.3, 0.5],
          [0.8, 0.1, 1],
          [1.1, 0.08, 1.1],
        ]}
        color="#f6c514"
      />
    </group>
  );
}
function BreakingHead({ top = false, y = 0 }: { top?: boolean; y?: number }) {
  const geo = useMemo(() => {
    const shape = new T.Shape();
    const start = top ? 0 : Math.PI;
    shape.absarc(0, 0, 0.75, start, start + Math.PI, false);
    shape.absarc(0, 0, 0.595, start + Math.PI, start, true);
    shape.closePath();
    return new T.ExtrudeGeometry(shape, {
      depth: 0.75,
      bevelEnabled: true,
      bevelSize: 0.018,
      bevelSegments: 2,
      steps: 1,
      bevelThickness: 0.018,
    });
  }, [top]);
  return (
    <mesh
      geometry={geo}
      position={[0, y, -0.375]}
      castShadow
      material={mats.steel}
    />
  );
}
export function AsphaltMachine({ time = 0 }: { time?: number }) {
  const load = ease((time - 1.8) / 3.6);
  return (
    <group>
      <Box p={[0, 0.28, 0]} s={[3.2, 0.45, 2.25]} mat="navy" />
      <Box p={[0, 0.53, 0]} s={[3.18, 0.05, 2.21]} mat="steel" />
      {[-1.1, 1.1].map((x) => (
        <group key={x}>
          <Cyl p={[x, 2.2, -0.2]} r={0.12} h={3.5} />
          <Cyl p={[x, 4, -0.2]} r={0.18} h={0.16} segments={6} />
          <Cyl p={[x, 0.67, -0.2]} r={0.19} h={0.15} />
        </group>
      ))}
      <Box p={[0, 3.75, -0.2]} s={[2.7, 0.4, 1.3]} mat="navy" />
      <Box p={[0, 3.52, -0.2]} s={[2.5, 0.035, 1.3]} mat="gold" />
      <Cyl
        p={[0, (3.5 + 3.2 - load * 0.3) / 2, 0]}
        r={0.2}
        h={3.5 - (3.2 - load * 0.3)}
      />
      <Box p={[0, 3.2 - load * 0.3, 0]} s={[1.5, 0.22, 1.05]} mat="steel" />
      <BreakingHead top y={2.04 + 0.3 * (1 - load)} />
      <BreakingHead y={2.04} />
      <Cyl
        p={[0, 2.04, 0]}
        r={0.58}
        h={0.62}
        mat="asphalt"
        rot={[Math.PI / 2, 0, 0]}
      />
      <Cyl p={[0, 0.84, 0]} r={0.62} h={0.6} />
      <Box p={[0, 1.21, 0]} s={[1.45, 0.16, 1.12]} mat="steel" />
      {Array.from({ length: 80 }, (_, i) => (
        <mesh
          key={i}
          position={[
            (random(i * 2) - 0.5) * 1.0,
            2.04 + (random(i * 2 + 1) - 0.5) * 0.85,
            0.323,
          ]}
          scale={[
            0.018 + random(i) * 0.03,
            0.018 + random(i + 1) * 0.027,
            0.009,
          ]}
          material={i % 4 === 0 ? mats.concrete : mats.dark}
        >
          <icosahedronGeometry args={[1, 0]} />
        </mesh>
      ))}
      <Box p={[1.8, 1.15, -0.25]} s={[0.65, 1.25, 1.05]} mat="navy" />
      <Cyl p={[1.8, 1.85, -0.05]} r={0.09} h={0.1} mat="gold" />
      <Cable
        points={[
          [1.8, 1.4, -0.7],
          [2.2, 1.8, -1.1],
          [1.6, 3.8, -0.8],
          [0.3, 3.9, -0.5],
        ]}
      />
      <group position={[-2.7, 1.14, 0.25]} rotation={[0, time * 0.12, 0]}>
        <Cyl r={1.0} h={0.14} mat="steel" />
        {[0, 1, 2].map((i) => (
          <group
            key={i}
            position={[
              Math.cos(i * 2.094) * 0.65,
              0.22,
              Math.sin(i * 2.094) * 0.65,
            ]}
          >
            <Cyl r={0.3} h={0.35} mat="asphalt" />
            <Ring p={[0, -0.08, 0]} r={0.31} tube={0.02} mat="steel" />
          </group>
        ))}
      </group>
      <Cyl p={[-2.7, 0.55, 0.25]} r={0.2} h={1.05} mat="navy" />
    </group>
  );
}
export function Oven() {
  return (
    <group>
      <Box p={[0, 1.6, 0]} s={[2, 3.1, 1.5]} mat="white" />
      <Box p={[0, 1.6, 0.78]} s={[1.7, 2.5, 0.08]} mat="navy" />
      <Box p={[0, 1.7, 0.84]} s={[1.3, 1.6, 0.035]} mat="glass" />
      <Box p={[0.63, 1.65, 0.92]} s={[0.07, 0.65, 0.09]} mat="steel" />
      {[0.5, 0.8, 1.1, 1.4].map((y) => (
        <Box key={y} p={[-0.4, y, 0.85]} s={[0.6, 0.018, 0.018]} mat="steel" />
      ))}
      <Cyl
        p={[0.5, 2.65, 0.9]}
        r={0.07}
        h={0.04}
        rot={[Math.PI / 2, 0, 0]}
        mat="gold"
      />
    </group>
  );
}
