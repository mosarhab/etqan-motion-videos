import React from "react";
import { ease, rand } from "./motion";
import { Bolt } from "./GeoMaterials";
export function rigMotion(t: number) {
  const advance = 180 * ease((t - 0.7) / 8.6),
    withdraw = 310 * ease((t - 10.2) / 5.5),
    feed = advance - withdraw;
  return {
    advance,
    withdraw,
    feed,
    headY: 224 + feed,
    tipY: 630 + feed,
    boreBottom: 630 + advance,
    angle: 4 * Math.min(Math.max(t, 0), 10.2),
    sampleReveal: ease((t - 10.4) / 1.2),
  };
}
export function SoilBlock({
  id,
  bottom = 640,
}: {
  id: string;
  bottom?: number;
}) {
  return (
    <g>
      <defs>
        <clipPath id={id + "-soil-clip"}>
          <path d="M70 620H930V950H70Z" />
        </clipPath>
      </defs>
      <path d="M70 620L120 590H980L930 620Z" fill="#80613f" stroke="#9c8259" />
      <path d="M930 620L980 590V920L930 950Z" fill="#253837" stroke="#4b5c53" />
      <g clipPath={`url(#${id}-soil-clip)`}>
        <path d="M70 620H930V950H70Z" fill={`url(#${id}-earth)`} />
        <path
          d="M70 620H930V699C750 675 610 728 430 700S180 720 70 700Z"
          fill="#745131"
        />
        <path
          d="M70 700C230 728 350 678 470 710S770 675 930 699V786C720 804 580 764 400 790S190 770 70 795Z"
          fill="#ad8b55"
        />
        <path
          d="M70 795C230 770 400 815 540 790S780 800 930 786V860C730 838 600 884 430 855S190 880 70 858Z"
          fill="#7a7255"
        />
        <path
          d="M70 858C230 880 380 836 530 866S790 836 930 860V950H70Z"
          fill="#455453"
        />
        <path d="M70 620H930V950H70Z" fill={`url(#${id}-grain)`} />
        {Array.from({ length: 65 }, (_, i) => {
          const x = 80 + rand(i + 17) * 840,
            y = 632 + rand(i + 250) * 310,
            r = 2 + rand(i + 44) * 3.8;
          return (
            <path
              key={i}
              d={`M${x - r} ${y}l${r * 0.9} ${-r * 0.8} ${r * 1.3} ${r * 0.35} ${-r * 0.2} ${r * 1.2} ${-r * 1.4} ${r * 0.3}Z`}
              fill={i % 3 ? "#b3a887" : "#353d37"}
              opacity={0.26 + rand(i + 88) * 0.3}
            />
          );
        })}
        <rect
          x={297}
          y={620}
          width={26}
          height={Math.max(0, bottom - 620)}
          rx={4}
          fill="#101c21"
        />
        <path
          d={`M297 620V${bottom}M323 620V${bottom}`}
          stroke="#151e1f"
          strokeWidth={1.2}
        />
      </g>
      <path
        d="M70 620H930V950H70Z"
        fill="none"
        stroke="#5b6451"
        strokeWidth={1.2}
      />
    </g>
  );
}
export function DrillRig({
  t = 0,
  id,
  active = false,
}: {
  t?: number;
  id: string;
  active?: boolean;
}) {
  const s = {
    ...rigMotion(active ? t : 0),
    angle: active ? rigMotion(t).angle : t * 0.8,
  };
  return (
    <g data-rig="single-upright-mast">
      <ellipse
        cx={530}
        cy={620}
        rx={346}
        ry={21}
        fill="#071018"
        opacity=".45"
      />
      <path
        d="M316 552H720C760 552 779 564 779 586S760 620 720 620H346C302 620 283 605 283 586S300 552 316 552Z"
        fill="#111e27"
        stroke="#52616a"
        strokeWidth={3}
      />
      {[345, 715].map((x) => (
        <g key={x}>
          <ellipse
            cx={x}
            cy={586}
            rx={28}
            ry={28}
            fill="#37454d"
            stroke="#7c898c"
            strokeWidth={2}
          />
          <circle cx={x} cy={586} r={18} fill="#172833" />
          <Bolt x={x} y={586} r={5} />
        </g>
      ))}
      {Array.from({ length: 7 }, (_, i) => (
        <g key={i}>
          <circle
            cx={395 + i * 43}
            cy={590}
            r={18}
            fill="#34434a"
            stroke="#63737b"
          />
          <circle cx={395 + i * 43} cy={590} r={9} fill="#13232d" />
        </g>
      ))}
      {Array.from({ length: 21 }, (_, i) => (
        <g key={i}>
          <path
            d={`M${327 + i * 19} 550h15l4 9h-18Z`}
            fill={i % 2 ? "#56626a" : "#68736f"}
            stroke="#101b22"
          />
          <path
            d={`M${327 + i * 19} 613h18l-4 9h-15Z`}
            fill={i % 2 ? "#4b595e" : "#65706d"}
            stroke="#101b22"
          />
        </g>
      ))}
      {[345, 715].map((x, j) => (
        <g key={j}>
          {Array.from({ length: 9 }, (_, i) => {
            const a = ((i * 20 + 90) * (j ? -1 : 1) * Math.PI) / 180;
            return (
              <rect
                key={i}
                x={x + 35 * Math.cos(a) - 7}
                y={586 + 32 * Math.sin(a) - 4}
                width={14}
                height={8}
                rx={1}
                transform={`rotate(${(a * 180) / Math.PI + 90} ${x + 35 * Math.cos(a)} ${586 + 32 * Math.sin(a)})`}
                fill="#65716f"
                stroke="#15222a"
              />
            );
          })}
        </g>
      ))}
      <path d="M365 566H694V600H365Z" fill="#33434c" stroke="#718186" />
      {[590, 615, 640].map((x) => (
        <path
          key={x}
          d={`M${x + 16} 571l-12 12 12 12h-10l-12-12 12-12Z`}
          fill="#dfb84d"
        />
      ))}
      {[384, 470, 675].map((x) => (
        <Bolt key={x} x={x} y={584} r={2.8} />
      ))}
      <path
        d="M168 524H867V554H168Z"
        fill={`url(#${id}-dark)`}
        stroke="#6d838d"
        strokeWidth={1.5}
      />
      <path d="M168 524L188 513H885L867 524Z" fill="#526b76" />
      {[200, 838].map((x) => (
        <g key={x}>
          <rect
            x={x - 12}
            y={499}
            width={24}
            height={103}
            rx={2}
            fill={`url(#${id}-orange)`}
          />
          <rect
            x={x - 8}
            y={555}
            width={16}
            height={58}
            fill={`url(#${id}-steel)`}
          />
          <ellipse
            cx={x}
            cy={618}
            rx={31}
            ry={8}
            fill="#a84e21"
            stroke="#e69d59"
            strokeWidth={1.5}
          />
          <ellipse cx={x} cy={614} rx={27} ry={6} fill="#e58032" />
          <rect
            x={x - 18}
            y={520}
            width={36}
            height={17}
            fill={`url(#${id}-steel)`}
          />
        </g>
      ))}
      <path d="M450 441L474 426H793L778 441Z" fill="#e7e9df" stroke="#afbbb9" />
      <rect
        x={450}
        y={441}
        width={328}
        height={84}
        rx={2}
        fill={`url(#${id}-white)`}
        stroke="#b7c7c6"
      />
      <rect
        x={492}
        y={467}
        width={250}
        height={56}
        fill={`url(#${id}-orange)`}
        stroke="#ed9d5d"
      />
      {Array.from({ length: 6 }, (_, i) => (
        <path
          key={i}
          d={`M510 ${477 + i * 7}h105M635 ${477 + i * 7}h90`}
          stroke="#6d351e"
          strokeWidth={2.4}
        />
      ))}
      <rect
        x={666}
        y={483}
        width={113}
        height={42}
        rx={2}
        fill={`url(#${id}-dark)`}
        stroke="#5f7783"
      />
      <path d="M777 443L793 426V509L778 525Z" fill="#7c9096" stroke="#b5c4bf" />
      <rect x={482} y={470} width={26} height={55} fill={`url(#${id}-dark)`} />
      <path d="M535 442V408" stroke="#192d39" strokeWidth={19} />
      <ellipse
        cx={535}
        cy={407}
        rx={24}
        ry={7}
        fill="#6b7779"
        stroke="#a8b7b6"
      />
      <path d="M512 407V420Q535 430 558 420V407" fill={`url(#${id}-dark)`} />
      {[472, 570, 665, 758].map((x) => (
        <Bolt key={x} x={x} y={452} r={2.6} />
      ))}
      <g transform="translate(410 525) rotate(-25)">
        <rect
          x={-11}
          y={-137}
          width={22}
          height={137}
          rx={5}
          fill={`url(#${id}-orange)`}
          stroke="#edaa60"
        />
        <rect
          x={-5}
          y={-185}
          width={10}
          height={70}
          fill={`url(#${id}-steel)`}
        />
        <circle r={15} fill="#c96625" stroke="#e99e53" />
        <Bolt x={0} y={0} r={5} />
      </g>
      <path d="M237 83V501M266 83V501" stroke="#1d2e3c" strokeWidth={7} />
      {Array.from({ length: 18 }, (_, i) => (
        <path
          key={i}
          d={`M237 ${95 + i * 23}H266`}
          stroke="#718792"
          strokeWidth={4}
        />
      ))}
      <path
        d="M273 67H347V533H273Z"
        fill="#263d4c"
        stroke="#93a5aa"
        strokeWidth={2}
      />
      <rect x={278} y={78} width={14} height={443} fill={`url(#${id}-white)`} />
      <rect x={330} y={78} width={13} height={443} fill={`url(#${id}-white)`} />
      <rect x={300} y={82} width={19} height={440} fill={`url(#${id}-steel)`} />
      <path d="M295 89V511M324 89V511" stroke="#101f2a" strokeWidth={4} />
      {Array.from({ length: 12 }, (_, i) => (
        <g key={i}>
          <Bolt x={281} y={95 + i * 36} r={1.7} />
          <Bolt x={340} y={95 + i * 36} r={1.7} />
        </g>
      ))}
      <path
        d="M280 65L296 24Q304 17 310 31L337 65Z"
        fill={`url(#${id}-orange)`}
        stroke="#f0af70"
        strokeWidth={1.4}
      />
      <circle cx={306} cy={48} r={7} fill="#172b38" stroke="#8a9c9d" />
      <path d="M274 70H345" stroke="#bed0ce" strokeWidth={7} />
      <path d={`M306 59V${s.headY - 8}`} stroke="#222e37" strokeWidth={2} />
      <path d="M268 67L243 55M344 67L365 55" stroke="#d37134" strokeWidth={5} />
      <circle cx={242} cy={55} r={4} fill="#73858e" />
      <circle cx={366} cy={55} r={4} fill="#73858e" />
      {Array.from({ length: 4 }, (_, i) => (
        <g key={i}>
          <path
            d={`M${520 + i * 11} 471C${432 + i * 5} 451 ${418 + i * 8} ${s.headY + 100} ${347 + i * 2} ${s.headY + 42}`}
            fill="none"
            stroke="#101d28"
            strokeWidth={7 - i * 0.7}
          />
          <path
            d={`M${520 + i * 11} 471C${432 + i * 5} 451 ${418 + i * 8} ${s.headY + 100} ${347 + i * 2} ${s.headY + 42}`}
            fill="none"
            stroke="#69808c"
            strokeOpacity=".5"
            strokeWidth={1}
          />
        </g>
      ))}
      <g transform={`translate(0 ${s.headY})`}>
        <rect
          x={268}
          y={-5}
          width={84}
          height={76}
          rx={2}
          fill="#4a5e66"
          stroke="#a9b7b4"
        />
        <rect
          x={274}
          y={5}
          width={72}
          height={51}
          rx={3}
          fill={`url(#${id}-orange)`}
          stroke="#f2b16b"
        />
        {[282, 338].map((x) => (
          <g key={x}>
            <Bolt x={x} y={12} r={2.5} />
            <Bolt x={x} y={48} r={2.5} />
          </g>
        ))}
        <ellipse
          cx={310}
          cy={60}
          rx={28}
          ry={9}
          fill="#e38031"
          stroke="#f1aa64"
        />
        <path d="M283 59V76Q310 86 337 76V59" fill={`url(#${id}-orange)`} />
        {Array.from({ length: 6 }, (_, i) => {
          const a = s.angle + (i * Math.PI) / 3;
          return (
            <path
              key={i}
              d={`M${310 + 22 * Math.sin(a)} 64v12`}
              stroke="#6f3d25"
              strokeWidth={2}
              opacity={0.2 + 0.7 * Math.max(0, Math.cos(a))}
            />
          );
        })}
        <path d="M298 82H322V92H298Z" fill={`url(#${id}-steel)`} />
      </g>
      <path
        d={`M310 ${s.headY + 86}V${s.tipY - 111}`}
        stroke={`url(#${id}-steel)`}
        strokeWidth={8}
      />
      <path
        d={`M${310 + 2 * Math.sin(s.angle)} ${s.headY + 86}V${s.tipY - 111}`}
        stroke="#dce6de"
        strokeWidth={1.3}
        opacity=".7"
      />
      <g transform={`translate(310 ${s.tipY - 110})`}>
        <rect
          x={-10}
          width={20}
          height={110}
          rx={2}
          fill={`url(#${id}-steel)`}
          stroke="#c9d1c8"
        />
        <rect
          x={-6}
          y={9}
          width={12}
          height={92}
          fill="#917047"
          opacity={s.sampleReveal}
        />
        <rect
          x={-6}
          y={9}
          width={12}
          height={92}
          fill={`url(#${id}-grain)`}
          opacity={s.sampleReveal * 0.65}
        />
        <path d="M-11 3H11M-11 106H11" stroke="#6f8992" strokeWidth={3} />
        <ellipse cy={112} rx={11} ry={4} fill="#ba994b" stroke="#d2b776" />
        {[-7, 0, 7].map((x) => (
          <path key={x} d={`M${x - 2} 113l2 6 2-6`} fill="#d2b776" />
        ))}
      </g>
      {active &&
        t > 0.7 &&
        t < 10.2 &&
        Array.from({ length: 8 }, (_, i) => {
          const a = (t * 1.3 + i * 0.25) % 1;
          return (
            <circle
              key={i}
              cx={310 + (i % 2 ? 1 : -1) * (14 + a * 15)}
              cy={619 - 18 * Math.sin(a * Math.PI)}
              r={1.4 + rand(i + 30)}
              fill="#9e8456"
              opacity={(1 - a) * 0.55}
            />
          );
        })}
    </g>
  );
}
export function RigWorld({
  t = 0,
  id,
  active = false,
  camera = false,
}: {
  t?: number;
  id: string;
  active?: boolean;
  camera?: boolean;
}) {
  const s = rigMotion(active ? t : 0),
    a = ease(t / 12),
    z = camera ? 1 + 0.04 * a : 1 + 0.015 * ease(t / 8),
    fy = 500;
  return (
    <g transform={`translate(500 500) scale(${z}) translate(-500 ${-fy})`}>
      <SoilBlock id={id} bottom={active ? s.boreBottom : 640} />
      <DrillRig id={id} t={t} active={active} />
    </g>
  );
}
