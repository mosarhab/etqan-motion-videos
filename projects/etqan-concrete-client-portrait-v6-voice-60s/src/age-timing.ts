import { clamp } from "./motion";

/** Illustrative age since casting, not elapsed time spent in the water bath. */
export function sampleAge(t: number) {
  const progress = clamp((t - 4.6) / 4.4);
  return { progress, days: Math.min(28, 1 + Math.floor(progress * 27 + 1e-8)) };
}
