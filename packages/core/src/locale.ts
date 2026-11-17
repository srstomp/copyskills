/** Validate a BCP 47 locale before using its language in a reference path. */
export function languageOf(locale: string): string {
  try {
    const language = new Intl.Locale(locale).language;
    if (/^[a-z]{2,3}$/.test(language)) return language;
  } catch {
    // Report the supplied locale consistently, including Intl parsing failures.
  }
  throw new Error(`Invalid locale: ${locale}`);
}
