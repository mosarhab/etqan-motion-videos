import * as T from "three";
import { rand } from "./Materials";
type P = T.Vector3;
type Face = { points: P[]; material: number };
export type Cell = {
  geometry: T.BufferGeometry;
  center: T.Vector3;
  seed: number;
};
const v = (x: number, y: number, z: number) => new T.Vector3(x, y, z);
function clip(faces: Face[], n: P, c: number): Face[] {
  const out: Face[] = [],
    cap: P[] = [];
  for (const f of faces) {
    const pts: P[] = [];
    for (let i = 0; i < f.points.length; i++) {
      const a = f.points[i],
        b = f.points[(i + 1) % f.points.length],
        da = n.dot(a) + c,
        db = n.dot(b) + c;
      const ia = da <= 1e-8,
        ib = db <= 1e-8;
      if (ia) pts.push(a);
      if (ia !== ib) {
        const p = a.clone().lerp(b, da / (da - db));
        pts.push(p);
        if (!cap.some((q) => q.distanceToSquared(p) < 1e-12)) cap.push(p);
      }
    }
    if (pts.length >= 3) out.push({ points: pts, material: f.material });
  }
  if (cap.length >= 3) {
    const center = cap
        .reduce((a, b) => a.add(b), new T.Vector3())
        .multiplyScalar(1 / cap.length),
      u =
        Math.abs(n.x) < 0.8
          ? v(1, 0, 0).cross(n).normalize()
          : v(0, 1, 0).cross(n).normalize(),
      w = n.clone().cross(u).normalize();
    cap.sort(
      (a, b) =>
        Math.atan2(a.clone().sub(center).dot(w), a.clone().sub(center).dot(u)) -
        Math.atan2(b.clone().sub(center).dot(w), b.clone().sub(center).dot(u)),
    );
    out.push({ points: cap, material: 1 });
  }
  return out;
}
export function fractureCells(): Cell[] {
  const r = 0.75,
    seeds: P[] = [];
  for (let i = 0; i < 27; i++)
    seeds.push(
      v(
        ((i % 3) - 1) * 0.48 + (rand(i * 3) - 0.5) * 0.19,
        ((Math.floor(i / 3) % 3) - 1) * 0.48 + (rand(i * 3 + 1) - 0.5) * 0.19,
        (Math.floor(i / 9) - 1) * 0.48 + (rand(i * 3 + 2) - 0.5) * 0.19,
      ),
    );
  const cube = [
    [v(-r, -r, r), v(r, -r, r), v(r, r, r), v(-r, r, r)],
    [v(r, -r, -r), v(-r, -r, -r), v(-r, r, -r), v(r, r, -r)],
    [v(-r, -r, -r), v(-r, -r, r), v(-r, r, r), v(-r, r, -r)],
    [v(r, -r, r), v(r, -r, -r), v(r, r, -r), v(r, r, r)],
    [v(-r, -r, -r), v(r, -r, -r), v(r, -r, r), v(-r, -r, r)],
    [v(-r, r, r), v(r, r, r), v(r, r, -r), v(-r, r, -r)],
  ];
  return seeds.map((s, index) => {
    let faces: Face[] = cube.map((points) => ({
      points: points.map((p) => p.clone()),
      material: 0,
    }));
    for (let j = 0; j < seeds.length; j++)
      if (j !== index) {
        const n = seeds[j].clone().sub(s),
          c = (s.lengthSq() - seeds[j].lengthSq()) / 2;
        faces = clip(faces, n, c);
      }
    const all = faces.flatMap((f) => f.points),
      center = all
        .reduce((a, b) => a.add(b), new T.Vector3())
        .multiplyScalar(1 / all.length),
      p: number[] = [],
      uv: number[] = [],
      groups: { start: number; count: number; material: number }[] = [];
    for (const face of faces) {
      const n = face.points[1]
          .clone()
          .sub(face.points[0])
          .cross(face.points[2].clone().sub(face.points[0]))
          .normalize(),
        axis = Math.abs(n.z) > 0.6 ? 2 : Math.abs(n.y) > 0.6 ? 1 : 0;
      const start = p.length / 3;
      for (let i = 1; i < face.points.length - 1; i++)
        for (const q of [face.points[0], face.points[i], face.points[i + 1]]) {
          p.push(q.x - center.x, q.y - center.y, q.z - center.z);
          uv.push(
            ((axis === 0 ? q.z : q.x) + r) / (2 * r),
            ((axis === 1 ? q.z : q.y) + r) / (2 * r),
          );
        }
      groups.push({
        start,
        count: p.length / 3 - start,
        material: face.material,
      });
    }
    const g = new T.BufferGeometry();
    g.setAttribute("position", new T.Float32BufferAttribute(p, 3));
    g.setAttribute("uv", new T.Float32BufferAttribute(uv, 2));
    for (const x of groups) g.addGroup(x.start, x.count, x.material);
    g.computeVertexNormals();
    return { geometry: g, center, seed: index };
  });
}
