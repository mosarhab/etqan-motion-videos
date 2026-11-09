import * as T from "three";
export const rand = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
const cache: Record<string, T.MeshStandardMaterial> = {};
/** Procedural aggregate, capillary pores and micro-normal maps; no scene image. */
export function concrete(wet = false, broken = false) {
  const key = `concrete-${wet}-${broken}`;
  if (cache[key]) return cache[key];
  const w = 1024;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = w;
  const c = canvas.getContext("2d")!;
  const height = document.createElement("canvas");
  height.width = height.height = w;
  const h = height.getContext("2d")!;
  const d = c.createImageData(w, w),
    hd = h.createImageData(w, w);
  for (let i = 0; i < w * w; i++) {
    const n = rand(i + 301),
      base = (wet ? 97 : broken ? 142 : 153) + (n - 0.5) * 18;
    d.data.set([base, base + 2, base + 1, 255], i * 4);
    const v = 127 + (n - 0.5) * 26;
    hd.data.set([v, v, v, 255], i * 4);
  }
  c.putImageData(d, 0, 0);
  h.putImageData(hd, 0, 0);
  for (let i = 0; i < (broken ? 460 : wet ? 260 : 140); i++) {
    const x = rand(i * 9 + 11) * w,
      y = rand(i * 9 + 12) * w,
      r = 2 + Math.pow(rand(i * 9 + 13), 2.5) * (broken ? 32 : wet ? 18 : 10),
      n = 5 + Math.floor(rand(i * 9 + 14) * 5);
    c.beginPath();
    h.beginPath();
    for (let j = 0; j < n; j++) {
      const a = (j / n) * Math.PI * 2,
        rr = r * (0.58 + rand(i * 37 + j) * 0.42),
        xx = x + Math.cos(a) * rr,
        yy = y + Math.sin(a) * rr;
      j
        ? (c.lineTo(xx, yy), h.lineTo(xx, yy))
        : (c.moveTo(xx, yy), h.moveTo(xx, yy));
    }
    c.closePath();
    h.closePath();
    const b =
      (wet ? 86 : broken ? 114 : 145) +
      (rand(i + 312) - 0.5) * (broken ? 44 : wet ? 23 : 16);
    const grad = c.createLinearGradient(x - r, y - r, x + r, y + r);
    grad.addColorStop(0, `rgb(${b + 8},${b + 9},${b + 8})`);
    grad.addColorStop(1, `rgb(${b - 8},${b - 6},${b - 7})`);
    c.fillStyle = grad;
    c.fill();
    h.fillStyle = `rgb(${134 + (i % 9)},${134 + (i % 9)},${134 + (i % 9)})`;
    h.fill();
    c.strokeStyle = wet ? "rgba(70,76,76,.23)" : "rgba(75,82,82,.20)";
    c.lineWidth = 1;
    c.stroke();
    for (let k = 0; k < 80; k++) {
      const xx = x + (rand(i * 31 + k) - 0.5) * r * 1.1,
        yy = y + (rand(i * 71 + k) - 0.5) * r * 1.1;
      c.fillStyle = `rgba(230,233,228,${0.03 + rand(i + k) * 0.06})`;
      c.fillRect(xx, yy, 0.4 + rand(k + i) * 1.2, 0.4 + rand(k + i + 7) * 1.2);
    }
  }
  for (let i = 0; i < 2600; i++) {
    const x = rand(i * 3 + 4100) * w,
      y = rand(i * 3 + 4101) * w,
      r = 0.25 + Math.pow(rand(i * 3 + 4102), 4) * 3.8;
    c.fillStyle = wet ? "rgba(39,45,46,.4)" : "rgba(53,60,60,.28)";
    c.beginPath();
    c.ellipse(x, y, r, r * 0.66, rand(i) * 3, 0, Math.PI * 2);
    c.fill();
    h.fillStyle = "#3b3b3b";
    h.beginPath();
    h.arc(x, y, r, 0, Math.PI * 2);
    h.fill();
  }
  const map = new T.CanvasTexture(canvas);
  map.colorSpace = T.SRGBColorSpace;
  map.wrapS = map.wrapT = T.RepeatWrapping;
  map.anisotropy = 4;
  const src = h.getImageData(0, 0, w, w).data,
    normal = new Uint8Array(w * w * 4);
  for (let y = 0; y < w; y++)
    for (let x = 0; x < w; x++) {
      const id = (y * w + x) * 4,
        dx =
          (src[(y * w + ((x + 1) % w)) * 4] -
            src[(y * w + ((x + w - 1) % w)) * 4]) /
          255,
        dy =
          (src[(((y + 1) % w) * w + x) * 4] -
            src[(((y + w - 1) % w) * w + x) * 4]) /
          255;
      const v = new T.Vector3(-dx * 0.55, dy * 0.55, 1).normalize();
      normal.set(
        [
          (v.x * 0.5 + 0.5) * 255,
          (v.y * 0.5 + 0.5) * 255,
          (v.z * 0.5 + 0.5) * 255,
          255,
        ],
        id,
      );
    }
  const nmap = new T.DataTexture(normal, w, w, T.RGBAFormat);
  nmap.needsUpdate = true;
  nmap.wrapS = nmap.wrapT = T.RepeatWrapping;
  nmap.anisotropy = 4;
  const mat = new T.MeshStandardMaterial({
    map,
    normalMap: nmap,
    normalScale: new T.Vector2(0.8, 0.8),
    roughness: wet ? 0.42 : 0.86,
    metalness: 0,
  });
  cache[key] = mat;
  return mat;
}
export const steel = new T.MeshStandardMaterial({
  color: "#aeb7bc",
  metalness: 0.91,
  roughness: 0.27,
});
export const brushed = new T.MeshStandardMaterial({
  color: "#b8bfc3",
  metalness: 0.86,
  roughness: 0.36,
});
export const navy = new T.MeshStandardMaterial({
  color: "#182a4b",
  metalness: 0.42,
  roughness: 0.38,
});
export const gold = new T.MeshStandardMaterial({
  color: "#e7bd33",
  metalness: 0.6,
  roughness: 0.3,
});
export const rubber = new T.MeshStandardMaterial({
  color: "#24292d",
  metalness: 0.05,
  roughness: 0.77,
});
export const pale = new T.MeshStandardMaterial({
  color: "#e8ebeb",
  metalness: 0.25,
  roughness: 0.44,
});
export const dark = new T.MeshStandardMaterial({
  color: "#303b40",
  metalness: 0.35,
  roughness: 0.48,
});
export const water = new T.MeshPhysicalMaterial({
  color: "#c2e2e5",
  roughness: 0.08,
  metalness: 0,
  transmission: 0.7,
  thickness: 0.7,
  ior: 1.333,
  transparent: true,
  opacity: 0.4,
  attenuationColor: new T.Color("#8acbd0"),
  attenuationDistance: 6,
});
export const glass = new T.MeshPhysicalMaterial({
  color: "#dae7e7",
  transmission: 0.85,
  roughness: 0.04,
  thickness: 0.06,
  ior: 1.45,
  transparent: true,
  opacity: 0.14,
  side: T.DoubleSide,
});
