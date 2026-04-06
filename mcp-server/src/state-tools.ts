import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import * as fs from "node:fs";
import * as path from "node:path";

function getStateDir(): string {
  const workspaceRoot = process.env.WORKSPACE_ROOT || process.cwd();
  return path.join(workspaceRoot, ".omc", "state");
}

function ensureDir(dir: string): void {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function getStatePath(mode: string): string {
  return path.join(getStateDir(), `${mode}-state.json`);
}

export function registerStateTools(server: McpServer): void {
  server.tool(
    "omg_read_state",
    "Read the current state for a given OMG mode (autopilot, ralph, ultrawork, ultraqa, team, self-improve)",
    {
      mode: z.string().describe("The mode to read state for (e.g., autopilot, ralph, team)"),
    },
    async ({ mode }) => {
      const statePath = getStatePath(mode);
      if (!fs.existsSync(statePath)) {
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({ active: false, mode, message: "No state found" }),
            },
          ],
        };
      }
      const data = fs.readFileSync(statePath, "utf-8");
      return {
        content: [{ type: "text" as const, text: data }],
      };
    }
  );

  server.tool(
    "omg_write_state",
    "Write or update state for a given OMG mode. Merges with existing state.",
    {
      mode: z.string().describe("The mode to write state for"),
      state: z.string().describe("JSON string of state to write/merge"),
    },
    async ({ mode, state }) => {
      const stateDir = getStateDir();
      ensureDir(stateDir);
      const statePath = getStatePath(mode);

      let existing: Record<string, unknown> = {};
      if (fs.existsSync(statePath)) {
        try {
          existing = JSON.parse(fs.readFileSync(statePath, "utf-8"));
        } catch {
          // Corrupted state — overwrite
        }
      }

      const newState = { ...existing, ...JSON.parse(state), updated_at: new Date().toISOString() };
      fs.writeFileSync(statePath, JSON.stringify(newState, null, 2));

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify({ success: true, mode, state: newState }),
          },
        ],
      };
    }
  );

  server.tool(
    "omg_clear_state",
    "Clear state for a given OMG mode or all modes",
    {
      mode: z
        .string()
        .optional()
        .describe("Mode to clear. Omit to clear all modes."),
    },
    async ({ mode }) => {
      const stateDir = getStateDir();
      if (!fs.existsSync(stateDir)) {
        return {
          content: [{ type: "text" as const, text: JSON.stringify({ success: true, message: "No state directory" }) }],
        };
      }

      if (mode) {
        const statePath = getStatePath(mode);
        if (fs.existsSync(statePath)) {
          fs.unlinkSync(statePath);
        }
        return {
          content: [{ type: "text" as const, text: JSON.stringify({ success: true, cleared: mode }) }],
        };
      }

      // Clear all state files
      const files = fs.readdirSync(stateDir).filter((f) => f.endsWith("-state.json"));
      for (const file of files) {
        fs.unlinkSync(path.join(stateDir, file));
      }
      return {
        content: [
          { type: "text" as const, text: JSON.stringify({ success: true, cleared: "all", files: files.length }) },
        ],
      };
    }
  );

  server.tool(
    "omg_list_active",
    "List all currently active OMG modes",
    {},
    async () => {
      const stateDir = getStateDir();
      if (!fs.existsSync(stateDir)) {
        return {
          content: [{ type: "text" as const, text: JSON.stringify({ active_modes: [] }) }],
        };
      }

      const files = fs.readdirSync(stateDir).filter((f) => f.endsWith("-state.json"));
      const activeModes: Array<{ mode: string; phase?: string; updated_at?: string }> = [];

      for (const file of files) {
        try {
          const data = JSON.parse(fs.readFileSync(path.join(stateDir, file), "utf-8"));
          if (data.active) {
            activeModes.push({
              mode: file.replace("-state.json", ""),
              phase: data.current_phase || data.phase,
              updated_at: data.updated_at,
            });
          }
        } catch {
          // Skip corrupted files
        }
      }

      return {
        content: [{ type: "text" as const, text: JSON.stringify({ active_modes: activeModes }) }],
      };
    }
  );
}
