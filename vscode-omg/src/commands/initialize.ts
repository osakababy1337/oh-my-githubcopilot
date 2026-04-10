import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export function registerCommands(context: vscode.ExtensionContext, outputChannel: vscode.OutputChannel) {
  context.subscriptions.push(
    vscode.commands.registerCommand('omg.initWorkspace', () => initWorkspace(context, outputChannel)),
    vscode.commands.registerCommand('omg.updateFiles', () => updateFiles(context, outputChannel)),
  );
}

async function initWorkspace(context: vscode.ExtensionContext, outputChannel: vscode.OutputChannel) {
  const ws = vscode.workspace.workspaceFolders?.[0];
  if (!ws) {
    vscode.window.showErrorMessage('OMG: No workspace folder open.');
    return;
  }

  // Check if already initialized
  const copilotInstructions = path.join(ws.uri.fsPath, '.github', 'copilot-instructions.md');
  if (fs.existsSync(copilotInstructions)) {
    const answer = await vscode.window.showWarningMessage(
      'OMG: This workspace already has OMG convention files. Overwrite?',
      'Overwrite',
      'Cancel',
    );
    if (answer !== 'Overwrite') {
      return;
    }
  }

  const templatesDir = path.join(context.extensionPath, 'resources', 'templates');
  if (!fs.existsSync(templatesDir)) {
    vscode.window.showErrorMessage('OMG: Templates not found in extension bundle.');
    return;
  }

  try {
    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: 'OMG: Initializing workspace...',
        cancellable: false,
      },
      async (progress) => {
        progress.report({ message: 'Copying convention files...' });
        await copyTemplates(templatesDir, ws.uri.fsPath, outputChannel);

        progress.report({ message: 'Building MCP server...' });
        await buildMcpServer(ws.uri.fsPath, outputChannel);

        progress.report({ message: 'Done!' });
      },
    );

    vscode.window.showInformationMessage(
      'OMG: Workspace initialized! Reload window to activate all agents and skills.',
      'Reload Window',
    ).then((choice) => {
      if (choice === 'Reload Window') {
        vscode.commands.executeCommand('workbench.action.reloadWindow');
      }
    });
  } catch (err) {
    outputChannel.appendLine(`OMG Init Error: ${err}`);
    vscode.window.showErrorMessage(
      `OMG: Initialization failed. Check Output > OMG for details.`,
    );
  }
}

async function updateFiles(context: vscode.ExtensionContext, outputChannel: vscode.OutputChannel) {
  const ws = vscode.workspace.workspaceFolders?.[0];
  if (!ws) {
    vscode.window.showErrorMessage('OMG: No workspace folder open.');
    return;
  }

  const copilotInstructions = path.join(ws.uri.fsPath, '.github', 'copilot-instructions.md');
  if (!fs.existsSync(copilotInstructions)) {
    vscode.window.showErrorMessage('OMG: This workspace is not initialized. Run "OMG: Initialize Workspace" first.');
    return;
  }

  const answer = await vscode.window.showWarningMessage(
    'OMG: This will update all convention files to the latest bundled version. Continue?',
    'Update',
    'Cancel',
  );
  if (answer !== 'Update') {
    return;
  }

  const templatesDir = path.join(context.extensionPath, 'resources', 'templates');
  try {
    await copyTemplates(templatesDir, ws.uri.fsPath, outputChannel);
    vscode.window.showInformationMessage('OMG: Convention files updated to latest version.');
  } catch (err) {
    outputChannel.appendLine(`OMG Update Error: ${err}`);
    vscode.window.showErrorMessage('OMG: Update failed. Check Output > OMG for details.');
  }
}

async function copyTemplates(templatesDir: string, targetDir: string, outputChannel: vscode.OutputChannel) {
  const items = [
    { src: 'copilot-instructions.md', dest: '.github/copilot-instructions.md' },
    { src: 'agents', dest: '.github/agents' },
    { src: 'skills', dest: '.github/skills' },
    { src: 'hooks', dest: '.github/hooks' },
    { src: 'prompts', dest: '.github/prompts' },
    { src: 'mcp-server', dest: 'mcp-server' },
  ];

  for (const item of items) {
    const srcPath = path.join(templatesDir, item.src);
    const destPath = path.join(targetDir, item.dest);

    if (!fs.existsSync(srcPath)) {
      outputChannel.appendLine(`OMG: Template not found: ${item.src}, skipping`);
      continue;
    }

    // Ensure parent directory exists
    fs.mkdirSync(path.dirname(destPath), { recursive: true });

    if (fs.statSync(srcPath).isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
    outputChannel.appendLine(`OMG: Copied ${item.src} → ${item.dest}`);
  }

  // Ensure .vscode directory exists (but don't overwrite existing mcp.json)
  const vscodeDir = path.join(targetDir, '.vscode');
  fs.mkdirSync(vscodeDir, { recursive: true });
}

function copyDirRecursive(src: string, dest: string) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

async function buildMcpServer(workspaceDir: string, outputChannel: vscode.OutputChannel) {
  const mcpDir = path.join(workspaceDir, 'mcp-server');
  if (!fs.existsSync(path.join(mcpDir, 'package.json'))) {
    outputChannel.appendLine('OMG: mcp-server/package.json not found, skipping build');
    return;
  }

  return new Promise<void>((resolve, reject) => {
    const { exec } = require('child_process');
    exec(
      'npm install && npm run build',
      { cwd: mcpDir, timeout: 120000 },
      (error: Error | null, stdout: string, stderr: string) => {
        if (stdout) outputChannel.appendLine(stdout);
        if (stderr) outputChannel.appendLine(stderr);
        if (error) {
          reject(error);
        } else {
          outputChannel.appendLine('OMG: MCP server built successfully');
          resolve();
        }
      },
    );
  });
}
