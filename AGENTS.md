# AGENTS.md

## What this repo is

`logship-cli`: a CommonJS command line tool that groups shipped log lines by service and ranks them by severity. Part of the `factorydependencydefense` fleet.

## Commands

- Install: `npm ci`
- Build: `npm run build` (esbuild bundle to `dist/logship.js`)
- Test: `npm test` (`node --test`, under 60 seconds)
- Run: `node bin/logship.js group <file>`

## Rules

- This repo is CommonJS (`require`, no `"type": "module"`). Keep it that way.
- Never push to `main`. Commit on a `droid/<job>` branch; the harness opens the PR.
- Never pick a package version from memory. Use `npm view <pkg> versions --json`.
- A change is done only when `npm run build` and `npm test` both pass.
- Keep diffs small: one concern per PR.
