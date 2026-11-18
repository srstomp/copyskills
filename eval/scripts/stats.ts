// One-sided 95% Student t quantiles, df 1..40. Larger df uses 40 conservatively.
const t95 = [
  6.313751515, 2.919985580, 2.353363435, 2.131846786, 2.015048373,
  1.943180281, 1.894578605, 1.859548038, 1.833112933, 1.812461123,
  1.795884819, 1.782287556, 1.770933396, 1.761310136, 1.753050356,
  1.745883676, 1.739606726, 1.734063607, 1.729132812, 1.724718243,
  1.720742903, 1.717144374, 1.713871528, 1.710882080, 1.708140761,
  1.705617920, 1.703288446, 1.701130934, 1.699127027, 1.697260887,
  1.695518783, 1.693888748, 1.692360309, 1.690924255, 1.689572458,
  1.688297714, 1.687093620, 1.685954460, 1.684875122, 1.683851013,
];
export interface Interval { mean: number | null; sd: number | null; n: number; lower: number | null; upper: number | null }
export function interval(values: number[]): Interval {
  if (values.some(v => !Number.isFinite(v))) throw new Error('Non-finite statistic');
  const n = values.length;
  if (!n) return { mean: null, sd: null, n, lower: null, upper: null };
  const mean = values.reduce((sum, value) => sum + value, 0) / n;
  if (n < 2) return { mean, sd: null, n, lower: null, upper: null };
  const sd = Math.sqrt(values.reduce((sum, v) => sum + (v - mean) ** 2, 0) / (n - 1));
  const margin = t95[Math.min(n - 1, 40) - 1] * sd / Math.sqrt(n);
  return { mean, sd, n, lower: mean - margin, upper: mean + margin };
}
