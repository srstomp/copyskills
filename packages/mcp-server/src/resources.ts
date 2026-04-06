import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { SkillLoader } from '@copydoc/core';

/**
 * Registers all copydoc:// resource handlers on the given McpServer.
 */
export function registerResources(server: McpServer, loader: SkillLoader): void {
  // Static resource: list all skills
  server.resource(
    'copydoc-skills',
    'copydoc://skills',
    {
      description: 'List all available copydoc skills with name and description',
      mimeType: 'application/json',
    },
    (_uri) => {
      const skillNames = loader.listSkills();
      const skills = skillNames.map((name) => {
        const skill = loader.getSkill(name);
        return { name: skill.metadata.name, description: skill.metadata.description };
      });
      return {
        contents: [
          {
            uri: 'copydoc://skills',
            mimeType: 'application/json',
            text: JSON.stringify(skills, null, 2),
          },
        ],
      };
    },
  );

  // Static resource: quality rubric
  server.resource(
    'copydoc-quality-rubric',
    'copydoc://quality/rubric',
    {
      description: 'Quality scoring rubric from quality-frameworks skill',
      mimeType: 'text/markdown',
    },
    (_uri) => {
      const skill = loader.getSkill('quality-frameworks');
      return {
        contents: [
          {
            uri: 'copydoc://quality/rubric',
            mimeType: 'text/markdown',
            text: skill.body,
          },
        ],
      };
    },
  );

  // Static resource: anti-slop reference
  server.resource(
    'copydoc-quality-anti-slop',
    'copydoc://quality/anti-slop',
    {
      description: 'Anti-slop reference guide for eliminating AI writing tells',
      mimeType: 'text/markdown',
    },
    (_uri) => {
      const content = loader.resolveReference('quality-frameworks/references/anti-slop.md');
      return {
        contents: [
          {
            uri: 'copydoc://quality/anti-slop',
            mimeType: 'text/markdown',
            text: content,
          },
        ],
      };
    },
  );

  // Static resource: headline patterns
  server.resource(
    'copydoc-headlines-patterns',
    'copydoc://headlines/patterns',
    {
      description: 'Proven headline patterns and formulas',
      mimeType: 'text/markdown',
    },
    (_uri) => {
      const content = loader.getReference('headline-formulas', 'proven-patterns');
      return {
        contents: [
          {
            uri: 'copydoc://headlines/patterns',
            mimeType: 'text/markdown',
            text: content,
          },
        ],
      };
    },
  );

  // Static resource: headline power words
  server.resource(
    'copydoc-headlines-power-words',
    'copydoc://headlines/power-words',
    {
      description: 'Power words for headlines and copy',
      mimeType: 'text/markdown',
    },
    (_uri) => {
      const content = loader.getReference('headline-formulas', 'power-words');
      return {
        contents: [
          {
            uri: 'copydoc://headlines/power-words',
            mimeType: 'text/markdown',
            text: content,
          },
        ],
      };
    },
  );

  // Template: copydoc://frameworks/{name}
  server.resource(
    'copydoc-frameworks',
    new ResourceTemplate('copydoc://frameworks/{name}', { list: undefined }),
    {
      description: 'Get a persuasion framework reference by name (e.g., pas, aida, bab)',
      mimeType: 'text/markdown',
    },
    (uri, variables) => {
      const name = variables.name as string;
      try {
        const content = loader.resolveReference(`persuasion-frameworks/references/${name}.md`);
        return {
          contents: [
            {
              uri: uri.toString(),
              mimeType: 'text/markdown',
              text: content,
            },
          ],
        };
      } catch (_err) {
        return {
          contents: [
            {
              uri: uri.toString(),
              mimeType: 'text/plain',
              text: `Framework not found: '${name}'. Available frameworks are in persuasion-frameworks/references/.`,
            },
          ],
        };
      }
    },
  );

  // Template: copydoc://domains/{domain}/workflow
  server.resource(
    'copydoc-domain-workflow',
    new ResourceTemplate('copydoc://domains/{domain}/workflow', { list: undefined }),
    {
      description: 'Get the SKILL.md workflow body for a domain',
      mimeType: 'text/markdown',
    },
    (uri, variables) => {
      const domain = variables.domain as string;
      try {
        const skill = loader.getSkill(domain);
        return {
          contents: [
            {
              uri: uri.toString(),
              mimeType: 'text/markdown',
              text: skill.body,
            },
          ],
        };
      } catch (_err) {
        return {
          contents: [
            {
              uri: uri.toString(),
              mimeType: 'text/plain',
              text: `Domain not found: '${domain}'. Use copydoc://skills to list available domains.`,
            },
          ],
        };
      }
    },
  );

  // Template: copydoc://domains/{domain}/references (list)
  server.resource(
    'copydoc-domain-references-list',
    new ResourceTemplate('copydoc://domains/{domain}/references', { list: undefined }),
    {
      description: 'List all reference names for a domain',
      mimeType: 'application/json',
    },
    (uri, variables) => {
      const domain = variables.domain as string;
      const refs = loader.listReferences(domain);
      return {
        contents: [
          {
            uri: uri.toString(),
            mimeType: 'application/json',
            text: JSON.stringify(refs, null, 2),
          },
        ],
      };
    },
  );

  // Template: copydoc://domains/{domain}/references/{ref}
  server.resource(
    'copydoc-domain-reference',
    new ResourceTemplate('copydoc://domains/{domain}/references/{ref}', { list: undefined }),
    {
      description: 'Get a specific reference file for a domain',
      mimeType: 'text/markdown',
    },
    (uri, variables) => {
      const domain = variables.domain as string;
      const ref = variables.ref as string;
      try {
        const content = loader.getReference(domain, ref);
        return {
          contents: [
            {
              uri: uri.toString(),
              mimeType: 'text/markdown',
              text: content,
            },
          ],
        };
      } catch (_err) {
        return {
          contents: [
            {
              uri: uri.toString(),
              mimeType: 'text/plain',
              text: `Reference not found: '${ref}' for domain '${domain}'. Use copydoc://domains/${domain}/references to list available references.`,
            },
          ],
        };
      }
    },
  );

  // Template: copydoc://quality/{ref} (other quality refs)
  server.resource(
    'copydoc-quality-ref',
    new ResourceTemplate('copydoc://quality/{ref}', { list: undefined }),
    {
      description: 'Get a specific quality-frameworks reference by name',
      mimeType: 'text/markdown',
    },
    (uri, variables) => {
      const ref = variables.ref as string;
      // rubric and anti-slop are handled by static resources above
      // but if they reach here (e.g., via template matching), handle them too
      if (ref === 'rubric') {
        const skill = loader.getSkill('quality-frameworks');
        return {
          contents: [
            {
              uri: uri.toString(),
              mimeType: 'text/markdown',
              text: skill.body,
            },
          ],
        };
      }
      if (ref === 'anti-slop') {
        const content = loader.resolveReference('quality-frameworks/references/anti-slop.md');
        return {
          contents: [
            {
              uri: uri.toString(),
              mimeType: 'text/markdown',
              text: content,
            },
          ],
        };
      }
      try {
        const content = loader.getReference('quality-frameworks', ref);
        return {
          contents: [
            {
              uri: uri.toString(),
              mimeType: 'text/markdown',
              text: content,
            },
          ],
        };
      } catch (_err) {
        return {
          contents: [
            {
              uri: uri.toString(),
              mimeType: 'text/plain',
              text: `Quality reference not found: '${ref}'. Available refs are in quality-frameworks/references/.`,
            },
          ],
        };
      }
    },
  );
}
