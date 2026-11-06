import React from "react";
import {
  AbsoluteFill,
  Img,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from "remotion";

/** User-requested white lettering, original gold; original PNG and alpha intact. */
export function Logo({ width = 280 }: { width?: number }) {
  const filterId = "etqan-white-gold-" + React.useId().replace(/:/g, "");
  return (
    <>
      <svg
        width="0"
        height="0"
        style={{ position: "absolute" }}
        aria-hidden="true"
      >
        <defs>
          <filter
            id={filterId}
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
            <feFlood floodColor="#ffffff" result="white" />
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
        src={staticFile("etqan-logo.png")}
        style={{
          display: "block",
          width,
          height: (width * 552) / 2048,
          objectFit: "contain",
          filter: `url(#${filterId})`,
        }}
      />
    </>
  );
}
export function BrandMark() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div
      style={{
        position: "absolute",
        left: 80,
        top: 105,
        opacity: interpolate(frame, [55.25 * fps, 55.65 * fps], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
        pointerEvents: "none",
      }}
    >
      <Logo />
    </div>
  );
}
export const contactNumbers = ["0535588975"];
export function CreatorLogo({
  width = 46,
  opacity = 0.5,
}: {
  width?: number;
  opacity?: number;
}) {
  return (
    <Img
      src={staticFile("creator-logo-mask.png")}
      style={{
        display: "block",
        width,
        height: (width * 959) / 1640,
        objectFit: "contain",
        filter: "brightness(0) invert(1)",
        opacity,
      }}
    />
  );
}
function ContactIcon({ kind }: { kind: "mail" | "pin" | "phone" }) {
  return (
    <svg
      aria-hidden="true"
      width={22}
      height={22}
      viewBox="0 0 24 24"
      fill="none"
      stroke="#d1ad61"
      strokeWidth={1.65}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ flexShrink: 0 }}
    >
      {kind === "mail" && (
        <>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m4 7 8 6 8-6" />
        </>
      )}
      {kind === "pin" && (
        <>
          <path d="M20 10c0 6-8 11-8 11S4 16 4 10a8 8 0 1 1 16 0Z" />
          <circle cx="12" cy="10" r="2.5" />
        </>
      )}
      {kind === "phone" && (
        <path d="M6.7 3.5 10 7.8 8.1 10a15 15 0 0 0 5.9 5.9l2.2-1.9 4.3 3.3-.6 3.1c-.2.8-.9 1.3-1.7 1.2C9.7 20.5 3.5 14.3 2.4 5.8c-.1-.8.4-1.5 1.2-1.7l3.1-.6Z" />
      )}
    </svg>
  );
}
function Divider() {
  return (
    <span
      aria-hidden="true"
      style={{
        width: 1,
        height: 25,
        background: "rgba(193,155,83,.32)",
        flexShrink: 0,
      }}
    />
  );
}
/** Contact strip matches the user's reference, with a tiny authorship mark below it. */
export function FooterOverlay() {
  const group: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 12,
    whiteSpace: "nowrap",
  };
  return (
    <AbsoluteFill style={{ pointerEvents: "none", fontFamily: "EtqanCairo" }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1680,
          bottom: 0,
          background:
            "linear-gradient(to bottom,rgba(3,19,31,0) 0%,rgba(3,19,31,1) 20%,rgba(3,19,31,1) 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1750,
          height: 1,
          background: "rgba(193,155,83,.3)",
        }}
      />
      <div
        dir="ltr"
        style={{
          position: "absolute",
          left: 88,
          right: 88,
          bottom: 94,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 18,
          lineHeight: 1.5,
          color: "#fff",
        }}
      >
        <div style={group}>
          <span data-contact="email" style={{ fontSize: 26, fontWeight: 500 }}>
            info@etqanelbnaa.com
          </span>
          <ContactIcon kind="mail" />
        </div>
        <Divider />
        <div style={group}>
          <span
            dir="rtl"
            data-contact="address"
            style={{ fontSize: 28, fontWeight: 500 }}
          >
            حي القادسية، الرياض
          </span>
          <ContactIcon kind="pin" />
        </div>
        <Divider />
        <div style={group}>
          <span
            data-contact="phone"
            style={{
              fontSize: 31.5,
              fontWeight: 700,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            0535588975
          </span>
          <ContactIcon kind="phone" />
        </div>
      </div>
      <div style={{ position: "absolute", left: 40, bottom: 22 }}>
        <CreatorLogo />
      </div>
    </AbsoluteFill>
  );
}
export function ContactFooter() {
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          height: 285,
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          background:
            "linear-gradient(transparent,rgba(3,13,27,.82) 72%,rgba(3,13,27,.96))",
        }}
      />
      <FooterOverlay />
    </AbsoluteFill>
  );
}
