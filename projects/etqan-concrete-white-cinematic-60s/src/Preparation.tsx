import React from "react";
import { Box, Cyl, Line, Bolt, FrameBase } from "./Parts";
import { concrete, steel, brushed, navy, rubber, gold } from "./Materials";
import { smooth, clamp } from "./Math";
import { Stream, PourPan } from "./Slump";
export function SampleMould({
  fill = 1,
  level = 0,
}: {
  fill?: number;
  level?: number;
}) {
  const y = 0.64,
    h = 1.5 * fill;
  return (
    <group>
      <Box p={[0, y - 0.06, 0]} s={[1.86, 0.14, 1.86]} mat={brushed} />
      {[-1, 1].map((s) => (
        <group key={s}>
          <Box p={[s * 0.83, y + 0.75, 0]} s={[0.13, 1.5, 1.8]} mat={navy} />
          <Box p={[0, y + 0.75, s * 0.83]} s={[1.8, 1.5, 0.13]} mat={brushed} />
          <Bolt p={[s * 0.91, y + 0.04, 0.91]} scale={0.7} />
          <Cyl
            p={[s * 0.89, y + 0.75, 0.89]}
            r={0.07}
            h={0.18}
            rot={[Math.PI / 2, 0, 0]}
            mat={gold}
          />
        </group>
      ))}
      {fill > 0 && (
        <Box
          p={[0, y + h / 2, 0]}
          s={[1.49, h, 1.49]}
          mat={concrete(true)}
          r={0.009}
        />
      )}
    </group>
  );
}
export function Preparation({ t }: { t: number }) {
  const local = t - 17,
    active = Math.max(0, Math.min(2, Math.floor(local / 2))),
    phase = local - active * 2,
    carriage =
      -2.3 +
      active * 2.3 +
      (active < 2 ? 2.3 * smooth((phase - 1.7) / 0.3) : 0),
    activeFill = smooth((local - 0.25 - active * 2) / 1.4);
  return (
    <group>
      <FrameBase w={7.0} d={3.3} />
      {[-2.3, 0, 2.3].map((x, i) => (
        <group key={x} position={[x, 0, 0]}>
          <SampleMould
            fill={smooth((local - 0.25 - i * 2) / 1.4)}
            level={smooth((local - 6.4) / 2.4)}
          />
        </group>
      ))}
      <Box p={[0, 0.58, -1.46]} s={[6.9, 0.08, 0.13]} mat={steel} />
      <Box p={[0, 3.42, -1.46]} s={[7.15, 0.11, 0.14]} mat={brushed} />
      {[-3.4, 3.4].map((x) => (
        <Box key={x} p={[x, 2, -1.46]} s={[0.12, 2.92, 0.15]} mat={brushed} />
      ))}
      <group visible={local < 6.9} position={[carriage, 0, 0]}>
        <Box p={[0, 3.48, -1.44]} s={[0.48, 0.26, 0.3]} mat={navy} />
        <Line
          points={[
            [0, 3.5, -1.4],
            [0, 4.15, -0.3],
            [0, 4.0, 0.1],
          ]}
          r={0.055}
          mat={steel}
        />
        <PourPan p={[0, 3.7, -0.45]} rot={-0.14} />
        <Stream
          t={t}
          from={[0, 3.55, 0.1]}
          to={[0, 0.66 + 1.5 * activeFill, 0.05]}
          visible={phase > 0.25 && phase < 1.65 && local < 6.0}
          r={0.17}
        />
      </group>
      <group
        visible={local > 6.2}
        position={[0, 0, -0.78 + 1.56 * smooth((local - 6.4) / 2.3)]}
      >
        <Box p={[0, 2.17, 0]} s={[6.66, 0.06, 0.22]} mat={steel} r={0.008} />
        {[-3.3, 3.3].map((x) => (
          <group key={x}>
            <Box p={[x, 2.49, 0]} s={[0.09, 0.65, 0.14]} mat={brushed} />
            <Cyl
              p={[x, 2.79, 0]}
              r={0.11}
              h={0.18}
              rot={[Math.PI / 2, 0, 0]}
              mat={navy}
            />
          </group>
        ))}
      </group>
    </group>
  );
}
