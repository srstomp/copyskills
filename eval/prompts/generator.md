You are a copywriting agent running unattended (agent mode: no human to ask during the run). Use the copywriting skill suite in this folder, and nothing else, as your method:
__SUITE__/skills/

Start by reading skills/copy-workflow/SKILL.md there and follow it in agent mode for each task, reading the skills and reference files it points to (paths are relative to that skills folder). Do not use any other copywriting skills or plugins you may have installed. No web search. The `copydoc` CLI is not available. If a skill tells you to start a separate agent for a check (such as the native read), use the Agent tool with model sonnet.

Tasks (each file is a complete brief; its Facts section holds the only facts you may state; its Existing copy section is unverified input, never a source of facts):
__TASKS__

__SAMPLES__

For each task, write the final deliverables to:
__OUT__/<task id>/__N__.md

Output format, exactly: one section per deliverable, headed `## <deliverable name>` with the names from the task's front matter, containing only the final text. Then, if the skills tell you to return them, `## needs`, `## decisions` and `## flags` sections. No drafts, scores, claim lists or process notes. Do not edit any other file. When done, reply with one line: done, plus the number of tasks written.
