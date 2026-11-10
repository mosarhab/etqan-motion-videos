import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { Scene, SceneProps, Art, Copy } from "./Scene";
import { Defs, Ground } from "./Drawing";
import { SlumpRig } from "./Equipment";
export function Slump({ embedded = false }: SceneProps) {
  const t = useCurrentFrame() / useVideoConfig().fps;
  return (
    <Scene embedded={embedded} duration={558}>
      <Art>
        <Defs id="slump" />
        <Ground id="slump" t={t} />
        <SlumpRig id="slump" t={t} camera />
      </Art>
      <Copy
        title="اختبار"
        accent="الهبوط"
        process="لفهم القوام وقابلية التشغيل."
        benefit="تقييم ملاءمة الخرسانة للصب"
        detail="مؤشر يُقرأ وفق متطلبات المشروع."
      />
    </Scene>
  );
}
