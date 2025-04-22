import { McpServer, } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport, } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z, } from 'zod';
import { dbOperations } from './dataBase.js';
//console.log(path.dirname('../build/index.js'));
//console.log(path.basename('../build/index.js'));
const server = new McpServer({
    name: 'TODO',
    version: '1.0.0',
    //description: 'MCP server test - TODO',
});
server.tool('add-todo', {
    text: z.string(),
}, async ({ text }) => {
    //#region old code
    // return {
    //     content: [
    //         {
    //             type: 'text',
    //             text: `${text} was added to our todo with id 99`,
    //         }
    //     ],
    // }
    //#endregion old code
    const todo = dbOperations.addTodo(text);
    return {
        content: [
            {
                type: 'text',
                text: `${text} was added to our todo with id ${todo?.id}`,
            }
        ]
    };
});
server.tool('get-todo', {}, async () => {
    //#region old code
    // return {
    //     content: [
    //         {
    //             type: 'text',
    //             text: `Call mom ID 99`
    //         }
    //     ]
    // }
    //#endregion old code
    const todos = dbOperations.getTodos();
    if (todos?.length <= 0) {
        return {
            content: [
                {
                    type: 'text',
                    text: `You have no todo items yet.`,
                }
            ]
        };
    }
    const todoList = todos.map(todo => `${todo?.id}: ${todo?.text}\n`);
    return {
        content: [
            {
                type: 'text',
                text: `You have ${todos?.length} todo items:\n${todoList}`,
            }
        ]
    };
});
server.tool('remove-todo', {
    id: z.number(),
}, async ({ id }) => {
    //#region old code
    // return {
    //     content: [
    //         {
    //             type: 'text',
    //             text: `Todo ${id} was removed`,
    //         }
    //     ]
    // }
    //#endregion old code
    const todo = dbOperations.removeTodo(id);
    if (!todo) {
        return {
            content: [
                {
                    type: 'text',
                    text: `Warning: no todo item found with id: ${id}`,
                }
            ]
        };
    }
    return {
        content: [
            {
                type: 'text',
                text: `Todo ${id} was removed`,
            }
        ]
    };
});
server.tool('todo-remove-all', {}, async () => {
    const todos = dbOperations.removeTodoAll();
    if (!todos) {
        return {
            content: [
                {
                    type: 'text',
                    text: 'There are no items to delete',
                }
            ]
        };
    }
    return {
        content: [
            {
                type: 'text',
                text: `You have removed all items todo`,
            }
        ]
    };
});
// async function main() {
//     try {
//         const transport = new StdioServerTransport();
//         await server.connect(transport);
//     } catch (ex) {
//         console.error(ex);
//         process.exit(1);
//     }
// }
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
}
main().catch((ex) => {
    console.error(ex);
    process.exit(1);
});
