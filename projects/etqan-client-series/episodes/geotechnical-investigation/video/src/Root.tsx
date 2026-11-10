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
import { Field } from "./Field";
import { Samples } from "./Samples";
import { Laboratory } from "./Laboratory";
import { Report } from "./Report";
import { Outro } from "./Outro";
const scenes = [
  {
    id: "Intro",
    name: "من استكشاف التربة إلى قرار التأسيس",
    component: Intro,
    frames: 258,
  },
  { id: "Field", name: "الجسات وطبقات التربة", component: Field, frames: 498 },
  { id: "Samples", name: "حفظ العينات", component: Samples, frames: 198 },
  {
    id: "Laboratory",
    name: "اختبارات المختبر",
    component: Laboratory,
    frames: 378,
  },
  {
    id: "Report",
    name: "التحليل والتقرير والتوصيات",
    component: Report,
    frames: 318,
  },
  { id: "Outro", name: "الهوية والتواصل", component: Outro, frames: 240 },
];
export function Film() {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill>
      <BrandFrame />
      <TransitionSeries>
        {scenes.map((s, i) => (
          <React.Fragment key={s.id}>
            {i > 0 && (
              <TransitionSeries.Transition
                timing={linearTiming({ durationInFrames: 18 })}
                presentation={fade({ shouldFadeOutExitingScene: true })}
              />
            )}
            <TransitionSeries.Sequence
              name={s.name}
              durationInFrames={s.frames}
              premountFor={fps}
            >
              <s.component embedded />
            </TransitionSeries.Sequence>
          </React.Fragment>
        ))}
      </TransitionSeries>
      <Audio src={staticFile("score.m4a")} premountFor={fps} />
    </AbsoluteFill>
  );
}
export const RemotionRoot = () => (
  <>
    <Composition
      id="EtqanSeriesGeotechnical"
      component={Film}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={1800}
    />
    {scenes.map((s) => (
      <Composition
        key={s.id}
        id={s.id}
        component={s.component}
        width={1080}
        height={1920}
        fps={30}
        durationInFrames={s.frames}
        defaultProps={{ embedded: false }}
      />
    ))}
  </>
);
