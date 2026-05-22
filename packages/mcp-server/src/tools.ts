import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { SkillLoader, QualityScores, AntiSlopIssue } from '@copydoc/core';
import { selectFramework, createAntiSlopChecker } from '@copydoc/core';
import { z } from 'zod';

/**
 * Registers the three copydoc MCP tool handlers on the given McpServer.
 *
 * Tools registered:
 *  - select_framework: routes copy type + goal to a persuasion framework
 *  - score_copy: programmatic quality scoring (only ai_tell_score; LLM dims return -1)
 *  - check_anti_slop: detects AI writing tells in copy text
 */
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

  // Tool 2: score_copy
  server.tool(
    'score_copy',
    'Score copy text for quality. Returns ai_tell_score (programmatic) and -1 for dimensions requiring LLM evaluation.',
    {
      text: z.string().describe('The copy text to score'),
      context: z
        .object({
          audience: z.string().optional(),
          goal: z.string().optional(),
          brand_voice: z.string().optional(),
          avoids: z
            .array(z.string())
            .optional()
            .describe('Extra banned words/phrases from brand voice. Flagged alongside the doc patterns.'),
        })
        .optional()
        .describe('Optional context about the copy'),
    },
    ({ text, context }) => {
      const checker = createAntiSlopChecker(loader);
      const antiSlopResult = checker.check(text, { extraBannedWords: context?.avoids });

      const scores: QualityScores = {
        clarity: -1,
        specificity: -1,
        voice_match: -1,
        ai_tell_score: antiSlopResult.score,
        persuasion: -1,
        action: -1,
        overall: -1,
      };

      const issues: AntiSlopIssue[] = antiSlopResult.issues;

      const issueCount = issues.length;
      const issueList = issues.map((i) => `  - ${i.pattern}`).join('\n');
      const summary =
        `AI-tell score: ${antiSlopResult.score}/10. ${issueCount} issues found.` +
        (issueList ? `\n${issueList}` : '');

      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify({ scores, issues, summary }),
          },
        ],
      };
    },
  );

  // Tool 3: check_anti_slop
  server.tool(
    'check_anti_slop',
    'Check copy text for AI writing patterns (slop). Returns a score and list of detected issues.',
    {
      text: z.string().describe('The copy text to check for AI patterns'),
      avoids: z
        .array(z.string())
        .optional()
        .describe('Extra banned words/phrases from brand voice. Flagged alongside the doc patterns.'),
    },
    ({ text, avoids }) => {
      const checker = createAntiSlopChecker(loader);
      const result = checker.check(text, { extraBannedWords: avoids });
      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify({ ai_tell_score: result.score, issues: result.issues }),
          },
        ],
      };
    },
  );
}
