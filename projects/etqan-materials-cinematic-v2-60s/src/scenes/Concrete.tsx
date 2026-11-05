import { useSceneTime } from "../World";
import React, { useMemo } from "react";
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
  View,
  V3,
  smooth,
  lerp3,
  worldPoint,
  metal,
  navy,
  gold,
  dark,
  glow,
} from "../World";
import { ConcreteSpecimen, OrbitGrains } from "../Specimens";
import { surface } from "../Surfaces";
import { Fonts, Header, Callout } from "../Type";
export function ConcreteCompression({ duration = 6 }: { duration?: number }) {
  const t = useSceneTime(duration, 6),
    a = smooth(t / 6),
    load = smooth((t - 1) / 3);
  const view: View = {
    position: lerp3([-4.6, 3.7, 9.2], [-3.4, 3.3, 8.7], a),
    target: [0, 2.55, 0],
    fov: 38,
  };
  const pos: V3 = [0, 0, 0],
    rot: V3 = [0, 0.1, 0];
  const point = worldPoint([0.2, 2.6, 0.84], pos, rot);
  return (
    <AbsoluteFill>
      <Fonts />
      <Canvas>
        <Camera view={view} />
        <group rotation={rot}>
          <group position={[0, 2.5, 0]} scale={[1, 1 - load * 0.003, 1]}>
            <ConcreteSpecimen />
          </group>
          <Cyl p={[0, 1.49, 0]} r={1.08} h={0.2} />
          <Cyl p={[0, 1.36, 0]} r={1.12} h={0.07} mat={navy} />
          <Cyl p={[0, 4.1 - load * 0.6, 0]} r={1.08} h={0.2} />
          <Cyl p={[0, 4.24 - load * 0.6, 0]} r={1.12} h={0.06} mat={navy} />
          <Cyl p={[0, 4.62 - load * 0.6, 0]} r={0.2} h={0.75} />
          <Path
            points={[
              [-0.9, 1.3, 0.3],
              [-0.6, 1.3, 0.9],
              [0.3, 1.3, 1.1],
              [1.0, 1.3, 0.5],
            ]}
            width={0.009}
          />
        </group>
        <group position={[0, 2.5, -0.7]}>
          <OrbitGrains
            t={t}
            count={260}
            radius={2.4}
            kind="concrete"
            forming={false}
          />
        </group>
        <Dust t={t} />
      </Canvas>
      <Finish />
      <Callout
        text="مقاومة الضغط"
        point={point}
        view={view}
        t={t}
        start={1.5}
        end={5.6}
        y={490}
      />
    </AbsoluteFill>
  );
}
function Probe({ x, t }: { x: number; t: number }) {
  const side = Math.sign(x);
  return (
    <group position={[x, 2.5, -0.015]}>
      <Cyl r={0.18} h={0.3} mat={navy} rot={[0, 0, Math.PI / 2]} />
      <Cyl
        p={[-side * 0.17, 0, 0]}
        r={0.18}
        h={0.04}
        rot={[0, 0, Math.PI / 2]}
      />
      <Cyl
        p={[side * 0.19, 0, 0]}
        r={0.1}
        h={0.07}
        mat={gold}
        rot={[0, 0, Math.PI / 2]}
      />
      <Path
        points={[
          [side * 0.22, 0, 0],
          [side * 0.65, 0.3, -0.15],
          [side * 0.6, 1.25, -0.4],
          [side * 0.1, 1.6, -0.4],
        ]}
        width={0.02}
        mat={dark}
      />
    </group>
  );
}
export function ConcreteUltrasonic({ duration = 5 }: { duration?: number }) {
  const t = useSceneTime(duration, 5),
    a = smooth(t / 5);
  const view: View = {
    position: lerp3([4.2, 5.2, 9.4], [3.6, 4.8, 8.8], a),
    target: [0, 2.5, 0],
    fov: 38,
  };
  const pos: V3 = [0, 0, 0],
    rot: V3 = [0, -0.12, 0];
  const phase = ((((t - 0.8) % 2.2) + 2.2) % 2.2) / 2.2,
    visible = t > 0.8 && t < 4.7;
  const x = -0.78 + phase * 1.56;
  const point = worldPoint([0.25, 2.53, 0.05], pos, rot);
  return (
    <AbsoluteFill>
      <Fonts />
      <Canvas>
        <Camera view={view} />
        <group rotation={rot}>
          <group position={[0, 2.5, 0]}>
            <ConcreteSpecimen cut />
          </group>
          <Probe x={-0.99} t={t} />
          <Probe x={0.99} t={t} />
          <Path
            points={[
              [-0.78, 2.5, 0.04],
              [0.78, 2.5, 0.04],
            ]}
            width={0.008}
            mat={gold}
          />
          {visible && (
            <group>
              <mesh position={[x, 2.5, 0.065]} material={glow}>
                <sphereGeometry args={[0.035, 24, 16]} />
              </mesh>
              {[-0.07, 0, 0.07].map((q, i) => (
                <mesh
                  key={q}
                  position={[x + q, 2.5, 0.05]}
                  scale={[1, 0.22 + i * 0.08, 0.22 + i * 0.08]}
                  rotation={[0, Math.PI / 2, 0]}
                >
                  <torusGeometry args={[1, 0.012, 8, 64]} />
                  <meshBasicMaterial
                    color="#f2cf6c"
                    transparent
                    opacity={0.6 - i * 0.12}
                  />
                </mesh>
              ))}
            </group>
          )}
        </group>
        <Dust t={t} />
      </Canvas>
      <Finish />
      <Callout
        text="الموجات فوق الصوتية"
        point={point}
        view={view}
        t={t}
        start={1.2}
        end={4.65}
        y={500}
        width={540}
      />
    </AbsoluteFill>
  );
}
function CoreSlab() {
  const geo = useMemo(() => {
    const s = new T.Shape();
    s.moveTo(-1.5, -1.2);
    s.lineTo(1.5, -1.2);
    s.lineTo(1.5, 1.2);
    s.lineTo(-1.5, 1.2);
    s.closePath();
    const hole = new T.Path();
    hole.absarc(0, 0, 0.39, 0, Math.PI * 2, true);
    s.holes.push(hole);
    return new T.ExtrudeGeometry(s, {
      depth: 0.65,
      bevelEnabled: true,
      bevelThickness: 0.025,
      bevelSize: 0.025,
      bevelSegments: 2,
      curveSegments: 64,
      steps: 1,
    });
  }, []);
  return (
    <mesh
      geometry={geo}
      material={surface("concrete")}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 1.1, 0]}
      castShadow
      receiveShadow
    />
  );
}
export function ConcreteCore({ duration = 5 }: { duration?: number }) {
  const t = useSceneTime(duration, 5),
    down = smooth((t - 0.3) / 1.7),
    up = smooth((t - 2.1) / 2.2),
    height = 3.1 - down * 1.0 + up * 1.65;
  const view: View = {
    position: lerp3([4.6, 5.2, 8.9], [3.7, 4.7, 8.3], smooth(t / 5)),
    target: [0, 2.25, 0],
    fov: 38,
  };
  const point = worldPoint([0, height - 0.68, 0.32], [0, 0, 0], [0, -0.12, 0]);
  return (
    <AbsoluteFill>
      <Fonts />
      <Canvas>
        <Camera view={view} />
        <group rotation={[0, -0.12, 0]}>
          <CoreSlab />
          <group position={[0, height, 0]} rotation={[0, t * 1.5, 0]}>
            <Cyl r={0.37} h={0.9} open mat={metal} />
            <Cyl p={[0, 0.47, 0]} r={0.39} h={0.07} mat={navy} />
            {Array.from({ length: 10 }, (_, i) => (
              <Box
                key={i}
                p={[
                  Math.cos((i * Math.PI) / 5) * 0.355,
                  -0.46,
                  Math.sin((i * Math.PI) / 5) * 0.355,
                ]}
                s={[0.09, 0.08, 0.08]}
                mat={gold}
              />
            ))}
            <group position={[0, -0.64, 0]} visible={t > 1.7}>
              <ConcreteSpecimen r={0.335} h={0.68} />
            </group>
          </group>
        </group>
        <Dust t={t} />
      </Canvas>
      <Finish />
      <Callout
        text="الكور الخرساني"
        point={point}
        view={view}
        t={t}
        start={1.1}
        end={4.65}
        y={500}
      />
    </AbsoluteFill>
  );
}
