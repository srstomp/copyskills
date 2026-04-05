import { describe, expect, test } from 'bun:test';
import { createLoader } from '../loader';
import type { SkillLoader } from '../loader';
import path from 'path';

// Point to the real skills directory
// From packages/core/src/__tests__/ -> ../../../../ is the copyskills project root
const SKILLS_DIR = path.resolve(__dirname, '../../../../skills');

describe('createLoader', () => {
  test('createLoader returns a SkillLoader object', () => {
    const loader = createLoader(SKILLS_DIR);
    expect(loader).toBeTruthy();
    expect(typeof loader.listSkills).toBe('function');
    expect(typeof loader.getSkill).toBe('function');
    expect(typeof loader.getReference).toBe('function');
    expect(typeof loader.listReferences).toBe('function');
    expect(typeof loader.resolveReference).toBe('function');
  });
});

describe('listSkills()', () => {
  test('listSkills() returns 15 skills from the real skills/ directory', () => {
    const loader = createLoader(SKILLS_DIR);
    const skills = loader.listSkills();
    expect(skills).toHaveLength(15);
  });

  test('listSkills() returns an array of strings', () => {
    const loader = createLoader(SKILLS_DIR);
    const skills = loader.listSkills();
    expect(Array.isArray(skills)).toBe(true);
    for (const skill of skills) {
      expect(typeof skill).toBe('string');
    }
  });

  test('listSkills() includes email-copy', () => {
    const loader = createLoader(SKILLS_DIR);
    const skills = loader.listSkills();
    expect(skills).toContain('email-copy');
  });

  test('listSkills() only returns subdirs that contain SKILL.md', () => {
    const loader = createLoader(SKILLS_DIR);
    const skills = loader.listSkills();
    // Each returned name must be a valid skill directory
    expect(skills).toContain('persuasion-frameworks');
    expect(skills).toContain('copy-critique');
  });
});

describe('getSkill()', () => {
  test('getSkill("email-copy") returns parsed metadata with name="email-copy"', () => {
    const loader = createLoader(SKILLS_DIR);
    const skill = loader.getSkill('email-copy');
    expect(skill.metadata.name).toBe('email-copy');
  });

  test('getSkill("email-copy") returns non-empty description', () => {
    const loader = createLoader(SKILLS_DIR);
    const skill = loader.getSkill('email-copy');
    expect(skill.metadata.description).toBeTruthy();
    expect(skill.metadata.description.length).toBeGreaterThan(0);
  });

  test('getSkill("email-copy").body does not contain frontmatter markers', () => {
    const loader = createLoader(SKILLS_DIR);
    const skill = loader.getSkill('email-copy');
    // Body should not start with --- or contain the frontmatter block
    expect(skill.body).not.toMatch(/^---/);
    expect(skill.body).not.toContain('name: email-copy');
  });

  test('getSkill("email-copy").body contains markdown content', () => {
    const loader = createLoader(SKILLS_DIR);
    const skill = loader.getSkill('email-copy');
    expect(skill.body.length).toBeGreaterThan(0);
    expect(skill.body).toContain('#');
  });

  test('getSkill("copy-brief") parses quoted description correctly', () => {
    const loader = createLoader(SKILLS_DIR);
    const skill = loader.getSkill('copy-brief');
    // description is wrapped in double quotes in the frontmatter
    expect(skill.metadata.description).not.toMatch(/^"/);
    expect(skill.metadata.description).not.toMatch(/"$/);
    expect(skill.metadata.description.length).toBeGreaterThan(0);
  });

  test('getSkill("nonexistent") throws descriptive error', () => {
    const loader = createLoader(SKILLS_DIR);
    expect(() => loader.getSkill('nonexistent')).toThrow();
    try {
      loader.getSkill('nonexistent');
    } catch (err) {
      expect((err as Error).message).toContain('nonexistent');
    }
  });
});

describe('getReference()', () => {
  test('getReference("email-copy", "cold-outreach") returns non-empty string', () => {
    const loader = createLoader(SKILLS_DIR);
    const content = loader.getReference('email-copy', 'cold-outreach');
    expect(typeof content).toBe('string');
    expect(content.length).toBeGreaterThan(0);
  });

  test('getReference("email-copy", "cold-outreach") returns raw markdown content', () => {
    const loader = createLoader(SKILLS_DIR);
    const content = loader.getReference('email-copy', 'cold-outreach');
    expect(content).toContain('#');
  });

  test('getReference throws when skill does not exist', () => {
    const loader = createLoader(SKILLS_DIR);
    expect(() => loader.getReference('nonexistent-skill', 'some-ref')).toThrow();
  });

  test('getReference throws when reference does not exist', () => {
    const loader = createLoader(SKILLS_DIR);
    expect(() => loader.getReference('email-copy', 'nonexistent-ref')).toThrow();
  });
});

describe('listReferences()', () => {
  test('listReferences("email-copy") returns 4 references', () => {
    const loader = createLoader(SKILLS_DIR);
    const refs = loader.listReferences('email-copy');
    expect(refs).toHaveLength(4);
  });

  test('listReferences("email-copy") returns expected reference names', () => {
    const loader = createLoader(SKILLS_DIR);
    const refs = loader.listReferences('email-copy');
    expect(refs).toContain('sequences');
    expect(refs).toContain('cold-outreach');
    expect(refs).toContain('subject-lines');
    expect(refs).toContain('newsletters');
  });

  test('listReferences("email-copy") returns names without .md extension', () => {
    const loader = createLoader(SKILLS_DIR);
    const refs = loader.listReferences('email-copy');
    for (const ref of refs) {
      expect(ref).not.toMatch(/\.md$/);
    }
  });

  test('listReferences("copy-critique") returns empty array (no references dir)', () => {
    const loader = createLoader(SKILLS_DIR);
    const refs = loader.listReferences('copy-critique');
    expect(refs).toEqual([]);
  });
});

describe('resolveReference()', () => {
  test('resolveReference("persuasion-frameworks/references/pas.md") returns PAS framework content', () => {
    const loader = createLoader(SKILLS_DIR);
    const content = loader.resolveReference('persuasion-frameworks/references/pas.md');
    expect(typeof content).toBe('string');
    expect(content.length).toBeGreaterThan(0);
  });

  test('resolveReference("persuasion-frameworks/references/pas.md") contains PAS-related content', () => {
    const loader = createLoader(SKILLS_DIR);
    const content = loader.resolveReference('persuasion-frameworks/references/pas.md');
    // PAS framework should mention Problem, Agitate, or Solution
    expect(content).toMatch(/PAS|Problem|Agitate|Solution/);
  });

  test('resolveReference throws for nonexistent path', () => {
    const loader = createLoader(SKILLS_DIR);
    expect(() => loader.resolveReference('nonexistent/references/file.md')).toThrow();
  });
});
