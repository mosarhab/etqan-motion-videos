import React from "react";
import { SoilBlock, DrillRig, rigMotion } from "./Rig";
import { ease, clamp, mix, gold, rand } from "./motion";
export function openingMotion(t: number) {
  const camera = ease((t - 0.6) / 3.5),
    depth = ease((t - 1.05) / 2.9),
    rigOpacity = ease((t - 3.5) / 1);
  return {
    ax: mix(100, 70, camera),
    bx: mix(860, 930, camera),
    dx: mix(180, 120, camera),
    cx: mix(940, 980, camera),
    backY: mix(180, 590, camera),
    depth,
    border: ease((t - 0.08) / 1.4),
    borderOpacity: 1 - ease((t - 2.8) / 0.7),
    rigOpacity,
    rigTime: 1 + 8.3 * clamp((t - 4) / 7.9),
    zoom: 1 + 0.025 * ease((t - 4.5) / 7.4),
  };
}
export function planePoint(
  s: ReturnType<typeof openingMotion>,
  u: number,
  v: number,
) {
  return {
    x: mix(mix(s.ax, s.bx, u), mix(s.dx, s.cx, u), v),
    y: mix(620, s.backY, v),
  };
}
/** A vacant surface tilts into a cutaway; the same ground carries the approved rig. */
export function OpeningSite({ t, id }: { t: number; id: string }) {
  const s = openingMotion(t),
    bottom = 620 + 330 * s.depth,
    bodyScale = (s.bx - s.ax) / 860,
    depthScale = Math.max(0.0001, s.depth),
    hole = s.rigOpacity > 0.05 ? rigMotion(s.rigTime).boreBottom : 620,
    points = [
      [0.15, 0.18],
      [0.85, 0.18],
      [0.85, 0.82],
      [0.15, 0.82],
    ].map(([u, v]) => planePoint(s, u, v));
  const boundary = `M${points.map((p) => `${p.x} ${p.y}`).join("L")}Z`;
  return (
    <g
      data-opening="vacant-site-to-cutaway"
      transform={`translate(500 500) scale(${s.zoom}) translate(-500 -500)`}
    >
      <defs>
        <linearGradient id={id + "-site-surface"} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#776044" />
          <stop offset=".38" stopColor="#93805b" />
          <stop offset=".73" stopColor="#756348" />
          <stop offset="1" stopColor="#596051" />
        </linearGradient>
        <clipPath id={id + "-front-window"}>
          <rect
            x={s.ax}
            y={620}
            width={s.bx - s.ax}
            height={Math.max(0, bottom - 620)}
          />
        </clipPath>
      </defs>
      <path
        d={`M${s.bx} 620L${s.cx} ${s.backY}V${s.backY + 330 * s.depth}L${s.bx} ${bottom}Z`}
        fill="#253837"
        stroke="#4b5c53"
        strokeWidth={1.2}
      />
      <g clipPath={`url(#${id}-front-window)`}>
        <g
          transform={`translate(${s.ax} 620) scale(${bodyScale} ${depthScale}) translate(-70 -620)`}
        >
          <SoilBlock id={id} bottom={hole} />
        </g>
      </g>
      <path
        d={`M${s.ax} 620L${s.dx} ${s.backY}H${s.cx}L${s.bx} 620Z`}
        fill="#80613f"
        stroke="#9c8259"
        strokeWidth={1.2}
      />
      <path
        d={`M${s.ax} 620L${s.dx} ${s.backY}H${s.cx}L${s.bx} 620Z`}
        fill={`url(#${id}-grain)`}
        opacity={0.22 * (1 - ease((t - 3.4) / 0.7))}
      />
      <g opacity={1 - ease((t - 3.3) / 0.7)}>
        <path
          d={`M${s.ax} 620L${s.dx} ${s.backY}H${s.cx}L${s.bx} 620Z`}
          fill={`url(#${id}-site-surface)`}
        />
        {Array.from({ length: 95 }, (_, i) => {
          const p = planePoint(
              s,
              0.04 + rand(i + 19) * 0.92,
              0.05 + rand(i + 173) * 0.9,
            ),
            r = 1.1 + rand(i + 61) * 3.1;
          return (
            <ellipse
              key={i}
              cx={p.x}
              cy={p.y}
              rx={r}
              ry={r * (0.4 - 0.26 * ease((t - 0.6) / 3.5))}
              fill={i % 3 ? "#b4a17b" : "#4b4f42"}
              stroke={i % 3 ? "#c4b494" : "#3d483c"}
              strokeWidth={0.4}
              opacity={0.28 + rand(i + 201) * 0.35}
            />
          );
        })}
      </g>
      <path
        d={boundary}
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - s.border}
        fill="none"
        stroke={gold}
        strokeWidth={2.6}
        opacity={s.borderOpacity * 0.85}
      />
      {points.map((p, i) => (
        <g
          key={i}
          opacity={ease((t - 0.25 - i * 0.13) / 0.45) * s.borderOpacity}
        >
          <path
            d={`M${p.x - 6} ${p.y}h12M${p.x} ${p.y - 6}v12`}
            stroke="#dbe4d6"
            strokeWidth={1.6}
          />
        </g>
      ))}
      <g
        opacity={s.rigOpacity}
        transform={`translate(500 620) scale(${0.975 + 0.025 * s.rigOpacity}) translate(-500 -620)`}
      >
        <DrillRig id={id} t={s.rigTime} active />
      </g>
    </g>
  );
}
