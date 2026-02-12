# AI Explorer Workflow

**A structured approach for using AI coding agents to explore, document, and test web application features through browser automation.**

This document is generic. Adapt the specifics (folder paths, URL patterns, credential formats) to your project.

---

## Overview

The AI explorer workflow uses an AI coding agent (such as GitHub Copilot in VS Code) combined with a browser automation MCP server (Playwright MCP) to systematically explore a web application. The agent navigates the UI, records its findings, and produces structured notes that serve as input for test generation.

The workflow has five stages. Each stage is independent -- you complete one before moving to the next.

| Stage | Trigger | Output |
|-------|---------|--------|
| **Explore** | "Explore {feature}" | Exploration notes with UI structure and raw Playwright code |
| **Draft test cases** | "Draft test cases for {feature}" | Test case document with scenarios, steps, expected results |
| **Generate tests** | "Generate tests for {feature}" | Executable Playwright test files |
| **Update docs** | "Update docs for {feature}" | Updated project documentation |
| **Heal tests** | "Fix the failing test" | Repaired test code |

---

## Prerequisites

### Tools

- **VS Code** with GitHub Copilot (Agent mode)
- **Playwright MCP server** -- provides browser control via MCP tools (navigate, click, type, snapshot, screenshot)
- **Project prompt files** -- one per workflow stage, stored in `.github/prompts/`

### Project structure

```
your-project/
  .github/
    copilot-instructions.md       # AI agent behavior rules
    prompts/
      explore.prompt.md           # Explore stage instructions
      draft-test-cases.prompt.md  # Test case drafting instructions
      generate-tests.prompt.md    # Test generation instructions
      update-docs.prompt.md       # Documentation update instructions
      heal-tests.prompt.md        # Test repair instructions
  sessions/                       # Exploration session data (gitignored)
    {date}-{feature}/
      metadata.json
      exploration-notes.md
      screenshots/
```

---

## Stage 1: Explore

### Purpose

Discover and document a feature's UI: pages, components, flows, URL patterns, and edge cases.

### How to start

Tell the agent:

> "Explore {feature}"

Or, for applications with multiple environments:

> "Explore {brand} {env} {interface} {feature}"

The agent reads the explore prompt file and follows the steps.

### What the agent does

1. **Creates a session folder** with metadata and an empty screenshots directory
2. **Authenticates** using credentials from environment variables
3. **Creates exploration notes immediately** -- a skeleton markdown file that serves as a live checkpoint
4. **Navigates the feature** -- clicking through the UI, trying main flows, noting edge cases
5. **Writes findings incrementally** -- updates the notes file after every 2-3 actions
6. **Finalizes** -- organizes notes and marks the session complete

### Key principles

#### Incremental note-writing

The exploration notes file is created *before* exploration starts and updated continuously. This is the single most important rule -- it prevents data loss if the session is interrupted.

The notes file is your durable memory. The chat context is ephemeral.

#### Snapshots over screenshots

The Playwright MCP server returns two things with every action:

1. **Accessibility snapshot** -- a structured text representation of every element on the page. This is how the agent "sees" the UI. It contains element types, labels, values, and reference IDs for interaction.
2. **Generated Playwright code** -- the TypeScript equivalent of the action performed (e.g., `await page.getByRole('button', { name: 'Save' }).click()`).

The snapshot is lightweight text. A screenshot is a large binary payload that inflates the conversation context. Prefer snapshots for understanding UI structure. Only take screenshots when visual layout matters (charts, complex positioning, styling).

#### Context management

AI chat sessions have payload size limits. Screenshots are the primary cause of hitting these limits. Follow these rules:

- Write findings to the file continuously -- do not accumulate them in chat memory
- Minimize screenshots -- describe UI using snapshot text instead
- When the context gets heavy, start a fresh chat and point it to the notes file
- The browser session persists across chats (the MCP server runs independently)

#### Session continuity

When starting a fresh chat to continue exploration:

1. The browser stays open -- same page, same login state
2. Tell the agent to read the existing notes file for context
3. The agent takes a snapshot to see the current page state
4. Exploration continues seamlessly

Example prompt for continuation:

> "Continue exploring imports. Read `sessions/2026-02-10-imports/exploration-notes.md` for context. The browser is still open."

### Exploration notes format

