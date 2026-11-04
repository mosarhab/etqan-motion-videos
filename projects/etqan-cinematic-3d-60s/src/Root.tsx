import React from "react";
import {
  AbsoluteFill,
  Composition,
  Sequence,
  useCurrentFrame,
  interpolate,
  staticFile,
} from "remotion";
import { Audio } from "@remotion/media";
import { Fonts } from "./Type";
import { Earth } from "./scenes/Earth";
import { Location } from "./scenes/Location";
import { Laboratory } from "./scenes/Laboratory";
import { Soil } from "./scenes/Soil";
import { Concrete } from "./scenes/Concrete";
import { Asphalt } from "./scenes/Asphalt";
import { Confidence } from "./scenes/Confidence";
import { Closing } from "./scenes/Closing";
const Dissolve = ({ children }: { children: React.ReactNode }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        opacity: interpolate(f, [0, 14], [0, 1], { extrapolateRight: "clamp" }),
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
export const Film = () => (
  <AbsoluteFill style={{ background: "#030812" }}>
    <Fonts />
    <Sequence
      from={0}
      durationInFrames={254}
      name="Earth to Saudi Arabia"
      premountFor={30}
    >
      <Earth />
    </Sequence>
    <Sequence
      from={240}
      durationInFrames={314}
      name="Riyadh relief"
      premountFor={30}
    >
      <Dissolve>
        <Location />
      </Dissolve>
    </Sequence>
    <Sequence
      from={540}
      durationInFrames={224}
      name="Laboratory dolly"
      premountFor={30}
    >
      <Dissolve>
        <Laboratory />
      </Dissolve>
    </Sequence>
    <Sequence
      from={750}
      durationInFrames={314}
      name="Soil extraction"
      premountFor={30}
    >
      <Dissolve>
        <Soil />
      </Dissolve>
    </Sequence>
    <Sequence
      from={1050}
      durationInFrames={314}
      name="Concrete compression"
      premountFor={30}
    >
      <Dissolve>
        <Concrete />
      </Dissolve>
    </Sequence>
    <Sequence
      from={1350}
      durationInFrames={254}
      name="Asphalt testing"
      premountFor={30}
    >
      <Dissolve>
        <Asphalt />
      </Dissolve>
    </Sequence>
    <Sequence
      from={1590}
      durationInFrames={134}
      name="Confidence montage"
      premountFor={30}
    >
      <Dissolve>
        <Confidence />
      </Dissolve>
    </Sequence>
    <Sequence
      from={1710}
      durationInFrames={90}
      name="ETQAN closing"
      premountFor={30}
    >
      <Dissolve>
        <Closing />
      </Dissolve>
    </Sequence>
    <Audio src={staticFile("etqan-original-score.wav")} premountFor={30} />
  </AbsoluteFill>
);
export const Root = () => (
  <>
    <Composition
      id="EtqanCinematic3D"
      component={Film}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={1800}
    />
    <Composition
      id="Earth"
      component={Earth}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={240}
    />
    <Composition
      id="Riyadh"
      component={Location}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={300}
    />
    <Composition
      id="Laboratory"
      component={Laboratory}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={210}
    />
    <Composition
      id="Soil"
      component={Soil}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={300}
    />
    <Composition
      id="Concrete"
      component={Concrete}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={300}
    />
    <Composition
      id="Asphalt"
      component={Asphalt}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={240}
    />
    <Composition
      id="Confidence"
      component={Confidence}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={120}
    />
    <Composition
      id="Closing"
      component={Closing}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={90}
    />
  </>
);
