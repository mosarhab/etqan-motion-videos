import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { Scene, SceneProps, Art, Copy } from "./Scene";
import { Defs, Ground } from "./Drawing";
import { TemperatureRig } from "./Equipment";
export function Temperature({ embedded = false }: SceneProps) {
  const t = useCurrentFrame() / useVideoConfig().fps;
  return (
    <Scene embedded={embedded} duration={498}>
      <Art>
        <Defs id="temperature" />
        <Ground id="temperature" t={t} />
        <TemperatureRig id="temperature" t={t} camera />
      </Art>
      <Copy
        title="قياس"
        accent="درجة الحرارة"
        process="مؤشر يرتبط بسلوك الخرسانة أثناء التنفيذ."
        benefit="التحقّق وفق متطلبات الصب"
        detail="تُقيّم الحرارة ضمن متطلبات المشروع."
      />
    </Scene>
  );
}
