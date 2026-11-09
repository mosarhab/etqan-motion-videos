import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { BrandFrame } from "./Brand";
import { ease, gold, muted } from "./motion";
export type SceneProps = { embedded?: boolean };
export function Scene({
  embedded = false,
  duration,
  first = false,
  last = false,
  children,
}: {
  embedded?: boolean;
  duration: number;
  first?: boolean;
  last?: boolean;
  children: React.ReactNode;
}) {
  const f = useCurrentFrame();
  const a =
    (first ? 1 : ease(f / 12)) * (last ? 1 : ease((duration - 1 - f) / 12));
  return (
    <AbsoluteFill style={{ fontFamily: "EtqanCairo", color: "#fff" }}>
      {!embedded && <BrandFrame />}
      <AbsoluteFill
        style={{ opacity: a, transform: `translateX(${(1 - a) * 12}px)` }}
      >
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
}
export function Art({ children }: { children: React.ReactNode }) {
  return (
    <svg
      data-graphic="animated-engineering-drawing"
      width={1000}
      height={740}
      viewBox="0 0 1000 740"
      style={{ position: "absolute", left: 70, top: 207, overflow: "visible" }}
    >
      {children}
    </svg>
  );
}
export function Copy({
  title,
  accent,
  process,
  benefit,
  detail,
  kicker = "فحوصات الخرسانة",
}: {
  title: string;
  accent: string;
  process: string;
  benefit: string;
  detail: string;
  kicker?: string;
}) {
  const t = useCurrentFrame() / useVideoConfig().fps;
  const a = ease(t / 0.65);
  return (
    <div
      data-copy="client-explanation"
      dir="rtl"
      style={{
        position: "absolute",
        right: 88,
        top: 222,
        width: 690,
        textAlign: "right",
        transform: `translateY(${12 * (1 - a)}px)`,
      }}
    >
      <div
        style={{
          fontSize: 27,
          fontWeight: 500,
          color: muted,
          marginBottom: 22,
        }}
      >
        {kicker}
      </div>
      <div style={{ fontSize: 76, fontWeight: 750, lineHeight: 1.3 }}>
        {title}
      </div>
      <div
        style={{
          fontSize: 79,
          fontWeight: 800,
          lineHeight: 1.35,
          color: gold,
          marginTop: 4,
        }}
      >
        {accent}
      </div>
      <div
        style={{
          margin: "24px 0 24px auto",
          width: 82,
          height: 3,
          background: gold,
        }}
      />
      <div
        style={{
          fontSize: 33,
          lineHeight: 1.8,
          color: "#c6d9e1",
          fontWeight: 500,
          minHeight: 108,
        }}
      >
        {process}
      </div>
      <div
        style={{
          fontSize: 23,
          color: gold,
          fontWeight: 500,
          marginTop: 24,
          marginBottom: 9,
        }}
      >
        الفائدة لمشروعك
      </div>
      <div style={{ fontSize: 43, fontWeight: 750, lineHeight: 1.5 }}>
        {benefit}
      </div>
      <div
        style={{
          fontSize: 31,
          lineHeight: 1.85,
          color: "#a9c3cf",
          marginTop: 12,
        }}
      >
        {detail}
      </div>
    </div>
  );
}
