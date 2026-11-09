import React from "react";
import {
  AbsoluteFill,
  Composition,
  Sequence,
  useVideoConfig,
  staticFile,
} from "remotion";
import { Audio } from "@remotion/media";
import { Stage } from "./Stage";
import { Titles } from "./Typography";
export function Film() {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: "#f5f7f7" }}>
      <Stage />
      <Titles />
      <Audio src={staticFile("etqan-concrete-score.wav")} premountFor={fps} />
    </AbsoluteFill>
  );
}
export const Root = () => (
  <>
    <Composition
      id="EtqanConcrete60"
      component={Film}
      durationInFrames={1800}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);
