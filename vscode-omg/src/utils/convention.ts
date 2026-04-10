import * as fs from 'fs';
import * as path from 'path';

/**
 * Validate and read .github/ convention files. Pure filesystem logic.
 */

export interface ConventionCheckResult {
  severity: 'error' | 'warning' | 'info';
  message: string;
  fix?: string;
}

export interface AgentInfo {
  name: string;
  description: string;
  filePath: string;
}

export function checkConventionFiles(rootDir: string): ConventionCheckResult[] {
  const issues: ConventionCheckResult[] = [];

  // Check required files
  const requiredFiles = [
    { path: '.github/copilot-instructions.md', name: 'Copilot instructions' },
    { path: '.github/hooks/pre-tool-use.sh', name: 'Pre-tool-use hook' },
    { path: '.github/hooks/post-tool-use.sh', name: 'Post-tool-use hook' },
  ];

  for (const file of requiredFiles) {
    if (!fs.existsSync(path.join(rootDir, file.path))) {
      issues.push({
        severity: 'error',
        message: `Missing ${file.name}: ${file.path}`,
        fix: 'Run "OMG: Initialize Workspace" to generate all files.',
      });
    }
  }

  // Check agents
  const agentsDir = path.join(rootDir, '.github', 'agents');
  if (!fs.existsSync(agentsDir)) {
    issues.push({ severity: 'error', message: 'Missing .github/agents/ directory', fix: 'Run "OMG: Initialize Workspace"' });
  } else {
    const agents = fs.readdirSync(agentsDir).filter(f => f.endsWith('.agent.md'));
    if (agents.length < 20) {
      issues.push({
        severity: 'warning',
        message: `Found ${agents.length}/20 agent files in .github/agents/`,
        fix: 'Run "OMG: Update Convention Files" to restore missing agents.',
      });
    }
  }

  // Check skills
  const skillsDir = path.join(rootDir, '.github', 'skills');
  if (!fs.existsSync(skillsDir)) {
    issues.push({ severity: 'error', message: 'Missing .github/skills/ directory', fix: 'Run "OMG: Initialize Workspace"' });
  } else {
    const skills = fs.readdirSync(skillsDir, { withFileTypes: true }).filter(d => d.isDirectory());
    if (skills.length < 18) {
      issues.push({
        severity: 'warning',
        message: `Found ${skills.length}/18 skill directories in .github/skills/`,
        fix: 'Run "OMG: Update Convention Files" to restore missing skills.',
      });
    }
  }

  // Check MCP server
  const mcpPackageJson = path.join(rootDir, 'mcp-server', 'package.json');
  if (!fs.existsSync(mcpPackageJson)) {
    issues.push({ severity: 'error', message: 'Missing mcp-server/package.json', fix: 'Run "OMG: Initialize Workspace"' });
  } else {
    const mcpDist = path.join(rootDir, 'mcp-server', 'dist', 'index.js');
    if (!fs.existsSync(mcpDist)) {
      issues.push({
        severity: 'warning',
        message: 'MCP server not built (mcp-server/dist/index.js missing)',
        fix: 'Run: cd mcp-server && npm install && npm run build',
      });
    }
  }

  return issues;
}

export function checkVersionDrift(bundledPkgPath: string, workspacePkgPath: string): ConventionCheckResult | null {
  try {
    if (!fs.existsSync(bundledPkgPath) || !fs.existsSync(workspacePkgPath)) return null;
    const bundledVersion = JSON.parse(fs.readFileSync(bundledPkgPath, 'utf-8')).version;
    const workspaceVersion = JSON.parse(fs.readFileSync(workspacePkgPath, 'utf-8')).version;
    if (bundledVersion !== workspaceVersion) {
      return {
        severity: 'info',
        message: `MCP server version drift: workspace=${workspaceVersion}, extension=${bundledVersion}`,
        fix: 'Run "OMG: Update Convention Files" to update MCP server.',
      };
    }
  } catch {
    // Ignore
  }
  return null;
}

export function listAgents(agentsDir: string): AgentInfo[] {
  if (!fs.existsSync(agentsDir)) return [];

  return fs.readdirSync(agentsDir)
    .filter(f => f.endsWith('.agent.md'))
    .sort()
    .map(file => {
      const name = file.replace('.agent.md', '');
      const content = fs.readFileSync(path.join(agentsDir, file), 'utf-8');
      const descMatch = content.match(/description:\s*>\s*\n\s*(.+)/);
      const desc = descMatch ? descMatch[1].trim() : '';
      return { name, description: desc, filePath: path.join(agentsDir, file) };
    });
}

export function copyDirRecursive(src: string, dest: string) {
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
