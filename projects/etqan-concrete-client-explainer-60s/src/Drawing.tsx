import React from "react";
import { rand, gold, ease } from "./motion";
export function Defs({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={id + "-steel"}>
        <stop stopColor="#385564" />
        <stop offset=".15" stopColor="#98b4bd" />
        <stop offset=".32" stopColor="#dae4e6" />
        <stop offset=".42" stopColor="#688996" />
        <stop offset=".7" stopColor="#2b4c5d" />
        <stop offset=".92" stopColor="#9cb5bd" />
        <stop offset="1" stopColor="#3d6070" />
      </linearGradient>
      <linearGradient id={id + "-wet"}>
        <stop stopColor="#636e6c" />
        <stop offset=".5" stopColor="#a4a89a" />
        <stop offset="1" stopColor="#697b7c" />
      </linearGradient>
      <linearGradient id={id + "-dry"}>
        <stop stopColor="#82918c" />
        <stop offset=".38" stopColor="#c7c6ae" />
        <stop offset=".8" stopColor="#a5b3ae" />
        <stop offset="1" stopColor="#607f87" />
      </linearGradient>
      <linearGradient id={id + "-water"} x1="0" y1="0" x2="0" y2="1">
        <stop stopColor="#75c5d4" stopOpacity=".2" />
        <stop offset="1" stopColor="#3d879e" stopOpacity=".04" />
      </linearGradient>
      <pattern
        id={id + "-grain"}
        width={100}
        height={100}
        patternUnits="userSpaceOnUse"
      >
        {Array.from({ length: 55 }, (_, i) => {
          const x = rand(i + 3) * 100,
            y = rand(i + 109) * 100,
            r = 0.65 + rand(i + 50) * 1.9;
          return (
            <path
              key={i}
              d={`M${x - r},${y}l${r * 0.7},${-r} ${r * 1.3},${r * 0.4} ${-r * 0.3},${r * 1.3} ${-r * 1.1},${r * 0.4}Z`}
              fill={i % 3 === 0 ? "#e2dac1" : "#253f48"}
              opacity={0.12 + rand(i + 300) * 0.27}
            />
          );
        })}
      </pattern>
      <filter id={id + "-shadow"} x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="12" />
      </filter>
    </defs>
  );
}
export function Cylinder({
  id,
  x = 0,
  y = 0,
  w = 150,
  h = 300,
  wet = false,
  crack = 0,
  cap = true,
}: {
  id: string;
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  wet?: boolean;
  crack?: number;
  cap?: boolean;
}) {
  const r = w / 2,
    e = w * 0.13;
  const body = `M${-r},${e} C${-r},${-e} ${r},${-e} ${r},${e} L${r},${h - e} C${r},${h + e * 0.3} ${-r},${h + e * 0.3} ${-r},${h - e}Z`;
  return (
    <g transform={`translate(${x} ${y})`}>
      <path
        d={body}
        fill={`url(#${id}-${wet ? "wet" : "dry"})`}
        stroke="#d0d6c4"
        strokeOpacity=".45"
        strokeWidth={1.3}
      />
      <path d={body} fill={`url(#${id}-grain)`} />
      {cap && (
        <ellipse
          cy={e}
          rx={r}
          ry={e}
          fill={wet ? "#b0b3a2" : "#c5c7b6"}
          stroke="#d7daca"
          strokeOpacity=".7"
          strokeWidth={1.1}
        />
      )}
      <path
        d={`M${-r + 9},${e * 1.5}V${h - e * 1.6}`}
        stroke="#d3d7c6"
        opacity=".13"
        strokeWidth={2}
      />
      {crack > 0 && (
        <g
          stroke="#152e3a"
          strokeWidth={1.4 + crack * 1.8}
          fill="none"
          opacity={crack}
        >
          <path
            d={`M${-w * 0.19},${e * 2}l9,${h * 0.16} -15,${h * 0.12} 8,${h * 0.18} -11,${h * 0.18} 16,${h * 0.16} -6,${h * 0.13}`}
          />
          <path
            d={`M${w * 0.22},${e * 2}l-8,${h * 0.2} 12,${h * 0.13} -14,${h * 0.18} 8,${h * 0.18} -13,${h * 0.21}`}
          />
          <path d={`M${w * 0.2},${h * 0.38}l${-w * 0.12},${h * 0.1}`} />
        </g>
      )}
    </g>
  );
}
export function Ground({ t, id }: { t: number; id: string }) {
  return (
    <g>
      <ellipse
        cx={490}
        cy={650}
        rx={375}
        ry={32}
        fill="#000b13"
        opacity=".55"
        filter={`url(#${id}-shadow)`}
      />
      <ellipse
        cx={490}
        cy={648}
        rx={385}
        ry={42}
        fill="none"
        stroke="#5b8494"
        strokeOpacity=".28"
      />
      <ellipse
        cx={490}
        cy={648}
        rx={360}
        ry={30}
        fill="none"
        stroke="#7a9eaa"
        strokeOpacity=".16"
      />
      <path d="M130 648H850" stroke="#a7bec2" strokeOpacity=".16" />
      <path
        d="M155 648H825"
        pathLength={1}
        stroke={gold}
        strokeOpacity=".65"
        strokeDasharray=".07 .93"
        strokeDashoffset={-((t * 0.065) % 1)}
        fill="none"
      />
    </g>
  );
}
export function SvgLabel({
  x,
  y,
  children,
  color = "#cfdee4",
  size = 28,
}: {
  x: number;
  y: number;
  children: React.ReactNode;
  color?: string;
  size?: number;
}) {
  return (
    <text
      x={x}
      y={y}
      fill={color}
      fontSize={size}
      fontWeight={500}
      fontFamily="EtqanCairo"
      direction="rtl"
      textAnchor="middle"
    >
      {children}
    </text>
  );
}
export function FluidStream({
  x,
  y,
  bottom,
  t,
  id,
  visible = true,
}: {
  x: number;
  y: number;
  bottom: number;
  t: number;
  id: string;
  visible?: boolean;
}) {
  if (!visible) return null;
  return (
    <g>
      <path
        d={`M${x - 12},${y}Q${x + 8 * Math.sin(t * 8)},${(y + bottom) / 2} ${x - 10},${bottom}H${x + 13}Q${x + 11 + 5 * Math.sin(t * 9)},${(y + bottom) / 2} ${x + 13},${y}Z`}
        fill={`url(#${id}-wet)`}
      />
      {Array.from({ length: 11 }, (_, i) => (
        <circle
          key={i}
          cx={x + (rand(i) - 0.5) * 18}
          cy={y + ((i * 31 + t * 145) % Math.max(1, bottom - y))}
          r={1 + rand(i + 55) * 2}
          fill={i % 2 ? "#c3bca4" : "#4a6266"}
          opacity=".65"
        />
      ))}
    </g>
  );
}
