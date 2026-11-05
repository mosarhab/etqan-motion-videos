import * as T from "three";
import { rand } from "./World";
export type Kind = "soil" | "concrete" | "asphalt";
const cache: Partial<Record<Kind, T.MeshStandardMaterial>> = {};
export function surface(kind: Kind) {
  if (cache[kind]) return cache[kind]!;
  const c = document.createElement("canvas");
  c.width = c.height = 1024;
  const ctx = c.getContext("2d")!;
  const h = document.createElement("canvas");
  h.width = h.height = 1024;
  const hc = h.getContext("2d")!;
  const base =
    kind === "soil"
      ? [102, 83, 59]
      : kind === "concrete"
        ? [180, 179, 165]
        : [39, 44, 47];
  ctx.fillStyle = `rgb(${base.join(",")})`;
  ctx.fillRect(0, 0, 1024, 1024);
  hc.fillStyle = "#8a8a8a";
  hc.fillRect(0, 0, 1024, 1024);
  for (let i = 0; i < 16000; i++) {
    const x = rand(i * 4) * 1024,
      y = rand(i * 4 + 1) * 1024,
      r =
        0.4 +
        Math.pow(rand(i * 4 + 2), 5) *
          (kind === "asphalt" ? 11 : kind === "soil" ? 5 : 7);
    const bright = rand(i * 4 + 3);
    const v =
      (bright - 0.5) * (kind === "soil" ? 55 : kind === "concrete" ? 35 : 40);
    ctx.fillStyle = `rgb(${base.map((n) => Math.min(255, Math.max(0, n + v))).join(",")})`;
    ctx.beginPath();
    ctx.ellipse(
      x,
      y,
      r,
      r * (0.4 + rand(i + 42) * 0.6),
      rand(i + 8) * Math.PI,
      0,
      Math.PI * 2,
    );
    ctx.fill();
    hc.fillStyle =
      bright > 0.8 ? "#434343" : bright < 0.3 ? "#c4c4c4" : "#888888";
    hc.beginPath();
    hc.arc(x, y, r, 0, Math.PI * 2);
    hc.fill();
    if (kind === "concrete" && r > 3.5) {
      ctx.fillStyle = "#787a71";
      ctx.beginPath();
      ctx.arc(x, y, r * 0.55, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  if (kind === "soil") {
    for (let i = 0; i < 240; i++) {
      let x = rand(i * 3 + 71) * 1024,
        y = rand(i * 3 + 72) * 1024;
      ctx.beginPath();
      hc.beginPath();
      ctx.moveTo(x, y);
      hc.moveTo(x, y);
      for (let j = 0; j < 8; j++) {
        x += (rand(i * 17 + j) - 0.45) * 15;
        y += 4 + rand(i * 13 + j) * 11;
        ctx.lineTo(x, y);
        hc.lineTo(x, y);
      }
      ctx.strokeStyle = "rgba(43,33,20,.35)";
      ctx.lineWidth = 0.6 + rand(i + 512) * 2;
      ctx.stroke();
      hc.strokeStyle = "#303030";
      hc.lineWidth = ctx.lineWidth;
      hc.stroke();
    }
  }
  const map = new T.CanvasTexture(c);
  map.colorSpace = T.SRGBColorSpace;
  map.wrapS = map.wrapT = T.RepeatWrapping;
  map.repeat.set(kind === "asphalt" ? 2 : 1.5, 1.5);
  map.anisotropy = 4;
  const bump = new T.CanvasTexture(h);
  bump.wrapS = bump.wrapT = T.RepeatWrapping;
  bump.repeat.copy(map.repeat);
  const mat = new T.MeshStandardMaterial({
    map,
    bumpMap: bump,
    bumpScale: kind === "soil" ? 0.038 : kind === "concrete" ? 0.025 : 0.04,
    roughness: kind === "asphalt" ? 0.68 : 0.91,
    metalness: kind === "asphalt" ? 0.1 : 0.01,
  });
  cache[kind] = mat;
  return mat;
}
export function noise(x: number, y: number, z: number) {
  const a =
    Math.sin(x * 1.73 + Math.sin(y * 2.1 + z * 1.7)) *
    Math.cos(y * 2.7 - z * 0.8);
  const b = Math.sin(x * 5.1 + z * 3.4) * Math.cos(y * 6.2 + x * 1.2);
  return a * 0.7 + b * 0.3;
}
export function monolith(kind: Kind, w = 2.65, h = 3.8, d = 1.5, carve = true) {
  const g = new T.BoxGeometry(w, h, d, 70, 100, 28),
    a = g.attributes.position;
  const colors = [];
  for (let i = 0; i < a.count; i++) {
    let x = a.getX(i),
      y = a.getY(i),
      z = a.getZ(i);
    const bx = Math.max(-w / 2 + 0.13, Math.min(w / 2 - 0.13, x)),
      by = Math.max(-h / 2 + 0.13, Math.min(h / 2 - 0.13, y)),
      bz = Math.max(-d / 2 + 0.13, Math.min(d / 2 - 0.13, z));
    const v = new T.Vector3(x - bx, y - by, z - bz)
      .normalize()
      .multiplyScalar(0.13);
    x = bx + v.x;
    y = by + v.y;
    z = bz + v.z;
    const n = noise(x * 2, y * 2, z * 2),
      front = a.getZ(i) > d / 2 - 0.02;
    let groove = 0;
    if (front && kind === "soil" && carve) {
      const center = 0.48 * Math.sin(y * 1.15) + y * 0.08;
      groove = Math.exp(-Math.pow((x - center) / 0.65, 2)) * 0.52;
      z -= groove;
    }
    const micro = noise(x * 11, y * 13, z * 11) * 0.045;
    x += n * 0.09 + micro;
    y += noise(y * 3, z * 2, x * 3) * 0.075 + micro;
    z +=
      n * (kind === "concrete" ? 0.02 : 0.12) +
      (kind === "concrete" ? micro * 0.2 : micro);
    a.setXYZ(i, x, y, z);
    const col = new T.Color(
      kind === "soil"
        ? groove > 0.12
          ? "#eee0bd"
          : "#d9cfb8"
        : kind === "concrete"
          ? "#e8e5db"
          : "#ddddcf",
    );
    col.multiplyScalar(0.85 + 0.15 * n);
    colors.push(col.r, col.g, col.b);
  }
  g.setAttribute("color", new T.Float32BufferAttribute(colors, 3));
  g.computeVertexNormals();
  return g;
}
