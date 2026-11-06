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
export const contactNumbers = [
  "0535588975",
  "0575828265",
  "0573870072",
  "0551603205",
];
export function CreatorLogo({
  width = 104,
  opacity = 0.86,
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
/** Entire-film lower-third correction; the gradient is opaque before the previous text baseline. */
export function FooterOverlay() {
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
            "linear-gradient(to bottom,rgba(3,13,27,0) 0%,rgba(3,13,27,1) 20%,rgba(3,13,27,1) 100%)",
        }}
      />
      <div
        dir="rtl"
        data-contact="address"
        style={{
          position: "absolute",
          left: 220,
          right: 64,
          bottom: 160,
          textAlign: "center",
          fontSize: 32,
          fontWeight: 550,
          lineHeight: 1.5,
          color: "#e8e2cf",
        }}
      >
        حي القادسية، الرياض
      </div>
      <div
        dir="ltr"
        style={{
          position: "absolute",
          left: 220,
          right: 64,
          bottom: 32,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          columnGap: 24,
          rowGap: 4,
          fontSize: 38,
          fontWeight: 650,
          lineHeight: 1.35,
          fontVariantNumeric: "tabular-nums",
          color: "#fff",
          textAlign: "center",
        }}
      >
        <span data-contact="phone">0535588975</span>
        <span data-contact="phone">0575828265</span>
        <span data-contact="phone">0573870072</span>
        <span data-contact="phone">0551603205</span>
      </div>
      <div style={{ position: "absolute", left: 64, bottom: 38 }}>
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
