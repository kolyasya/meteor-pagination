# Supply Chain Cleanup & pnpm Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove orphaned lockfiles, update gitignore rules, configure pnpm with a 14-day package release delay, and generate a clean pnpm lockfile.

**Architecture:** Clean root repository artifacts, configure `.npmrc` security settings (`engine-strict`, `minimum-release-age`), configure `packageManager` in `example/package.json`, and replace `example/package-lock.json` with `example/pnpm-lock.yaml`.

**Tech Stack:** pnpm v11.20.0, Node.js, Meteor, Git.

**Spec:** User request to clean repository hygiene and migrate to pnpm with a 2-week (14d) release delay.

## Global Constraints

- Use ASD-STE100 (Simplified Technical English) for all documentation and messages.
- Do not commit `node_modules` or `.meteor/local/`.
- Do not remove `npm-shrinkwrap.json` under `example/packages/meteor-pagination/.npm/package/`.
- Use exact version `pnpm@11.20.0` in `packageManager`.

---

### Task 1: Immediate Supply Chain & Gitignore Cleanup

**Files:**
- Modify: [.gitignore](file:///Users/nikolay/webdev/meteor-pagination/.gitignore)
- Delete: [package-lock.json](file:///Users/nikolay/webdev/meteor-pagination/package-lock.json)

**Interfaces:**
- Consumes: Existing git tracking state.
- Produces: Clean git status with correct ignore rules for Meteor and npm artifacts.

- [ ] **Step 1: Delete orphaned root `package-lock.json`**

```bash
git rm package-lock.json
```

- [ ] **Step 2: Update root `.gitignore`**

Update [.gitignore](file:///Users/nikolay/webdev/meteor-pagination/.gitignore) to contain:

```gitignore
.DS_Store
node_modules/
.meteor/local/
example/packages/*/.npm/package/node_modules/
```

- [ ] **Step 3: Verify git status**

Run: `git status`
Expected: `package-lock.json` staged for deletion, `.gitignore` modified, no untracked build artifacts.

- [ ] **Step 4: Commit cleanup changes**

```bash
git add .gitignore package-lock.json
git commit -m "chore: remove orphaned root package-lock and update gitignore"
```

---

### Task 2: Configure pnpm and Supply Chain Security Rules

**Files:**
- Create: [.npmrc](file:///Users/nikolay/webdev/meteor-pagination/.npmrc)
- Create: [example/.npmrc](file:///Users/nikolay/webdev/meteor-pagination/example/.npmrc)
- Modify: [example/package.json](file:///Users/nikolay/webdev/meteor-pagination/example/package.json)

**Interfaces:**
- Consumes: pnpm v11.20.0 security configuration options.
- Produces: Strict engine enforcement and 14-day minimum package release age configuration.

- [ ] **Step 1: Create `.npmrc` files**

Create [.npmrc](file:///Users/nikolay/webdev/meteor-pagination/.npmrc) and [example/.npmrc](file:///Users/nikolay/webdev/meteor-pagination/example/.npmrc) with the following content:

```ini
engine-strict=true
minimum-release-age=14d
```

- [ ] **Step 2: Add `packageManager` field to `example/package.json`**

Modify [example/package.json](file:///Users/nikolay/webdev/meteor-pagination/example/package.json) to declare `packageManager`:

```json
{
  "name": "example",
  "private": true,
  "packageManager": "pnpm@11.20.0",
  ...
}
```

- [ ] **Step 3: Commit configuration changes**

```bash
git add .npmrc example/.npmrc example/package.json
git commit -m "chore: configure pnpm with engine-strict and 14d release age"
```

---

### Task 3: Migrate to pnpm and Generate `pnpm-lock.yaml`

**Files:**
- Delete: [example/package-lock.json](file:///Users/nikolay/webdev/meteor-pagination/example/package-lock.json)
- Create: [example/pnpm-lock.yaml](file:///Users/nikolay/webdev/meteor-pagination/example/pnpm-lock.yaml)

**Interfaces:**
- Consumes: `example/package.json`, `example/.npmrc`.
- Produces: `example/pnpm-lock.yaml`.

- [ ] **Step 1: Remove `example/package-lock.json`**

```bash
git rm example/package-lock.json
```

- [ ] **Step 2: Install dependencies with pnpm**

Run command in `example/` directory:

```bash
pnpm install
```

Verify that `example/pnpm-lock.yaml` is generated and dependencies install successfully.

- [ ] **Step 3: Run tests to verify setup**

Run command in `example/` directory:

```bash
pnpm test
```

Expected: Tests pass without dependency resolution errors.

- [ ] **Step 4: Commit pnpm lockfile**

```bash
git add example/pnpm-lock.yaml example/package-lock.json
git commit -m "chore: migrate example app from npm to pnpm"
```

---

## Verification Plan

### Automated Tests
- Run `pnpm test` inside `example/` directory to verify mocha test execution.
- Run `rtk git status` to verify no extra lockfiles exist and working tree is clean.

### Manual Verification
- Verify `minimum-release-age=14d` is respected by pnpm.
- Verify `example/packages/meteor-pagination/.npm/package/npm-shrinkwrap.json` remains tracked and unmodified.
