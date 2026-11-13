export const clamp = (v: number) => Math.max(0, Math.min(1, v));
export const ease = (v: number) => {
  v = clamp(v);
  return v * v * (3 - 2 * v);
};
export const mix = (a: number, b: number, t: number) => a + (b - a) * t;
export const rand = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
export const reveal = (t: number, a: number, d = 0.65) => ease((t - a) / d);
export const gold = "#e4bb53",
  white = "#f5f6f4",
  muted = "#a6bfcc";
