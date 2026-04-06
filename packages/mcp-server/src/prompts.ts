import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { SkillLoader, Brief } from '@copydoc/core';
import { selectFramework, createAssembler } from '@copydoc/core';
import { z } from 'zod';

/**
 * Registers the three copydoc MCP prompt handlers on the given McpServer.
 *
 * Prompts registered:
 *  - write: assemble a full copywriting prompt for a given brief
 *  - critique: assemble a copy critique prompt for the given text
 *  - adapt: assemble a copy adaptation prompt for a target format
 */
export function registerPrompts(server: McpServer, loader: SkillLoader): void {
  const assembler = createAssembler(loader, selectFramework);

  // Prompt 1: write
  server.prompt(
    'write',
    'Assemble a professional copywriting prompt for a given brief. Returns a ready-to-use prompt combining domain workflow, persuasion framework, and quality rules.',
    {
      type: z.string().describe("The type of copy to write, e.g. 'cold outreach email'"),
      goal: z.string().describe("The conversion goal, e.g. 'book a demo'"),
      audience: z.string().optional().describe("The target audience, e.g. 'restaurant owners in the US'"),
      product: z.string().optional().describe("Product name and description, e.g. 'SakeBox - direct from 40+ breweries'"),
      brand_voice: z.string().optional().describe("Brand voice descriptor, e.g. 'knowledgeable, casual'"),
      constraints: z.string().optional().describe("Copy constraints, e.g. '150 words max, plain text'"),
    },
    ({ type, goal, audience, product, brand_voice, constraints }) => {
      const brief: Brief = {
        type,
        goal,
      };

      if (audience) {
        brief.audience = { who: audience };
      }

      if (product) {
        brief.product = { name: product };
      }

      if (brand_voice) {
        brief.brand_voice = { tone: brand_voice };
      }

      if (constraints) {
        brief.constraints = { length: constraints };
      }

      const { systemPrompt, userPrompt } = assembler.assemble(brief);
      const text = systemPrompt + '\n\n---\n\n' + userPrompt;

      return {
        messages: [
          {
            role: 'user' as const,
            content: { type: 'text' as const, text },
          },
        ],
      };
    },
  );

  // Prompt 2: critique
  server.prompt(
    'critique',
    'Assemble a copy critique prompt for evaluating existing copy. Returns a prompt with scoring rubric and anti-slop rules.',
    {
      copy_text: z.string().describe('The copy text to evaluate'),
      audience: z.string().optional().describe('The intended audience for the copy'),
      goal: z.string().optional().describe('The conversion goal of the copy'),
      brand_voice: z.string().optional().describe("Brand voice descriptor, e.g. 'bold, direct'"),
    },
    ({ copy_text, audience, goal, brand_voice }) => {
      const context: Partial<Brief> = {};

      if (audience) {
        context.audience = { who: audience };
      }

      if (goal) {
        context.goal = goal;
      }

      if (brand_voice) {
        context.brand_voice = { tone: brand_voice };
      }

      const { systemPrompt, userPrompt } = assembler.assembleCritique(copy_text, context);
      const text = systemPrompt + '\n\n---\n\n' + userPrompt;

      return {
        messages: [
          {
            role: 'user' as const,
            content: { type: 'text' as const, text },
          },
        ],
      };
    },
  );

  // Prompt 3: adapt
  server.prompt(
    'adapt',
    'Assemble a copy adaptation prompt for repurposing copy into a different format. Returns a prompt with target domain workflow and anti-slop rules.',
    {
      source_copy: z.string().describe('The source copy text to adapt'),
      target_format: z.string().describe("The target format, e.g. 'LinkedIn post'"),
      brand_voice: z.string().optional().describe("Brand voice descriptor, e.g. 'knowledgeable, casual'"),
    },
    ({ source_copy, target_format, brand_voice }) => {
      const brandVoice: Brief['brand_voice'] = brand_voice ? { tone: brand_voice } : undefined;

      const { systemPrompt, userPrompt } = assembler.assembleAdapt(source_copy, target_format, brandVoice);
      const text = systemPrompt + '\n\n---\n\n' + userPrompt;

      return {
        messages: [
          {
            role: 'user' as const,
            content: { type: 'text' as const, text },
          },
        ],
      };
    },
  );
}
