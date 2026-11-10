import React from "react";
import {
  AbsoluteFill,
  Composition,
  useVideoConfig,
  staticFile,
} from "remotion";
import { Audio } from "@remotion/media";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { BrandFrame } from "./Brand";
import { Intro } from "./Intro";
import { Slump } from "./Slump";
import { Temperature } from "./Temperature";
import { Together } from "./Together";
import { Outro } from "./Outro";
export function Film() {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill>
      <BrandFrame />
      <TransitionSeries>
        <TransitionSeries.Sequence
          name="وقت الصب"
          durationInFrames={6 * fps + 18}
          premountFor={fps}
        >
          <Intro embedded />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: Math.round(0.6 * fps) })}
          presentation={fade({ shouldFadeOutExitingScene: true })}
        />
        <TransitionSeries.Sequence
          name="فائدة اختبار الهبوط"
          durationInFrames={18 * fps + 18}
          premountFor={fps}
        >
          <Slump embedded />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: Math.round(0.6 * fps) })}
          presentation={fade({ shouldFadeOutExitingScene: true })}
        />
        <TransitionSeries.Sequence
          name="فائدة قياس الحرارة"
          durationInFrames={16 * fps + 18}
          premountFor={fps}
        >
          <Temperature embedded />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: Math.round(0.6 * fps) })}
          presentation={fade({ shouldFadeOutExitingScene: true })}
        />
        <TransitionSeries.Sequence
          name="قراءة المؤشرين"
          durationInFrames={12 * fps + 18}
          premountFor={fps}
        >
          <Together embedded />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: Math.round(0.6 * fps) })}
          presentation={fade({ shouldFadeOutExitingScene: true })}
        />
        <TransitionSeries.Sequence
          name="الهوية والتواصل"
          durationInFrames={8 * fps}
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
      id="EtqanSeries01Pouring"
      component={Film}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={1800}
    />
    <Composition
      id="Intro"
      component={Intro}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={198}
      defaultProps={{ embedded: false }}
    />
    <Composition
      id="Slump"
      component={Slump}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={558}
      defaultProps={{ embedded: false }}
    />
    <Composition
      id="Temperature"
      component={Temperature}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={498}
      defaultProps={{ embedded: false }}
    />
    <Composition
      id="Together"
      component={Together}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={378}
      defaultProps={{ embedded: false }}
    />
    <Composition
      id="Outro"
      component={Outro}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={240}
      defaultProps={{ embedded: false }}
    />
  </>
);
