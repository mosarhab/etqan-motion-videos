import React, { useState, useEffect } from "react";
import {
  AbsoluteFill,
  Img,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  delayRender,
  continueRender,
} from "remotion";
import { smooth, clamp } from "./Math";
export function Fonts() {
  const [hold] = useState(() => delayRender("Arabic font"));
  useEffect(() => {
    Promise.all([
      document.fonts.load("500 56px EtqanCairo"),
      document.fonts.load("800 96px EtqanCairo"),
    ]).then(() => continueRender(hold));
  }, [hold]);
  return (
    <style>{`@font-face{font-family:EtqanCairo;src:url('${staticFile("Cairo-Variable.ttf")}') format('truetype');font-weight:200 1000;font-display:block}*{box-sizing:border-box}`}</style>
  );
}
function Label({
  text,
  start,
  end,
  t,
}: {
  text: string;
  start: number;
  end: number;
  t: number;
}) {
  const a = smooth((t - start) / 0.5) * (1 - smooth((t - end + 0.4) / 0.4));
  return (
    <div
      dir="rtl"
      data-ad-copy={text}
      style={{
        position: "absolute",
        right: 120,
        bottom: 108,
        fontFamily: "EtqanCairo",
        fontSize: 53,
        fontWeight: 650,
        color: "#172d4a",
        textAlign: "right",
        opacity: a,
        translate: `0 ${12 * (1 - a)}px`,
        padding: "0 25px 0 0",
        borderRight: "3px solid #d7ae3e",
        textShadow: "0 2px 18px rgba(255,255,255,.9)",
      }}
    >
      {text}
    </div>
  );
}
export function Titles() {
  const { fps } = useVideoConfig(),
    t = useCurrentFrame() / fps;
  const hook = smooth((t - 0.35) / 0.65) * (1 - smooth((t - 3.8) / 1.1)),
    end = smooth((t - 52.5) / 1.2);
  const age = clamp((t - 29) / 5),
    days = Math.max(1, Math.round(1 + 27 * smooth(age))),
    clock = smooth((t - 29.0) / 0.65) * (1 - smooth((t - 36.1) / 0.65));
  return (
    <AbsoluteFill style={{ pointerEvents: "none", fontFamily: "EtqanCairo" }}>
      <Fonts />
      <div
        dir="rtl"
        style={{
          position: "absolute",
          right: 135,
          top: 210,
          width: 1030,
          color: "#f3f5f5",
          opacity: hook,
          textAlign: "right",
          textShadow: "0 3px 28px #07121a66",
        }}
      >
        <div style={{ fontSize: 80, fontWeight: 500, lineHeight: 1.5 }}>
          القوة لا تُفترض…
        </div>
        <div
          style={{
            fontSize: 110,
            fontWeight: 800,
            lineHeight: 1.4,
            color: "#e5bc3a",
          }}
        >
          بل تُختبر
        </div>
      </div>
      <Label text="اختبار الهبوط" start={7.8} end={16.3} t={t} />
      <Label text="إعداد العينات بدقة" start={17.7} end={26.0} t={t} />
      <Label
        text="المعالجة وفق المتطلبات الفنية"
        start={28.0}
        end={36.4}
        t={t}
      />
      <Label text="اختبار مقاومة الضغط" start={37.8} end={44.2} t={t} />
      <Label text="دقة تُقاس… وثقة تُبنى" start={47.2} end={50.8} t={t} />
      <div
        dir="rtl"
        style={{
          position: "absolute",
          right: 135,
          top: 165,
          width: 425,
          textAlign: "center",
          opacity: clock,
          color: "#1c354d",
        }}
      >
        <svg
          width={155}
          height={155}
          viewBox="0 0 155 155"
          style={{ display: "block", margin: "0 auto 12px" }}
        >
          <circle
            cx={77.5}
            cy={77.5}
            r={65}
            fill="none"
            stroke="#b7c4c9"
            strokeWidth={1.4}
          />
          <circle
            cx={77.5}
            cy={77.5}
            r={65}
            fill="none"
            stroke="#c7a33c"
            strokeWidth={3}
            strokeDasharray={408.4}
            strokeDashoffset={408.4 * (1 - age)}
            transform="rotate(-90 77.5 77.5)"
          />
        </svg>
        <div style={{ fontSize: 48, fontWeight: 700 }}>
          {days.toLocaleString("ar-SA")} يومًا
        </div>
        <div
          style={{
            fontSize: 25,
            lineHeight: 1.65,
            marginTop: 10,
            color: "#536b77",
          }}
        >
          {days === 28 ? "أحد أعمار اختبار المقاومة الشائعة" : "خلال المعالجة"}
        </div>
      </div>
      <div
        dir="rtl"
        style={{
          position: "absolute",
          right: 105,
          top: 150,
          width: 780,
          textAlign: "center",
          opacity: end,
          translate: `0 ${18 * (1 - end)}px`,
          color: "#172d4a",
        }}
      >
        <Img
          src={staticFile("etqan-logo.png")}
          data-official-logo="true"
          style={{
            display: "block",
            width: 750,
            height: (750 * 552) / 2048,
            objectFit: "contain",
            margin: "0 auto 55px",
          }}
        />
        <div style={{ fontSize: 48, fontWeight: 750, lineHeight: 1.5 }}>
          مختبر إتقان البناء
        </div>
        <div
          style={{
            fontSize: 35,
            fontWeight: 500,
            lineHeight: 1.75,
            color: "#63737b",
          }}
        >
          لفحص التربة والمواد
        </div>
        <div
          style={{
            width: 66,
            height: 3,
            background: "#d5ad38",
            margin: "28px auto",
          }}
        />
        <div style={{ fontSize: 35, fontWeight: 650, lineHeight: 1.75 }}>
          إتقان البناء…
          <br />
          لأن الثقة تبدأ من الاختبار
        </div>
        <div
          style={{
            fontSize: 28,
            fontWeight: 500,
            marginTop: 37,
            color: "#62747d",
          }}
        >
          الرياض – المملكة العربية السعودية
        </div>
      </div>
    </AbsoluteFill>
  );
}