```markdown
# Exploration: {feature}

**Date**: {YYYY-MM-DD}
**Status**: In progress | Complete

## Pages visited

- /path/to/page -- Description of what this page does
- /path/to/other -- Description

## UI components

### Page name
- Table with columns: Name, Status, Date
- "Create New" button opens a dialog
- Filter dropdown with options: All, Active, Archived

## Flows

### Flow: Create a new item
1. Click "Create New" button
2. Fill in Name field
3. Select Type from dropdown
4. Click "Save"
5. Success message appears, redirects to list

## Edge cases

- Empty state: shows "No items found" message
- Validation: Name field is required, shows red border on submit
- Permissions: Delete button only visible to admin users

## Observations

- Page loads slowly when list exceeds 100 items
- Search field does not support partial matches

## Raw Playwright code

### Flow: Create a new item
```typescript
await page.getByRole('button', { name: 'Create New' }).click();
await page.getByLabel('Name').fill('Test Item');
await page.getByRole('combobox', { name: 'Type' }).selectOption('Standard');
await page.getByRole('button', { name: 'Save' }).click();
```
```

---

## Stage 2: Draft test cases

### Purpose

Transform exploration notes into structured test case documents before writing code.

### How to start

> "Draft test cases for {feature}"

The agent reads the exploration notes and the draft-test-cases prompt, then produces a test case document with scenarios, steps, and expected results.

### Output

A markdown document with test cases organized by flow, including:

- Test ID and title
- Preconditions
- Steps with expected results
- Tags (smoke, regression, e2e)

---

## Stage 3: Generate tests

### Purpose

Convert drafted test cases into executable Playwright test files, using the raw Playwright code from exploration as a starting point.

### How to start

> "Generate tests for {feature}"

The agent reads the test case document, the exploration notes (for raw code), and the generate-tests prompt.

---

## Stage 4: Update docs

### Purpose

Update project documentation to reflect the newly tested feature.

### How to start

> "Update docs for {feature}"

---

## Stage 5: Heal tests

### Purpose

Fix tests that are failing due to UI changes, selector drift, or timing issues.

### How to start

> "Fix the failing test"

The agent reads the test failure output, opens the browser, inspects the current UI state, and updates the test code to match.

---

## Adapting this workflow to your project

### 1. Create prompt files

Create one prompt file per stage in `.github/prompts/`. Each prompt should:

- Describe the agent's role
- Define the input format (what the user says)
- List the steps in order
- Specify the output format
- Include the incremental note-writing and context management rules

### 2. Configure copilot instructions

In `.github/copilot-instructions.md`, reference the workflow stages and prompt files:

```markdown
## AI Exploration Workflow

| Stage | When | Prompt file |
|-------|------|-------------|
| Explore | "Explore {feature}" | `.github/prompts/explore.prompt.md` |
| Draft test cases | "Draft test cases for {feature}" | `.github/prompts/draft-test-cases.prompt.md` |
| Generate tests | "Generate tests for {feature}" | `.github/prompts/generate-tests.prompt.md` |
| Update docs | "Update docs for {feature}" | `.github/prompts/update-docs.prompt.md` |
| Heal tests | "Fix the failing test" | `.github/prompts/heal-tests.prompt.md` |
```

### 3. Set up sessions directory

Add `sessions/` to your `.gitignore` (exploration data is ephemeral). Create a `.gitignore` inside `sessions/` to keep the directory in version control:

```
# sessions/.gitignore
*
!.gitignore
```

### 4. Configure authentication

Store credentials in `.env.local` (gitignored). Use a consistent naming pattern so the agent can construct variable names from the explore command parameters.

### 5. Install Playwright MCP

The browser automation depends on a Playwright MCP server. Configure it in your VS Code MCP settings so the agent has access to browser tools (navigate, click, type, snapshot, screenshot).

---

## Troubleshooting

### "413 Request Entity Too Large"

The conversation payload exceeded the API limit. This is almost always caused by accumulated screenshots.

**Fix**: Start a new chat. Point the agent to the exploration notes file. The browser session is still open.

**Prevent**: Follow the context management rules -- prefer snapshots over screenshots, write notes incrementally.

### Agent lost context after many interactions

The agent's understanding degrades as the conversation grows long, even before hitting payload limits.

**Fix**: Same as above -- start a fresh chat with a pointer to the notes file.

### Browser session expired

If too much time passes between interactions, the application session may time out.

**Fix**: Tell the agent to re-authenticate. The explore prompt includes authentication steps.

### Agent creates duplicate files

The agent may not know that a file already exists if it was created in a previous chat session.

**Fix**: Include a rule in copilot-instructions.md: "Search the codebase before creating new files."
