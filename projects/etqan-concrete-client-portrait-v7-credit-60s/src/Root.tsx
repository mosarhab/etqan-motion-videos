import React from "react";
import { AbsoluteFill, Composition, Sequence, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import { BrandFrame } from "./Brand";
import { Opening } from "./Opening";
import { Fresh } from "./Fresh";
import { Samples } from "./Samples";
import { Curing } from "./Curing";
import { Compression } from "./Compression";
import { Closing } from "./Closing";
export function Film() {
  return (
    <AbsoluteFill>
      <BrandFrame />
      <Sequence name="القوة لا تفترض بل تختبر" from={0} durationInFrames={198}>
        <Opening embedded />
      </Sequence>
      <Sequence name="الهبوط ودرجة الحرارة" from={180} durationInFrames={438}>
        <Fresh embedded />
      </Sequence>
      <Sequence name="العينات الأسطوانية" from={600} durationInFrames={378}>
        <Samples embedded />
      </Sequence>
      <Sequence name="المعالجة قبل المقاومة" from={960} durationInFrames={348}>
        <Curing embedded />
      </Sequence>
      <Sequence name="مقاومة الضغط" from={1290} durationInFrames={378}>
        <Compression embedded />
      </Sequence>
      <Sequence name="نتائج تدعم القرار" from={1650} durationInFrames={150}>
        <Closing embedded />
      </Sequence>
      <Audio src={staticFile("score.m4a")} premountFor={30} />
    </AbsoluteFill>
  );
}
export const RemotionRoot = () => (
  <>
    <Composition
      id="EtqanConcretePortraitV7Credit"
      component={Film}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={1800}
    />
    <Composition
      id="Opening"
      component={Opening}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={198}
      defaultProps={{ embedded: false }}
    />
    <Composition
      id="Fresh"
      component={Fresh}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={438}
      defaultProps={{ embedded: false }}
    />
    <Composition
      id="Samples"
      component={Samples}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={378}
      defaultProps={{ embedded: false }}
    />
    <Composition
      id="Curing"
      component={Curing}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={348}
      defaultProps={{ embedded: false }}
    />
    <Composition
      id="Compression"
      component={Compression}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={378}
      defaultProps={{ embedded: false }}
    />
    <Composition
      id="Closing"
      component={Closing}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={150}
      defaultProps={{ embedded: false }}
    />
  </>
);
