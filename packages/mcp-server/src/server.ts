import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createLoader } from '@copydoc/core';
import path from 'path';
import { fileURLToPath } from 'url';
import { registerResources } from './resources.js';
import { registerTools } from './tools.js';
import { registerPrompts } from './prompts.js';

// Resolve skills directory relative to this package's location.
// The skills/ directory is at the repo root, which is three levels up from
// packages/mcp-server/src/ (src -> mcp-server -> packages -> repo root).
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SKILLS_DIR = path.resolve(__dirname, '..', '..', '..', 'skills');

const server = new McpServer(
  { name: 'copydoc-mcp', version: '0.1.0' },
  {
    capabilities: {
      resources: {},
      tools: {},
      prompts: {},
    },
  },
);

const loader = createLoader(SKILLS_DIR);

registerResources(server, loader);
registerTools(server, loader);
registerPrompts(server, loader);

// Start the server using stdio transport
const transport = new StdioServerTransport();
await server.connect(transport);
