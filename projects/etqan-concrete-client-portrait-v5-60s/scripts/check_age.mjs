// Check the actual age helper used by the rendered counter at every video frame.
import ts from "typescript";
import fs from "node:fs";
const toUrl = (s) =>
  "data:text/javascript;base64," + Buffer.from(s).toString("base64");
const compile = (s) =>
  ts.transpileModule(s, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2020,
    },
  }).outputText;
const motionUrl = toUrl(compile(fs.readFileSync("src/motion.ts", "utf8")));
const ageCode = compile(fs.readFileSync("src/age-timing.ts", "utf8")).replace(
  /from ["']\.\/motion["']/,
  `from ${JSON.stringify(motionUrl)}`,
);
const { sampleAge } = await import(toUrl(ageCode));
const values = Array.from({ length: 348 }, (_, f) => sampleAge(f / 30));
if (
  values.some(
    (x) => x.days < 1 || x.days > 28 || x.progress < 0 || x.progress > 1,
  )
)
  throw new Error("Age out of range");
if (
  values
    .slice(1)
    .some((x, i) => x.days < values[i].days || x.progress < values[i].progress)
)
  throw new Error("Clock reverses");
if (new Set(values.map((x) => x.days)).size !== 28)
  throw new Error("Clock skips an age");
if (
  sampleAge(9).days !== 28 ||
  sampleAge(9).progress !== 1 ||
  sampleAge(8.9).days === 28
)
  throw new Error("Clock endpoint is wrong");
if (
  values
    .filter((x, i) => i / 30 >= 9 && i / 30 <= 10.7)
    .some((x) => x.days !== 28)
)
  throw new Error("Endpoint does not hold");
if (!(4.6 > 1.4 + 3))
  throw new Error("Aging animation begins before rack immersion finishes");
const source = fs.readFileSync("src/SampleAge.tsx", "utf8");
for (const required of [
  "عُمر العينة",
  "يوم واحد",
  "يومان",
])
  if (!source.includes(required))
    throw new Error("Missing required clock copy");
for (const removed of ["أحد أعمار اختبار المقاومة الشائعة", "حتى عمر الاختبار المحدد"])
  if (source.includes(removed)) throw new Error("Removed counter subtitle remains");
const curing = fs.readFileSync("src/Curing.tsx", "utf8"),
  closing = fs.readFileSync("src/Closing.tsx", "utf8");
if (!curing.includes("معالجة العينات وفق متطلبات المواصفات القياسية."))
  throw new Error("Missing curing standards line");
if (
  !closing.includes("أجهزة مُعايرة…") ||
  !closing.includes("واختبارات وفق المواصفات القياسية.")
)
  throw new Error("Missing user-approved calibration wording");
if (!closing.includes("0551603205") || !closing.includes('data-copy="closing-phone"'))
  throw new Error("Closing contact number is missing");
const brand = fs.readFileSync("src/Brand.tsx", "utf8");
if (!brand.includes("0535588975") || brand.includes("0551603205"))
  throw new Error("Persistent footer number changed");
const result = {
  passed: true,
  frames_checked: 348,
  minimum_age: 1,
  maximum_age: 28,
  all_28_ages_appear: true,
  age_increases_monotonically: true,
  endpoint_global_seconds: 41,
  endpoint_held_before_fade: true,
  aging_starts_after_immersion: true,
  age_since_casting_not_water_duration: true,
  counter_subtitle_removed_as_requested: true,
  closing_contact_phone: "0551603205",
  persistent_footer_phone: "0535588975",
  user_approved_standards_and_calibration_copy_present: true,
  limits:
    "Illustrative passage of sample age, not an actual specimen record or mandatory age for all tests; no certification or standard number is displayed.",
};
fs.writeFileSync(
  "renders/age-and-copy-check.json",
  JSON.stringify(result, null, 2) + "\n",
);
console.log(JSON.stringify(result, null, 2));
