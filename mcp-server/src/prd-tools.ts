import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import * as fs from "node:fs";
import * as path from "node:path";

function getPrdPath(): string {
  const workspaceRoot = process.env.WORKSPACE_ROOT || process.cwd();
  return path.join(workspaceRoot, ".omc", "prd.json");
}

function ensureDir(dir: string): void {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

interface Story {
  id: string;
  title: string;
  description: string;
  acceptance_criteria: string[];
  passes: boolean;
  verification_evidence?: string;
  priority: number;
}

interface Prd {
  title: string;
  description: string;
  stories: Story[];
  created_at: string;
  updated_at: string;
}

function readPrd(): Prd | null {
  const prdPath = getPrdPath();
  if (!fs.existsSync(prdPath)) return null;
  try {
    return JSON.parse(fs.readFileSync(prdPath, "utf-8"));
  } catch {
    return null;
  }
}

function writePrd(prd: Prd): void {
  const prdPath = getPrdPath();
  ensureDir(path.dirname(prdPath));
  prd.updated_at = new Date().toISOString();
  fs.writeFileSync(prdPath, JSON.stringify(prd, null, 2));
}

export function registerPrdTools(server: McpServer): void {
  server.tool(
    "omg_read_prd",
    "Read the current PRD (Product Requirements Document) with all stories and their status",
    {},
    async () => {
      const prd = readPrd();
      if (!prd) {
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({ exists: false, message: "No PRD found. Create one with ralph or autopilot." }),
            },
          ],
        };
      }

      const summary = {
        title: prd.title,
        total_stories: prd.stories.length,
        passing: prd.stories.filter((s) => s.passes).length,
        failing: prd.stories.filter((s) => !s.passes).length,
        stories: prd.stories.map((s) => ({
          id: s.id,
          title: s.title,
          passes: s.passes,
          priority: s.priority,
          criteria_count: s.acceptance_criteria.length,
        })),
      };

      return {
        content: [{ type: "text" as const, text: JSON.stringify(summary, null, 2) }],
      };
    }
  );

  server.tool(
    "omg_create_prd",
    "Create a new PRD with title, description, and stories",
    {
      prd: z.string().describe("JSON string of PRD: {title, description, stories: [{id, title, description, acceptance_criteria, priority}]}"),
    },
    async ({ prd: prdJson }) => {
      const input = JSON.parse(prdJson);
      const prd: Prd = {
        title: input.title,
        description: input.description,
        stories: (input.stories || []).map((s: Partial<Story>) => ({
          id: s.id || `story-${Math.random().toString(36).slice(2, 8)}`,
          title: s.title || "Untitled",
          description: s.description || "",
          acceptance_criteria: s.acceptance_criteria || [],
          passes: false,
          priority: s.priority || 0,
        })),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      writePrd(prd);

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify({
              success: true,
              title: prd.title,
              stories_created: prd.stories.length,
            }),
          },
        ],
      };
    }
  );

  server.tool(
    "omg_update_story",
    "Update a story's status (passes: true/false) and optionally add verification evidence",
    {
      story_id: z.string().describe("The story ID to update"),
      passes: z.boolean().describe("Whether the story passes its acceptance criteria"),
      evidence: z.string().optional().describe("Verification evidence (test output, etc.)"),
    },
    async ({ story_id, passes, evidence }) => {
      const prd = readPrd();
      if (!prd) {
        return {
          content: [{ type: "text" as const, text: JSON.stringify({ success: false, error: "No PRD found" }) }],
        };
      }

      const story = prd.stories.find((s) => s.id === story_id);
      if (!story) {
        return {
          content: [
            { type: "text" as const, text: JSON.stringify({ success: false, error: `Story ${story_id} not found` }) },
          ],
        };
      }

      story.passes = passes;
      if (evidence) {
        story.verification_evidence = evidence;
      }
      writePrd(prd);

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify({
              success: true,
              story_id,
              passes,
              total_passing: prd.stories.filter((s) => s.passes).length,
              total_stories: prd.stories.length,
            }),
          },
        ],
      };
    }
  );

  server.tool(
    "omg_verify_story",
    "Get the next unverified story and its acceptance criteria for verification",
    {},
    async () => {
      const prd = readPrd();
      if (!prd) {
        return {
          content: [{ type: "text" as const, text: JSON.stringify({ exists: false, message: "No PRD found" }) }],
        };
      }

      // Find highest-priority story that hasn't passed yet
      const pending = prd.stories
        .filter((s) => !s.passes)
        .sort((a, b) => b.priority - a.priority);

      if (pending.length === 0) {
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                all_passing: true,
                message: "All stories pass. PRD is complete.",
                total_stories: prd.stories.length,
              }),
            },
          ],
        };
      }

      const next = pending[0];
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify({
              story: {
                id: next.id,
                title: next.title,
                description: next.description,
                acceptance_criteria: next.acceptance_criteria,
                priority: next.priority,
              },
              remaining: pending.length,
              total: prd.stories.length,
            }),
          },
        ],
      };
    }
  );
}
