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
  const f = useCurrentFrame(),
    enter = first ? 1 : ease(f / 18),
    exit = last ? 1 : ease((duration - 1 - f) / 18);
  return (
    <AbsoluteFill style={{ fontFamily: "EtqanCairo", color: "#fff" }}>
      {!embedded && <BrandFrame />}
      <AbsoluteFill
        style={{
          opacity: enter * exit,
          transform: `translateY(${24 * (1 - enter) - 18 * (1 - exit)}px)`,
        }}
      >
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
}
export function Art({
  children,
  top = 690,
}: {
  children: React.ReactNode;
  top?: number;
}) {
  return (
    <svg
      data-graphic="animated-engineering-drawing"
      width={1050}
      height={777}
      viewBox="0 0 1000 740"
      style={{ position: "absolute", left: 15, top, overflow: "visible" }}
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
  benefitLabel = "الفائدة لمشروعك",
}: {
  title: string;
  accent: string;
  process: string;
  benefit: string;
  detail: string;
  kicker?: string;
  benefitLabel?: string;
}) {
  const t = useCurrentFrame() / useVideoConfig().fps,
    a = ease(t / 0.7);
  return (
    <>
      <div
        data-copy="test-description"
        dir="rtl"
        style={{
          position: "absolute",
          right: 80,
          top: 246,
          width: 920,
          textAlign: "right",
          transform: `translateY(${10 * (1 - a)}px)`,
        }}
      >
        <div
          style={{
            fontSize: 30,
            fontWeight: 500,
            color: muted,
            marginBottom: 22,
          }}
        >
          {kicker}
        </div>
        <div style={{ fontSize: 72, fontWeight: 750, lineHeight: 1.3 }}>
          {title}
        </div>
        <div
          style={{
            fontSize: 76,
            fontWeight: 800,
            lineHeight: 1.35,
            color: gold,
            marginTop: 5,
          }}
        >
          {accent}
        </div>
        <div
          style={{
            margin: "20px 0 21px auto",
            width: 82,
            height: 3,
            background: gold,
          }}
        />
        {process && (
          <div
            style={{
              fontSize: 34,
              lineHeight: 1.8,
              color: "#c6d9e1",
              fontWeight: 500,
            }}
          >
            {process}
          </div>
        )}
      </div>
      {(benefit || detail) && (
        <div
          data-copy="client-benefit"
          dir="rtl"
          style={{
            position: "absolute",
            right: 80,
            top: 1510,
            width: 920,
            textAlign: "right",
          }}
        >
          {benefitLabel && (
            <div
              style={{
                fontSize: 26,
                color: gold,
                fontWeight: 500,
                marginBottom: 11,
              }}
            >
              {benefitLabel}
            </div>
          )}
          {benefit && (
            <div style={{ fontSize: 46, fontWeight: 750, lineHeight: 1.55 }}>
              {benefit}
            </div>
          )}
          {detail && (
            <div
              style={{
                fontSize: 34,
                lineHeight: 1.85,
                color: "#a9c3cf",
                marginTop: 12,
              }}
            >
              {detail}
            </div>
          )}
        </div>
      )}
    </>
  );
}
