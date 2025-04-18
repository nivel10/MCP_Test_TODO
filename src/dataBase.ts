import Database from 'better-sqlite3';
import { existsSync, mkdirSync } from 'fs';
import { homedir } from 'os';
import { join, resolve } from 'path';

export interface Todo {
    id: number;
    text: string;
}

const dbName = 'todos.db';
const dbLocatiob = join(homedir(), 'todos');
const dbDirectory = resolve(dbLocatiob);

if (!existsSync(dbDirectory)) {
    mkdirSync(dbDirectory, { recursive: true, });
}

const dbPath = join(dbDirectory, dbName);
const db = new Database(dbPath);

let sqlQuery = 'CREATE TABLE IF NOT EXISTS todos (';
sqlQuery += 'id INTEGER PRIMARY KEY AUTOINCREMENT, ';
sqlQuery += 'text TEXT NOT NULL)';
//sqlQuery += 'createdAt TEXT NOT NULL, ';
db.exec(sqlQuery);

export const dbOperations = {
    addTodo: (text: string,) => {
        const statement = db.prepare('INSERT INTO todos (text) VALUES (?)');
        const info = statement.run(text);

        return {
            id: info.lastInsertRowid as number,
            text: text,
        };
    },
    getTodos: () => {
        const statement = db.prepare('SELECT * FROM todos ORDER BY id DESC');
        
        return statement.all() as Todo[];
    },
    removeTodo: (id: number): boolean => {
        const statement = db.prepare('DELETE FROM todos WHERE id = ?');
        const info = statement.run(id);
        
        return info.changes > 0;
     },
}