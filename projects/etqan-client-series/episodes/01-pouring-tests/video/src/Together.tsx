import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { Scene, SceneProps, Art, Copy } from "./Scene";
import { Defs, Ground } from "./Drawing";
import { EquipmentPair } from "./Equipment";
export function Together({ embedded = false }: SceneProps) {
  const t = useCurrentFrame() / useVideoConfig().fps;
  return (
    <Scene embedded={embedded} duration={378}>
      <Art>
        <Defs id="together" />
        <EquipmentPair id="together" t={t} />
      </Art>
      <Copy
        title="مؤشران…"
        accent="لصورة أوضح"
        process="القوام والحرارة يدعمان تقييم الصب."
        benefit="لكل مؤشر دلالته"
        detail="ومقاومة الخرسانة تُقيّم باختبارها المحدّد."
      />
    </Scene>
  );
}
