import { describe, expect, test } from 'bun:test';
import path from 'node:path';
import { createLoader } from '../loader';
import { createLinter } from '../lint';

// Runs the linter against the real skills/ lists, so a formatting slip in a
// locale pack (a lost `{lint: ...}` marker, a broken bullet) fails a test.
const linter = createLinter(createLoader(path.resolve(__dirname, '../../../../skills')));
const rules = (text: string, locale: string) =>
  linter.lint(text, { locale }).issues.map((i) => `${i.severity}:${i.message}`);

describe('linter on the real anti-slop and locale packs', () => {
  test('English: stock words, staged contrasts and the em dash', () => {
    const found = rules("We delve into flavour. It's not just a sake — it's a story.", 'en-GB');
    expect(found).toContain('error:Banned pattern: delve');
    expect(found).toContain('error:Banned pattern: —');
    expect(found).toContain('warn:Banned pattern: not just');
  });

  test('Dutch: its own list applies, the English one does not', () => {
    const found = rules('Duik in sake. Een naadloze smaak.', 'nl-NL');
    expect(found).toContain('error:Banned pattern: duik in');
    expect(found).toContain('error:Banned pattern: naadloze');
    expect(rules('We delve into it.', 'nl-NL')).toEqual([]);
  });

  test('Dutch: overlapping patterns report only the longest match', () => {
    expect(rules('Perfect voor elke gelegenheid', 'nl-NL')).toEqual([
      'error:Banned pattern: perfect voor elke gelegenheid',
    ]);
  });

  test('German: the spaced Gedankenstrich is a warning, the em dash an error', () => {
    const found = rules('Ein Sake – leicht und frisch. Tauchen Sie ein — jetzt.', 'de-DE');
    expect(found).toContain('warn:Banned pattern:  – ');
    expect(found).toContain('error:Banned pattern: —');
    expect(found).toContain('error:Banned pattern: tauchen Sie ein');
  });

  test('clean native copy passes in each language', () => {
    expect(linter.lint('Melon blossom and green apple, then a dry, short finish.', { locale: 'en' }).errors).toBe(0);
    expect(linter.lint('Meloenbloesem en groene appel, met een droge, korte afdronk.', { locale: 'nl-NL' }).errors).toBe(0);
    expect(linter.lint('Melonenblüte und grüner Apfel, dann ein trockener, kurzer Abgang.', { locale: 'de-DE' }).errors).toBe(0);
  });
});
