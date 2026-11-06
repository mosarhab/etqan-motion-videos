import React, { useMemo, useLayoutEffect } from "react";
import * as T from "three";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
export type V3 = [number, number, number];
export type View = {
  position: V3;
  target: V3;
  fov?: number;
  fullFrame?: boolean;
};
/** The same viewport is used by the 3D camera and its projected callout anchors. */
export const TEST_STAGE = { top: 260, height: 1550 };
export const C = {
  navy: "#07182b",
  gold: "#f5c532",
  cream: "#f4ead3",
  blue: "#7fc9ec",
};
export const rand = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
export const clamp = (v: number) => Math.min(1, Math.max(0, v));
export const smooth = (v: number) => {
  v = clamp(v);
  return v * v * (3 - 2 * v);
};
export const mix = (a: number, b: number, t: number) => a + (b - a) * t;
export const lerp3 = (a: V3, b: V3, t: number) =>
  a.map((v, i) => mix(v, b[i], t)) as V3;
export function project(point: V3, view: View) {
  const h = view.fullFrame ? 1920 : TEST_STAGE.height;
  const top = view.fullFrame ? 0 : TEST_STAGE.top;
  const cam = new T.PerspectiveCamera(view.fov || 38, 1080 / h, 0.1, 200);
  cam.position.set(...view.position);
  cam.lookAt(...view.target);
  cam.updateMatrixWorld();
  const v = new T.Vector3(...point).project(cam);
  return [(v.x + 1) * 540, top + ((1 - v.y) * h) / 2] as [number, number];
}
export function worldPoint(p: V3, position: V3, rotation: V3, scale = 1): V3 {
  const q = new T.Quaternion().setFromEuler(new T.Euler(...rotation));
  const m = new T.Matrix4().compose(
    new T.Vector3(...position),
    q,
    new T.Vector3(scale, scale, scale),
  );
  return new T.Vector3(...p).applyMatrix4(m).toArray() as V3;
}
export function Camera({ view }: { view: View }) {
  const { camera } = useThree();
  useLayoutEffect(() => {
    camera.position.set(...view.position);
    camera.lookAt(...view.target);
    (camera as T.PerspectiveCamera).fov = view.fov || 38;
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld();
  }, [camera, ...view.position, ...view.target, view.fov]);
  return null;
}
function Environment() {
  const { scene } = useThree();
  const texture = useMemo(() => {
    const w = 256,
      h = 128,
      d = new Float32Array(w * h * 4);
    for (let y = 0; y < h; y++)
      for (let x = 0; x < w; x++) {
        let r = 0.018,
          g = 0.029,
          b = 0.045;
        for (const [cx, cy, sx, sy, intensity, warm] of [
          [36, 37, 15, 36, 3.6, 1],
          [173, 35, 12, 44, 3.9, 0],
          [106, 17, 47, 8, 2.2, 0.5],
          [232, 48, 9, 36, 1.7, 0],
        ]) {
          const n =
            Math.pow(
              Math.max(
                0,
                1 - Math.max(Math.abs(x - cx) / sx, Math.abs(y - cy) / sy),
              ),
              0.55,
            ) * intensity;
          r += n * (warm ? 0.98 : 0.68);
          g += n * (warm ? 0.8 : 0.85);
          b += n * (warm ? 0.5 : 1);
        }
        d.set([r, g, b, 1], (y * w + x) * 4);
      }
    const tex = new T.DataTexture(d, w, h, T.RGBAFormat, T.FloatType);
    tex.mapping = T.EquirectangularReflectionMapping;
    tex.needsUpdate = true;
    return tex;
  }, []);
  useLayoutEffect(() => {
    scene.environment = texture;
    scene.environmentIntensity = 0.6;
    return () => {
      scene.environment = null;
    };
  }, [scene, texture]);
  return null;
}
export function Canvas({
  children,
  space = false,
  fullFrame = false,
}: {
  children: React.ReactNode;
  space?: boolean;
  fullFrame?: boolean;
}) {
  const full = space || fullFrame;
  return (
    <AbsoluteFill style={{ background: "#061426" }}>
      <ThreeCanvas
        width={1080}
        height={full ? 1920 : TEST_STAGE.height}
        style={{ position: "absolute", top: full ? 0 : TEST_STAGE.top }}
        dpr={1}
        shadows
        camera={{ fov: 38, near: 0.1, far: 160, position: [6, 4, 11] }}
        gl={{
          antialias: true,
          alpha: false,
          localClippingEnabled: true,
          toneMapping: T.ACESFilmicToneMapping,
          toneMappingExposure: 1.05,
        }}
      >
        <color attach="background" args={["#061426"]} />
        <fog attach="fog" args={["#061426", 24, 60]} />
        <Environment />
        <ambientLight intensity={space ? 0.22 : 0.28} />
        <hemisphereLight
          color="#c6dce9"
          groundColor="#20180e"
          intensity={space ? 0.2 : 0.5}
        />
        <directionalLight
          position={[-4, 7, 5]}
          color="#fff0d8"
          intensity={space ? 2 : 2.65}
          castShadow={!space}
          shadow-mapSize={[1024, 1024]}
          shadow-camera-left={-5}
          shadow-camera-right={5}
          shadow-camera-top={8}
          shadow-camera-bottom={-4}
          shadow-bias={-0.0004}
        />
        <pointLight
          position={[5, 4, -2]}
          color="#6fc5ff"
          intensity={140}
          distance={18}
        />
        <pointLight
          position={[-4, 2, 3]}
          color="#ffc75c"
          intensity={14}
          distance={16}
        />
        {children}
      </ThreeCanvas>
    </AbsoluteFill>
  );
}
export const Finish = () => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      background:
        "radial-gradient(ellipse at 50% 45%,transparent 38%,rgba(0,5,16,.45) 100%)",
      boxShadow: "inset 0 0 130px #02091355",
    }}
  />
);
export const metal = new T.MeshStandardMaterial({
  color: "#aebbc4",
  metalness: 0.92,
  roughness: 0.24,
});
export const navy = new T.MeshStandardMaterial({
  color: "#173251",
  metalness: 0.6,
  roughness: 0.31,
});
export const gold = new T.MeshStandardMaterial({
  color: "#e8bb29",
  metalness: 0.65,
  roughness: 0.28,
});
export const ivory = new T.MeshStandardMaterial({
  color: "#e9dfbe",
  metalness: 0.2,
  roughness: 0.43,
});
export const dark = new T.MeshStandardMaterial({
  color: "#0b111a",
  metalness: 0.4,
  roughness: 0.52,
});
export const glow = new T.MeshBasicMaterial({
  color: "#ffd263",
  toneMapped: false,
});
export const glass = new T.MeshPhysicalMaterial({
  color: "#76acbb",
  metalness: 0.15,
  roughness: 0.14,
  transparent: true,
  opacity: 0.35,
});
export function Box({
  p = [0, 0, 0],
  s = [1, 1, 1],
  mat = navy,
  rot = [0, 0, 0],
}: {
  p?: V3;
  s?: V3;
  mat?: T.Material;
  rot?: V3;
}) {
  const geo = useMemo(
    () =>
      new RoundedBoxGeometry(...s, 2, Math.min(0.04, Math.min(...s) * 0.19)),
    [...s],
  );
  return (
    <mesh
      geometry={geo}
      position={p}
      rotation={rot}
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
  mat = metal,
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
export function Path({
  points,
  width = 0.012,
  mat = glow,
}: {
  points: V3[];
  width?: number;
  mat?: T.Material;
}) {
  const geo = useMemo(
    () =>
      new T.TubeGeometry(
        new T.CatmullRomCurve3(points.map((v) => new T.Vector3(...v))),
        80,
        width,
        8,
        false,
      ),
    [JSON.stringify(points), width],
  );
  return <mesh geometry={geo} material={mat} />;
}
export function Dust({ t = 0 }: { t?: number }) {
  const a = useMemo(() => {
    const d = [];
    for (let i = 0; i < 190; i++)
      d.push(
        (rand(i * 3) - 0.5) * 24,
        (rand(i * 3 + 1) - 0.15) * 17,
        (rand(i * 3 + 2) - 0.5) * 24,
      );
    return new Float32Array(d);
  }, []);
  return (
    <points
      rotation={[0, t * 0.01, 0]}
      position={[0, Math.sin(t * 0.3) * 0.12, 0]}
    >
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[a, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.012}
        color="#d1bd8a"
        transparent
        opacity={0.3}
        depthWrite={false}
      />
    </points>
  );
}

export function Trace({
  points,
  t,
  width = 0.009,
}: {
  points: V3[];
  t: number;
  width?: number;
}) {
  const curve = useMemo(
    () => new T.CatmullRomCurve3(points.map((p) => new T.Vector3(...p))),
    [JSON.stringify(points)],
  );
  const geo = useMemo(
    () => new T.TubeGeometry(curve, 100, width, 8, false),
    [curve, width],
  );
  const p = smooth((t - 0.65) / 4.1),
    head = curve.getPointAt(p);
  useLayoutEffect(() => {
    geo.setDrawRange(0, Math.floor((geo.index!.count * p) / 48) * 48);
  }, [geo, p]);
  return (
    <group>
      <mesh geometry={geo} material={glow} />
      {p > 0 && (
        <mesh position={head} material={glow}>
          <sphereGeometry args={[0.022, 20, 12]} />
        </mesh>
      )}
    </group>
  );
}

export function useSceneTime(duration: number, originalDuration: number) {
  const { fps } = useVideoConfig();
  return ((useCurrentFrame() / fps) * originalDuration) / duration;
}
