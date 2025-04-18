import { McpServer, } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport, } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z, } from 'zod';
const server = new McpServer({
    name: 'TODO',
    version: '1.0.0',
    description: 'MCP server test - TODO',
});
server.tool('add-todo', {
    text: z.string(),
}, async ({ text }) => {
    return {
        content: [
            {
                type: 'text',
                text: `${text} was added to our todo with id 99`,
            }
        ],
    };
});
server.tool('get-todo', {}, async () => {
    return {
        content: [
            {
                type: 'text',
                text: `Call mom ID 99`
            }
        ]
    };
});
server.tool('remove-todo', {
    id: z.number(),
}, async ({ id }) => {
    return {
        content: [
            {
                type: 'text',
                text: ``,
            }
        ]
    };
});
async function main() {
    try {
        const transport = new StdioServerTransport();
        await server.connect(transport);
    }
    catch (ex) {
        console.error(ex);
        process.exit(1);
    }
}
main();
