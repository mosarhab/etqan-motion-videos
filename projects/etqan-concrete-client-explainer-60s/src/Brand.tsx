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
          "radial-gradient(ellipse at 26% 48%,#12394a 0%,#082438 38%,#041725 76%)",
      }}
    >
      <Fonts />
      <svg
        width={1920}
        height={1080}
        style={{ position: "absolute", inset: 0 }}
      >
        <defs>
          <linearGradient id="bg-stroke">
            <stop stopColor="#95c2cc" stopOpacity=".02" />
            <stop offset=".6" stopColor="#8db4c5" stopOpacity=".10" />
            <stop offset="1" stopColor="#b9c9d1" stopOpacity=".015" />
          </linearGradient>
        </defs>
        {Array.from({ length: 26 }, (_, i) => (
          <path
            key={i}
            d={`M${-500 + i * 78},1050 Q${200 + i * 45},500 ${-100 + i * 73},165`}
            stroke="url(#bg-stroke)"
            strokeWidth={1}
            fill="none"
          />
        ))}
        {Array.from({ length: 24 }, (_, i) => (
          <circle
            key={i}
            cx={100 + rand(i + 1) * 900}
            cy={220 + ((rand(i + 40) * 700 + t * (1 + rand(i) * 1.5)) % 700)}
            r={0.7 + rand(i + 60)}
            fill="#a9c6ce"
            opacity={0.09 + rand(i + 7) * 0.1}
          />
        ))}
      </svg>
      <div
        data-brand="header"
        style={{
          position: "absolute",
          inset: "0 0 auto 0",
          height: 167,
          background: "linear-gradient(#041522f5,#041522a0)",
        }}
      >
        <div style={{ position: "absolute", left: 30, top: 15 }}>
          <Logo />
        </div>
        <div
          dir="rtl"
          style={{
            position: "absolute",
            right: 86,
            top: 34,
            textAlign: "right",
            lineHeight: 1.4,
            color: "#fff",
          }}
        >
          <div style={{ fontSize: 36, fontWeight: 800 }}>
            مختبر إتقان البناء
          </div>
          <div
            style={{
              fontSize: 27,
              fontWeight: 500,
              color: "#9bb6c5",
              marginTop: 5,
            }}
          >
            لفحص التربة والمواد
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            left: 76,
            right: 76,
            bottom: 0,
            height: 1,
            background: "#87a1ae35",
          }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          top: 209,
          bottom: 168,
          left: 1087,
          width: 1,
          background:
            "linear-gradient(transparent,#b5c8ce25 20%,#b5c8ce25 80%,transparent)",
        }}
      />
      <div
        data-brand="footer"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 90,
          background: "#031521",
          borderTop: "1px solid #bfa25470",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 100px",
          color: "#eef5f6",
          fontSize: 26,
          lineHeight: 1.5,
        }}
      >
        <div style={{ display: "flex", gap: 13, alignItems: "center" }}>
          <span data-contact="email">info@etqanelbnaa.com</span>
          <ContactIcon kind="mail" />
        </div>
        <span style={{ height: 26, width: 1, background: "#a5813f80" }} />
        <div style={{ display: "flex", gap: 13, alignItems: "center" }}>
          <span dir="rtl" data-contact="address">
            حي القادسية، الرياض
          </span>
          <ContactIcon kind="pin" />
        </div>
        <span style={{ height: 26, width: 1, background: "#a5813f80" }} />
        <div style={{ display: "flex", gap: 13, alignItems: "center" }}>
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
