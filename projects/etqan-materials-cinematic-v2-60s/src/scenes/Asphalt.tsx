import { useSceneTime } from "../World";
import React, { useMemo, useRef, useLayoutEffect } from "react";
import * as T from "three";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import {
  Canvas,
  Camera,
  Dust,
  Finish,
  Cyl,
  Box,
  Path,
  Trace,
  View,
  V3,
  smooth,
  lerp3,
  worldPoint,
  rand,
  metal,
  navy,
  gold,
  dark,
  glow,
} from "../World";
import { surface, monolith } from "../Surfaces";
import { OrbitGrains, AsphaltPuck } from "../Specimens";
import { Fonts, Header, Callout } from "../Type";
const rockGeo = new T.IcosahedronGeometry(1, 0);
function Aggregate({
  t = 0,
  extraction = false,
  count = 1100,
}: {
  t?: number;
  extraction?: boolean;
  count?: number;
}) {
  const ref = useRef<T.InstancedMesh>(null);
  useLayoutEffect(() => {
    if (!ref.current) return;
    const obj = new T.Object3D(),
      color = new T.Color(),
      a = extraction ? smooth((t - 0.7) / 3) : 0;
    for (let i = 0; i < count; i++) {
      const x = (rand(i * 5) - 0.5) * 2.7,
        y = (rand(i * 5 + 1) - 0.5) * 3.35,
        z = 0.55 + (rand(i * 5 + 2) - 0.5) * 0.09;
      const angle = rand(i * 5 + 3) * Math.PI * 2;
      const ex = Math.cos(angle) * (1.0 + rand(i) * 0.3),
        ey = 0.45 + rand(i + 34) * 1.65,
        ez = Math.sin(angle) * 0.55;
      if (extraction) {
        const r = Math.sqrt(rand(i + 83)) * 1.05;
        obj.position.set(
          Math.cos(angle) * r * (1 - a) + ex * a,
          (rand(i + 62) - 0.5) * 0.5 * (1 - a) + ey * a,
          Math.sin(angle) * r * (1 - a) + ez * a,
        );
      } else {
        const formation = smooth((t - 0.15 - rand(i + 731) * 0.6) / 1.5);
        obj.position.set(
          x + (1 - formation) * Math.sin(i * 2.3) * 1.7,
          Math.min(1.85, y + (1 - formation) * (rand(i + 753) - 0.5) * 2.5),
          z + (1 - formation) * (1 + rand(i + 54)),
        );
      }
      obj.rotation.set(i * 0.3, i * 0.6 + t * 0.04, i * 0.11);
      const size = 0.018 + Math.pow(rand(i * 5 + 4), 3) * 0.065;
      obj.scale.set(size, size * (0.65 + rand(i + 5) * 0.5), size * 0.65);
      obj.updateMatrix();
      ref.current.setMatrixAt(i, obj.matrix);
      color.set(["#47504c", "#333d3b", "#747d72", "#60665d", "#293235"][i % 5]);
      if (extraction)
        color.lerp(
          new T.Color(
            ["#747b76", "#454d4d", "#a6aaa0", "#8e9186", "#30383a"][i % 5],
          ),
          a,
        );
      ref.current.setColorAt(i, color);
    }
    ref.current.instanceMatrix.needsUpdate = true;
    if (ref.current.instanceColor) ref.current.instanceColor.needsUpdate = true;
  }, [t, count, extraction]);
  return (
    <instancedMesh
      ref={ref}
      args={[rockGeo, undefined, count]}
      castShadow
      receiveShadow
    >
      <meshStandardMaterial roughness={0.73} metalness={0.08} flatShading />
    </instancedMesh>
  );
}
export function AsphaltBlock({ t = 0 }: { t?: number }) {
  const ref = useRef<T.Mesh>(null),
    plane = useMemo(() => new T.Plane(), []);
  const geo = useMemo(() => monolith("asphalt", 2.9, 3.6, 1.1, false), []);
  const mat = useMemo(() => {
    const m = surface("asphalt").clone();
    m.vertexColors = true;
    m.clippingPlanes = [plane];
    m.clipShadows = true;
    return m;
  }, [plane]);
  useLayoutEffect(() => {
    if (ref.current) {
      ref.current.updateWorldMatrix(true, false);
      plane
        .set(new T.Vector3(0, -1, 0), -1.95 + 4.05 * smooth((t - 0.1) / 1.9))
        .applyMatrix4(ref.current.matrixWorld);
    }
  }, [plane, t]);
  return (
    <group>
      <mesh ref={ref} geometry={geo} material={mat} castShadow receiveShadow />
      <Aggregate t={t} />
      <Trace
        t={t}
        points={[
          [-1.35, -1.45, 0.65],
          [-0.6, -0.6, 0.66],
          [0.12, 0.25, 0.66],
          [1.25, 1.55, 0.65],
        ]}
        width={0.008}
      />
    </group>
  );
}
export function AsphaltFormation({ duration = 6 }: { duration?: number }) {
  const t = useSceneTime(duration, 6),
    a = smooth(t / 6);
  const view: View = {
    position: lerp3([4.0, 4.4, 10.5], [3.4, 4.0, 9.9], a),
    target: [0, 2.4, 0],
    fov: 38,
  };
  const pos: V3 = [0, 2.4, 0],
    rot: V3 = [-0.06, -0.25 + t * 0.018, -0.13];
  const p = worldPoint([-0.35, 0.25, 0.6], pos, rot);
  return (
    <AbsoluteFill>
      <Fonts />
      <Canvas>
        <Camera view={view} />
        <group
          position={pos}
          rotation={rot}
          scale={0.92 + 0.08 * smooth(t / 2)}
        >
          <AsphaltBlock t={t} />
          <OrbitGrains kind="asphalt" t={t} count={430} />
        </group>
        <Dust t={t} />
      </Canvas>
      <Finish />
      <Callout
        text="مكونات الخلطة"
        point={p}
        view={view}
        t={t}
        start={1.55}
        end={5.6}
        y={490}
      />
    </AbsoluteFill>
  );
}
function Head({ top = false, y }: { top?: boolean; y: number }) {
  const geo = useMemo(() => {
    const s = new T.Shape(),
      start = top ? 0 : Math.PI;
    s.absarc(0, 0, 1.0, start, start + Math.PI, false);
    s.absarc(0, 0, 0.825, start + Math.PI, start, true);
    s.closePath();
    return new T.ExtrudeGeometry(s, {
      depth: 0.8,
      bevelEnabled: true,
      bevelSize: 0.025,
      bevelThickness: 0.025,
      bevelSegments: 3,
      curveSegments: 48,
      steps: 1,
    });
  }, [top]);
  return (
    <mesh
      geometry={geo}
      position={[0, y, -0.4]}
      material={metal}
      castShadow
      receiveShadow
    />
  );
}
export function AsphaltMarshall({ duration = 5 }: { duration?: number }) {
  const t = useSceneTime(duration, 5),
    a = smooth(t / 5),
    load = smooth((t - 0.7) / 3.2);
  const view: View = {
    position: lerp3([3.5, 3.8, 9.5], [2.7, 3.3, 8.8], a),
    target: [0, 2.45, 0],
    fov: 38,
  };
  const pos: V3 = [0, 0, 0],
    rot: V3 = [0, -0.12, 0],
    point = worldPoint([0.15, 2.5, 0.43], pos, rot);
  return (
    <AbsoluteFill>
      <Fonts />
      <Canvas>
        <Camera view={view} />
        <group rotation={rot}>
          <group position={[0, 2.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <AsphaltPuck r={0.81} h={0.64} />
          </group>
          <Head y={2.5} />
          <Head top y={2.5 + 0.32 * (1 - load)} />
          <Box p={[0, 1.39, 0]} s={[2.1, 0.2, 1.15]} mat={metal} />
          <Box
            p={[0, 3.92 - 0.32 * load, 0]}
            s={[2.1, 0.2, 1.15]}
            mat={metal}
          />
          <Cyl p={[0, 4.3 - 0.32 * load, 0]} r={0.17} h={0.55} />
          <Cyl p={[0, 1.2, 0]} r={0.72} h={0.15} mat={navy} />
          <Path
            points={[
              [-0.9, 1.08, 0.4],
              [-0.3, 1.08, 1.0],
              [0.5, 1.08, 0.8],
              [0.95, 1.08, 0.3],
            ]}
            width={0.009}
          />
        </group>
        <Dust t={t} />
      </Canvas>
      <Finish />
      <Callout
        text="الثبات والانسياب"
        point={point}
        view={view}
        t={t}
        start={1.2}
        end={4.65}
        y={490}
        width={470}
      />
    </AbsoluteFill>
  );
}
export function AsphaltBinder({ duration = 5 }: { duration?: number }) {
  const t = useSceneTime(duration, 5),
    a = smooth(t / 5),
    split = smooth((t - 0.7) / 3);
  const view: View = {
    position: lerp3([3.4, 4.2, 10], [2.7, 3.8, 9.3], a),
    target: [0, 2.35, 0],
    fov: 38,
  };
  const pos: V3 = [0, 2.1, 0],
    rot: V3 = [0, -0.15, -0.1];
  const point = worldPoint([0.1, -0.75, 0.3], pos, rot);
  return (
    <AbsoluteFill>
      <Fonts />
      <Canvas>
        <Camera view={view} />
        <group position={pos} rotation={rot}>
          <group
            scale={[1, 1 - 0.65 * split, 1]}
            position={[0, -split * 0.65, 0]}
          >
            <AsphaltPuck r={1.12} h={0.65} />
          </group>
          <Aggregate t={t} extraction count={850} />
          <group position={[0, -0.8 - split * 0.15, 0.2]}>
            <Path
              points={[
                [-1.15, 0.1, 0],
                [-0.6, -0.1, 0.5],
                [0.1, 0.0, 0.6],
                [1.2, 0.24, 0],
              ]}
              width={0.07}
              mat={dark}
            />
            <Path
              points={[
                [-1.15, 0.16, 0],
                [-0.6, -0.04, 0.5],
                [0.1, 0.06, 0.6],
                [1.2, 0.3, 0],
              ]}
              width={0.009}
            />
          </group>
        </group>
        <Dust t={t} />
      </Canvas>
      <Finish />
      <Callout
        text="نسبة البيتومين"
        point={point}
        view={view}
        t={t}
        start={1.25}
        end={4.65}
        y={490}
      />
    </AbsoluteFill>
  );
}
