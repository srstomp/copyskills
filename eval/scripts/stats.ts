// One-sided 90% Student t quantiles, df 1..40. Larger df uses 40 conservatively.
const t90 = [
  3.077683537, 1.885618083, 1.637744354, 1.533206274, 1.475884049,
  1.439755747, 1.414923928, 1.396815310, 1.383028739, 1.372183641,
  1.363430318, 1.356217334, 1.350171289, 1.345030374, 1.340605607,
  1.336757167, 1.333379390, 1.330390944, 1.327728209, 1.325340707,
  1.323187874, 1.321236742, 1.319460240, 1.317835934, 1.316345073,
  1.314971864, 1.313702913, 1.312526782, 1.311433647, 1.310415025,
  1.309463549, 1.308572793, 1.307737124, 1.306951587, 1.306211802,
  1.305513886, 1.304854381, 1.304230204, 1.303638589, 1.303077053,
];
export interface Interval { mean: number | null; sd: number | null; n: number; lower: number | null; upper: number | null }
export function interval(values: number[]): Interval {
  if (values.some(v => !Number.isFinite(v))) throw new Error('Non-finite statistic');
  const n = values.length;
  if (!n) return { mean: null, sd: null, n, lower: null, upper: null };
  const mean = values.reduce((sum, value) => sum + value, 0) / n;
  if (n < 2) return { mean, sd: null, n, lower: null, upper: null };
  const sd = Math.sqrt(values.reduce((sum, v) => sum + (v - mean) ** 2, 0) / (n - 1));
  const margin = t90[Math.min(n - 1, 40) - 1] * sd / Math.sqrt(n);
  return { mean, sd, n, lower: mean - margin, upper: mean + margin };
}
