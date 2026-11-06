import React, { useState, useEffect } from "react";
import {
  AbsoluteFill,
  Img,
  staticFile,
  useCurrentFrame,
  delayRender,
  continueRender,
  useVideoConfig,
} from "remotion";
import { project, View, V3, smooth, clamp } from "./World";
import { Logo } from "./BrandMark";
import { benefits } from "./Copy";
const css = `@font-face{font-family:EtqanCairo;src:url('${staticFile("Cairo-Variable.ttf")}') format('truetype');font-weight:200 1000;font-display:block}*{box-sizing:border-box}`;
export function Fonts() {
  const [hold] = useState(() => delayRender("Loading Arabic editorial fonts"));
  useEffect(() => {
    Promise.all([
      document.fonts.load("500 48px EtqanCairo"),
      document.fonts.load("750 100px EtqanCairo"),
    ]).then(() => continueRender(hold));
  }, [hold]);
  return <style>{css}</style>;
}
export function Header({
  title,
  prefix = "فحوصات",
  t,
  duration,
}: {
  title: string;
  prefix?: string;
  t: number;
  duration: number;
}) {
  const a =
    smooth((t - 0.15) / 0.65) * (1 - smooth((t - duration + 0.45) / 0.4));
  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        fontFamily: "EtqanCairo",
        direction: "rtl",
        color: "#f6efdf",
        opacity: a,
      }}
    >
      <div
        style={{
          position: "absolute",
          right: 86,
          top: 245,
          textAlign: "right",
          translate: `0 ${18 * (1 - smooth(t / 0.8))}px`,
        }}
      >
        <div style={{ fontSize: 30, fontWeight: 500, lineHeight: 1.4 }}>
          {prefix}
        </div>
        <div
          style={{
            fontSize: 82,
            fontWeight: 750,
            lineHeight: 1.3,
            color: "#f5ca42",
          }}
        >
          {title}
        </div>
        <div
          style={{
            width: 65,
            height: 3,
            background: "#ebc66b",
            marginTop: 10,
            marginRight: 5,
          }}
        />
      </div>
    </AbsoluteFill>
  );
}
export function Callout({
  text,
  point,
  view,
  t,
  start = 1.5,
  end = 5,
  x = 80,
  y = 570,
  width = 480,
  benefit,
  side = "left",
}: {
  text: string;
  point: V3;
  view: View;
  t: number;
  start?: number;
  end?: number;
  x?: number;
  y?: number;
  width?: number;
  benefit?: string | null;
  side?: "left" | "right";
}) {
  const purpose = benefit === undefined ? benefits[text] : benefit;
  const ruleY = y + 90;
  const p = project(point, view),
    reveal = smooth((t - start) / 0.6),
    a = 1 - smooth((t - end + 0.35) / 0.35);
  const right = x + width,
    elbow = [side === "right" ? x + 90 : right - 90, ruleY],
    finish = [side === "right" ? right - 35 : x + 35, ruleY];
  const len =
    Math.hypot(p[0] - elbow[0], p[1] - elbow[1]) +
    Math.hypot(elbow[0] - finish[0], elbow[1] - finish[1]);
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: a }}>
      <svg
        width={1080}
        height={1920}
        style={{ position: "absolute", inset: 0, overflow: "visible" }}
      >
        <path
          d={`M${p[0]},${p[1]} L${elbow[0]},${elbow[1]} L${finish[0]},${finish[1]}`}
          fill="none"
          stroke="#e9e8d7"
          strokeWidth={2}
          strokeLinejoin="round"
          strokeDasharray={len}
          strokeDashoffset={len * (1 - reveal)}
          opacity={0.85}
        />
        <circle cx={p[0]} cy={p[1]} r={6 * reveal} fill="#ffe8a3" />
      </svg>
      <div
        dir="rtl"
        data-test-title={text}
        style={{
          position: "absolute",
          left: x,
          top: y,
          width,
          fontFamily: "EtqanCairo",
          fontWeight: 600,
          fontSize: 45,
          lineHeight: 1.6,
          color: "#f3ecd9",
          textAlign: "center",
          textShadow: "0 2px 22px #07101c",
          opacity: smooth((t - start - 0.15) / 0.35),
        }}
      >
        {text}
      </div>
      {purpose && <Benefit text={purpose} t={t} start={start} end={end} />}
    </AbsoluteFill>
  );
}
export function Benefit({
  text,
  t,
  start = 0.4,
  end = 5,
}: {
  text: string;
  t: number;
  start?: number;
  end?: number;
}) {
  return (
    <div
      data-benefit={text}
      dir="rtl"
      style={{
        position: "absolute",
        left: 80,
        top: 1642,
        width: 920,
        fontFamily: "EtqanCairo",
        fontSize: 38,
        fontWeight: 500,
        lineHeight: 1.65,
        color: "#eadcba",
        textAlign: "center",
        textShadow: "0 2px 18px #061426",
        opacity:
          smooth((t - start - 0.15) / 0.35) *
          (1 - smooth((t - end + 0.35) / 0.35)),
        whiteSpace: "normal",
        textWrap: "balance",
      }}
    >
      {text}
    </div>
  );
}
export function Footer({
  text,
  t,
  start = 0.6,
  end = 5.5,
}: {
  text: string;
  t: number;
  start?: number;
  end?: number;
}) {
  const a = smooth((t - start) / 0.7) * (1 - smooth((t - end + 0.35) / 0.35));
  return (
    <div
      dir="rtl"
      style={{
        position: "absolute",
        top: 1642,
        width: "100%",
        textAlign: "center",
        fontFamily: "EtqanCairo",
        fontSize: 53,
        fontWeight: 600,
        color: "#f4ecda",
        opacity: a,
        textShadow: "0 3px 30px #000",
      }}
    >
      {text}
    </div>
  );
}
export function Closing() {
  const { fps } = useVideoConfig();
  const t = useCurrentFrame() / fps;
  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(ellipse at 50% 38%,#16364c 0%,#07182b 48%,#030d1b 100%)",
        fontFamily: "EtqanCairo",
        color: "white",
        direction: "rtl",
        alignItems: "center",
      }}
    >
      <Fonts />
      <svg
        width="1080"
        height="1920"
        style={{ position: "absolute", inset: 0, opacity: 0.18 }}
      >
        <ellipse
          cx="540"
          cy="815"
          rx="470"
          ry="500"
          fill="none"
          stroke="#dcbb67"
          strokeWidth="1"
          strokeDasharray="900 2300"
          strokeDashoffset={-t * 30}
        />
        <ellipse
          cx="540"
          cy="815"
          rx="520"
          ry="550"
          fill="none"
          stroke="#6da7bb"
          strokeWidth="1"
        />
      </svg>
      <div
        style={{
          position: "absolute",
          top: 605,
          width: 900,
          textAlign: "center",
          opacity: smooth(t / 0.5),
          translate: `0 ${22 * (1 - smooth(t / 0.8))}px`,
        }}
      >
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Logo width={810} />
        </div>
        <div
          style={{
            width: 76,
            height: 3,
            background: "#edc323",
            margin: "65px auto 32px",
          }}
        />
        <div
          data-closing="company"
          style={{ fontSize: 42, fontWeight: 550, lineHeight: 1.85 }}
        >
          مختبر اتقان البناء لفحص التربة و المواد
        </div>
        <div
          style={{
            fontSize: 70,
            fontWeight: 750,
            marginTop: 37,
            opacity: smooth((t - 0.2) / 0.5),
          }}
        >
          الدقة أساس الثقة
        </div>
        <div
          dir="ltr"
          data-contact="email"
          style={{
            fontSize: 45,
            fontWeight: 550,
            marginTop: 82,
            color: "#efe3bf",
            opacity: smooth((t - 0.3) / 0.5),
          }}
        >
          info@etqanelbnaa.com
        </div>
      </div>
    </AbsoluteFill>
  );
}
