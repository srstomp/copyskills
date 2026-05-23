import { afterEach, describe, expect, test } from 'bun:test';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { convertSkillToMdc, convertAllSkills } from '../converters/mdc';

const REAL_SKILLS_DIR = path.resolve(__dirname, '../../../..', 'skills');

const SAMPLE_SKILL = {
  name: 'email-copy',
  description: 'Workflow-driven generator for email copy',
  body: '## Overview\n\nThis skill covers email copy formats.',
};

const SAMPLE_ANTI_SLOP = '## Banned Words\n\n- leverage\n- unlock\n- elevate';

let tempDirs: string[] = [];

function makeTempDir(): string {
  const d = fs.mkdtempSync(path.join(os.tmpdir(), 'copydoc-mdc-test-'));
  tempDirs.push(d);
  return d;
}

afterEach(() => {
  for (const d of tempDirs) {
    fs.rmSync(d, { recursive: true, force: true });
  }
  tempDirs = [];
});

describe('convertSkillToMdc', () => {
  test('returns string starting with --- YAML frontmatter', () => {
    const result = convertSkillToMdc(SAMPLE_SKILL, SAMPLE_ANTI_SLOP);
    expect(result).toMatch(/^---\n/);
  });

  test('frontmatter contains description field with skill name', () => {
    const result = convertSkillToMdc(SAMPLE_SKILL, SAMPLE_ANTI_SLOP);
    expect(result).toContain('description: ');
    expect(result).toContain('email-copy');
    // Description must include the skill name
    const descMatch = result.match(/description: (.+)/);
    expect(descMatch).not.toBeNull();
    expect(descMatch![1]).toContain('email-copy');
  });

  test('frontmatter contains alwaysApply: false', () => {
    const result = convertSkillToMdc(SAMPLE_SKILL, SAMPLE_ANTI_SLOP);
    expect(result).toContain('alwaysApply: false');
  });

  test('frontmatter contains empty globs field', () => {
    const result = convertSkillToMdc(SAMPLE_SKILL, SAMPLE_ANTI_SLOP);
    expect(result).toContain('globs: ');
  });

  test('body contains original SKILL.md body content', () => {
    const result = convertSkillToMdc(SAMPLE_SKILL, SAMPLE_ANTI_SLOP);
    expect(result).toContain(SAMPLE_SKILL.body);
  });

  test('body is prepended with skill name heading', () => {
    const result = convertSkillToMdc(SAMPLE_SKILL, SAMPLE_ANTI_SLOP);
    expect(result).toContain('# email-copy\n');
  });

  test('includes anti-slop section at the end', () => {
    const result = convertSkillToMdc(SAMPLE_SKILL, SAMPLE_ANTI_SLOP);
    expect(result).toContain('## Anti-Slop Rules');
    expect(result).toContain(SAMPLE_ANTI_SLOP);
    // Anti-slop section should appear after the body
    const bodyIndex = result.indexOf(SAMPLE_SKILL.body);
    const antiSlopIndex = result.indexOf('## Anti-Slop Rules');
    expect(antiSlopIndex).toBeGreaterThan(bodyIndex);
  });

  test('with empty frontmatter fields uses fallback name and description', () => {
    const skillWithFallback = {
      name: '',
      description: '',
      body: 'Some skill body content.',
    };
    const result = convertSkillToMdc(skillWithFallback, SAMPLE_ANTI_SLOP);
    // Should still produce valid .mdc with description field
    expect(result).toMatch(/^---\n/);
    expect(result).toContain('description: ');
    expect(result).toContain('alwaysApply: false');
    // Body content must still appear
    expect(result).toContain('Some skill body content.');
  });
});

describe('convertAllSkills', () => {
  test('generates exactly 8 .mdc files', async () => {
    const outputDir = makeTempDir();
    const files = await convertAllSkills(REAL_SKILLS_DIR, outputDir);
    expect(files.length).toBe(8);
  });

  test('output filenames follow copydoc-<name>.mdc pattern', async () => {
    const outputDir = makeTempDir();
    const files = await convertAllSkills(REAL_SKILLS_DIR, outputDir);
    for (const filePath of files) {
      const basename = path.basename(filePath);
      expect(basename).toMatch(/^copydoc-.+\.mdc$/);
    }
  });

  test('does not include Layer 1 or Layer 3 skills', async () => {
    const outputDir = makeTempDir();
    const files = await convertAllSkills(REAL_SKILLS_DIR, outputDir);
    const basenames = files.map((f) => path.basename(f));
    // Layer 1 skills must NOT appear
    expect(basenames).not.toContain('copydoc-persuasion-frameworks.mdc');
    expect(basenames).not.toContain('copydoc-quality-frameworks.mdc');
    expect(basenames).not.toContain('copydoc-headline-formulas.mdc');
    // Layer 3 skills must NOT appear
    expect(basenames).not.toContain('copydoc-copy-brief.mdc');
    expect(basenames).not.toContain('copydoc-copy-workflow.mdc');
    expect(basenames).not.toContain('copydoc-copy-critique.mdc');
    expect(basenames).not.toContain('copydoc-copy-adapt.mdc');
  });

  test('generated .mdc files are written to outputDir', async () => {
    const outputDir = makeTempDir();
    const files = await convertAllSkills(REAL_SKILLS_DIR, outputDir);
    for (const filePath of files) {
      expect(fs.existsSync(filePath)).toBe(true);
      expect(filePath).toContain(outputDir);
    }
  });

  test('each generated .mdc file contains valid frontmatter with description', async () => {
    const outputDir = makeTempDir();
    const files = await convertAllSkills(REAL_SKILLS_DIR, outputDir);
    for (const filePath of files) {
      const content = fs.readFileSync(filePath, 'utf8');
      expect(content).toMatch(/^---\n/);
      expect(content).toContain('description: ');
      expect(content).toContain('alwaysApply: false');
    }
  });

  test('each generated .mdc file contains anti-slop section', async () => {
    const outputDir = makeTempDir();
    const files = await convertAllSkills(REAL_SKILLS_DIR, outputDir);
    for (const filePath of files) {
      const content = fs.readFileSync(filePath, 'utf8');
      expect(content).toContain('## Anti-Slop Rules');
    }
  });
});
