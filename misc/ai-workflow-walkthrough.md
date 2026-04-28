# AI Coding For Real Engineers — Full Workshop
**Speaker:** Matt Pocock (AI Hero, [@mattpocockuk](https://twitter.com/mattpocockuk))
**Source:** [https://www.youtube.com/watch/-QFHIoCo-Ko](https://www.youtube.com/watch/-QFHIoCo-Ko)

---

## Overview

The thesis of this talk: **software engineering fundamentals — the stuff that works with humans — also works super well with AI.** The workshop demonstrates a full workflow from idea → grilling session → PRD → kanban board → AFK agent implementation.

---

## Part 1: LLM Constraints You Must Design Around

### The Smart Zone vs. The Dumb Zone

*(Concept attributed to Dex Hy, who runs a company called Human Layer)*

- Every LLM has a **smart zone** (early in a context window) and a **dumb zone** (later in a context window).
- Each token added to the context creates new attention relationships to every prior token — this scales **quadratically**, like adding a team to a football league.
- Around **~100k tokens**, regardless of whether the model advertises 200k or 1M context, the model starts making increasingly poor decisions.
- The 1M context window expansion mostly just ships more "dumb zone." It is useful for **retrieval** tasks, not ideal for **coding** tasks.
- **Goal:** Size tasks so they stay within the smart zone. Keep system prompts as small as possible — 250k tokens in a system prompt puts the model in the dumb zone before a single user message is sent.

### The Momento Problem (LLMs Forget)

- Every new session starts fresh from the system prompt. Everything from the prior session is gone when context is cleared.
- A **session** typically moves through: system prompt → exploratory phase (agent reads the codebase) → implementation → testing/feedback loops.
- **Compacting:** Squeezes a long conversation into a compressed summary that stays in context. Matt explicitly dislikes this approach because the summary degrades accuracy.
- **Preferred approach:** Clear the context entirely and re-initialize from a clean, well-structured state. Predictable, consistent starting conditions every time.

> "I much prefer my AI to behave like the guy from Memento — the state is always the same."

---

## Part 2: The Workflow

### Step 0 — Context Monitoring

- Always display a token counter in your coding environment so you can see exactly how many tokens you're using at any moment.
- Matt uses Claude Code with a status line showing exact token count. Reference article available on [AI Hero](https://aihero.dev).

---

### Step 1 — The Grill Me Skill

**Purpose:** Reach a *shared design concept* with the AI before writing any code.

**The problem being solved:** Plan mode and spec-to-code approaches both have AI eagerly producing plans before genuine alignment is reached. This creates misalignment — the silent assumption that writing a spec and piping it to AI equals good output.

> "Specs-to-code... I tried it and it sucks. You need to keep a handle on the code. The code is your battleground."

**How it works:**

The `/grill-me` skill is a short prompt with instructions like:
> "Interview me relentlessly about every aspect of this plan until we reach a shared understanding. Walk down each branch of the design tree, resolving dependencies one by one. For each question, provide your recommended answer. Ask the questions one at a time."

**Process:**
1. Clear context window.
2. Invoke the grill me skill, passing the client brief or idea as input.
3. The AI uses a **sub-agent** to explore the codebase first (sub-agent runs in an isolated context window and reports a summary back — token usage doesn't pollute the orchestrator's context).
4. The AI begins asking targeted questions **one at a time**, each with a recommended answer.
5. You respond. The AI deepens. This can involve 40–100+ questions over an extended session.

**The output:** A conversation history that constitutes a shared *design concept* — the same term Frederick P. Brooks uses in *The Design of Design* to describe the shared idea held by all participants in a project.

**Practical tip:** You can pipe in a meeting transcript (e.g., from Gemini meetings) and run a grill session on it to surface and resolve assumptions you didn't know you had.

**Two types of tasks in the AI age:**
- **Human-in-the-loop tasks:** A human must be present and engaged. The grilling/planning phase is always this type.
- **AFK tasks:** The human can walk away. Implementation can be made AFK, but planning cannot.

---

### Step 2 — Write a PRD (Product Requirements Document)

**Purpose:** Convert the grilling session into a structured *destination document*.

**The `/write-prd` skill:**
1. Asks user for a long, detailed description of the problem.
2. Optionally explores the repo (can be skipped if grill session was just run).
3. Identifies proposed modules to modify.
4. Outputs a PRD in a standard template.

**PRD template structure:**
- Problem statement
- Solution
- User stories (e.g., 18 for a gamification feature)
- Implementation decisions
- Testing decisions
- **Out-of-scope items** (critical for defining "done" and preventing scope creep)

**Why Matt doesn't re-read the PRD:**
- LLMs are excellent at summarization.
- Alignment was already achieved in the grill session.
- Reading it would only validate the LLM's summarization ability, not add new signal.

**Keeping the code in mind throughout:**
- The PRD explicitly lists which modules will be modified.
- This is intentional: "This is not specs-to-code. We are not ignoring the code. We keep the code in mind throughout the whole process."

**Doc rot warning:**
- Do **not** keep old PRDs in the repo indefinitely. Once implemented, the code diverges from the PRD. Claude finding a stale PRD will be misled by it.
- Preferred: close the GitHub issue (marks it done visually) or delete the local markdown file.

---

### Step 3 — PRD to Issues (Kanban Board)

**Purpose:** Break the PRD into independently-grabbable implementation tasks with blocking relationships.

**The `/prd-to-issues` skill:**
- Breaks the PRD into **vertical slice** issues.
- Issues are written as local markdown files (or GitHub issues).
- Each issue has a type: **AFK** or **human-in-the-loop**.
- Issues have explicit **blocking relationships** to each other.

#### Vertical Slices vs. Horizontal Slices

**Horizontal (wrong — what AI naturally wants to do):**
- Phase 1: all database/schema work
- Phase 2: all API work
- Phase 3: all frontend work
- Problem: you get no feedback until Phase 3 is complete. The system isn't integrated until the very end.

**Vertical (correct — what you want):**
- Each issue cuts across all layers: schema change + service logic + minimal UI representation
- You get a reviewable, integrated artifact at the end of every issue
- This is the **tracer bullet** concept from *The Pragmatic Programmer*

> "A tracer bullet: attach phosphorescence to every 6th round so you can see the line in the sky. You get feedback on where you're aiming."

**Parallelization:**
- Issues with no blocking dependencies can be worked on **simultaneously** by parallel agents.
- A sequential multi-phase plan can only be worked on by one agent at a time.
- A kanban board with a directed acyclic graph of blocking relationships enables **parallel agent execution**.

---

### Step 4 — AFK Agent Implementation (The Ralph Loop)

**Purpose:** Let an AI agent work through the kanban backlog autonomously while the human is away.

#### The `once.sh` Script (Single-Run Version)
- Reads all issue markdown files into a variable.
- Grabs the last 5 commits for context.
- Runs Claude Code with `--permission-mode except-edits`.
- Passes the issues and a prompt describing what to do.

#### The Ralph Loop (Repeated Version)
- Runs in a **Docker sandbox** for isolation.
- The prompt instructs the agent to:
  1. Look at the issue backlog.
  2. Pick the next AFK task (priority order: critical bug fixes → dev infrastructure → tracer bullets → polishing/quick wins/refactors).
  3. Explore the repo.
  4. Use **TDD** to complete the task.
  5. Run feedback loops.
  6. Output a completion summary and then loop.
- If all AFK tasks are complete, the agent outputs a terminal signal and stops.

---

### Step 5 — TDD (Test-Driven Development) Inside the Loop

TDD is described as **essential** for getting quality output from coding agents.

**Red-Green-Refactor:**
1. Write a single failing test first (red).
2. Write the minimal implementation to make it pass (green).
3. Refactor.

**Why TDD prevents AI from cheating on tests:**
- If AI does implementation first and tests second (the horizontal pattern), it will write tests that simply validate what it already built — including bugs.
- TDD forces the AI to instrument the code *before* writing the code, making it structurally harder to write tests that just rubber-stamp the implementation.

**The quality ceiling principle:**
> "If your codebase doesn't have feedback loops, you're never going to get decent output from AI. The quality of your feedback loops is the ceiling on how good your AI can code."

---

### Step 6 — Code Review and QA

**Why you must do this manually:**
- QA is how the human imposes taste and opinion back onto the codebase.
- Fully automating the QA/idea/research/prototype loop produces apps that "lack taste and are bad."

> "We are not producing slop here."

**Smart zone trick for AI-assisted review:**
- Do **not** ask the AI to review its own code in the same context window it used to write the code — it will be reviewing from within the dumb zone.
- **Clear the context first**, then pass the code to a fresh agent for review. The reviewer operates in the smart zone.
- Matt uses **Sonnet for implementation** and **Opus for reviewing** (Opus = smarter, better judgment for review tasks).

**What to look at during code review:**
1. Review the **tests** first — are they testing reasonable things?
2. Then review the code itself for anything egregious.
3. QA the running app manually.

**QA feeds back into the kanban:**
- Bugs and missing behaviors found during QA become new issues on the kanban board.
- The loop continues until you're satisfied.

---

## Part 3: Codebase Architecture for AI

### Deep Modules vs. Shallow Modules

*(Concept from John Ousterhout's *A Philosophy of Software Design*)*

**Shallow modules (bad):**
- Many small files, each exporting a few things.
- Dense internal dependency graphs.
- Hard for AI to navigate — must manually trace through the entire graph.
- Unclear test boundaries — do you test each micro-function individually? Do you mock half the graph?
- AI left to its own devices **naturally produces shallow module codebases**.

**Deep modules (good):**
- Fewer, larger modules with **small, simple public interfaces** hiding substantial internal functionality.
- Easy to draw a clean test boundary around the module's interface.
- AI can see the entire flow of a feature within one module and test it end-to-end.
- Enables the "gray box" mental model for the developer.

> "I don't necessarily need to review everything inside that module. I just need to know that it behaves a certain way under certain conditions."

**Practical benefit for developer cognition:**
- Design the **interface** for each module yourself.
- Delegate the **implementation** of that interface to the AI.
- This lets you maintain a high-level mental map of the codebase without needing to track every internal detail — preserving sanity while moving fast.

### The `/improve-codebase-architecture` Skill

- Scans the codebase for clusters of related shallow modules.
- Identifies candidates for consolidation into deep modules.
- Outputs: module clusters, arguments for coupling, dependency category, current test coverage gaps.

> "If you take one thing away from today, just try running this skill on your repo and see what happens."

---

## Part 4: Push vs. Pull for Coding Standards

**Push:** Instructions always sent to the agent (e.g., content in `CLAUDE.md` / system prompt). Always consumes tokens.

**Pull:** Information the agent can choose to retrieve (e.g., skills, referenced files). Only consumes tokens when the agent decides it needs them.

**Recommended approach:**
- For the **implementer agent**: make coding standards available via **pull** (agent consults them if it has a question).
- For the **reviewer agent**: **push** coding standards directly (reviewer has both the written code and the standards to compare against simultaneously).

---

## Part 5: Sand Castle — Parallel Agent Orchestration

A TypeScript library Matt built for running agents in parallel AFK loops.

**Architecture:**
1. **Planner agent** — reads the backlog, determines which issues can be worked on in parallel (based on blocking relationships), selects a batch.
2. **For each selected issue:** create a Docker sandbox (git worktree), run an implement loop inside it.
3. **Reviewer agent** — reviews commits produced by the implementer.
4. **Merger agent** — takes reviewed branches, merges them, resolves any type/test conflicts.

**Model allocation:**
- Sonnet → implementation (fast, cheap)
- Opus → review (smarter judgment needed)

> "This has been my flow for quite a while now for working on most projects. It works super super well."

GitHub: `github.com/mattpocco/course-video-manager` — 744 closed issues as evidence of the workflow at scale.

---

## Summary: The Full Workflow

```
IDEA
  │
  ▼
GRILL ME SESSION (human-in-the-loop, builds shared design concept)
  │
  ▼
WRITE PRD (destination document, module map, out-of-scope items)
  │
  ▼
PRD → KANBAN ISSUES (vertical slices, blocking relationships, AFK/HITL labels)
  │
  ▼
AFK AGENT IMPLEMENTATION (Ralph loop, TDD, feedback loops, Docker sandbox)
  │
  ▼
QA + CODE REVIEW (human imposes taste, creates new issues)
  │
  └──► back to KANBAN (new issues from QA)
       └──► until done
  │
  ▼
TEAM REVIEW + MERGE
```

**Throughout the entire process:** maintain awareness of the codebase's module structure. Never let AI dictate the shape of the codebase by default.

---

## Key Book References

- **Frederick P. Brooks** — *The Design of Design* (shared design concept)
- **Martin Fowler** — *Refactoring* (keep tasks small)
- **Andy Hunt & Dave Thomas** — *The Pragmatic Programmer* (tracer bullets, don't bite off more than you can chew)
- **John Ousterhout** — *A Philosophy of Software Design* (deep vs. shallow modules)

> "Buy a ton of those old books. Pre-AI writing is always really fun to read, and on every single page I found something useful and interesting."

---

## Q&A Highlights

**Q: Should I use Taskmaster / Spec-it / other frameworks instead of the grill me skill?**
> At this stage there's no clear winner and things are changing constantly. Own as much of your planning stack as possible. If you use a framework you don't fully understand, you won't have observability when it breaks. Inversion of control: you should be in control of the stack.

**Q: Do we actually want to take advantage of the 1M context window?**
> It's mostly more dumb zone. ~100k remains the practical smart zone for coding. Larger context is better suited to retrieval tasks (reading large documents) than coding tasks.

**Q: How do you retain decisions you chose *not* to implement?**
> The PRD's out-of-scope section captures these explicitly. It's critical for defining done.

**Q: How do you handle team workflows / messy real-world parallel ideas?**
> Everything up to the kanban board (idea → grill → PRD → issues) is team-level work. Collaborate on those assets, argue over them, request comments. Once the destination is agreed, agents can implement. The phases bounce until the team converges.

**Q: How do you deal with more code review than ever before?**
> There's no way to avoid it if you're delegating more coding to agents. We simply need to be ready to do more code review. No clean solution exists yet.

**Q: Should I keep PRDs and issue files in the repo long-term?**
> Risky. Old PRDs cause doc rot — Claude finds them and is misled by stale information. Prefer closing/deleting them after implementation. For GitHub issues, mark as closed (still fetchable but visually marked done).

**Q: Front end workflow?**
> Front end is multimodal and requires human eyes. AI can generate 3 throwaway prototype routes for you to compare visually. You pick the best, feed feedback back into the grilling session. Playwright MCP and agent browsers exist but aren't reliable enough yet for automated front-end QA in mature codebases.

**Q: How do you get AI to code the way you want it to (libraries, style, patterns)?**
> Push/pull model described above. Standards available via pull during implementation; pushed directly to the reviewer agent.
