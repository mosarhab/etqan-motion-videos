import React from "react";
import {
  AbsoluteFill,
  Composition,
  staticFile,
  useVideoConfig,
} from "remotion";
import { Audio } from "@remotion/media";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { BrandFrame } from "./Brand";
import { Field } from "./Field";
import { Rocks } from "./Rocks";
import { SPT } from "./SPT";
import { Moisture } from "./Moisture";
import { Laboratory } from "./Laboratory";
import { Atterberg } from "./Atterberg";
import { Shear } from "./Shear";
import { Groundwater } from "./Groundwater";
import { Report } from "./Report";
import { Outro } from "./Outro";
export function Film() {
  const { fps } = useVideoConfig(),
    blend = () => (
      <TransitionSeries.Transition
        timing={linearTiming({ durationInFrames: Math.round(0.6 * fps) })}
        presentation={fade({ shouldFadeOutExitingScene: true })}
      />
    );
  return (
    <AbsoluteFill>
      <BrandFrame />
      <TransitionSeries>
        <TransitionSeries.Sequence
          name="أرض الموقع وكشف الطبقات ثم الجسات"
          durationInFrames={12 * fps + 18}
          premountFor={fps}
        >
          <Field embedded />
        </TransitionSeries.Sequence>
        {blend()}
        <TransitionSeries.Sequence
          name="توصيف الصخور"
          durationInFrames={10 * fps + 18}
          premountFor={fps}
        >
          <Rocks embedded />
        </TransitionSeries.Sequence>
        {blend()}
        <TransitionSeries.Sequence
          name="الاختراق القياسي والعينات"
          durationInFrames={21 * fps + 18}
          premountFor={fps}
        >
          <SPT embedded />
        </TransitionSeries.Sequence>
        {blend()}
        <TransitionSeries.Sequence
          name="المحتوى المائي"
          durationInFrames={8 * fps + 18}
          premountFor={fps}
        >
          <Moisture embedded />
        </TransitionSeries.Sequence>
        {blend()}
        <TransitionSeries.Sequence
          name="التدرّج والتصنيف"
          durationInFrames={9 * fps + 18}
          premountFor={fps}
        >
          <Laboratory embedded />
        </TransitionSeries.Sequence>
        {blend()}
        <TransitionSeries.Sequence
          name="حدود أتربرج"
          durationInFrames={9 * fps + 18}
          premountFor={fps}
        >
          <Atterberg embedded />
        </TransitionSeries.Sequence>
        {blend()}
        <TransitionSeries.Sequence
          name="القص المباشر"
          durationInFrames={9 * fps + 18}
          premountFor={fps}
        >
          <Shear embedded />
        </TransitionSeries.Sequence>
        {blend()}
        <TransitionSeries.Sequence
          name="المياه الجوفية عند الحاجة"
          durationInFrames={8 * fps + 18}
          premountFor={fps}
        >
          <Groundwater embedded />
        </TransitionSeries.Sequence>
        {blend()}
        <TransitionSeries.Sequence
          name="التحليل والتقرير"
          durationInFrames={8 * fps + 18}
          premountFor={fps}
        >
          <Report embedded />
        </TransitionSeries.Sequence>
        {blend()}
        <TransitionSeries.Sequence
          name="الهوية والتواصل"
          durationInFrames={6 * fps}
          premountFor={fps}
        >
          <Outro embedded />
        </TransitionSeries.Sequence>
      </TransitionSeries>
      <Audio src={staticFile("score.m4a")} premountFor={fps} />
    </AbsoluteFill>
  );
}
export const RemotionRoot = () => (
  <>
    <Composition
      id="EtqanSeriesGeotechnicalV4"
      component={Film}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={3000}
    />
    <Composition
      id="Field"
      component={Field}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={378}
    />
    <Composition
      id="Rocks"
      component={Rocks}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={318}
    />
    <Composition
      id="SPT"
      component={SPT}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={648}
    />
    <Composition
      id="Moisture"
      component={Moisture}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={258}
    />
    <Composition
      id="Laboratory"
      component={Laboratory}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={288}
    />
    <Composition
      id="Atterberg"
      component={Atterberg}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={288}
    />
    <Composition
      id="Shear"
      component={Shear}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={288}
    />
    <Composition
      id="Groundwater"
      component={Groundwater}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={258}
    />
    <Composition
      id="Report"
      component={Report}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={258}
    />
    <Composition
      id="Outro"
      component={Outro}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={180}
    />
  </>
);
