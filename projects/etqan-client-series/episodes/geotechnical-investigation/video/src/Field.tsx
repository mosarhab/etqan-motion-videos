import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { Scene, SceneProps, Copy } from "./Scene";
import { GeoArt, GeoDefs } from "./GeoMaterials";
import { RigWorld } from "./Rig";
export function Field({ embedded = false }: SceneProps) {
  const t = useCurrentFrame() / useVideoConfig().fps;
  return (
    <Scene embedded={embedded} duration={498}>
      <Copy
        title="استكشاف"
        accent="طبقات التربة"
        process=""
        benefit="معلومات تدعم دراسة التأسيس"
        detail=""
        benefitLabel=""
        benefitTop={1650}
      />
      <GeoArt>
        <GeoDefs id="field" />
        <RigWorld id="field" t={t} active camera />
      </GeoArt>
    </Scene>
  );
}
