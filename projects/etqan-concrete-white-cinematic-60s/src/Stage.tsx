import React, { useMemo, useLayoutEffect } from "react";
import * as T from "three";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import {
  EffectComposer,
  SSAO,
  DepthOfField,
  ToneMapping,
} from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { shot, smooth, mix, View } from "./Math";
import { rand, concrete, steel } from "./Materials";
import { Box } from "./Parts";
import { SlumpStation, Cone } from "./Slump";
import { Preparation } from "./Preparation";
import { Curing } from "./Curing";
import { Compression } from "./Compression";
function CameraRig({ view }: { view: View }) {
  const { camera } = useThree();
  useLayoutEffect(() => {
    camera.position.set(...view.position);
    camera.lookAt(...view.target);
    (camera as T.PerspectiveCamera).fov = view.fov;
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld();
  }, [camera, ...view.position, ...view.target, view.fov]);
  return null;
}
function Environment({ t }: { t: number }) {
  const { scene, gl } = useThree();
  const env = useMemo(() => {
    const w = 512,
      h = 256,
      p = new Float32Array(w * h * 4);
    for (let y = 0; y < h; y++)
      for (let x = 0; x < w; x++) {
        let value = 0.3 + 0.25 * Math.max(0, 1 - y / h);
        for (const [cx, cy, sx, sy, power] of [
          [90, 73, 46, 51, 3.6],
          [340, 78, 65, 64, 4.3],
          [221, 29, 110, 16, 2.4],
        ])
          value +=
            Math.exp(-Math.pow((x - cx) / sx, 8) - Math.pow((y - cy) / sy, 8)) *
            power;
        p.set([value * 0.99, value, value * 1.015, 1], (y * w + x) * 4);
      }
    const tx = new T.DataTexture(p, w, h, T.RGBAFormat, T.FloatType);
    tx.mapping = T.EquirectangularReflectionMapping;
    tx.needsUpdate = true;
    const pmrem = new T.PMREMGenerator(gl);
    const out = pmrem.fromEquirectangular(tx).texture;
    pmrem.dispose();
    tx.dispose();
    return out;
  }, [gl]);
  useLayoutEffect(() => {
    scene.environment = env;
    scene.environmentIntensity = 0.09 + 0.6 * smooth((t - 2.4) / 3.4);
    return () => {
      scene.environment = null;
    };
  }, [scene, env, t]);
  return null;
}
function Lighting({ t, view }: { t: number; view: View }) {
  const white = smooth((t - 2.4) / 3.4),
    { scene } = useThree(),
    target = useMemo(() => new T.Object3D(), []);
  const cx = Math.round(view.target[0] / 0.01) * 0.01;
  useLayoutEffect(() => {
    target.position.set(cx, 0, 0);
    target.updateMatrixWorld();
    scene.background = new T.Color("#0b1624").lerp(
      new T.Color("#f5f7f7"),
      white,
    );
    scene.fog = new T.Fog(
      new T.Color("#0b1624").lerp(new T.Color("#f5f7f7"), white),
      40,
      95,
    );
  }, [target, cx, white, scene]);
  return (
    <>
      <primitive object={target} />
      <ambientLight intensity={0.04 + 0.18 * white} />
      <hemisphereLight
        color="#f6f8ff"
        groundColor="#a3aaad"
        intensity={0.12 + 0.52 * white}
      />
      <directionalLight
        position={[cx - 6, 11, 8]}
        target={target}
        intensity={0.85 + white * 1.55}
        color="#fff8ee"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        shadow-camera-near={0.5}
        shadow-camera-far={40}
        shadow-bias={-0.00035}
        shadow-normalBias={0.025}
        shadow-radius={3.5}
        shadow-blurSamples={8}
      />
      <directionalLight
        position={[cx + 5, 7, -5]}
        target={target}
        intensity={0.45 + 0.45 * white}
        color="#e5edf3"
      />
    </>
  );
}
function Floor({ t }: { t: number }) {
  const mat = useMemo(
    () =>
      new T.MeshStandardMaterial({
        color: "#ebefef",
        roughness: 0.64,
        metalness: 0.04,
      }),
    [],
  );
  useLayoutEffect(() => {
    mat.color
      .set("#171e27")
      .lerp(new T.Color("#edf0f0"), smooth((t - 2.4) / 3.4));
  }, [mat, t]);
  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[15, -0.015, 0]}
      material={mat}
      receiveShadow
    >
      <planeGeometry args={[160, 160]} />
    </mesh>
  );
}
export function Stage() {
  const { fps } = useVideoConfig(),
    t = useCurrentFrame() / fps,
    view = shot(t);
  return (
    <ThreeCanvas
      width={1920}
      height={1080}
      dpr={1}
      shadows="soft"
      camera={{ position: view.position, fov: view.fov, near: 0.045, far: 110 }}
      gl={{
        antialias: true,
        alpha: false,
        toneMapping: T.ACESFilmicToneMapping,
        toneMappingExposure: 1.05,
        localClippingEnabled: true,
      }}
    >
      <CameraRig view={view} />
      <Lighting t={t} view={view} />
      <Environment t={t} />
      <Floor t={t} />
      {
        <Box
          p={[-3.5, 0.8, 2.5]}
          s={[2.6, 1.6, 1.4]}
          mat={concrete(false, true)}
          r={0.035}
        />
      }
      <SlumpStation t={Math.min(t, 17)} />
      {
        <group position={[8, 0, 0]}>
          <Preparation t={Math.max(17, Math.min(t, 26.5))} />
        </group>
      }
      {
        <group position={[17, 0, 0]}>
          <Curing t={Math.max(27, Math.min(t, 36.5))} />
        </group>
      }
      {
        <group position={[26, 0, 0]}>
          <Compression t={Math.max(37, Math.min(t, 50))} />
        </group>
      }
      {
        <group>
          <group position={[22.0, 0, 1.1]} rotation={[0, 0.1, 0]}>
            <SlumpStation t={60} hero />
          </group>
          {[0, 1, 2].map((i) => (
            <Box
              key={i}
              p={[
                23.6 + (i % 2) * 1.6,
                0.75 + i * 0.01,
                2.3 - Math.floor(i / 2) * 1.6,
              ]}
              s={[1.5, 1.5, 1.5]}
              mat={concrete(false)}
              r={0.022}
            />
          ))}
        </group>
      }
      <EffectComposer multisampling={0} enableNormalPass resolutionScale={0.5}>
        <SSAO
          samples={12}
          rings={3}
          radius={0.14}
          intensity={1.2}
          luminanceInfluence={0.5}
          bias={0.025}
        />
        <DepthOfField
          target={view.target}
          worldFocusRange={t < 3 ? 0.2 : t > 41 && t < 48 ? 1.8 : 5.8}
          bokehScale={t < 3 ? 2.4 : 0.6}
          height={540}
        />
        <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      </EffectComposer>
    </ThreeCanvas>
  );
}
