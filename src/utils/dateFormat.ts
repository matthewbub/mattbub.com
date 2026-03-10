const RELATIVE_UNITS: ReadonlyArray<{
  unit: Intl.RelativeTimeFormatUnit;
  ms: number;
}> = [
  { unit: "year", ms: 1000 * 60 * 60 * 24 * 365 },
  { unit: "month", ms: 1000 * 60 * 60 * 24 * 30 },
  { unit: "week", ms: 1000 * 60 * 60 * 24 * 7 },
  { unit: "day", ms: 1000 * 60 * 60 * 24 },
  { unit: "hour", ms: 1000 * 60 * 60 },
  { unit: "minute", ms: 1000 * 60 },
];

export function formatPostedRelative(iso: string): string {
  const date = new Date(iso);
  const time = date.getTime();

  if (Number.isNaN(time)) {
    return "Posted recently";
  }

  const diffMs = Date.now() - time;
  const safePastDiffMs = Math.max(0, diffMs);

  if (safePastDiffMs < 1000 * 60) {
    return "Posted just now";
  }

  const formatter = new Intl.RelativeTimeFormat(undefined, {
    numeric: "auto",
    style: "short",
  });

  for (const { unit, ms } of RELATIVE_UNITS) {
    if (safePastDiffMs >= ms) {
      const value = -Math.round(safePastDiffMs / ms);
      return `Posted ${formatter.format(value, unit).replaceAll(".", "")}`;
    }
  }

  return "Posted just now";
}
