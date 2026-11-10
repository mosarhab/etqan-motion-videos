import React, { useState, useEffect } from "react";
import {
  AbsoluteFill,
  Img,
  staticFile,
  delayRender,
  continueRender,
  useCurrentFrame,
} from "remotion";
import { gold, rand } from "./motion";

export function Fonts() {
  const [hold] = useState(() => delayRender("Cairo Arabic font"));
  useEffect(() => {
    Promise.all([
      document.fonts.load("500 40px EtqanCairo"),
      document.fonts.load("800 90px EtqanCairo"),
    ]).then(() => continueRender(hold));
  }, [hold]);
  return (
    <style>{`@font-face{font-family:EtqanCairo;src:url('${staticFile("Cairo-Variable.ttf")}') format('truetype');font-weight:200 1000;font-display:block}*{box-sizing:border-box}`}</style>
  );
}

/** Original PNG and alpha, using the user's previously approved white/gold treatment. */
export function Logo({ width = 430 }: { width?: number }) {
  const id = "white-gold-" + React.useId().replace(/[^a-zA-Z0-9]/g, "");
  return (
    <>
      <svg width={0} height={0} style={{ position: "absolute" }}>
        <defs>
          <filter
            id={id}
            colorInterpolationFilters="sRGB"
            x="0"
            y="0"
            width="100%"
            height="100%"
          >
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  1 0 -1 0 0"
              result="goldSelector"
            />
            <feComponentTransfer in="goldSelector" result="goldThreshold">
              <feFuncA type="linear" slope="20" intercept="-0.7" />
            </feComponentTransfer>
            <feComposite
              in="SourceGraphic"
              in2="goldThreshold"
              operator="in"
              result="goldPixels"
            />
            <feFlood floodColor="#fff" result="white" />
            <feComposite
              in="white"
              in2="SourceGraphic"
              operator="in"
              result="whiteLogo"
            />
            <feMerge>
              <feMergeNode in="whiteLogo" />
              <feMergeNode in="goldPixels" />
            </feMerge>
          </filter>
        </defs>
      </svg>
      <Img
        data-brand="official-logo"
        src={staticFile("etqan-logo.png")}
        style={{
          width,
          height: (width * 552) / 2048,
          objectFit: "contain",
          display: "block",
          filter: `url(#${id})`,
        }}
      />
    </>
  );
}

function ContactIcon({ kind }: { kind: "phone" | "pin" | "mail" }) {
  return (
    <svg
      width={23}
      height={23}
      viewBox="0 0 24 24"
      fill="none"
      stroke={gold}
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {kind === "mail" ? (
        <>
          <rect x={3} y={5} width={18} height={14} rx={2} />
          <path d="m3 6 9 7 9-7" />
        </>
      ) : kind === "pin" ? (
        <>
          <path d="M12 22s7-7 7-13a7 7 0 0 0-14 0c0 6 7 13 7 13Z" />
          <circle cx={12} cy={9} r={2.5} />
        </>
      ) : (
        <path d="M4 3h4l2 5-3 2c2 4 4 6 8 8l2-3 5 2v4c-9 3-20-8-18-18Z" />
      )}
    </svg>
  );
}

export function BrandFrame() {
  const t = useCurrentFrame() / 30;
  return (
    <AbsoluteFill
      style={{
        fontFamily: "EtqanCairo",
        background:
          "radial-gradient(ellipse at 42% 53%,#12394a 0%,#082438 43%,#041725 84%)",
      }}
    >
      <Fonts />
      <svg
        width={1080}
        height={1920}
        style={{ position: "absolute", inset: 0 }}
      >
        <defs>
          <linearGradient id="bg-stroke">
            <stop stopColor="#95c2cc" stopOpacity=".015" />
            <stop offset=".6" stopColor="#8db4c5" stopOpacity=".075" />
            <stop offset="1" stopColor="#b9c9d1" stopOpacity=".01" />
          </linearGradient>
        </defs>
        {Array.from({ length: 22 }, (_, i) => (
          <path
            key={i}
            d={`M${-650 + i * 94},1810 Q${150 + i * 44},950 ${-300 + i * 80},200`}
            stroke="url(#bg-stroke)"
            strokeWidth={1}
            fill="none"
          />
        ))}
        {Array.from({ length: 22 }, (_, i) => {
          const q = (rand(i + 40) + (t * (1 + rand(i) * 1.5)) / 1500) % 1;
          return (
            <circle
              key={i}
              cx={85 + rand(i + 1) * 910}
              cy={270 + q * 1440}
              r={0.7 + rand(i + 60)}
              fill="#a9c6ce"
              opacity={(0.06 + rand(i + 7) * 0.08) * Math.sin(q * Math.PI) ** 2}
            />
          );
        })}
      </svg>
      <div
        data-brand="header"
        style={{
          position: "absolute",
          inset: "0 0 auto 0",
          height: 202,
          background: "linear-gradient(#041522fa,#041522bc)",
        }}
      >
        <div style={{ position: "absolute", left: 0, top: 40 }}>
          <Logo width={410} />
        </div>
        <div
          dir="rtl"
          style={{
            position: "absolute",
            right: 58,
            top: 56,
            textAlign: "right",
            lineHeight: 1.5,
            color: "#fff",
          }}
        >
          <div style={{ fontSize: 34, fontWeight: 800 }}>
            مختبر إتقان البناء
          </div>
          <div
            style={{
              fontSize: 27,
              fontWeight: 500,
              color: "#9bb6c5",
              marginTop: 3,
            }}
          >
            لفحص التربة والمواد
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            left: 64,
            right: 64,
            bottom: 0,
            height: 1,
            background: "#87a1ae35",
          }}
        />
      </div>
      <div
        data-brand="footer"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 114,
          background: "#031521",
          borderTop: "1px solid #bfa25470",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 60px",
          color: "#eef5f6",
          lineHeight: 1.5,
        }}
      >
        <div style={{ display: "flex", gap: 9, alignItems: "center" }}>
          <span data-contact="email" style={{ fontSize: 24 }}>
            info@etqanelbnaa.com
          </span>
          <ContactIcon kind="mail" />
        </div>
        <span style={{ height: 25, width: 1, background: "#a5813f80" }} />
        <div style={{ display: "flex", gap: 9, alignItems: "center" }}>
          <span dir="rtl" data-contact="address" style={{ fontSize: 26 }}>
            حي القادسية، الرياض
          </span>
          <ContactIcon kind="pin" />
        </div>
        <span style={{ height: 25, width: 1, background: "#a5813f80" }} />
        <div style={{ display: "flex", gap: 9, alignItems: "center" }}>
          <span
            data-contact="phone"
            style={{
              fontSize: 29,
              fontWeight: 750,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            0535588975
          </span>
          <ContactIcon kind="phone" />
        </div>
      </div>
    </AbsoluteFill>
  );
}
