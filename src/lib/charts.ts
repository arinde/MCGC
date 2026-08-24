/**
 * Chart geometry — pure maths, no DOM, no dependencies.
 *
 * The dashboard renders its charts as inline SVG on the server. That is a
 * deliberate choice over a charting library: the admin pages are already
 * server-rendered, the datasets are small, and shipping ~60KB of Chart.js to
 * draw seven bars would be the single largest asset on a site an usher opens
 * on mobile data at the gate.
 *
 * Every function here returns plain numbers or SVG path strings, so the
 * components stay markup and this stays testable.
 */

export type Slice = {
  label: string;
  value: number;
  /** Optional drill-down target. Carried through so a legend row can link to
      the filtered list behind the slice. */
  href?: string;
};

export type Series = {
  label: string;
  values: number[];
};

/** Categorical palette. Gold leads because it is the convention's own accent. */
export const SERIES_COLORS = [
  "var(--accent)",
  "var(--color-info)",
  "var(--color-success)",
  "var(--accent-deep)",
  "var(--color-warning)",
  "var(--glow-cool)",
  "var(--color-danger)",
  "var(--glow-cool-pale)",
] as const;

export function seriesColor(index: number): string {
  return SERIES_COLORS[index % SERIES_COLORS.length];
}

/**
 * Rounds an axis maximum up to a readable number, so the top gridline reads
 * "40" rather than "37". Always returns at least 1 — a zero-height axis makes
 * every bar infinite.
 */
export function niceCeiling(value: number): number {
  if (!Number.isFinite(value) || value <= 0) return 1;

  const magnitude = 10 ** Math.floor(Math.log10(value));
  const normalised = value / magnitude;
  const step = normalised <= 1 ? 1 : normalised <= 2 ? 2 : normalised <= 5 ? 5 : 10;

  return step * magnitude;
}

/** Evenly spaced axis values from 0 to max, inclusive of both ends. */
export function axisTicks(max: number, count = 4): number[] {
  return Array.from({ length: count + 1 }, (_, i) => Math.round((max / count) * i));
}

// ---------------------------------------------------------------- line

export type LineGeometry = {
  /** The stroked path along the top of the data. */
  line: string;
  /** The same path closed to the baseline, for a soft fill underneath. */
  area: string;
  points: { x: number; y: number; value: number }[];
};

/**
 * Maps a series onto a box. A single data point still produces a visible dot —
 * on day one of registrations that is the whole chart, and an empty panel
 * looks broken rather than early.
 */
export function buildLine(
  values: number[],
  width: number,
  height: number,
  max: number,
): LineGeometry {
  if (values.length === 0) {
    return { line: "", area: "", points: [] };
  }

  const step = values.length === 1 ? 0 : width / (values.length - 1);
  const safeMax = max > 0 ? max : 1;

  const points = values.map((value, index) => ({
    x: values.length === 1 ? width / 2 : index * step,
    y: height - (value / safeMax) * height,
    value,
  }));

  const line = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${round(point.x)} ${round(point.y)}`)
    .join(" ");

  const first = points[0];
  const last = points[points.length - 1];
  const area = `${line} L ${round(last.x)} ${height} L ${round(first.x)} ${height} Z`;

  return { line, area, points };
}

// ---------------------------------------------------------------- donut

export type DonutSegment = {
  label: string;
  value: number;
  percent: number;
  path: string;
  color: string;
  href?: string;
};

function polar(cx: number, cy: number, radius: number, degrees: number) {
  // -90 starts the first slice at twelve o'clock, which is how a pie is read.
  const radians = ((degrees - 90) * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(radians),
    y: cy + radius * Math.sin(radians),
  };
}

function arc(
  cx: number,
  cy: number,
  outer: number,
  inner: number,
  start: number,
  end: number,
): string {
  const largeArc = end - start > 180 ? 1 : 0;
  const a = polar(cx, cy, outer, start);
  const b = polar(cx, cy, outer, end);
  const c = polar(cx, cy, inner, end);
  const d = polar(cx, cy, inner, start);

  return [
    `M ${round(a.x)} ${round(a.y)}`,
    `A ${outer} ${outer} 0 ${largeArc} 1 ${round(b.x)} ${round(b.y)}`,
    `L ${round(c.x)} ${round(c.y)}`,
    `A ${inner} ${inner} 0 ${largeArc} 0 ${round(d.x)} ${round(d.y)}`,
    "Z",
  ].join(" ");
}

/**
 * Slices of a donut, largest first. Zero-value slices are dropped — they would
 * render as an invisible path and a legend row claiming 0%.
 */
export function buildDonut(
  slices: Slice[],
  size: number,
  thickness: number,
): { segments: DonutSegment[]; total: number } {
  const present = slices.filter((slice) => slice.value > 0).sort((a, b) => b.value - a.value);
  const total = present.reduce((sum, slice) => sum + slice.value, 0);

  if (total === 0) return { segments: [], total: 0 };

  const centre = size / 2;
  const outer = centre;
  const inner = centre - thickness;

  let angle = 0;

  const segments = present.map((slice, index) => {
    const sweep = (slice.value / total) * 360;
    const start = angle;
    // A full circle would make start and end the same point, collapsing the
    // arc to nothing. Stopping a hair short draws the ring with an invisible seam.
    const end = Math.min(start + sweep, 359.99);
    angle += sweep;

    return {
      label: slice.label,
      value: slice.value,
      href: slice.href,
      percent: slice.value / total,
      path: arc(centre, centre, outer, inner, start, end),
      color: seriesColor(index),
    };
  });

  return { segments, total };
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}
