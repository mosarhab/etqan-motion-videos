import { useSceneTime } from "../World";
import React, { useMemo, useLayoutEffect, useRef } from "react";
import * as T from "three";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import {
  Canvas,
  Camera,
  Dust,
  Finish,
  Cyl,
  Box,
  Path,
  View,
  smooth,
  lerp3,
  rand,
  metal,
  navy,
  gold,
  dark,
} from "../World";
import { surface } from "../Surfaces";
import { Fonts, Callout } from "../Type";

function Sleeve({
  bottom,
  height,
  outer,
  inner,
}: {
  bottom: number;
  height: number;
  outer: number;
  inner: number;
}) {
  const geometry = useMemo(
    () =>
      new T.LatheGeometry(
        [
          new T.Vector2(inner, 0),
          new T.Vector2(outer, 0),
          new T.Vector2(outer, height),
          new T.Vector2(inner, height),
          new T.Vector2(inner, 0),
        ],
        96,
        Math.PI / 3,
        (Math.PI * 4) / 3,
      ),
    [height, outer, inner],
  );
  return (
    <mesh
      position={[0, bottom, 0]}
      geometry={geometry}
      material={metal}
      castShadow
      receiveShadow
    />
  );
}
function SoilFill({ height }: { height: number }) {
  const mat = useMemo(() => {
    const m = surface("soil").clone();
    m.color.set("#c0a578");
    return m;
  }, []);
  const ref = useRef<T.InstancedMesh>(null);
  useLayoutEffect(() => {
    if (!ref.current) return;
    const o = new T.Object3D(),
      c = new T.Color();
    for (let i = 0; i < 240; i++) {
      const angle = (rand(i * 4) - 0.5) * Math.PI * 0.65,
        y = rand(i * 4 + 1) * height;
      o.position.set(
        Math.sin(angle) * 0.602,
        1.27 + y,
        Math.cos(angle) * 0.602,
      );
      const r = 0.005 + rand(i * 4 + 2) * 0.012;
      o.scale.set(r, r * 0.65, r);
      o.rotation.set(i, i * 0.3, i * 0.7);
      o.updateMatrix();
      ref.current.setMatrixAt(i, o.matrix);
      c.set(["#a58c64", "#86734e", "#c3ae83", "#9b805a"][i % 4]);
      ref.current.setColorAt(i, c);
    }
    ref.current.instanceMatrix.needsUpdate = true;
    if (ref.current.instanceColor) ref.current.instanceColor.needsUpdate = true;
  }, [height]);
  return (
    <>
      <mesh
        position={[0, 1.27 + height / 2, 0]}
        material={mat}
        castShadow
        receiveShadow
      >
        <cylinderGeometry args={[0.601, 0.601, height, 96, 18]} />
      </mesh>
      <instancedMesh ref={ref} args={[undefined, undefined, 240]}>
        <icosahedronGeometry args={[1, 0]} />
        <meshStandardMaterial roughness={0.95} />
      </instancedMesh>
    </>
  );
}
/** Two guided lift/drop cycles into a sectioned Proctor mould.
 * Cutaway and settling illustrate the process, not a calibrated result or an operating guide. */
export function SoilProctor({ duration = 3.5 }: { duration?: number }) {
  const { fps } = useVideoConfig(),
    t = useCurrentFrame() / fps;
  const cycle = (time: number) => {
    if (time < 0 || time > 1.15) return 0;
    if (time < 0.67) return smooth(time / 0.67) * 1.03;
    if (time < 0.9) {
      const q = (time - 0.67) / 0.23;
      return 1.03 * (1 - q * q);
    }
    return 0;
  };
  const lift = cycle(t - 0.35) + cycle(t - 1.6);
  const compact =
    0.035 * smooth((t - 1.22) / 0.2) + 0.035 * smooth((t - 2.47) / 0.2);
  const view: View = {
    position: lerp3([4.2, 4.4, 10.5], [3.2, 4.1, 9.8], smooth(t / 3.5)),
    target: [0, 2.75, 0],
    fov: 39,
  };
  return (
    <AbsoluteFill>
      <Fonts />
      <Canvas>
        <Camera view={view} />
        <Box p={[0, 1.1, 0]} s={[2.35, 0.17, 2.15]} mat={navy} />
        <Box p={[0, 1.196, 0]} s={[2.28, 0.025, 2.08]} mat={gold} />
        <Cyl p={[0, 1.25, 0]} r={0.89} h={0.085} />
        <Sleeve bottom={1.29} height={1.22} outer={0.675} inner={0.615} />
        <Sleeve bottom={2.51} height={0.43} outer={0.69} inner={0.62} />
        <Sleeve bottom={2.5} height={0.035} outer={0.708} inner={0.613} />
        <SoilFill height={1.09 - compact} />
        {[0, 1, 2, 3].map((i) => {
          const angle = (i * Math.PI) / 2 + Math.PI / 4,
            x = Math.sin(angle) * 0.82,
            z = Math.cos(angle) * 0.82;
          return (
            <group key={i}>
              <Cyl p={[x, 1.4, z]} r={0.038} h={0.27} />
              <Cyl p={[x, 1.54, z]} r={0.075} h={0.04} mat={dark} />
              <Box p={[x, 1.565, z]} s={[0.2, 0.025, 0.035]} mat={metal} />
            </group>
          );
        })}
        <group position={[0.06, 2.68 + lift - compact, 0]}>
          <Cyl p={[0, -0.28, 0]} r={0.25} h={0.12} />
          <Cyl r={0.218} h={0.48} />
          <Cyl p={[0, 0.26, 0]} r={0.224} h={0.045} mat={gold} />
          <Cyl p={[0, 0.92, 0]} r={0.034} h={1.28} />
          <Cyl p={[0, 1.58, 0]} r={0.076} h={0.1} mat={navy} />
          <Box p={[0, 1.65, 0]} s={[0.48, 0.07, 0.09]} mat={dark} />
        </group>
        <Path
          points={[
            [-1.04, 1.02, 1.1],
            [0, 1.02, 1.13],
            [1.04, 1.02, 1.1],
          ]}
          width={0.008}
        />
        <Dust t={t} />
      </Canvas>
      <Finish />
      <Callout
        text="اختبار البروكتور"
        point={[0.06, 2.4 + lift - compact, 0.14]}
        view={view}
        t={t}
        start={0.25}
        end={3.85}
        x={65}
        y={420}
        width={500}
      />
    </AbsoluteFill>
  );
}
