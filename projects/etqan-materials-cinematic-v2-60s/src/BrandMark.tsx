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
export function ContactFooter() {
  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        fontFamily: "EtqanCairo",
        justifyContent: "flex-end",
      }}
    >
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
      <div
        style={{
          position: "absolute",
          bottom: 112,
          left: 80,
          right: 80,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 32,
          color: "#fff",
        }}
      >
        <span
          dir="ltr"
          data-contact="phone"
          style={{
            fontSize: 43,
            fontWeight: 650,
            lineHeight: 1.5,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          0535588975
        </span>
        <span
          style={{ height: 31, width: 2, background: "#e8bd40", opacity: 0.8 }}
        />
        <span
          dir="rtl"
          data-contact="address"
          style={{ fontSize: 36, fontWeight: 550, lineHeight: 1.5 }}
        >
          حي القادسية، الرياض
        </span>
      </div>
    </AbsoluteFill>
  );
}
