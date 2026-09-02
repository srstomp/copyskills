import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createBundledLoader } from '@copydoc/core';
import { registerResources } from './resources.js';
import { registerTools } from './tools.js';
import { registerPrompts } from './prompts.js';

const server = new McpServer(
  { name: 'copydoc-mcp', version: '0.1.1' },
  {
    capabilities: {
      resources: {},
      tools: {},
      prompts: {},
    },
  },
);

const loader = createBundledLoader();

registerResources(server, loader);
registerTools(server, loader);
registerPrompts(server, loader);

// Start the server using stdio transport
const transport = new StdioServerTransport();
await server.connect(transport);
