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
import { smooth } from "./World";
import { Opening } from "./scenes/Opening";
import { SoilFormation, SoilDensity, SoilResistivity } from "./scenes/Soil";
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
import { BrandMark, ContactFooter } from "./BrandMark";
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
  return (
    <AbsoluteFill style={{ background: "#061426" }}>
      <Fonts />
      <Sequence
        from={0}
        durationInFrames={7.4 * fps}
        name="Earth to Riyadh"
        premountFor={fps}
      >
        <Opening />
      </Sequence>
      <Sequence
        from={7 * fps}
        durationInFrames={4.4 * fps}
        name="Boreholes and sampling"
        premountFor={fps}
      >
        <Dissolve>
          <SoilBorehole />
        </Dissolve>
      </Sequence>
      <Sequence
        from={11 * fps}
        durationInFrames={5.4 * fps}
        name="Soil classification and gradation"
        premountFor={fps}
      >
        <Dissolve>
          <SoilFormation duration={5} />
        </Dissolve>
      </Sequence>
      <Sequence
        from={16 * fps}
        durationInFrames={3.9 * fps}
        name="Field density"
        premountFor={fps}
      >
        <Dissolve>
          <SoilDensity duration={3.5} />
        </Dissolve>
      </Sequence>
      <Sequence
        from={19.5 * fps}
        durationInFrames={3.9 * fps}
        name="Soil resistivity"
        premountFor={fps}
      >
        <Dissolve>
          <SoilResistivity duration={3.5} />
        </Dissolve>
      </Sequence>
      <Sequence
        from={23 * fps}
        durationInFrames={7.4 * fps}
        name="Slump and concrete temperature"
        premountFor={fps}
      >
        <Dissolve>
          <FreshConcrete />
        </Dissolve>
      </Sequence>
      <Sequence
        from={30 * fps}
        durationInFrames={4.4 * fps}
        name="Concrete compression"
        premountFor={fps}
      >
        <Dissolve>
          <ConcreteCompression duration={4} />
        </Dissolve>
      </Sequence>
      <Sequence
        from={34 * fps}
        durationInFrames={3.4 * fps}
        name="Concrete ultrasonic"
        premountFor={fps}
      >
        <Dissolve>
          <ConcreteUltrasonic duration={3} />
        </Dissolve>
      </Sequence>
      <Sequence
        from={37 * fps}
        durationInFrames={3.4 * fps}
        name="Concrete core sampling"
        premountFor={fps}
      >
        <Dissolve>
          <ConcreteCore duration={3} />
        </Dissolve>
      </Sequence>
      <Sequence
        from={40 * fps}
        durationInFrames={4.4 * fps}
        name="Asphalt material formation"
        premountFor={fps}
      >
        <Dissolve>
          <AsphaltFormation duration={4} />
        </Dissolve>
      </Sequence>
      <Sequence
        from={44 * fps}
        durationInFrames={4.4 * fps}
        name="Marshall stability and flow"
        premountFor={fps}
      >
        <Dissolve>
          <AsphaltMarshall duration={4} />
        </Dissolve>
      </Sequence>
      <Sequence
        from={48 * fps}
        durationInFrames={4.4 * fps}
        name="Asphalt binder composition"
        premountFor={fps}
      >
        <Dissolve>
          <AsphaltBinder duration={4} />
        </Dissolve>
      </Sequence>
      <Sequence
        from={52 * fps}
        durationInFrames={3.4 * fps}
        name="Materials and confidence"
        premountFor={fps}
      >
        <Dissolve>
          <Overview />
        </Dissolve>
      </Sequence>
      <Sequence
        from={55 * fps}
        durationInFrames={5 * fps}
        name="ETQAN contact closing"
        premountFor={fps}
      >
        <Dissolve>
          <Closing />
        </Dissolve>
      </Sequence>
      <Sequence
        from={7 * fps}
        durationInFrames={16 * fps}
        name="Soil category"
        premountFor={fps}
      >
        <Category title="التربة" duration={16} />
      </Sequence>
      <Sequence
        from={23 * fps}
        durationInFrames={17 * fps}
        name="Concrete category"
        premountFor={fps}
      >
        <Category title="الخرسانة" duration={17} />
      </Sequence>
      <Sequence
        from={40 * fps}
        durationInFrames={12 * fps}
        name="Asphalt category"
        premountFor={fps}
      >
        <Category title="الأسفلت" duration={12} />
      </Sequence>
      <BrandMark />
      <ContactFooter />
      <Audio src={staticFile("etqan-original-score.wav")} premountFor={fps} />
    </AbsoluteFill>
  );
}
export const Root = () => (
  <>
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
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={210}
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
      durationInFrames={120}
      defaultProps={{ duration: 4 }}
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
      durationInFrames={90}
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
