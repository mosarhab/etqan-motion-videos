import React from "react";
import { staticFile } from "remotion";
import { ease, gold, rand } from "./motion";
export function SoilSample({
  id,
  x = 500,
  y = 170,
  w = 170,
  h = 360,
  capGap = 0,
  label = true,
  labelOpacity = 1,
}: {
  id: string;
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  capGap?: number;
  label?: boolean;
  labelOpacity?: number;
}) {
  const r = w / 2,
    clip = id + "-sample-" + x;
  return (
    <g transform={`translate(${x} ${y})`}>
      <defs>
        <clipPath id={clip}>
          <path d={`M${-r + 10} 20H${r - 10}V${h - 16}H${-r + 10}Z`} />
        </clipPath>
      </defs>
      <path
        d={`M${-r} 15Q0 -6 ${r} 15V${h - 12}Q0 ${h + 8} ${-r} ${h - 12}Z`}
        fill={`url(#${id}-white)`}
        fillOpacity=".4"
        stroke="#a9c1c8"
        strokeWidth={2}
      />
      <g clipPath={`url(#${clip})`}>
        <rect
          x={-r + 10}
          y={25}
          width={w - 20}
          height={h - 38}
          fill={`url(#${id}-earth)`}
        />
        <rect
          x={-r + 10}
          y={25}
          width={w - 20}
          height={h - 38}
          fill={`url(#${id}-grain)`}
        />
      </g>
      <path
        d={`M${-r + 9} 25V${h - 24}`}
        stroke="#d4e8e7"
        strokeWidth={4}
        opacity=".45"
      />
      <path d={`M${r - 9} 25V${h - 24}`} stroke="#6f8b96" strokeWidth={3} />
      <g transform={`translate(0 ${-capGap})`}>
        <path
          d={`M${-r - 8} -2V20Q0 40 ${r + 8} 20V-2Z`}
          fill={`url(#${id}-dark)`}
          stroke="#8ba7b1"
        />
        <ellipse cy={-2} rx={r + 8} ry={17} fill="#47616d" stroke="#a6bac2" />
        <path
          d={`M${-r - 6} 13Q0 33 ${r + 6} 13`}
          fill="none"
          stroke="#bac9c6"
          opacity=".5"
        />
      </g>
      <path
        d={`M${-r - 8} ${h - 12}V${h + 2}Q0 ${h + 22} ${r + 8} ${h + 2}V${h - 12}`}
        fill={`url(#${id}-dark)`}
        stroke="#7b98a4"
      />
      {label && (
        <g opacity={labelOpacity}>
          <path
            d={`M${-r - 2} ${h * 0.49}Q0 ${h * 0.53} ${r + 2} ${h * 0.49}V${h * 0.68}Q0 ${h * 0.73} ${-r - 2} ${h * 0.68}Z`}
            fill="#e7e7d6"
            opacity=".95"
          />
          <text
            x={0}
            y={h * 0.62}
            textAnchor="middle"
            direction="rtl"
            fontFamily="EtqanCairo"
            fontSize={26}
            fill="#1b3a4b"
          >
            عينة تربة
          </text>
        </g>
      )}
    </g>
  );
}
export function SieveStation({
  t,
  id,
  sampleOpacity = 1,
}: {
  t: number;
  id: string;
  sampleOpacity?: number;
}) {
  const a = ease((t - 0.4) / 0.8) * (1 - ease((t - 10.5) / 1)),
    shake = Math.sin(t * 32) * 1.05 * a;
  return (
    <g>
      <path d="M110 623H890L915 640H85Z" fill="#263f50" stroke="#718c99" />
      <g opacity={sampleOpacity}>
        <SoilSample id={id} x={180} y={462} w={72} h={143} label={false} />
      </g>
      <g transform={`translate(${shake} 0)`}>
        <path
          d="M287 540H780V615H287Z"
          fill={`url(#${id}-white)`}
          stroke="#a5b8bd"
        />
        <path d="M287 540L310 528H803L780 540Z" fill="#dae0da" />
        <path d="M780 540L803 528V602L780 615Z" fill="#496572" />
        <rect
          x={310}
          y={557}
          width={145}
          height={41}
          rx={3}
          fill="#143144"
          stroke="#6f909f"
        />
        <circle cx={422} cy={577} r={6} fill={gold} />
        <path d="M333 570H389M333 582H370" stroke="#7092a2" strokeWidth={2} />
        <path d="M310 615V625M758 615V625" stroke="#102733" strokeWidth={16} />
        {[0, 1, 2, 3].map((i) => {
          const y = 202 + i * 82;
          return (
            <g key={i}>
              <defs>
                <clipPath id={`${id}-mesh-${i}`}>
                  <ellipse cx={540} cy={y + 48} rx={155} ry={20} />
                </clipPath>
              </defs>
              <path
                d={`M365 ${y}C365 ${y - 35} 715 ${y - 35} 715 ${y}V${y + 51}C715 ${y + 86} 365 ${y + 86} 365 ${y + 51}Z`}
                fill={`url(#${id}-steel)`}
                stroke="#bac9c6"
                strokeWidth={1.4}
              />
              <ellipse
                cx={540}
                cy={y}
                rx={175}
                ry={29}
                fill="#1b3544"
                stroke="#bed0ce"
                strokeWidth={3}
              />
              <ellipse
                cx={540}
                cy={y + 48}
                rx={155}
                ry={20}
                fill="#47616b"
                opacity=".8"
              />
              <g
                clipPath={`url(#${id}-mesh-${i})`}
                stroke="#a4b4ad"
                strokeWidth={0.7}
                opacity=".45"
              >
                {Array.from({ length: 22 }, (_, j) => (
                  <path
                    key={j}
                    d={`M${375 + j * 16} ${y + 24}V${y + 72}M375 ${y + 25 + j * 3}H705`}
                  />
                ))}
              </g>
              <path
                d={`M365 ${y + 50}Q540 ${y + 108} 715 ${y + 50}`}
                fill="none"
                stroke="#bbc9c1"
                strokeWidth={4}
              />
            </g>
          );
        })}
        {Array.from({ length: 64 }, (_, i) => {
          const r = 1.8 + rand(i + 84) * 4.5,
            level = r > 5 ? 0 : r > 4 ? 1 : r > 3 ? 2 : 3,
            start = 80 - rand(i + 11) * 45,
            target = 248 + level * 82 + rand(i + 221) * 8,
            progress = Math.min(
              1,
              Math.max(0, (t - 0.6 - rand(i + 95) * 1.2) / (1.8 + level * 0.3)),
            ),
            y = start + (target - start) * progress ** 1.4,
            x = 540 + (rand(i + 1) - 0.5) * 270;
          return (
            <path
              key={i}
              opacity={ease((t - 0.3) / 0.35)}
              d={`M${x - r} ${y}l${r * 0.8} ${-r} ${r * 1.4} ${r * 0.4} ${-r * 0.3} ${r * 1.5}Z`}
              fill={i % 3 ? "#a99160" : "#d0b980"}
              stroke="#665a3b"
              strokeWidth={0.5}
            />
          );
        })}
      </g>
      <text
        x={540}
        y={706}
        textAnchor="middle"
        direction="rtl"
        fontFamily="EtqanCairo"
        fontSize={31}
        fill="#c8d9df"
      >
        التدرّج الحبيبي
      </text>
    </g>
  );
}
export function ReportCover({ id, t = 3 }: { id: string; t?: number }) {
  const a = ease(t / 1.7);
  return (
    <g data-art="geotechnical-report-cover">
      <g
        opacity={1 - a * 0.7}
        transform={`translate(${-100 * (1 - a)} ${30 * (1 - a)}) rotate(${-6 * (1 - a)} 500 400)`}
      >
        <path d="M300 210H660V643H300Z" fill="#c1cdc7" stroke="#91a7a8" />
        <text
          x={480}
          y={280}
          fontFamily="EtqanCairo"
          fontSize={30}
          fill="#234253"
          direction="rtl"
          textAnchor="middle"
        >
          بيانات الموقع
        </text>
      </g>
      <g
        opacity={1 - a * 0.7}
        transform={`translate(${100 * (1 - a)} ${15 * (1 - a)}) rotate(${6 * (1 - a)} 500 400)`}
      >
        <path d="M340 190H700V623H340Z" fill="#d6ded5" stroke="#9fb5b7" />
        <text
          x={520}
          y={260}
          fontFamily="EtqanCairo"
          fontSize={30}
          fill="#234253"
          direction="rtl"
          textAnchor="middle"
        >
          نتائج الاختبارات
        </text>
      </g>
      <g opacity={ease((t - 0.6) / 1)}>
        <path d="M320 210H680L694 199V639L680 650H320Z" fill="#8fa5a8" />
        <path
          d="M320 210H680V650H320Z"
          fill={`url(#${id}-paper)`}
          stroke="#b9c7c5"
          strokeWidth={1.5}
        />
        <rect x={320} y={210} width={7} height={440} fill={gold} />
        <image
          href={staticFile("etqan-logo.png")}
          x={372}
          y={245}
          width={256}
          height={69}
        />
        <path d="M365 341H635" stroke="#bba56b" strokeWidth={1} />
        <text
          x={500}
          y={408}
          direction="rtl"
          textAnchor="middle"
          fontFamily="EtqanCairo"
          fontSize={40}
          fontWeight={700}
          fill="#17394c"
        >
          تقرير الدراسة
        </text>
        <text
          x={500}
          y={468}
          direction="rtl"
          textAnchor="middle"
          fontFamily="EtqanCairo"
          fontSize={44}
          fontWeight={750}
          fill="#17394c"
        >
          الجيوتقنية
        </text>
        <path d="M455 512H545" stroke="#c9a34b" strokeWidth={3} />
        <text
          x={500}
          y={567}
          direction="rtl"
          textAnchor="middle"
          fontFamily="EtqanCairo"
          fontSize={29}
          fill="#706346"
        >
          توصيات التأسيس
        </text>
      </g>
    </g>
  );
}
