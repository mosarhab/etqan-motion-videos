import React, { useState, useEffect } from "react";
import {
  AbsoluteFill,
  Img,
  staticFile,
  useCurrentFrame,
  delayRender,
  continueRender,
} from "remotion";
import { project, View, V3, smooth, clamp } from "./World";
const css = `@font-face{font-family:EtqanPlex;src:url('${staticFile("Arabic-Medium.ttf")}');font-weight:500;font-display:block}@font-face{font-family:EtqanPlex;src:url('${staticFile("Arabic-SemiBold.ttf")}');font-weight:600;font-display:block}`;
export function Fonts() {
  const [hold] = useState(() => delayRender("Loading Arabic editorial fonts"));
  useEffect(() => {
    Promise.all([
      document.fonts.load("500 48px EtqanPlex"),
      document.fonts.load("600 100px EtqanPlex"),
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
        fontFamily: "EtqanPlex",
        direction: "rtl",
        color: "#f6efdf",
        opacity: a,
      }}
    >
      <div
        style={{
          position: "absolute",
          right: 100,
          top: 150,
          textAlign: "right",
          translate: `0 ${18 * (1 - smooth(t / 0.8))}px`,
        }}
      >
        <div style={{ fontSize: 45, fontWeight: 500, lineHeight: 1.5 }}>
          {prefix}
        </div>
        <div
          style={{
            fontSize: 110,
            fontWeight: 600,
            lineHeight: 1.45,
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
            marginTop: 16,
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
  x = 100,
  y = 570,
  width = 410,
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
}) {
  const p = project(point, view),
    reveal = smooth((t - start) / 0.6),
    a = 1 - smooth((t - end + 0.35) / 0.35);
  const right = x + width,
    elbow = [right - 90, y + 90],
    finish = [x + 35, y + 90];
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
        style={{
          position: "absolute",
          left: x,
          top: y,
          width,
          fontFamily: "EtqanPlex",
          fontWeight: 500,
          fontSize: 47,
          lineHeight: 1.6,
          color: "#f3ecd9",
          textAlign: "center",
          textShadow: "0 2px 22px #07101c",
          opacity: smooth((t - start - 0.45) / 0.5),
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
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
        bottom: 215,
        width: "100%",
        textAlign: "center",
        fontFamily: "EtqanPlex",
        fontSize: 55,
        fontWeight: 500,
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
  const t = useCurrentFrame() / 30;
  return (
    <AbsoluteFill
      style={{
        background: "radial-gradient(ellipse at 50% 40%,#fffdf7,#d7e0e5)",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "EtqanPlex",
        direction: "rtl",
        color: "#1c3155",
      }}
    >
      <Fonts />
      <div
        style={{
          width: 900,
          textAlign: "center",
          opacity: smooth(t / 0.55),
          translate: `0 ${20 * (1 - smooth(t / 0.8))}px`,
        }}
      >
        <Img
          src={staticFile("etqan-logo.png")}
          style={{ width: 900, height: "auto", objectFit: "contain" }}
        />
        <div
          style={{
            width: 75,
            height: 4,
            background: "#edc323",
            margin: "65px auto 34px",
          }}
        />
        <div style={{ fontSize: 42, fontWeight: 500, lineHeight: 1.9 }}>
          مختبر اتقان البناء لفحص التربة و المواد
        </div>
        <div
          style={{
            fontSize: 66,
            fontWeight: 600,
            marginTop: 45,
            opacity: smooth((t - 0.5) / 0.65),
          }}
        >
          الدقة أساس الثقة
        </div>
      </div>
    </AbsoluteFill>
  );
}
