# AGENTS.md

This repository contains a Tampermonkey userscripts (“tamperscripts”) intended to run in a chrome browser via the Tampermonkey extension for the Corebridge.net POS system.

This file tells coding agents (e.g., Codex) how to operate in this repo: how scripts are structured, how to make safe changes, and what “done” means.

---

## Repository goals
- Keep scripts **reliable across Chrome/Chromium** and common sites.
- Avoid breaking changes to existing scripts unless explicitly requested.
- Prefer **clear, maintainable vanilla JS** over heavy dependencies.
- Minimize site impact: avoid unnecessary DOM thrash, timers, and global pollution.

## Coding standards (important)

### General JavaScript
- Prefer `let`, no `var` unless required.
- Avoid polluting `window`. 
- If functions have optional parameters, make optional parameters passed as an object
- camelCase is prefered for naming conventions
- use classes and inheritance rather than the javascript prototype structure

**Versioning:** increment `@version` by 0.001 for any functional change in LocalIncludes.txt