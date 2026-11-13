import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { Scene, SceneProps, Art, Copy } from "./Scene";
import { GeoDefs } from "./GeoMaterials";
import { Ground } from "./Drawing";
import { ease, rand, gold } from "./motion";

export function chemistryMotion(t: number) {
  return { filtration: ease((t - 0.8) / 3.5),
    stream: ease((t - 0.7) / 0.5) * (1 - ease((t - 3.8) / 0.5)),
    probeY: 280 + 140 * ease((t - 3.5) / 1.4) };
}

export function Chemistry({ embedded = false }: SceneProps) {
  const t = useCurrentFrame() / useVideoConfig().fps,
    s = chemistryMotion(t);
  return (
    <Scene embedded={embedded} duration={258}>
      <Copy title="الفحوص" accent="الكيميائية"
        process="الحموضة والكلوريدات والكبريتات."
        benefit="تحديد متطلبات متانة الخرسانة"
        detail="للأجزاء الملامسة للتربة، وفق نتائج التحليل." />
      <Art>
        <GeoDefs id="chemistry" />
        <Ground id="chemistry" t={t} />
        <defs>
          <linearGradient id="chemistry-glass"><stop stopColor="#8fc8d4" stopOpacity={0.2} /><stop offset=".4" stopColor="#a3dce7" stopOpacity={0.04} /><stop offset="1" stopColor="#5290a6" stopOpacity={0.2} /></linearGradient>
          <clipPath id="chemistry-beaker"><path d="M275 415H435L420 600Q355 623 290 600Z" /></clipPath>
        </defs>
        <rect x={145} y={188} width={15} height={413} rx={3} fill="url(#chemistry-steel)" stroke="#bacdd0" />
        <path d="M125 600H230L249 620H105Z" fill="url(#chemistry-dark)" stroke="#8ba8b2" />
        <path d="M160 255H320" fill="none" stroke="#a3bec6" strokeWidth={8} />
        <ellipse cx={355} cy={258} rx={88} ry={18} fill="none" stroke="#aec8ce" strokeWidth={5} />
        <path d="M267 258L343 355V402H366V355L443 258Z" fill="url(#chemistry-glass)" stroke="#b5d2d8" strokeWidth={2} />
        <path d="M281 260L355 345L429 260Q355 283 281 260Z" fill="#d2d6c7" fillOpacity={0.8} stroke="#dce4d6" />
        <path d="M305 279Q355 293 404 279L355 333Z" fill="#75684b" opacity={0.9} />
        {Array.from({ length: 30 }, (_, i) => <circle key={i} cx={316 + rand(i + 10) * 78} cy={282 + rand(i + 90) * 14} r={1 + rand(i + 34) * 2} fill="#bbaa80" opacity={0.65} />)}
        <g clipPath="url(#chemistry-beaker)">
          <rect x={275} y={595 - 100 * s.filtration} width={160} height={145} fill="#7cb4c2" opacity={0.32} />
          <ellipse cx={355} cy={595 - 100 * s.filtration} rx={75} ry={8} fill="#9dcfda" opacity={0.4} />
          <path d={`M355 401V${595 - 100 * s.filtration}`} stroke="#b3d8de" strokeWidth={2} opacity={s.stream} />
        </g>
        <path d="M275 415H435L420 600Q355 623 290 600Z" fill="url(#chemistry-glass)" stroke="#bdd7dc" strokeWidth={2} />
        <path d="M290 435L301 587" stroke="#d4e4df" strokeWidth={3} opacity={0.5} />
        <path d="M510 359H850V427H510Z" fill="url(#chemistry-white)" stroke="#b1c7ce" />
        <path d="M510 359L532 340H869L850 359Z" fill="#a2bbbf" />
        <path d="M850 359L869 340V408L850 427Z" fill="#315567" />
        <rect x={538} y={378} width={88} height={25} rx={4} fill="#15313f" />
        <circle cx={817} cy={391} r={6} fill={gold} />
        <path d={`M645 359Q614 247 698 231Q758 235 753 ${s.probeY - 8}`} fill="none" stroke="#a1b7b8" strokeWidth={4} />
        <g transform={`translate(753 ${s.probeY})`}>
          <rect x={-13} y={0} width={26} height={102} rx={8} fill="url(#chemistry-steel)" stroke="#c9dedc" />
          <rect x={-6} y={95} width={12} height={37} rx={5} fill="#b4d1d5" stroke="#d2e2dc" />
        </g>
        <path d="M683 463H824L812 600Q754 622 695 600Z" fill="url(#chemistry-glass)" stroke="#bfd5da" strokeWidth={2} />
        <path d="M689 525Q754 512 819 525L812 600Q754 622 695 600Z" fill="#8fc4d0" opacity={0.24} />
        <path d="M698 483L706 585" stroke="#d8e6e1" strokeWidth={3} opacity={0.5} />
        <g fontFamily="EtqanCairo" fontSize={30} textAnchor="middle" direction="rtl" fill="#c6dae1">
          <text x={350} y={690}>تحضير المستخلص</text>
          <text x={750} y={690}>قياس الحموضة</text>
        </g>
      </Art>
    </Scene>
  );
}
