import React from "react";
import { clamp, ease, gold } from "./motion";
import { Ground } from "./Drawing";
function liftProfile(x: number) {
  x = clamp(x);
  const a = 0.05;
  if (x < a) return (x * x) / (2 * a * (1 - a));
  if (x > 1 - a) return 1 - (1 - x) ** 2 / (2 * a * (1 - a));
  return (x - a / 2) / (1 - a);
}
export function slumpState(t: number) {
  const settle = ease((t - 8) / 3),
    h = 300 - 70 * settle,
    r = 48 + 19 * settle,
    volume = (300 / 3) * (98 ** 2 + 98 * 48 + 48 ** 2),
    R = (-r + Math.sqrt((12 * volume) / h - 3 * r * r)) / 2;
  return {
    h,
    r,
    R,
    lift: 335 * liftProfile((t - 5) / 5),
    side: -320 * ease((t - 10.3) / 1.4),
    lower: 335 * ease((t - 12.2) / 3),
  };
}
export function SlumpRig({
  t,
  id,
  camera = false,
}: {
  t: number;
  id: string;
  camera?: boolean;
}) {
  const s = slumpState(t),
    z = camera ? 1 + 0.035 * ease(t / 18) : 1,
    body = `M${-s.r} ${622 - s.h}Q0 ${610 - s.h} ${s.r} ${622 - s.h}L${s.R} 622Q0 640 ${-s.R} 622Z`;
  return (
    <g transform={`translate(500 400) scale(${z}) translate(-500 -400)`}>
      <path
        d="M60 624H930L950 639H40Z"
        fill="#284b60"
        stroke="#829da6"
        strokeWidth={1.5}
      />
      <path d="M40 639H950V647H40Z" fill="#102b3c" stroke="#5d8090" />
      <g transform="translate(580 0)">
        <path
          d={body}
          fill={`url(#${id}-wet)`}
          stroke="#bcc1aa"
          strokeOpacity=".6"
        />
        <path d={body} fill={`url(#${id}-grain)`} />
        <g transform={`translate(${s.side} ${-s.lift + s.lower})`}>
          <path
            d="M-50 322H50L100 622H-100Z"
            fill={`url(#${id}-steel)`}
            stroke="#b4c8ce"
            strokeWidth={1.7}
          />
          <ellipse
            cy={322}
            rx={50}
            ry={10}
            fill="#102f42"
            stroke="#b5c7cd"
            strokeWidth={2}
          />
          <path
            d="M-50 322L-100 622M50 322L100 622"
            stroke="#e3e8e4"
            fill="none"
            opacity=".5"
          />
          <path
            d="M-78 425H-112V477H-88M78 425H112V477H88"
            fill="none"
            stroke={`url(#${id}-steel)`}
            strokeWidth={7}
          />
          <path
            d="M-95 620H-134V626H-88M95 620H134V626H88"
            fill="#8daab5"
            stroke="#c3d0cd"
          />
          <path
            d="M-35 355V582"
            stroke="#dbe5e2"
            opacity=".18"
            strokeWidth={2}
          />
        </g>
      </g>
    </g>
  );
}
export function TemperatureRig({
  t,
  id,
  camera = false,
}: {
  t: number;
  id: string;
  camera?: boolean;
}) {
  const raised = 130 * (1 - ease((t - 2) / 4.5)),
    z = camera ? 1.25 + 0.035 * ease(t / 16) : 1;
  return (
    <g transform={`translate(500 450) scale(${z}) translate(-500 -450)`}>
      <g transform="translate(500 0)">
        <path d="M-130 400H130L160 383H-101Z" fill="#426271" stroke="#96afb7" />
        <path
          d="M130 400L160 383V603L130 620Z"
          fill="#0d2638"
          stroke="#789cac"
        />
        <path
          d="M-130 400H130V620H-130Z"
          fill="#123348"
          stroke="#88aab8"
          strokeWidth={2}
        />
        <path d="M-124 411H124V613H-124Z" fill={`url(#${id}-wet)`} />
        <path d="M-124 411H124V613H-124Z" fill={`url(#${id}-grain)`} />
        <path d="M-130 400H130M-130 620H130" stroke="#c2d1ce" strokeWidth={3} />
        <g transform={`translate(0 ${-raised})`}>
          <path d="M0 359V520" stroke="#b6d2d9" strokeWidth={8} />
          <path d="M0 411V520" stroke="#d4e3df" strokeWidth={8} />
          <rect
            x={-34}
            y={296}
            width={68}
            height={82}
            rx={6}
            fill="#0b2438"
            stroke="#94b7c4"
            strokeWidth={2}
          />
          <rect
            x={-24}
            y={309}
            width={48}
            height={37}
            rx={2}
            fill="#183e50"
            stroke="#819fad"
            strokeWidth={0.7}
          />
          <path d="M-21 312H9L-21 342Z" fill="#d7eff3" opacity=".08" />
          <circle cx={-12} cy={362} r={4} fill={gold} />
          <circle cx={12} cy={362} r={4} fill="#8aaab8" />
        </g>
      </g>
    </g>
  );
}
export function EquipmentPair({
  t,
  id,
  settled = true,
}: {
  t: number;
  id: string;
  settled?: boolean;
}) {
  const z = 1 + 0.02 * ease(t / 8);
  return (
    <g transform={`translate(500 400) scale(${z}) translate(-500 -400)`}>
      <g transform="translate(0 -85)">
        <Ground id={id} t={t} />
      </g>
      <g transform="translate(-35 140) scale(.67)">
        <SlumpRig id={id} t={settled ? 18 : 0} />
      </g>
      <g transform="translate(360 60) scale(.8)">
        <TemperatureRig id={id} t={settled ? 8 : 0} />
      </g>
      <text
        x={320}
        y={650}
        fill="#cfdee4"
        fontFamily="EtqanCairo"
        fontSize={30}
        direction="rtl"
        textAnchor="middle"
      >
        الهبوط
      </text>
      <text
        x={760}
        y={650}
        fill="#cfdee4"
        fontFamily="EtqanCairo"
        fontSize={30}
        direction="rtl"
        textAnchor="middle"
      >
        درجة الحرارة
      </text>
    </g>
  );
}
