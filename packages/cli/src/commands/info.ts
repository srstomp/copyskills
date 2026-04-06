import type { SkillLoader } from '@copydoc/core';
import { bold, dim } from '../output';

export function infoCommand(loader: SkillLoader, skillName: string): void {
  let skill;
  try {
    skill = loader.getSkill(skillName);
  } catch {
    console.log(
      `Skill not found: ${skillName}. Run 'copydoc list' to see available skills.`
    );
    return;
  }

  const refs = loader.listReferences(skillName);

  console.log(bold(skill.metadata.name));
  console.log(`  ${skill.metadata.description}`);
  console.log('');

  console.log(`  References (${refs.length}):`);
  for (const ref of refs) {
    console.log(`    - ${ref}`);
  }
  console.log('');

  console.log('  Preview:');
  const lines = skill.body.split('\n').slice(0, 10);
  for (const line of lines) {
    console.log(`    ${dim(line)}`);
  }
}
