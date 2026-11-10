import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { Scene, SceneProps, Art, Copy } from "./Scene";
import { GeoDefs } from "./GeoMaterials";
import { SieveStation } from "./GeoProps";
import { Ground } from "./Drawing";
export function Laboratory({ embedded = false }: SceneProps) {
  const t = useCurrentFrame() / useVideoConfig().fps;
  return (
    <Scene embedded={embedded} duration={378}>
      <Copy
        title="اختبارات"
        accent="التربة"
        process="لتصنيفها والتعرّف على خصائصها."
        benefit="برنامج اختبار يناسب المشروع"
        detail="تتكامل النتائج مع بيانات الموقع."
      />
      <Art>
        <GeoDefs id="lab" />
        <Ground id="lab" t={t} />
        <SieveStation id="lab" t={t} />
      </Art>
    </Scene>
  );
}
