import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { SkillLoader } from '@copydoc/core';
import { selectFramework, createLinter } from '@copydoc/core';
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
    },
    ({ copy_type, goal }) => {
      const result = selectFramework(copy_type, goal);
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
      text: z.string().optional(),
      items: z.array(z.string()).optional(),
      locale: z.string().optional(),
      kind: z.enum(['title', 'meta', 'body']).optional(),
      min: z.number().int().nonnegative().optional(),
      max: z.number().int().nonnegative().optional(),
      facts: z.string().optional(),
      avoid: z.array(z.string()).optional(),
    },
    ({ text, items, ...options }) => {
      if ((text === undefined) === (items === undefined)) {
        return { isError: true, content: [{ type: 'text' as const, text: 'Provide exactly one of text or items' }] };
      }
      const result = items === undefined ? linter.lint(text!, options) : linter.lintBatch(items, options);
      return { content: [{ type: 'text' as const, text: JSON.stringify(result) }] };
    },
  );
}
