import React from "react";
import { GeoDefs, Bolt } from "./GeoMaterials";
import { ease, rand } from "./motion";

export function detailMotion(t: number, drive: number, withdraw: number, lift: number) {
  return {
    anvil: 690 + drive - withdraw,
    hammerBottom: 690 + drive - withdraw - lift,
    samplerTop: 900 + drive - withdraw,
    cutter: 1017 + drive - withdraw,
    frameOpacity: 1 - ease((t - 9.5) / 1.1),
    toolOpacity: 1 - ease((t - 12.4) / 0.5),
    soilOpacity: 1 - ease((t - 11.8) / 1.4),
    filled: ease(drive / 54),
    cameraZoom: 1 + .035 * ease((t - .2) / 7) * (1 - ease((t - 9.3) / 2.9)),
  };
}

/** Procedural mounted hammer detail. The approved concept PNG is not a scene asset. */
export function SPTDetail({ t, drive, withdraw, lift }: {
  t: number; drive: number; withdraw: number; lift: number;
}) {
  const s = detailMotion(t, drive, withdraw, lift),
    id = "spt-detail";
  return (
    <svg data-graphic="mounted-SPT-detail" width={1050} height={1344} viewBox="0 0 1000 1280"
      style={{ position: "absolute", left: 15, top: 210, overflow: "hidden" }}>
      <GeoDefs id={id} />
      <defs>
        <linearGradient id="spt-detail-mast"><stop stopColor="#66300e" /><stop offset=".2" stopColor="#de6319" /><stop offset=".5" stopColor="#ff963c" /><stop offset="1" stopColor="#983e0e" /></linearGradient>
        <linearGradient id="spt-detail-ground-fade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="white" /><stop offset=".82" stopColor="white" /><stop offset="1" stopColor="black" /></linearGradient>
        <mask id="spt-detail-ground-mask"><rect x={0} y={800} width={1000} height={410} fill="url(#spt-detail-ground-fade)" /></mask>
        <clipPath id="spt-detail-soil"><path d="M0 824Q110 813 225 823T450 821T670 827T1000 821V1210H0Z" /></clipPath>
        <pattern id="spt-detail-brush" width={44} height={36} patternUnits="userSpaceOnUse">
          {[3, 8, 14, 22, 31].map((y, i) => <path key={y} d={`M${i % 2 ? 2 : 12} ${y}h${24 + i * 2}`} stroke={i % 2 ? "#f4f5eb" : "#102736"} strokeWidth={0.6} opacity={0.1} />)}
        </pattern>
      </defs>

      <g transform={`translate(315 820) scale(${s.cameraZoom}) translate(-315 -820)`}>
      <g opacity={s.soilOpacity} mask="url(#spt-detail-ground-mask)">
        <g clipPath="url(#spt-detail-soil)">
          <rect x={0} y={800} width={1000} height={410} fill="#6c5338" />
          <path d="M0 905Q180 879 330 919T650 911T1000 929V1210H0Z" fill="#ab8c5c" />
          <path d="M0 1010Q200 1030 390 1006T700 1037T1000 1015V1210H0Z" fill="#757660" />
          <path d="M0 1122Q170 1090 350 1132T670 1124T1000 1131V1210H0Z" fill="#3c5152" />
          <rect x={0} y={810} width={1000} height={400} fill="url(#spt-detail-grain)" />
          {Array.from({ length: 160 }, (_, i) => {
            const x = rand(i + 14) * 1000, y = 824 + rand(i + 170) * 360, r = 1.4 + rand(i + 62) * 4;
            return <path key={i} d={`M${x - r} ${y}l${r} ${-r * .7} ${r * 1.5} ${r * .4} ${-r * .2} ${r} ${-r * 1.6} ${r * .2}Z`} fill={i % 4 ? "#c4b08a" : "#313e3d"} opacity={.2 + rand(i + 247) * .3} />;
          })}
          <rect x={287} y={819} width={56} height={198} fill="#071820" />
          <path d="M287 819V1017H343V819" stroke="#a4a18a" strokeOpacity={.5} strokeWidth={1.6} fill="none" />
        </g>
        <path d="M0 824Q110 813 225 823T450 821T670 827T1000 821" fill="none" stroke="#b5a27f" strokeWidth={4} />
        <ellipse cx={315} cy={821} rx={29} ry={5} fill="#071820" stroke="#988a6a" />
      </g>

      <g opacity={s.frameOpacity} data-spt="mast-mounted-guide-frame">
        <path d="M0 12L28 0H149V818H0Z" fill="url(#spt-detail-mast)" stroke="#9e6a3a" />
        <rect x={87} y={0} width={47} height={819} fill="url(#spt-detail-white)" stroke="#c4d2cb" />
        <rect x={124} y={0} width={22} height={819} fill="url(#spt-detail-steel)" />
        <path d="M0 96L87 184V214L0 126ZM0 333L87 421V451L0 363ZM0 574L87 662V692L0 604Z" fill="#c8cfbf" stroke="#516b74" strokeWidth={2} />
        <path d="M0 287L87 199V224L0 311ZM0 523L87 435V460L0 548Z" fill="#a74911" stroke="#e7984a" strokeWidth={2} />
        <path d="M69 11V803" stroke="#ffd38f" strokeOpacity={.6} strokeWidth={2} />
        {[150, 387, 628, 784].map(y => <Bolt key={y} x={101} y={y} r={6} />)}
        {[252, 643].map((y, i) => <g key={y}>
          <path d={`M141 ${y - 40}L185 ${y - 64}H224V${y + 42}H177L141 ${y + 18}Z`} fill="url(#spt-detail-dark)" stroke="#9aafb2" strokeWidth={2} />
          <path d={`M148 ${y - 33}L179 ${y - 49}V${y + 29}L148 ${y + 10}Z`} fill="#455c66" stroke="#70888e" />
          <Bolt x={162} y={y - 11} r={8} /><Bolt x={204} y={y + 19} r={6} />
        </g>)}
        {[210, 420].map(x => <g key={x}>
          <rect x={x - 10} y={240} width={20} height={528} fill="url(#spt-detail-steel)" stroke="#b6cccf" />
          <rect x={x - 10} y={240} width={20} height={528} fill="url(#spt-detail-brush)" />
        </g>)}
        {[200, 762].map(y => <g key={y}>
          <path d={`M179 ${y}L194 ${y - 13}H452L438 ${y}Z`} fill="#6b828a" stroke="#a6b6b8" />
          <rect x={179} y={y} width={259} height={44} rx={4} fill="url(#spt-detail-dark)" stroke="#8aa3ac" strokeWidth={2} />
          {[198, 235, 397, 422].map(x => <Bolt key={x} x={x} y={y + 20} r={6} />)}
        </g>)}
        <ellipse cx={315} cy={783} rx={28} ry={13} fill="#0b1f2a" stroke="#748f9a" strokeWidth={3} />
        <ellipse cx={315} cy={783} rx={11} ry={7} fill="#050e17" />
        <rect x={165} y={793} width={38} height={16} rx={2} fill="url(#spt-detail-orange)" />
        <rect x={435} y={773} width={17} height={34} rx={3} fill="url(#spt-detail-orange)" />
        <path d={`M315 224V${s.hammerBottom - 170}`} fill="none" stroke="#a0b4b6" strokeWidth={3} />
        <path d={`M312 226V${s.hammerBottom - 171}`} fill="none" stroke="#263f4c" strokeWidth={1} />
      </g>

      <g opacity={s.toolOpacity} data-spt="connected-rod-and-split-spoon">
        <rect data-spt="drive-rod" x={306} y={s.anvil - 385} width={18} height={s.samplerTop - s.anvil + 386} fill="url(#spt-detail-steel)" stroke="#c7d5d3" strokeWidth={1} />
        <rect x={305} y={s.anvil + 77} width={20} height={22} rx={2} fill="url(#spt-detail-steel)" stroke="#bacbcc" />
        <g transform={`translate(315 ${s.anvil})`}>
          <path d="M-43 0Q0 -11 43 0V18Q0 29 -43 18Z" fill="url(#spt-detail-orange)" stroke="#e4ba77" />
          <ellipse cy={0} rx={43} ry={9} fill="#c19d62" stroke="#ebd2a1" />
          <rect x={-13} y={19} width={26} height={29} fill="url(#spt-detail-steel)" stroke="#acbfc0" />
        </g>
        <g transform={`translate(315 ${s.samplerTop})`} data-spt="sampler">
          <path d="M-17 2Q0 -5 17 2V106Q0 113 -17 106Z" fill="url(#spt-detail-steel)" stroke="#c1d4d0" strokeWidth={1.3} />
          <path d="M-17 104H17L11 117H-11Z" fill="url(#spt-detail-steel)" stroke="#d2ded6" />
          <rect x={-10} y={12} width={20} height={88} rx={7} fill="#12242b" />
          <rect x={-8} y={100 - 85 * s.filled} width={16} height={85 * s.filled} rx={4} fill="url(#spt-detail-earth)" />
          <rect x={-8} y={100 - 85 * s.filled} width={16} height={85 * s.filled} rx={4} fill="url(#spt-detail-grain)" />
          <path d="M-17 7H17M-17 102H17" stroke="#bfd4d1" strokeWidth={3} />
          <path d="M-13 15V95" stroke="#e5e9de" strokeWidth={1.2} opacity={.65} />
        </g>
      </g>

      <g opacity={s.frameOpacity} transform={`translate(315 ${s.hammerBottom - 170})`} data-spt="guided-hammer">
        <path d="M-72 0H72V155Q0 185 -72 155Z" fill="url(#spt-detail-steel)" stroke="#c6d5d1" strokeWidth={1.5} />
        <rect x={-71} y={2} width={142} height={131} fill="url(#spt-detail-brush)" />
        <path d="M-72 130H72V155Q0 185 -72 155Z" fill="url(#spt-detail-orange)" stroke="#c67830" />
        <ellipse cy={0} rx={72} ry={16} fill="#a7bab9" stroke="#e0e5dc" />
        <rect x={-15} y={-26} width={30} height={26} rx={3} fill="url(#spt-detail-steel)" stroke="#c2d4d4" />
        <rect x={-52 + 36 * Math.sin(t * .7)} y={17} width={11} height={108} fill="#e7f0ed" opacity={.07} />
        <path d="M-57 17V115M52 18V115" stroke="#e7ece4" strokeOpacity={.32} strokeWidth={2} />
      </g>
      </g>
    </svg>
  );
}
