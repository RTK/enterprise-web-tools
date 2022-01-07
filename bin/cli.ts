#!/usr/bin/env node

import * as childProcess from 'child_process';
import * as os from 'os';
import * as path from 'path';

const processArgumentList: readonly string[] = process.argv;

const toolName: string | null = processArgumentList[2]?.toLowerCase();
const toolArguments: string | null = processArgumentList.slice(3)?.join(' ');

const toolList: readonly string[] = ['cz', 'husky', 'jest', 'lint-staged', 'prettier', 'ts-node'];
const toolModuleMap: Map<string, string> = new Map([['cz', 'commitizen']]);

if (!toolName || !toolList.includes(toolName)) {
    throw new Error(`Unknown tool: '${toolName}'`);
}

const toolPackagePath: string | undefined = require.resolve(
    `${
        toolModuleMap.has(toolName) ? toolModuleMap.get(toolName) : toolName
    }/package.json`
);

if (!path) {
    throw `Missing tool ${toolName}`;
}

let currentDir: string = path.dirname(toolPackagePath);

while (path.basename(currentDir) !== 'node_modules') {
    currentDir = path.resolve(path.join(currentDir, '..'));
}

let binary: string = toolName;
if (os.platform() === 'win32') {
    binary += '.cmd';
}

let command: string = path.join(currentDir, '.bin', binary);

if (toolArguments) {
    command += ` ${toolArguments}`;
}

try {
    childProcess.execSync(command, {
        stdio: 'inherit'
    });
} catch (error: unknown) {
    console.error(error);
    process.exit(1);
}
