import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { SkillLoader } from '@copydoc/core';
import { selectFramework, createLinter, EMAIL_TYPES } from '@copydoc/core';
import { z } from 'zod';

/** Register framework selection and locale-aware copy linting tools. */
export function registerTools(server: McpServer, loader: SkillLoader): void {
  // Tool 1: select_framework
  server.tool(
    'select_framework',
    'Select the appropriate persuasion framework for a given copy type and goal.',
    {
      copy_type: z.string().describe("The type of copy to write, e.g. 'cold outreach email'"),
      goal: z.string().describe("The conversion goal, e.g. 'book a demo'"),
      email_type: z.enum(EMAIL_TYPES).optional().describe('Explicit email type, e.g. transactional; overrides inference from copy_type'),
    },
    ({ copy_type, goal, email_type }) => {
      const result = selectFramework(copy_type, goal, email_type);
      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify({ framework: result.framework, path: result.path, rationale: result.rationale }),
          },
        ],
      };
    },
  );

  const linter = createLinter(loader);
  server.tool(
    'lint_copy',
    'Lint one text or a batch for locale-specific phrases, length, repetition and unsupported numbers.',
    {
      text: z.string().max(200000).optional(),
      items: z.array(z.string().max(20000)).max(2000).optional(),
      locale: z.string().regex(/^[A-Za-z]{2,3}(-[A-Za-z0-9]+)*$/).optional(),
      kind: z.enum(['title', 'meta', 'body']).optional(),
      min: z.number().int().nonnegative().optional(),
      max: z.number().int().nonnegative().optional(),
      facts: z.string().max(200000).optional(),
      avoid: z.array(z.string().max(200)).max(200).optional(),
    },
    ({ text, items, ...options }) => {
      if ((text === undefined) === (items === undefined)) {
        return { isError: true, content: [{ type: 'text' as const, text: 'Provide exactly one of text or items' }] };
      }
      try {
        const result = items === undefined ? linter.lint(text!, options) : linter.lintBatch(items, options);
        return { content: [{ type: 'text' as const, text: JSON.stringify(result) }] };
      } catch (error) {
        return { isError: true, content: [{ type: 'text' as const, text: error instanceof Error ? error.message : String(error) }] };
      }
    },
  );
}
