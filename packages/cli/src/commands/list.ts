import type { SkillLoader } from '@copydoc/core';
import { bold, dim } from '../output';

const LAYER_1 = ['persuasion-frameworks', 'quality-frameworks', 'headline-formulas'];
const LAYER_2 = [
  'marketing-copy',
  'email-copy',
  'ux-copy',
  'editorial-copy',
  'brand-copy',
  'sales-copy',
  'social-copy',
  'conversion-copy',
];
const LAYER_3 = ['copy-brief', 'copy-workflow', 'copy-critique', 'copy-adapt'];

const LAYERS: Array<{ label: string; skills: string[] }> = [
  { label: 'Layer 1: Framework Reference Skills', skills: LAYER_1 },
  { label: 'Layer 2: Domain Skills', skills: LAYER_2 },
  { label: 'Layer 3: Workflow Skills', skills: LAYER_3 },
];

function refLabel(count: number): string {
  return count === 1 ? '1 ref' : `${count} refs`;
}

export function listCommand(loader: SkillLoader): void {
  const availableSkills = new Set(loader.listSkills());

  // Compute column widths for alignment
  const allSkillNames: string[] = [...LAYER_1, ...LAYER_2, ...LAYER_3].filter((s) =>
    availableSkills.has(s)
  );
  const maxNameLen = allSkillNames.reduce((max, s) => Math.max(max, s.length), 0);

  for (const layer of LAYERS) {
    console.log(bold(layer.label));

    for (const skillName of layer.skills) {
      if (!availableSkills.has(skillName)) continue;

      const skill = loader.getSkill(skillName);
      const refs = loader.listReferences(skillName);
      const refCount = refLabel(refs.length);

      // Truncate description to 45 chars for table display
      const desc = skill.metadata.description.length > 45
        ? skill.metadata.description.slice(0, 42) + '...'
        : skill.metadata.description;

      const paddedName = skillName.padEnd(maxNameLen);
      const paddedDesc = desc.padEnd(47);

      console.log(`  ${paddedName}  ${dim(paddedDesc)}  ${refCount}`);
    }

    console.log('');
  }
}
