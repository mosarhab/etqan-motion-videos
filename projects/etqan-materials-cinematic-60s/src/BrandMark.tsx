import React from "react";
import { Img, interpolate, staticFile, useCurrentFrame } from "remotion";
/** Original, unmodified logo stays visible until the closing logo takes over. */
export function BrandMark() {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        left: 80,
        top: 100,
        padding: 16,
        background: "#f3f1e8",
        opacity: interpolate(frame, [1725, 1740], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
        pointerEvents: "none",
      }}
    >
      <Img
        src={staticFile("etqan-logo.png")}
        style={{
          display: "block",
          width: 256,
          height: 69,
          objectFit: "contain",
        }}
      />
    </div>
  );
}
