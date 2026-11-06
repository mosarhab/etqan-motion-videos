import { useSceneTime } from "../World";
import React, { useLayoutEffect, useMemo, useRef } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import * as T from "three";
import {
  Canvas,
  Camera,
  Dust,
  Finish,
  Box,
  Cyl,
  Trace,
  View,
  V3,
  smooth,
  lerp3,
  rand,
} from "../World";
import { surface } from "../Surfaces";
import { Fonts, Footer } from "../Type";

/** Connected construction section: bearing soil, footings and a layered road.
 * Front-left earth is cut away to reveal the foundations. Illustrative geometry,
 * not a calibrated engineering design or a claim about a measured test result.
 */
function Ground() {
  const strata = useMemo(
    () =>
      ["#aa967d", "#d1bb95", "#b6a481"].map((color) => {
        const m = surface("soil").clone();
        m.color.set(color);
        return m;
      }),
    [],
  );
  return (
    <group>
      <Box p={[0, 0.26, 0]} s={[5.8, 0.52, 3.6]} mat={strata[0]} />
      <Box p={[0, 0.57, 0]} s={[5.8, 0.1, 3.6]} mat={strata[1]} />
      <Box p={[1.45, 1.11, 0]} s={[2.9, 0.98, 3.6]} mat={strata[2]} />
      <Box p={[-1.45, 1.11, -1.06]} s={[2.9, 0.98, 1.48]} mat={strata[2]} />
      <Box p={[-2.77, 1.11, 0.74]} s={[0.26, 0.98, 2.12]} mat={strata[2]} />
      <AggregateFace />
    </group>
  );
}
function AggregateFace() {
  const ref = useRef<T.InstancedMesh>(null);
  useLayoutEffect(() => {
    if (!ref.current) return;
    const o = new T.Object3D(),
      color = new T.Color();
    for (let i = 0; i < 420; i++) {
      const x = (rand(i * 7 + 400) - 0.5) * 5.7;
      const top = x > 0.03 || x < -2.66 ? 1.57 : 0.57;
      const y = 0.04 + rand(i * 7 + 401) * (top - 0.08);
      o.position.set(x, y, 1.804);
      o.rotation.set(
        rand(i * 7 + 402) * 3,
        rand(i * 7 + 403) * 3,
        rand(i * 7 + 404) * 3,
      );
      const r = 0.009 + Math.pow(rand(i * 7 + 405), 3) * 0.04;
      o.scale.set(r, r * 0.7, r * 0.4);
      o.updateMatrix();
      ref.current.setMatrixAt(i, o.matrix);
      color.set(["#d0bea0", "#938a78", "#e8d4ab", "#6c6253"][i % 4]);
      ref.current.setColorAt(i, color);
    }
    ref.current.instanceMatrix.needsUpdate = true;
    if (ref.current.instanceColor) ref.current.instanceColor.needsUpdate = true;
  }, []);
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, 420]} castShadow>
      <icosahedronGeometry args={[1, 0]} />
      <meshStandardMaterial roughness={0.95} />
    </instancedMesh>
  );
}
function Foundations() {
  const concrete = useMemo(() => surface("concrete"), []);
  const steel = useMemo(
    () =>
      new T.MeshStandardMaterial({
        color: "#6e7b82",
        metalness: 0.8,
        roughness: 0.4,
      }),
    [],
  );
  const columns: V3[] = [
    [-2.08, 0, -0.88],
    [-0.68, 0, -0.88],
    [-2.08, 0, 0.68],
    [-0.68, 0, 0.68],
  ];
  return (
    <group>
      {columns.map(([x, , z], i) => (
        <group key={i}>
          <Box p={[x, 0.77, z]} s={[1.0, 0.3, 1.04]} mat={concrete} />
          <Box p={[x, 1.06, z]} s={[0.46, 0.28, 0.46]} mat={concrete} />
          <Box p={[x, 2.33, z]} s={[0.27, 2.26, 0.27]} mat={concrete} />
          {[-0.09, 0.09].map((q) => (
            <Cyl
              key={q}
              p={[x + q, 3.62, z - 0.065]}
              r={0.012}
              h={0.35}
              mat={steel}
            />
          ))}
        </group>
      ))}
      <Box p={[-1.38, 3.56, -0.88]} s={[1.92, 0.22, 0.31]} mat={concrete} />
      <Box p={[-1.38, 3.56, 0.68]} s={[1.92, 0.22, 0.31]} mat={concrete} />
      <Box p={[-2.08, 3.56, -0.1]} s={[0.31, 0.22, 1.88]} mat={concrete} />
      <Box p={[-0.68, 3.56, -0.1]} s={[0.31, 0.22, 1.88]} mat={concrete} />
      <Box p={[-1.38, 3.73, -0.1]} s={[2.18, 0.14, 2.28]} mat={concrete} />
    </group>
  );
}
function Road() {
  const materials = useMemo(() => {
    const base = surface("soil").clone();
    base.color.set("#d8c9a8");
    const gravel = surface("concrete").clone();
    gravel.color.set("#a3a395");
    const binder = surface("asphalt").clone();
    binder.color.set("#666d70");
    const wearing = surface("asphalt").clone();
    wearing.color.set("#b4b9b6");
    const line = new T.MeshStandardMaterial({
      color: "#e7e5cd",
      roughness: 0.76,
    });
    const kerb = surface("concrete").clone();
    kerb.color.set("#dedbd1");
    return { base, gravel, binder, wearing, line, kerb };
  }, []);
  return (
    <group>
      <Box p={[1.51, 1.68, 0]} s={[2.66, 0.16, 3.6]} mat={materials.base} />
      <Box p={[1.51, 1.83, 0]} s={[2.66, 0.14, 3.6]} mat={materials.gravel} />
      <Box p={[1.51, 1.95, 0]} s={[2.66, 0.1, 3.6]} mat={materials.binder} />
      <Box p={[1.51, 2.035, 0]} s={[2.66, 0.07, 3.6]} mat={materials.wearing} />
      <Box p={[0.2, 2.08, 0]} s={[0.13, 0.17, 3.6]} mat={materials.kerb} />
      <Box p={[2.82, 2.08, 0]} s={[0.13, 0.17, 3.6]} mat={materials.kerb} />
      {[-1.4, -0.5, 0.4, 1.3].map((z) => (
        <Box
          key={z}
          p={[1.51, 2.075, z]}
          s={[0.055, 0.006, 0.46]}
          mat={materials.line}
        />
      ))}
      <Box p={[0.4, 2.075, 0]} s={[0.025, 0.006, 3.45]} mat={materials.line} />
      <Box p={[2.61, 2.075, 0]} s={[0.025, 0.006, 3.45]} mat={materials.line} />
    </group>
  );
}
export function Overview({ duration = 3.5 }: { duration?: number }) {
  const { fps } = useVideoConfig();
  const t = useSceneTime(duration, 3.5);
  const view: View = {
    position: lerp3([7.5, 6.2, 14.0], [8.1, 6.6, 15.0], smooth(t / 3.5)),
    target: [-0.05, 1.82, 0],
    fov: 38,
  };
  return (
    <AbsoluteFill>
      <Fonts />
      <Canvas>
        <Camera view={view} />
        <Ground />
        <Foundations />
        <Road />
        <Trace
          t={t * 1.65 + 0.55}
          width={0.012}
          points={[
            [-2.79, 0.28, 1.82],
            [-2.32, 0.58, 1.82],
            [-2.08, 0.94, 0.84],
            [-2.08, 2.2, 0.84],
            [-2.08, 3.56, 0.84],
            [-1.25, 3.82, 0.92],
            [-0.22, 3.2, 0.92],
            [0.55, 2.12, 1.2],
            [1.9, 2.12, 1.2],
            [2.48, 2.12, -0.85],
          ]}
        />
        <Dust t={t} />
      </Canvas>
      <Finish />
      <Footer text="نتائج تدعم القرار الهندسي" t={t} start={0.12} end={3.9} />
    </AbsoluteFill>
  );
}
