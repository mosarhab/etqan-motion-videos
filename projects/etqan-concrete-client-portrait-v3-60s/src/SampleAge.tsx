import React from "react";
import { ease, gold } from "./motion";
import { sampleAge } from "./age-timing";

export function SampleAge({ t }: { t: number }) {
  const { progress, days } = sampleAge(t),
    a = ease((t - 3.8) / 0.55) * (1 - ease((t - 10.7) / 0.7));
  const circumference = 2 * Math.PI * 56;
  return (
    <div
      data-copy="sample-age-counter"
      dir="rtl"
      style={{
        position: "absolute",
        right: 80,
        top: 656,
        width: 920,
        textAlign: "center",
        fontFamily: "EtqanCairo",
        opacity: a,
        color: "#c8dce3",
      }}
    >
      <div style={{ fontSize: 28, fontWeight: 600, lineHeight: 1.5 }}>
        عُمر العينة
      </div>
      <svg
        width={132}
        height={132}
        viewBox="0 0 132 132"
        style={{ display: "block", margin: "10px auto 0" }}
      >
        <circle
          cx={66}
          cy={66}
          r={56}
          fill="none"
          stroke="#adc5cd"
          strokeOpacity={0.2}
          strokeWidth={1.3}
        />
        <circle
          cx={66}
          cy={66}
          r={56}
          fill="none"
          stroke={gold}
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - progress)}
          transform="rotate(-90 66 66)"
        />
        {days === 1 ? (
          <text
            x={66}
            y={77}
            textAnchor="middle"
            direction="rtl"
            fill="#f5f6f4"
            fontSize={26}
            fontWeight={650}
          >
            يوم واحد
          </text>
        ) : days === 2 ? (
          <text
            x={66}
            y={79}
            textAnchor="middle"
            direction="rtl"
            fill="#f5f6f4"
            fontSize={34}
            fontWeight={650}
          >
            يومان
          </text>
        ) : (
          <>
            <text
              x={66}
              y={70}
              textAnchor="middle"
              fill="#f5f6f4"
              fontSize={45}
              fontWeight={700}
            >
              {days.toLocaleString("ar-SA")}
            </text>
            <text
              x={66}
              y={103}
              textAnchor="middle"
              direction="rtl"
              fill="#b2cbd5"
              fontSize={22}
              fontWeight={500}
            >
              {days <= 10 ? "أيام" : "يومًا"}
            </text>
          </>
        )}
      </svg>
      <div
        style={{
          marginTop: 8,
          fontSize: 24,
          lineHeight: 1.5,
          color: "#a9c3cf",
        }}
      >
        {days === 28
          ? "أحد أعمار اختبار المقاومة الشائعة"
          : "حتى عمر الاختبار المحدد"}
      </div>
    </div>
  );
}
