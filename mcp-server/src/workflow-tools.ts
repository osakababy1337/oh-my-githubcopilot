import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import * as fs from "node:fs";
import * as path from "node:path";

function getStateDir(): string {
  const workspaceRoot = process.env.WORKSPACE_ROOT || process.cwd();
  return path.join(workspaceRoot, ".omc", "state");
}

function getStatePath(mode: string): string {
  return path.join(getStateDir(), `${mode}-state.json`);
}

const AUTOPILOT_PHASES = [
  { phase: 0, name: "expansion", description: "Requirements analysis and spec generation" },
  { phase: 1, name: "planning", description: "Implementation plan creation" },
  { phase: 2, name: "execution", description: "Code implementation" },
  { phase: 3, name: "qa", description: "Build, lint, and test verification" },
  { phase: 4, name: "validation", description: "Code review and security review" },
  { phase: 5, name: "cleanup", description: "State cleanup and completion" },
];

export function registerWorkflowTools(server: McpServer): void {
  server.tool(
    "omg_next_phase",
    "Advance the autopilot workflow to the next phase. Returns the new phase details.",
    {
      current_phase: z.number().describe("Current phase number (0-5)"),
      skip_reason: z
        .string()
        .optional()
        .describe("Reason for skipping to a non-sequential phase"),
    },
    async ({ current_phase, skip_reason }) => {
      const statePath = getStatePath("autopilot");
      if (!fs.existsSync(statePath)) {
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({ success: false, error: "No autopilot state found. Start with /autopilot." }),
            },
          ],
        };
      }

      const state = JSON.parse(fs.readFileSync(statePath, "utf-8"));
      const nextPhase = current_phase + 1;

      if (nextPhase > 5) {
        state.active = false;
        state.completed = true;
        state.completed_at = new Date().toISOString();
        state.current_phase = 5;
        fs.writeFileSync(statePath, JSON.stringify(state, null, 2));

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: true,
                completed: true,
                message: "Autopilot workflow complete.",
              }),
            },
          ],
        };
      }

      const phaseInfo = AUTOPILOT_PHASES[nextPhase];
      state.current_phase = nextPhase;
      state.phase_name = phaseInfo.name;
      state.phase_started_at = new Date().toISOString();
      state.updated_at = new Date().toISOString();
      if (skip_reason) {
        state.skip_reason = skip_reason;
      }

      fs.writeFileSync(statePath, JSON.stringify(state, null, 2));

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify({
              success: true,
              phase: nextPhase,
              name: phaseInfo.name,
              description: phaseInfo.description,
            }),
          },
        ],
      };
    }
  );

  server.tool(
    "omg_check_completion",
    "Check if the current workflow has incomplete tasks. Returns whether the agent should continue or can stop.",
    {
      mode: z
        .string()
        .optional()
        .describe("Mode to check (autopilot, ralph, team). Defaults to checking all active modes."),
    },
    async ({ mode }) => {
      const stateDir = getStateDir();
      if (!fs.existsSync(stateDir)) {
        return {
          content: [
            { type: "text" as const, text: JSON.stringify({ allow_stop: true, remaining: [], message: "No active state" }) },
          ],
        };
      }

      const remaining: string[] = [];

      const checkMode = (m: string) => {
        const statePath = getStatePath(m);
        if (!fs.existsSync(statePath)) return;
        try {
          const data = JSON.parse(fs.readFileSync(statePath, "utf-8"));
          if (!data.active) return;

          if (m === "autopilot") {
            const phase = data.current_phase ?? 0;
            if (phase < 5) {
              remaining.push(`autopilot: phase ${phase}/5 (${AUTOPILOT_PHASES[phase]?.name})`);
            }
          } else if (m === "ralph") {
            remaining.push("ralph: persistence loop active");
          } else if (m === "team") {
            remaining.push(`team: ${data.current_phase || "active"}`);
          } else if (m === "ultraqa") {
            remaining.push(`ultraqa: cycle ${data.current_cycle || "?"}/5`);
          } else {
            remaining.push(`${m}: active`);
          }
        } catch {
          // Skip corrupted
        }
      };

      if (mode) {
        checkMode(mode);
      } else {
        const files = fs.readdirSync(stateDir).filter((f) => f.endsWith("-state.json"));
        for (const file of files) {
          checkMode(file.replace("-state.json", ""));
        }
      }

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify({
              allow_stop: remaining.length === 0,
              remaining,
              message:
                remaining.length === 0
                  ? "All tasks complete. Safe to stop."
                  : `${remaining.length} active workflow(s). Continue working.`,
            }),
          },
        ],
      };
    }
  );

  server.tool(
    "omg_get_phase_info",
    "Get information about autopilot phases",
    {
      phase: z.number().optional().describe("Specific phase number (0-5). Omit for all phases."),
    },
    async ({ phase }) => {
      if (phase !== undefined) {
        const info = AUTOPILOT_PHASES[phase];
        if (!info) {
          return {
            content: [
              { type: "text" as const, text: JSON.stringify({ error: `Invalid phase: ${phase}. Valid: 0-5.` }) },
            ],
          };
        }
        return {
          content: [{ type: "text" as const, text: JSON.stringify(info) }],
        };
      }

      return {
        content: [{ type: "text" as const, text: JSON.stringify({ phases: AUTOPILOT_PHASES }) }],
      };
    }
  );
}
