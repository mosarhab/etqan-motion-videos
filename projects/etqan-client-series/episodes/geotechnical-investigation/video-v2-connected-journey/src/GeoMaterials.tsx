import React from "react";
import { rand } from "./motion";
export function GeoDefs({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={id + "-steel"}>
        <stop stopColor="#344f61" />
        <stop offset=".18" stopColor="#91aeb8" />
        <stop offset=".36" stopColor="#eff1e6" />
        <stop offset=".48" stopColor="#648391" />
        <stop offset=".8" stopColor="#233e51" />
        <stop offset="1" stopColor="#a5bdc3" />
      </linearGradient>
      <linearGradient id={id + "-white"}>
        <stop stopColor="#9eacaf" />
        <stop offset=".28" stopColor="#f0f1e8" />
        <stop offset=".72" stopColor="#d5dbd6" />
        <stop offset="1" stopColor="#758d98" />
      </linearGradient>
      <linearGradient id={id + "-orange"}>
        <stop stopColor="#9d4318" />
        <stop offset=".22" stopColor="#ee7225" />
        <stop offset=".5" stopColor="#ff983d" />
        <stop offset=".78" stopColor="#cd571d" />
        <stop offset="1" stopColor="#843913" />
      </linearGradient>
      <linearGradient id={id + "-dark"}>
        <stop stopColor="#0b1822" />
        <stop offset=".42" stopColor="#34434b" />
        <stop offset=".68" stopColor="#111e29" />
        <stop offset="1" stopColor="#07121c" />
      </linearGradient>
      <linearGradient id={id + "-earth"}>
        <stop stopColor="#493d2d" />
        <stop offset=".35" stopColor="#9a7547" />
        <stop offset=".7" stopColor="#b09565" />
        <stop offset="1" stopColor="#5e5542" />
      </linearGradient>
      <linearGradient id={id + "-paper"}>
        <stop stopColor="#d0d7cf" />
        <stop offset=".15" stopColor="#faf9ef" />
        <stop offset=".85" stopColor="#eeeee2" />
        <stop offset="1" stopColor="#b9c5c3" />
      </linearGradient>
      <pattern
        id={id + "-grain"}
        width={100}
        height={100}
        patternUnits="userSpaceOnUse"
      >
        {Array.from({ length: 40 }, (_, i) => {
          const x = rand(i + 7) * 100,
            y = rand(i + 130) * 100,
            r = 1 + rand(i + 60) * 2.4;
          return (
            <path
              key={i}
              d={`M${x - r} ${y}l${r * 0.8} ${-r} ${r * 1.4} ${r * 0.5} ${-r * 0.4} ${r * 1.4}Z`}
              fill={i % 3 === 0 ? "#d2bb89" : "#1b282b"}
              opacity={0.14 + rand(i + 220) * 0.3}
            />
          );
        })}
      </pattern>
      <filter id={id + "-shadow"} x="-50%" y="-60%" width="200%" height="220%">
        <feGaussianBlur stdDeviation={10} />
      </filter>
    </defs>
  );
}
export function Bolt({ x, y, r = 3 }: { x: number; y: number; r?: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r + 1.2} fill="#122635" />
      <circle cx={x - 0.35} cy={y - 0.35} r={r} fill="#b7c7c6" />
      <path
        d={`M${x - r * 0.6} ${y}h${r * 1.2}`}
        stroke="#435969"
        strokeWidth={1}
      />
    </g>
  );
}
export function GeoArt({
  children,
  top = 560,
}: {
  children: React.ReactNode;
  top?: number;
}) {
  return (
    <svg
      data-graphic="animated-geotechnical-scene"
      width={1050}
      height={1050}
      viewBox="0 0 1000 1000"
      style={{ position: "absolute", left: 15, top, overflow: "hidden" }}
    >
      {children}
    </svg>
  );
}
