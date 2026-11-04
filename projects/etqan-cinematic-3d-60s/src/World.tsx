import React, { useLayoutEffect, useMemo } from "react";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as T from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { AbsoluteFill, useCurrentFrame } from "remotion";

export const C = {
  navy: "#122746",
  gold: "#f6c514",
  steel: "#a7bccb",
  white: "#e0e9eb",
  black: "#07101e",
  cyan: "#91d9f3",
};
export const clamp = (v: number) => Math.min(1, Math.max(0, v));
export const ease = (v: number) => {
  v = clamp(v);
  return v * v * (3 - 2 * v);
};
export const mix = (a: number, b: number, t: number) => a + (b - a) * t;
export const random = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
const noise = new Uint8Array(128 * 128 * 4);
for (let i = 0; i < 128 * 128; i++) {
  const n = 130 + random(i) * 125;
  noise.set([n, n, n, 255], i * 4);
}
export const grain = new T.DataTexture(noise, 128, 128);
grain.needsUpdate = true;
grain.magFilter = T.LinearFilter;
grain.minFilter = T.LinearMipmapLinearFilter;
grain.generateMipmaps = true;
grain.wrapS = grain.wrapT = T.RepeatWrapping;
grain.repeat.set(4, 4);
export const mats = {
  navy: new T.MeshStandardMaterial({
    color: C.navy,
    metalness: 0.65,
    roughness: 0.29,
  }),
  gold: new T.MeshStandardMaterial({
    color: C.gold,
    metalness: 0.65,
    roughness: 0.25,
  }),
  steel: new T.MeshStandardMaterial({
    color: C.steel,
    metalness: 0.9,
    roughness: 0.24,
  }),
  white: new T.MeshStandardMaterial({
    color: C.white,
    metalness: 0.4,
    roughness: 0.3,
  }),
  dark: new T.MeshStandardMaterial({
    color: "#0a1018",
    metalness: 0.35,
    roughness: 0.5,
  }),
  rubber: new T.MeshStandardMaterial({ color: "#0c1319", roughness: 0.88 }),
  concrete: new T.MeshStandardMaterial({
    color: "#b3b4ab",
    metalness: 0.03,
    roughness: 0.94,
    bumpMap: grain,
    bumpScale: 0.025,
    map: grain,
  }),
  soil: new T.MeshStandardMaterial({
    color: "#9b7150",
    roughness: 1,
    bumpMap: grain,
    bumpScale: 0.035,
    map: grain,
  }),
  asphalt: new T.MeshStandardMaterial({
    color: "#373e42",
    roughness: 0.9,
    bumpMap: grain,
    bumpScale: 0.035,
    map: grain,
  }),
  glass: new T.MeshPhysicalMaterial({
    color: "#a4dae7",
    metalness: 0.1,
    roughness: 0.11,
    transparent: true,
    opacity: 0.25,
    side: T.DoubleSide,
  }),
  glow: new T.MeshBasicMaterial({ color: "#b1e5ff", toneMapped: false }),
  goldglow: new T.MeshBasicMaterial({ color: "#ffd85e", toneMapped: false }),
};
export type Mat = keyof typeof mats;
export const Box = ({
  p = [0, 0, 0],
  s = [1, 1, 1],
  mat = "navy",
  rot = [0, 0, 0],
  ...rest
}: {
  p?: number[];
  s?: number[];
  mat?: Mat;
  rot?: number[];
  [key: string]: any;
}) => {
  const g = useMemo(
    () =>
      Math.min(...s) > 0.12
        ? new RoundedBoxGeometry(
            s[0],
            s[1],
            s[2],
            2,
            Math.min(0.035, Math.min(...s) * 0.12),
          )
        : new T.BoxGeometry(s[0], s[1], s[2]),
    [...s],
  );
  return (
    <mesh
      position={p as any}
      rotation={rot as any}
      geometry={g}
      material={mats[mat]}
      castShadow
      receiveShadow
      {...rest}
    />
  );
};
export const Cyl = ({
  p = [0, 0, 0],
  r = 0.1,
  h = 1,
  mat = "steel",
  rot = [0, 0, 0],
  segments = 48,
}: {
  p?: number[];
  r?: number;
  h?: number;
  mat?: Mat;
  rot?: number[];
  segments?: number;
}) => (
  <mesh
    position={p as any}
    rotation={rot as any}
    material={mats[mat]}
    castShadow
    receiveShadow
  >
    <cylinderGeometry args={[r, r, h, segments]} />
  </mesh>
);
export const Ring = ({
  p = [0, 0, 0],
  r = 1,
  tube = 0.018,
  mat = "goldglow",
  rot = [-Math.PI / 2, 0, 0],
}: {
  p?: number[];
  r?: number;
  tube?: number;
  mat?: Mat;
  rot?: number[];
}) => (
  <mesh position={p as any} rotation={rot as any} material={mats[mat]}>
    <torusGeometry args={[r, tube, 8, 96]} />
  </mesh>
);
export const Bolt = ({ p = [0, 0, 0] }: { p?: number[] }) => (
  <Cyl p={p} r={0.065} h={0.055} mat="steel" segments={6} />
);
export const Cable = ({
  points,
  r = 0.018,
  color = "#111923",
}: {
  points: number[][];
  r?: number;
  color?: string;
}) => {
  const geo = useMemo(
    () =>
      new T.TubeGeometry(
        new T.CatmullRomCurve3(
          points.map((p) => new T.Vector3(...(p as [number, number, number]))),
        ),
        32,
        r,
        8,
        false,
      ),
    [JSON.stringify(points)],
  );
  return (
    <mesh geometry={geo}>
      <meshStandardMaterial color={color} roughness={0.55} />
    </mesh>
  );
};
function Lighting() {
  const { scene } = useThree();
  const env = useMemo(() => {
    const w = 256,
      h = 128,
      d = new Uint8Array(w * h * 4);
    for (let y = 0; y < h; y++)
      for (let x = 0; x < w; x++) {
        let b = 12;
        const boxes = [
          [42, 27, 20, 32],
          [180, 40, 24, 38],
          [115, 20, 55, 6],
          [225, 50, 9, 45],
        ];
        for (const [cx, cy, sx, sy] of boxes) {
          const dist = Math.max(Math.abs(x - cx) / sx, Math.abs(y - cy) / sy);
          b += Math.max(0, 1 - dist) * 220;
        }
        const idx = (y * w + x) * 4;
        d.set(
          [
            Math.min(255, b * 0.91),
            Math.min(255, b),
            Math.min(255, b * 1.08),
            255,
          ],
          idx,
        );
      }
    const tex = new T.DataTexture(d, w, h);
    tex.mapping = T.EquirectangularReflectionMapping;
    tex.needsUpdate = true;
    tex.colorSpace = T.SRGBColorSpace;
    return tex;
  }, []);
  useLayoutEffect(() => {
    scene.environment = env;
    return () => {
      scene.environment = null;
    };
  }, [env, scene]);
  return (
    <>
      <ambientLight intensity={0.38} />
      <hemisphereLight color="#bbdfff" groundColor="#1c1820" intensity={1.2} />
      <directionalLight
        position={[4, 8, 7]}
        intensity={3.5}
        color="#e8f2ff"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={10}
        shadow-camera-bottom={-6}
        shadow-bias={-0.0006}
      />
      <pointLight
        position={[-4, 4, 0]}
        color="#ffc65a"
        intensity={85}
        distance={18}
      />
      <pointLight
        position={[3, 4, -4]}
        color="#52b6ef"
        intensity={110}
        distance={18}
      />
      <pointLight
        position={[-1, 7, 3]}
        color="#ffffff"
        intensity={45}
        distance={14}
      />
    </>
  );
}
export function Camera({
  position,
  target,
  fov = 38,
}: {
  position: number[];
  target: number[];
  fov?: number;
}) {
  const { camera } = useThree();
  useLayoutEffect(() => {
    camera.position.set(...(position as [number, number, number]));
    camera.lookAt(...(target as [number, number, number]));
    (camera as T.PerspectiveCamera).fov = fov;
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld();
  }, [camera, ...position, ...target, fov]);
  return null;
}
export const Canvas = ({
  children,
  space = false,
}: {
  children: React.ReactNode;
  space?: boolean;
}) => (
  <ThreeCanvas
    width={1080}
    height={1920}
    shadows
    camera={{ fov: 38, near: 0.1, far: 200, position: [7, 5, 10] }}
    gl={{
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
      toneMapping: T.ACESFilmicToneMapping,
      toneMappingExposure: 1.05,
    }}
  >
    <color attach="background" args={[space ? "#030812" : "#07111e"]} />
    {!space && <fog attach="fog" args={["#07111e", 17, 47]} />}
    {space ? (
      <>
        <ambientLight intensity={0.35} />
        <directionalLight
          position={[-8, 6, 8]}
          intensity={2.0}
          color="#b6dafa"
        />
      </>
    ) : (
      <Lighting />
    )}
    {children}
  </ThreeCanvas>
);
export const Finish = () => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      background:
        "radial-gradient(ellipse at 50% 40%,transparent 35%,rgba(0,4,14,.5) 100%)",
      boxShadow: "inset 0 0 130px rgba(0,0,0,.3)",
    }}
  />
);
export function Dust({
  time = 0,
  space = false,
}: {
  time?: number;
  space?: boolean;
}) {
  const positions = useMemo(() => {
    const a = [];
    for (let i = 0; i < 180; i++) {
      a.push(
        (random(i * 3) - 0.5) * 30,
        (random(i * 3 + 1) - 0.4) * 20,
        (random(i * 3 + 2) - 0.5) * 25,
      );
    }
    return new Float32Array(a);
  }, []);
  return (
    <points
      rotation={[0, time * 0.012, 0]}
      position={[0, Math.sin(time * 0.2) * 0.12, 0]}
    >
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={space ? "#c6e6ff" : "#e6cfa1"}
        size={space ? 0.025 : 0.012}
        transparent
        opacity={space ? 0.65 : 0.35}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}
export function Stage() {
  return (
    <>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
        position={[0, -0.015, 0]}
      >
        <planeGeometry args={[120, 120]} />
        <meshStandardMaterial
          color="#0b1728"
          metalness={0.5}
          roughness={0.32}
        />
      </mesh>
      {[-8, -4, 0, 4, 8].map((x) => (
        <Box key={x} p={[x, 0.001, -1]} s={[0.012, 0.003, 28]} mat="dark" />
      ))}
      <Box p={[0, 0, -8]} s={[22, 14, 0.25]} mat="dark" />
      {[-7, -3, 3, 7].map((x) => (
        <group key={x}>
          <Box p={[x, 4, -7.7]} s={[0.07, 8, 0.08]} mat="glow" />
          <Box p={[x + 0.12, 4, -7.7]} s={[0.04, 8, 0.08]} mat="navy" />
        </group>
      ))}
      {[-3.5, 0, 3.5].map((x) => (
        <group key={x}>
          <Box p={[x, 7, -1]} s={[0.14, 0.06, 12]} mat="glow" />
          <Box p={[x, 7.13, -1]} s={[0.3, 0.2, 12]} mat="navy" />
        </group>
      ))}
    </>
  );
}
