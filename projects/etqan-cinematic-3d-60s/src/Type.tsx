import React, { useEffect, useState } from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  staticFile,
  Img,
  delayRender,
  continueRender,
} from "remotion";
const fontCSS = `@font-face{font-family:EtqanArabic;src:url('${staticFile("NotoSansArabic-Bold.ttf")}');font-weight:700;font-display:block} @font-face{font-family:EtqanArabic;src:url('${staticFile("NotoSansArabic-Regular.ttf")}');font-weight:400;font-display:block}`;
export const Fonts = () => {
  const [handle] = useState(() => delayRender("Arabic font shaping"));
  useEffect(() => {
    Promise.all([
      document.fonts.load("700 60px EtqanArabic"),
      document.fonts.load("400 34px EtqanArabic"),
    ]).then(() => continueRender(handle));
  }, [handle]);
  return <style>{fontCSS}</style>;
};
export function Title({
  text,
  sub,
  duration = 240,
  size = 66,
  bottom = 265,
  enter = 22,
}: {
  text: string;
  sub?: string;
  duration?: number;
  size?: number;
  bottom?: number;
  enter?: number;
}) {
  const f = useCurrentFrame();
  const a = interpolate(
    f,
    [enter, enter + 23, duration - 18, duration],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: bottom,
        pointerEvents: "none",
        direction: "rtl",
        fontFamily: "EtqanArabic",
        color: "#fff",
        opacity: a,
      }}
    >
      <Fonts />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          height: 620,
          width: "100%",
          background:
            "linear-gradient(0deg,rgba(3,10,23,.97),rgba(3,10,23,.6) 50%,transparent)",
          zIndex: 0,
        }}
      />
      <div
        style={{
          zIndex: 1,
          width: 76,
          height: 4,
          marginBottom: 34,
          background: "#f6c514",
          boxShadow: "0 0 25px #f6c51466",
          scale: `${interpolate(f, [enter, enter + 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} 1`,
        }}
      />
      <div
        style={{
          width: 930,
          fontSize: size,
          fontWeight: 700,
          lineHeight: 1.7,
          textAlign: "center",
          translate: `0 ${interpolate(f, [enter, enter + 28], [28, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px`,
          textShadow: "0 4px 30px #000",
        }}
      >
        {text}
      </div>
      {sub && (
        <div
          style={{
            fontSize: 34,
            lineHeight: 1.8,
            fontWeight: 400,
            marginTop: 12,
            zIndex: 1,
            color: "#c6d4df",
          }}
        >
          {sub}
        </div>
      )}
    </AbsoluteFill>
  );
}
export function ClosingBrand() {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "EtqanArabic",
        direction: "rtl",
        color: "#132b4a",
      }}
    >
      <Fonts />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 50% 38%,#ffffff 0%,#e6edf0 44%,#b0becb 100%)",
          opacity: interpolate(f, [0, 20], [0, 1], {
            extrapolateRight: "clamp",
          }),
        }}
      />
      <Fonts />
      <div
        style={{
          position: "absolute",
          width: 1400,
          height: 1400,
          border: "1px solid rgba(19,43,74,.08)",
          borderRadius: "50%",
          translate: `0 ${f * 0.2}px`,
          rotate: `${f * 0.1}deg`,
        }}
      />
      <div
        style={{
          zIndex: 1,
          width: 900,
          textAlign: "center",
          opacity: interpolate(f, [2, 22], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          translate: `0 ${interpolate(f, [0, 30], [30, 0], { extrapolateRight: "clamp" })}px`,
        }}
      >
        <Img
          src={staticFile("etqan-logo.png")}
          style={{ width: 900, height: "auto", objectFit: "contain" }}
        />
        <div
          style={{
            margin: "70px auto 38px",
            width: 80,
            height: 5,
            background: "#f1c412",
          }}
        />
        <div style={{ fontSize: 42, lineHeight: 1.8, fontWeight: 700 }}>
          مختبر اتقان البناء لفحص التربة و المواد
        </div>
        <div
          style={{
            fontSize: 63,
            fontWeight: 700,
            marginTop: 58,
            opacity: interpolate(f, [18, 40], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          الدقة أساس الثقة
        </div>
      </div>
    </AbsoluteFill>
  );
}
