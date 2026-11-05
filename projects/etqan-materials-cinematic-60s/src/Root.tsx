import React from "react";
import {
  AbsoluteFill,
  Composition,
  Sequence,
  useCurrentFrame,
  staticFile,
} from "remotion";
import { Audio } from "@remotion/media";
import { smooth } from "./World";
import { Opening } from "./scenes/Opening";
import { SoilFormation, SoilDensity, SoilResistivity } from "./scenes/Soil";
import {
  ConcreteCompression,
  ConcreteUltrasonic,
  ConcreteCore,
} from "./scenes/Concrete";
import {
  AsphaltFormation,
  AsphaltMarshall,
  AsphaltBinder,
} from "./scenes/Asphalt";
import { Overview } from "./scenes/Overview";
import { Closing, Header } from "./Type";
const Category = ({ title }: { title: string }) => {
  const t = useCurrentFrame() / 30;
  return <Header title={title} t={t} duration={16} />;
};
const Dissolve = ({ children }: { children: React.ReactNode }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ opacity: smooth(f / 14) }}>{children}</AbsoluteFill>
  );
};
export function Film() {
  return (
    <AbsoluteFill style={{ background: "#061426" }}>
      <Sequence
        from={0}
        durationInFrames={104}
        name="Riyadh opening"
        premountFor={30}
      >
        <Opening />
      </Sequence>
      <Sequence
        from={90}
        durationInFrames={194}
        name="Soil material formation"
        premountFor={30}
      >
        <Dissolve>
          <SoilFormation />
        </Dissolve>
      </Sequence>
      <Sequence
        from={270}
        durationInFrames={164}
        name="Field density"
        premountFor={30}
      >
        <Dissolve>
          <SoilDensity />
        </Dissolve>
      </Sequence>
      <Sequence
        from={420}
        durationInFrames={164}
        name="Soil resistivity"
        premountFor={30}
      >
        <Dissolve>
          <SoilResistivity />
        </Dissolve>
      </Sequence>
      <Sequence
        from={570}
        durationInFrames={194}
        name="Concrete compression"
        premountFor={30}
      >
        <Dissolve>
          <ConcreteCompression />
        </Dissolve>
      </Sequence>
      <Sequence
        from={750}
        durationInFrames={164}
        name="Ultrasonic UPV"
        premountFor={30}
      >
        <Dissolve>
          <ConcreteUltrasonic />
        </Dissolve>
      </Sequence>
      <Sequence
        from={900}
        durationInFrames={164}
        name="Concrete core"
        premountFor={30}
      >
        <Dissolve>
          <ConcreteCore />
        </Dissolve>
      </Sequence>
      <Sequence
        from={1050}
        durationInFrames={194}
        name="Asphalt material formation"
        premountFor={30}
      >
        <Dissolve>
          <AsphaltFormation />
        </Dissolve>
      </Sequence>
      <Sequence
        from={1230}
        durationInFrames={164}
        name="Marshall stability and flow"
        premountFor={30}
      >
        <Dissolve>
          <AsphaltMarshall />
        </Dissolve>
      </Sequence>
      <Sequence
        from={1380}
        durationInFrames={164}
        name="Binder and aggregate study"
        premountFor={30}
      >
        <Dissolve>
          <AsphaltBinder />
        </Dissolve>
      </Sequence>
      <Sequence
        from={1530}
        durationInFrames={194}
        name="Three materials one decision"
        premountFor={30}
      >
        <Dissolve>
          <Overview />
        </Dissolve>
      </Sequence>
      <Sequence
        from={1710}
        durationInFrames={90}
        name="ETQAN brand closing"
        premountFor={30}
      >
        <Dissolve>
          <Closing />
        </Dissolve>
      </Sequence>
      <Sequence
        from={90}
        durationInFrames={480}
        name="Soil heading"
        premountFor={30}
      >
        <Category title="التربة" />
      </Sequence>
      <Sequence
        from={570}
        durationInFrames={480}
        name="Concrete heading"
        premountFor={30}
      >
        <Category title="الخرسانة" />
      </Sequence>
      <Sequence
        from={1050}
        durationInFrames={480}
        name="Asphalt heading"
        premountFor={30}
      >
        <Category title="الأسفلت" />
      </Sequence>
      <Audio src={staticFile("etqan-original-score.wav")} premountFor={30} />
    </AbsoluteFill>
  );
}
export const Root = () => (
  <>
    <Composition
      id="EtqanMaterials60"
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
      durationInFrames={90}
    />
    <Composition
      id="SoilFormation"
      component={SoilFormation}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={180}
    />
    <Composition
      id="FieldDensity"
      component={SoilDensity}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={150}
    />
    <Composition
      id="SoilResistivity"
      component={SoilResistivity}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={150}
    />
    <Composition
      id="ConcreteCompression"
      component={ConcreteCompression}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={180}
    />
    <Composition
      id="UltrasonicUPV"
      component={ConcreteUltrasonic}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={150}
    />
    <Composition
      id="ConcreteCore"
      component={ConcreteCore}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={150}
    />
    <Composition
      id="AsphaltFormation"
      component={AsphaltFormation}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={180}
    />
    <Composition
      id="Marshall"
      component={AsphaltMarshall}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={150}
    />
    <Composition
      id="Binder"
      component={AsphaltBinder}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={150}
    />
    <Composition
      id="MaterialsOverview"
      component={Overview}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={180}
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
