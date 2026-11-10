import React from "react";
import { Bolt } from "./GeoMaterials";
import { ease, gold } from "./motion";
export function LabDefs({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={id + "-brass"}>
        <stop stopColor="#71502c" />
        <stop offset=".2" stopColor="#c7a15b" />
        <stop offset=".43" stopColor="#f1d895" />
        <stop offset=".64" stopColor="#c2a15c" />
        <stop offset="1" stopColor="#80613a" />
      </linearGradient>
      <linearGradient id={id + "-clay"}>
        <stop stopColor="#75644b" />
        <stop offset=".5" stopColor="#b09a72" />
        <stop offset="1" stopColor="#76664c" />
      </linearGradient>
    </defs>
  );
}
export function cupMotion(t: number) {
  const clock = Math.min(Math.max(0, t), 6.86),
    phase = (((clock * 2 + 0.28) % 1) + 1) % 1;
  return {
    angle: 3.2 * (phase < 0.84 ? phase / 0.84 : (1 - phase) / 0.16),
    crank: -clock * Math.PI * 4,
    closure: ease((t - 1.5) / 5.3),
  };
}
/** Casagrande cup: cam raises the pivoted cup, gravity return, local groove closure. */
export function AtterbergApparatus({ t, id }: { t: number; id: string }) {
  const s = cupMotion(t),
    a = s.crank;
  return (
    <g data-apparatus="casagrande-liquid-limit">
      <LabDefs id={id} />
      <path d="M150 555L188 533H832L800 555Z" fill="#435963" stroke="#849b9e" />
      <path
        d="M150 555H800V625H150Z"
        fill={`url(#${id}-dark)`}
        stroke="#6f8992"
      />
      <path d="M800 555L832 533V602L800 625Z" fill="#152a36" stroke="#526f7d" />
      <path d="M180 555H780" stroke="#c5d1c7" strokeOpacity=".35" />
      {[185, 764].map((x) => (
        <g key={x}>
          <rect
            x={x - 18}
            y={625}
            width={36}
            height={13}
            rx={4}
            fill="#0c202d"
          />
          <Bolt x={x} y={582} r={4} />
        </g>
      ))}
      <path d="M300 520H665V554H300Z" fill="#17252b" stroke="#586a6e" />
      <path d="M300 520L321 509H685L665 520Z" fill="#4c5a5a" />
      <path
        d="M626 324H654V530H626Z"
        fill={`url(#${id}-steel)`}
        stroke="#b1c2c0"
      />
      <path d="M620 516H676V536H620Z" fill={`url(#${id}-brass)`} />
      <rect
        x={664}
        y={395}
        width={53}
        height={94}
        rx={6}
        fill={`url(#${id}-white)`}
        stroke="#b1c1bd"
      />
      <Bolt x={681} y={416} r={4} />
      <Bolt x={681} y={470} r={4} />
      <g transform={`translate(715 442) rotate(${(a * 180) / Math.PI})`}>
        <circle r={27} fill={`url(#${id}-brass)`} stroke="#e1ca8e" />
        <path
          d="M-13 -25Q30 -35 34 5Q32 27 -15 24Z"
          fill="#bd9855"
          stroke="#e3cc90"
        />
        <circle r={10} fill="#2b4554" />
        <path d="M0 0H65" stroke={`url(#${id}-steel)`} strokeWidth={11} />
        <circle cx={65} r={12} fill="#173344" stroke="#8da7ae" />
        <circle cx={65} r={5} fill="#627e89" />
      </g>
      <g transform={`rotate(${s.angle} 640 400)`}>
        <path
          d="M625 395H695V410H625Z"
          fill={`url(#${id}-brass)`}
          stroke="#d5b66c"
        />
        <path
          d="M325 400C330 474 403 520 486 520S635 474 640 400Z"
          fill={`url(#${id}-brass)`}
          stroke="#d2b775"
          strokeWidth={2}
        />
        <ellipse
          cx={483}
          cy={400}
          rx={158}
          ry={50}
          fill="#c6aa6c"
          stroke="#edda9e"
          strokeWidth={3}
        />
        <ellipse cx={483} cy={397} rx={143} ry={42} fill={`url(#${id}-clay)`} />
        <ellipse
          cx={483}
          cy={397}
          rx={143}
          ry={42}
          fill={`url(#${id}-grain)`}
          opacity=".24"
        />
        <path
          d={`M478 356Q469 378 471 400L${473 + 10 * s.closure} 409V426L475 434Q482 440 490 433L${493 - 10 * s.closure} 426V409L495 402Q494 376 488 356Z`}
          fill="#756039"
          stroke="#d3b67b"
          strokeWidth={1.2}
        />
        <path
          d="M335 409Q480 457 633 409"
          fill="none"
          stroke="#e7d393"
          strokeWidth={2}
          opacity=".6"
        />
      </g>
      <circle
        cx={640}
        cy={400}
        r={10}
        fill={`url(#${id}-steel)`}
        stroke="#d5d9c2"
      />
      <Bolt x={640} y={400} r={4} />
      <text
        x={485}
        y={702}
        textAnchor="middle"
        direction="rtl"
        fontFamily="EtqanCairo"
        fontSize={31}
        fill="#c8d9df"
      >
        حدّ السيولة
      </text>
    </g>
  );
}
export function shearMotion(t: number) {
  return {
    normal: 4 * ease(t / 0.8),
    displacement: 26 * ease((t - 0.8) / 6.6),
  };
}
/** Cutaway split box: upper half restrained, lower carriage translated horizontally. */
export function DirectShearApparatus({ t, id }: { t: number; id: string }) {
  const s = shearMotion(t),
    d = s.displacement;
  return (
    <g data-apparatus="split-box-direct-shear">
      <LabDefs id={id} />
      <path d="M110 555L142 532H905L875 555Z" fill="#536d79" stroke="#8aa3aa" />
      <path
        d="M110 555H875V624H110Z"
        fill={`url(#${id}-white)`}
        stroke="#a3b9bd"
      />
      <path d="M875 555L905 532V604L875 624Z" fill="#2a485a" stroke="#7795a3" />
      <rect x={135} y={575} width={165} height={31} rx={3} fill="#18384b" />
      <path d="M154 587H213" stroke="#8ca6ae" />
      <circle cx={274} cy={590} r={5} fill={gold} />
      {[155, 825].map((x) => (
        <g key={x}>
          <rect
            x={x - 17}
            y={624}
            width={34}
            height={12}
            rx={3}
            fill="#0b2332"
          />
          <Bolt x={x} y={566} r={3} />
        </g>
      ))}
      <path
        d="M285 514H742M285 538H742"
        stroke={`url(#${id}-steel)`}
        strokeWidth={11}
      />
      {[300, 710].map((x) => (
        <g key={x}>
          <path
            d={`M${x - 13} 501h26v45h-26Z`}
            fill="#314f5f"
            stroke="#9cb2b9"
          />
          <Bolt x={x} y={514} r={3} />
        </g>
      ))}
      <path
        d="M330 204V541M661 204V541"
        stroke={`url(#${id}-steel)`}
        strokeWidth={17}
      />
      <path
        d="M310 187H681V224H310Z"
        fill={`url(#${id}-dark)`}
        stroke="#8ca8b2"
      />
      <path d="M310 187L330 175H701L681 187Z" fill="#7c969e" />
      {[330, 661].map((x) => (
        <Bolt key={x} x={x} y={205} r={4} />
      ))}
      <rect
        x={477}
        y={224}
        width={36}
        height={88 + s.normal}
        fill={`url(#${id}-steel)`}
      />
      <rect
        x={465}
        y={227}
        width={60}
        height={38}
        rx={3}
        fill={`url(#${id}-dark)`}
        stroke="#91a9af"
      />
      <g transform={`translate(0 ${s.normal})`}>
        <path
          d="M363 310H627V334H363Z"
          fill={`url(#${id}-steel)`}
          stroke="#c2d0ca"
        />
        <path d="M363 310L384 298H646L627 310Z" fill="#b8c9c7" />
        <path d="M375 334H614V403H375Z" fill={`url(#${id}-earth)`} />
        <path d="M375 334H614V403H375Z" fill={`url(#${id}-grain)`} />
        <path
          d="M350 329H372V404H350Z M615 329H641V404H615Z"
          fill={`url(#${id}-steel)`}
          stroke="#c1cfcb"
        />
        <path d="M350 329H641V343H350Z" fill={`url(#${id}-steel)`} />
        <path
          d="M350 389H641V404H350Z"
          fill={`url(#${id}-steel)`}
          stroke="#bdcbc8"
        />
        {[360, 630].map((x) => (
          <g key={x}>
            <Bolt x={x} y={351} r={2.6} />
            <Bolt x={x} y={380} r={2.6} />
          </g>
        ))}
      </g>
      <g transform={`translate(${d} ${s.normal})`}>
        <path d="M375 404H614V465H375Z" fill={`url(#${id}-earth)`} />
        <path d="M375 404H614V465H375Z" fill={`url(#${id}-grain)`} />
        <path
          d="M350 404H372V477H350Z M615 404H641V477H615Z"
          fill={`url(#${id}-steel)`}
          stroke="#b4c6c6"
        />
        <path d="M350 404H641V416H350Z" fill={`url(#${id}-steel)`} />
        <path
          d="M350 463H641V477H350Z"
          fill={`url(#${id}-steel)`}
          stroke="#c3d0c9"
        />
        <path
          d="M330 477H660V508H330Z"
          fill={`url(#${id}-dark)`}
          stroke="#90aab1"
        />
        <path d="M330 477L350 465H680L660 477Z" fill="#7d969b" />
        {[361, 626].map((x) => (
          <Bolt key={x} x={x} y={491} r={3} />
        ))}
      </g>
      <path d="M170 368H208" stroke={`url(#${id}-steel)`} strokeWidth={12} />
      <ellipse
        cx={244}
        cy={368}
        rx={35}
        ry={29}
        fill="none"
        stroke={`url(#${id}-steel)`}
        strokeWidth={12}
      />
      <path d="M280 368H350" stroke={`url(#${id}-steel)`} strokeWidth={10} />
      <path d="M158 327H179V547H158Z" fill={`url(#${id}-steel)`} />
      <Bolt x={168} y={368} r={6} />
      <path
        d={`M${641 + d} ${441 + s.normal}H816`}
        stroke={`url(#${id}-steel)`}
        strokeWidth={12}
      />
      {Array.from({ length: 14 }, (_, i) => {
        const x = 680 + i * 8;
        return (
          <path
            key={i}
            d={`M${x} ${435 + s.normal}l-4 12`}
            stroke="#486572"
            strokeWidth={1.3}
            opacity={x > 648 + d ? 1 : 0}
          />
        );
      })}
      <rect
        x={815}
        y={410}
        width={72}
        height={70}
        rx={5}
        fill={`url(#${id}-dark)`}
        stroke="#91aab1"
      />
      <rect x={833} y={480} width={37} height={59} fill={`url(#${id}-steel)`} />
      <Bolt x={851} y={439} r={9} />
      <path
        d="M375 407H614"
        stroke={gold}
        strokeWidth={1.5}
        opacity={0.25 + 0.25 * ease(t / 3)}
      />
      <text
        x={490}
        y={702}
        textAnchor="middle"
        direction="rtl"
        fontFamily="EtqanCairo"
        fontSize={29}
        fill="#c8d9df"
      >
        تحميل رأسي وإزاحة أفقية
      </text>
    </g>
  );
}
