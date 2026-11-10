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
import { Journey } from "./Journey";
import { Laboratory } from "./Laboratory";
import { Atterberg } from "./Atterberg";
import { Shear } from "./Shear";
import { Report } from "./Report";
import { Outro } from "./Outro";
const scenes = [
  {
    id: "Journey",
    name: "الجسات والعينة من موقع خالٍ",
    component: Journey,
    frames: 648,
  },
  {
    id: "Laboratory",
    name: "التدرّج والتصنيف",
    component: Laboratory,
    frames: 258,
  },
  { id: "Atterberg", name: "حدود أتربرج", component: Atterberg, frames: 258 },
  { id: "Shear", name: "القص المباشر", component: Shear, frames: 258 },
  { id: "Report", name: "التحليل والتقرير", component: Report, frames: 288 },
  { id: "Outro", name: "الهوية والتواصل", component: Outro, frames: 180 },
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
      id="EtqanSeriesGeotechnicalV2"
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
