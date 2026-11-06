import React, { useMemo, useLayoutEffect, useRef } from "react";
import * as T from "three";
import { V3, rand, smooth, Path, Trace, glow, worldPoint } from "./World";
import { surface, monolith, Kind, noise } from "./Surfaces";
const pebble = new T.IcosahedronGeometry(1, 0);
export function EmbeddedGrains({
  kind = "soil",
  count = 800,
  t = 6,
}: {
  kind?: Kind;
  count?: number;
  t?: number;
}) {
  const ref = useRef<T.InstancedMesh>(null);
  useLayoutEffect(() => {
    if (!ref.current) return;
    const o = new T.Object3D(),
      col = new T.Color();
    for (let i = 0; i < count; i++) {
      const y = (rand(i * 5) - 0.5) * 3.55,
        center = 0.48 * Math.sin(y * 1.15) + y * 0.08,
        x = center + (rand(i * 5 + 1) - 0.5) * 1.18;
      const dep = Math.exp(-Math.pow((x - center) / 0.65, 2)) * 0.52;
      const z =
        0.75 - (kind === "soil" ? dep : 0) + 0.03 + rand(i * 5 + 2) * 0.018;
      const r = 0.006 + Math.pow(rand(i * 5 + 3), 5) * 0.052;
      const settle = smooth((t - 0.2 - rand(i + 881) * 0.6) / 1.4);
      o.position.set(
        x + (1 - settle) * Math.sin(i * 2.3) * 2,
        Math.min(1.9, y + (1 - settle) * (rand(i + 553) - 0.5) * 3),
        z + (1 - settle) * (1 + rand(i + 54) * 2),
      );
      o.rotation.set(rand(i + 9) * 6, rand(i + 23) * 6, rand(i + 42) * 6);
      o.scale.set(r * (0.9 + rand(i) * 0.5), r * 0.7, r * 0.7);
      o.updateMatrix();
      ref.current.setMatrixAt(i, o.matrix);
      const palette =
        kind === "soil"
          ? ["#bc965f", "#987244", "#d3b983", "#74634c", "#a88c5c"]
          : ["#777b77", "#b1b1a3", "#515957", "#929588"];
      col.set(palette[i % palette.length]);
      ref.current.setColorAt(i, col);
    }
    ref.current.instanceMatrix.needsUpdate = true;
    if (ref.current.instanceColor) ref.current.instanceColor.needsUpdate = true;
  }, [count, kind, t]);
  return (
    <instancedMesh
      ref={ref}
      args={[pebble, undefined, count]}
      castShadow
      receiveShadow
    >
      <meshStandardMaterial roughness={0.93} metalness={0.01} flatShading />
    </instancedMesh>
  );
}
export function OrbitGrains({
  t,
  count = 650,
  radius = 2.05,
  kind = "soil",
  forming = true,
}: {
  t: number;
  count?: number;
  radius?: number;
  kind?: Kind;
  forming?: boolean;
}) {
  const ref = useRef<T.InstancedMesh>(null);
  useLayoutEffect(() => {
    if (!ref.current) return;
    const obj = new T.Object3D(),
      color = new T.Color();
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2 + t * 0.065,
        r = radius + (rand(i * 4) - 0.5) * 0.38;
      let x = Math.cos(a) * r,
        y = Math.sin(a) * r * 0.94,
        z = Math.sin(a * 1.8) * 0.6 + 0.15;
      const intro = forming ? smooth(t / 2.1) : 1;
      const spread = (1 - intro) * 1.5;
      x *= 1 + spread;
      y = Math.min(1.95, y * (1 + spread * 0.12));
      z += spread * (rand(i * 4 + 1) - 0.5) * 3;
      obj.position.set(x, y, z);
      obj.rotation.set(t * 0.08 + i, i * 0.2, t * 0.06);
      const size =
        (0.006 + Math.pow(rand(i * 4 + 2), 5) * 0.04) * (0.3 + 0.7 * intro);
      obj.scale.set(size, size * 0.7, size * 0.8);
      obj.updateMatrix();
      ref.current.setMatrixAt(i, obj.matrix);
      color.set(
        kind === "soil"
          ? ["#b18a51", "#8f7148", "#d1b587", "#9e8967"][i % 4]
          : ["#333c3f", "#818782", "#5b6260", "#afb0a1"][i % 4],
      );
      ref.current.setColorAt(i, color);
    }
    ref.current.instanceMatrix.needsUpdate = true;
    if (ref.current.instanceColor) ref.current.instanceColor.needsUpdate = true;
  }, [t, count, radius, kind, forming]);
  return (
    <instancedMesh ref={ref} args={[pebble, undefined, count]}>
      <meshStandardMaterial roughness={0.89} metalness={0.02} flatShading />
    </instancedMesh>
  );
}
export function SoilMonolith({
  t = 0,
  scale = 1,
}: {
  t?: number;
  scale?: number;
}) {
  const ref = useRef<T.Mesh>(null);
  const plane = useMemo(() => new T.Plane(), []);
  const geometry = useMemo(() => monolith("soil"), []);
  const material = useMemo(() => {
    const m = surface("soil").clone();
    m.vertexColors = true;
    m.clippingPlanes = [plane];
    m.clipShadows = true;
    return m;
  }, [plane]);
  useLayoutEffect(() => {
    if (ref.current) {
      ref.current.updateWorldMatrix(true, false);
      plane
        .set(new T.Vector3(0, -1, 0), -2.05 + 4.25 * smooth((t - 0.1) / 1.9))
        .applyMatrix4(ref.current.matrixWorld);
    }
  }, [plane, t]);
  const s = scale * (0.9 + 0.1 * smooth(t / 1.9));
  const pts = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => {
        const y = -1.85 + (i / 19) * 3.7,
          center = 0.48 * Math.sin(y * 1.15) + y * 0.08,
          x = center - 0.37;
        return [
          x,
          y,
          0.75 - Math.exp(-Math.pow(0.37 / 0.65, 2)) * 0.52 + 0.23,
        ] as V3;
      }),
    [],
  );
  return (
    <group scale={s}>
      <mesh
        ref={ref}
        geometry={geometry}
        material={material}
        castShadow
        receiveShadow
      />
      <EmbeddedGrains t={t} />
      <Trace points={pts} t={t} width={0.009} />
      <OrbitGrains t={t} />
    </group>
  );
}
export function RockPatch({
  kind = "soil",
  width = 4,
  depth = 2.7,
  height = 0.65,
}: {
  kind?: Kind;
  width?: number;
  depth?: number;
  height?: number;
}) {
  const geo = useMemo(
    () => monolith(kind, width, height, depth, false),
    [kind, width, height, depth],
  );
  const mat = useMemo(() => {
    const m = surface(kind).clone();
    m.vertexColors = true;
    return m;
  }, [kind]);
  return <mesh geometry={geo} material={mat} castShadow receiveShadow />;
}
export function ConcreteSpecimen({
  r = 0.86,
  h = 1.8,
  cut = false,
}: {
  r?: number;
  h?: number;
  cut?: boolean;
}) {
  const mat = useMemo(() => surface("concrete"), []);
  return (
    <group>
      <mesh material={mat} castShadow receiveShadow>
        <cylinderGeometry
          args={[
            r,
            r,
            h,
            96,
            16,
            false,
            cut ? Math.PI / 2 : 0,
            cut ? Math.PI : Math.PI * 2,
          ]}
        />
      </mesh>
      {cut && (
        <mesh material={mat} rotation={[0, 0, 0]}>
          <planeGeometry args={[r * 2, h, 36, 36]} />
        </mesh>
      )}
    </group>
  );
}
export function ConcreteCube() {
  const g = useMemo(() => monolith("concrete", 2.25, 2.25, 2.25), []);
  const m = useMemo(() => {
    const a = surface("concrete").clone();
    a.vertexColors = true;
    return a;
  }, []);
  return <mesh geometry={g} material={m} castShadow receiveShadow />;
}
export function AsphaltPuck({ r = 0.85, h = 0.7 }: { r?: number; h?: number }) {
  return (
    <mesh material={surface("asphalt")} castShadow receiveShadow>
      <cylinderGeometry args={[r, r, h, 96, 8]} />
    </mesh>
  );
}
export function AsphaltRibbon({ t = 0 }: { t?: number }) {
  const geo = useMemo(() => {
    const shape = new T.Shape();
    shape.moveTo(-1.45, -2);
    shape.bezierCurveTo(-1.7, -0.9, 0.8, -0.4, 0.95, 0.45);
    shape.bezierCurveTo(1.1, 1.1, -0.3, 1.5, -1.2, 2);
    shape.lineTo(-0.2, 2.2);
    shape.bezierCurveTo(1.5, 1.7, 2, 1.0, 1.65, 0.1);
    shape.bezierCurveTo(1.3, -0.9, -0.6, -1, -0.5, -1.7);
    shape.closePath();
    return new T.ExtrudeGeometry(shape, {
      depth: 0.35,
      bevelEnabled: true,
      bevelSize: 0.055,
      bevelThickness: 0.035,
      bevelSegments: 3,
      curveSegments: 32,
      steps: 1,
    });
  }, []);
  return (
    <mesh
      geometry={geo}
      material={surface("asphalt")}
      castShadow
      receiveShadow
    />
  );
}
