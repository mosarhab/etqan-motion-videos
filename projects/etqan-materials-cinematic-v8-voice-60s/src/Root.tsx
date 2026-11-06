import React from "react";
import {
  AbsoluteFill,
  Composition,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  staticFile,
} from "remotion";
import { Audio } from "@remotion/media";
import voiceTiming from "./voice-timeline.json";
import { smooth } from "./World";
import { Opening } from "./scenes/Opening";
import { SoilFormation, SoilDensity, SoilResistivity } from "./scenes/Soil";
import { SoilProctor } from "./scenes/Proctor";
import { SoilBorehole } from "./scenes/Borehole";
import {
  ConcreteCompression,
  ConcreteUltrasonic,
  ConcreteCore,
} from "./scenes/Concrete";
import { FreshConcrete } from "./scenes/FreshConcrete";
import {
  AsphaltFormation,
  AsphaltMarshall,
  AsphaltBinder,
} from "./scenes/Asphalt";
import { Overview } from "./scenes/Overview";
import { Closing, Header, Fonts } from "./Type";
import {
  BrandMark,
  ContactFooter,
  FooterOverlay,
  CreatorLogo,
} from "./BrandMark";
const Category = ({ title, duration }: { title: string; duration: number }) => {
  const { fps } = useVideoConfig();
  return (
    <Header title={title} t={useCurrentFrame() / fps} duration={duration} />
  );
};
const Dissolve = ({ children }: { children: React.ReactNode }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ opacity: smooth(frame / (0.4 * fps)) }}>
      {children}
    </AbsoluteFill>
  );
};
export function Film() {
  const { fps } = useVideoConfig();
  const shots = voiceTiming.scenes;
  return (
    <AbsoluteFill style={{ background: "#061426" }}>
      <Fonts />
      <Sequence
        from={shots.opening.startFrame}
        durationInFrames={shots.opening.durationFrames + Math.round(0.4 * fps)}
        name="Earth to Riyadh"
        premountFor={fps}
      >
        <Opening duration={shots.opening.durationFrames / fps} />
      </Sequence>
      <Sequence
        from={shots.borehole.startFrame}
        durationInFrames={shots.borehole.durationFrames + Math.round(0.4 * fps)}
        name="Boreholes and sampling"
        premountFor={fps}
      >
        <Dissolve>
          <SoilBorehole duration={shots.borehole.durationFrames / fps} />
        </Dissolve>
      </Sequence>
      <Sequence
        from={shots.soil.startFrame}
        durationInFrames={shots.soil.durationFrames + Math.round(0.4 * fps)}
        name="Soil classification and gradation"
        premountFor={fps}
      >
        <Dissolve>
          <SoilFormation duration={shots.soil.durationFrames / fps} />
        </Dissolve>
      </Sequence>
      <Sequence
        from={shots.proctor.startFrame}
        durationInFrames={shots.proctor.durationFrames + Math.round(0.4 * fps)}
        name="Proctor compaction"
        premountFor={fps}
      >
        <Dissolve>
          <SoilProctor duration={shots.proctor.durationFrames / fps} />
        </Dissolve>
      </Sequence>
      <Sequence
        from={shots.density.startFrame}
        durationInFrames={shots.density.durationFrames + Math.round(0.4 * fps)}
        name="Field density"
        premountFor={fps}
      >
        <Dissolve>
          <SoilDensity duration={shots.density.durationFrames / fps} />
        </Dissolve>
      </Sequence>
      <Sequence
        from={shots.resistance.startFrame}
        durationInFrames={
          shots.resistance.durationFrames + Math.round(0.4 * fps)
        }
        name="Soil resistivity"
        premountFor={fps}
      >
        <Dissolve>
          <SoilResistivity duration={shots.resistance.durationFrames / fps} />
        </Dissolve>
      </Sequence>
      <Sequence
        from={shots.fresh.startFrame}
        durationInFrames={shots.fresh.durationFrames + Math.round(0.4 * fps)}
        name="Slump and concrete temperature"
        premountFor={fps}
      >
        <Dissolve>
          <FreshConcrete
            duration={shots.fresh.durationFrames / fps}
            slumpDuration={
              (voiceTiming.freshTemperatureStartFrame -
                shots.fresh.startFrame) /
              fps
            }
          />
        </Dissolve>
      </Sequence>
      <Sequence
        from={shots.compression.startFrame}
        durationInFrames={
          shots.compression.durationFrames + Math.round(0.4 * fps)
        }
        name="Concrete compression"
        premountFor={fps}
      >
        <Dissolve>
          <ConcreteCompression
            duration={shots.compression.durationFrames / fps}
          />
        </Dissolve>
      </Sequence>
      <Sequence
        from={shots.ultrasonic.startFrame}
        durationInFrames={
          shots.ultrasonic.durationFrames + Math.round(0.4 * fps)
        }
        name="Concrete ultrasonic"
        premountFor={fps}
      >
        <Dissolve>
          <ConcreteUltrasonic
            duration={shots.ultrasonic.durationFrames / fps}
          />
        </Dissolve>
      </Sequence>
      <Sequence
        from={shots.core.startFrame}
        durationInFrames={shots.core.durationFrames + Math.round(0.4 * fps)}
        name="Concrete core sampling"
        premountFor={fps}
      >
        <Dissolve>
          <ConcreteCore duration={shots.core.durationFrames / fps} />
        </Dissolve>
      </Sequence>
      <Sequence
        from={shots.asphalt.startFrame}
        durationInFrames={shots.asphalt.durationFrames + Math.round(0.4 * fps)}
        name="Asphalt material formation"
        premountFor={fps}
      >
        <Dissolve>
          <AsphaltFormation duration={shots.asphalt.durationFrames / fps} />
        </Dissolve>
      </Sequence>
      <Sequence
        from={shots.marshall.startFrame}
        durationInFrames={shots.marshall.durationFrames + Math.round(0.4 * fps)}
        name="Marshall stability and flow"
        premountFor={fps}
      >
        <Dissolve>
          <AsphaltMarshall duration={shots.marshall.durationFrames / fps} />
        </Dissolve>
      </Sequence>
      <Sequence
        from={shots.binder.startFrame}
        durationInFrames={shots.binder.durationFrames + Math.round(0.4 * fps)}
        name="Asphalt binder composition"
        premountFor={fps}
      >
        <Dissolve>
          <AsphaltBinder duration={shots.binder.durationFrames / fps} />
        </Dissolve>
      </Sequence>
      <Sequence
        from={shots.overview.startFrame}
        durationInFrames={shots.overview.durationFrames + Math.round(0.4 * fps)}
        name="Soil, foundations and road"
        premountFor={fps}
      >
        <Dissolve>
          <Overview duration={shots.overview.durationFrames / fps} />
        </Dissolve>
      </Sequence>
      <Sequence
        from={shots.closing.startFrame}
        durationInFrames={shots.closing.durationFrames}
        name="ETQAN contact closing"
        premountFor={fps}
      >
        <Dissolve>
          <Closing />
        </Dissolve>
      </Sequence>
      <Sequence
        from={shots.borehole.startFrame}
        durationInFrames={shots.fresh.startFrame - shots.borehole.startFrame}
        name="Soil category"
        premountFor={fps}
      >
        <Category
          title="التربة"
          duration={(shots.fresh.startFrame - shots.borehole.startFrame) / fps}
        />
      </Sequence>
      <Sequence
        from={shots.fresh.startFrame}
        durationInFrames={shots.asphalt.startFrame - shots.fresh.startFrame}
        name="Concrete category"
        premountFor={fps}
      >
        <Category
          title="الخرسانة"
          duration={(shots.asphalt.startFrame - shots.fresh.startFrame) / fps}
        />
      </Sequence>
      <Sequence
        from={shots.asphalt.startFrame}
        durationInFrames={shots.overview.startFrame - shots.asphalt.startFrame}
        name="Asphalt category"
        premountFor={fps}
      >
        <Category
          title="الأسفلت"
          duration={
            (shots.overview.startFrame - shots.asphalt.startFrame) / fps
          }
        />
      </Sequence>
      <BrandMark />
      <ContactFooter />
      <Audio src={staticFile("etqan-voice-mix.wav")} premountFor={fps} />
    </AbsoluteFill>
  );
}
export function FooterOnly() {
  return (
    <AbsoluteFill>
      <Fonts />
      <FooterOverlay />
    </AbsoluteFill>
  );
}
export function CreatorLogoOnly() {
  return (
    <AbsoluteFill>
      <CreatorLogo width={1640} opacity={1} />
    </AbsoluteFill>
  );
}
export function BrandFrame() {
  return (
    <AbsoluteFill>
      <Fonts />
      <BrandMark />
      <ContactFooter />
    </AbsoluteFill>
  );
}
export const Root = () => (
  <>
    <Composition
      id="BrandFrame"
      component={BrandFrame}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={1800}
    />
    <Composition
      id="FooterOnly"
      component={FooterOnly}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={1}
    />
    <Composition
      id="CreatorLogoWhite"
      component={CreatorLogoOnly}
      width={1640}
      height={959}
      fps={30}
      durationInFrames={1}
    />
    <Composition
      id="EtqanCinematicRevision60"
      component={Film}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={1800}
    />
    <Composition
      id="Opening"
      component={Opening}
      defaultProps={{ duration: 5 }}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={150}
    />
    <Composition
      id="SoilBorehole"
      component={SoilBorehole}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={120}
    />
    <Composition
      id="SoilFormation"
      component={SoilFormation}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={150}
      defaultProps={{ duration: 5 }}
    />
    <Composition
      id="Proctor"
      component={SoilProctor}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={105}
    />
    <Composition
      id="FieldDensity"
      component={SoilDensity}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={105}
      defaultProps={{ duration: 3.5 }}
    />
    <Composition
      id="SoilResistivity"
      component={SoilResistivity}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={105}
      defaultProps={{ duration: 3.5 }}
    />
    <Composition
      id="FreshConcrete"
      component={FreshConcrete}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={210}
    />
    <Composition
      id="ConcreteCompression"
      component={ConcreteCompression}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={120}
      defaultProps={{ duration: 4 }}
    />
    <Composition
      id="UltrasonicUPV"
      component={ConcreteUltrasonic}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={90}
      defaultProps={{ duration: 3 }}
    />
    <Composition
      id="ConcreteCore"
      component={ConcreteCore}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={90}
      defaultProps={{ duration: 3 }}
    />
    <Composition
      id="AsphaltFormation"
      component={AsphaltFormation}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={105}
      defaultProps={{ duration: 3.5 }}
    />
    <Composition
      id="Marshall"
      component={AsphaltMarshall}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={120}
      defaultProps={{ duration: 4 }}
    />
    <Composition
      id="Binder"
      component={AsphaltBinder}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={120}
      defaultProps={{ duration: 4 }}
    />
    <Composition
      id="MaterialsOverview"
      component={Overview}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={105}
    />
    <Composition
      id="Closing"
      component={Closing}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={150}
    />
  </>
);
