# Git Workflow

How this repository is branched, committed, pushed, and merged.
Repo: `https://github.com/dxnielcapi/fitting_studio.git`

---

## 1. Branches

Three long-lived branches. None of them are deleted, none are force-pushed.

| Branch | Purpose | Deploys to | Accepts work from |
| ------ | ------- | ---------- | ----------------- |
| `main` | Integration. Default branch, always buildable. | Preview | `feat/*`, `fix/*`, `chore/*`, `docs/*` |
| `test` | QA / staging. What testers and reviewers look at. | Staging | `main` only |
| `prod` | Production. The live release. | Production | `test` only |

### Promotion path

```
feat/garment-zoom ──▶ main ──▶ test ──▶ prod
      (PR)            (PR)      (PR)
```

Work never skips a step. A hotfix still goes `fix/*` → `main` → `test` → `prod`;
it just moves faster through the same gates.

### Short-lived branch names

```
feat/<slug>     new capability          feat/garment-zoom
fix/<slug>      bug fix                 fix/rail-scroll-lock
chore/<slug>    deps, config, tooling   chore/bump-next
docs/<slug>     documentation only      docs/workflow-guide
refactor/<slug> no behaviour change     refactor/view-hooks
```

Lowercase, hyphenated, no issue numbers in the branch name.

---

## 2. Commits — Conventional Commits

Every commit message follows
[Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

| Type | Use for | Version impact |
| ---- | ------- | -------------- |
| `feat` | A new user-facing capability | minor |
| `fix` | A bug fix | patch |
| `docs` | Documentation and markdown only | none |
| `style` | Formatting, whitespace, no logic change | none |
| `refactor` | Code change that neither fixes nor adds | none |
| `perf` | Performance improvement | patch |
| `test` | Adding or correcting tests | none |
| `build` | Build system, bundler, scripts | none |
| `ci` | CI configuration and workflows | none |
| `chore` | Dependencies, config, housekeeping | none |
| `revert` | Reverts a previous commit | varies |

### Scopes

The area touched, matching the source layout:

```
app          src/app — routes, layout, metadata
fitting-room src/components/fitting-room
welcome      src/components/welcome
ui           src/components/ui
lib          src/lib — types, view model
hooks        src/lib/hooks
data         src/data — catalog and studio copy
assets       public/**
scripts      scripts/**
deps         dependencies in package.json / lockfile
config       tsconfig, eslint, next.config
```

Scope is optional but preferred. Omit it only when a change is genuinely
repo-wide.

### Subject line rules

- Imperative mood: `add`, not `added` or `adds`.
- Lowercase first letter, no trailing period.
- 72 characters or fewer for the whole first line.
- Describe the change, not the file: `fix(rail): keep active garment centred`,
  not `fix(rail): update GarmentRail.tsx`.

### Body and footer

Body is optional. Use it to say **why**, wrapped at 72 columns. Footers:

```
Refs: #42
Closes: #42
BREAKING CHANGE: garment ids are now slugs, not numeric
```

A `!` after the type or scope also marks a break: `feat(lib)!: ...`.
Either form requires a `BREAKING CHANGE:` footer explaining the migration.

### Markdown commits

Documentation is committed like any other change, under `docs`:

```
docs: add git workflow guide
docs(readme): document the placeholder script
```

Markdown never rides along inside a `feat` or `fix` commit — it gets its own
commit so release notes stay clean.

### Examples

```
feat(fitting-room): add drag-to-rotate on the garment stage
fix(hooks): release pointer capture when the drag leaves the window
chore(deps): add motion and sharp
build(scripts): add garment placeholder generator
docs: add git workflow guide
refactor(lib): extract view keys into a shared map
feat(lib)!: key garments by slug instead of index
```

### One commit, one idea

If a commit message needs the word "and", it is probably two commits.
Stage selectively (`git add -p`) rather than committing a mixed tree.

---

## 3. Pushing

### Automatic push — minimal changes

A change is **minimal** when *all* of the following hold:

- it touches **3 files or fewer**, and roughly **20 lines or fewer**;
- its type is `docs`, `style`, `chore`, or a small self-contained `fix`;
- it is on `main` or a short-lived `feat/*`, `fix/*`, `chore/*`, `docs/*` branch;
- `pnpm build` and `pnpm lint` still pass;
- it introduces no dependency, no schema change, no breaking change.

Minimal changes are committed and pushed straight away, no confirmation needed:

```bash
git add <paths>
git commit -m "docs(readme): fix dev server port"
git push origin HEAD
```

### Everything else — confirm first

Anything above that bar is committed locally, then the push is raised for
confirmation before it leaves the machine. That includes:

- new features and multi-file refactors;
- dependency or lockfile changes;
- anything touching `next.config.ts`, `tsconfig.json`, CI, or env handling;
- the **first** push of a branch to the remote;
- any push to `test` or `prod` — always, regardless of size.

### Never

- `git push --force` to `main`, `test`, or `prod`. Use `--force-with-lease`,
  and only on your own short-lived branch.
- Committing `.env*`, `node_modules/`, `.next/`, or `.vercel/` — all gitignored.
- Rewriting history that has already been pushed to a long-lived branch.

---

## 4. Pull requests

**Every merge into `main`, `test`, or `prod` goes through a pull request, and
every pull request is opened only after explicit approval.** PRs and merges are
never raised automatically — the work is prepared, then the PR is proposed for
a yes or no.

### Opening one

```bash
git push -u origin feat/garment-zoom
gh pr create --base main --head feat/garment-zoom \
  --title "feat(fitting-room): add pinch-to-zoom on the stage" \
  --body-file .github/pr-body.md
```

Title uses the same Conventional Commit format as the commits, because it
becomes the squash-merge subject.

### PR body

```markdown
## What
One paragraph on what changed.

## Why
The problem this solves.

## How to verify
1. pnpm dev
2. Open http://localhost:3000
3. ...

## Risk
What could break, and what to watch after deploy.
```

### Checks before requesting review

```bash
pnpm lint
pnpm build
```

Both green. Rebase onto the target branch rather than merging it back in:

```bash
git fetch origin
git rebase origin/main
```

### Merging

| Into | Strategy | Why |
| ---- | -------- | --- |
| `main` | **Squash** | One tidy semantic commit per unit of work |
| `test` | **Merge commit** | Preserves the set of commits being staged |
| `prod` | **Merge commit** | Release boundary stays visible in history |

Delete the short-lived branch after it merges into `main`. Never delete
`main`, `test`, or `prod`.

### Promotion PRs

Staging a release:

```bash
gh pr create --base test --head main --title "chore(release): promote main to test"
```

Shipping it:

```bash
gh pr create --base prod --head test --title "chore(release): promote test to prod"
```

Both are proposed for approval, same as any other PR — never opened or merged
unprompted.

---

## 5. Quick reference

```bash
# start work
git switch main && git pull origin main
git switch -c feat/garment-zoom

# commit
git add -p
git commit -m "feat(fitting-room): add pinch-to-zoom on the stage"

# minimal change → push immediately
git push origin HEAD

# larger change → confirm, then push and propose a PR
git push -u origin feat/garment-zoom
gh pr create --base main --head feat/garment-zoom --title "..." --body "..."

# promote
main ──▶ test ──▶ prod      # one PR per hop, each one approved first
```

---

## 6. Rules in one line each

1. Three long-lived branches: `main`, `test`, `prod`. Work flows one way.
2. Every commit is a Conventional Commit; one commit, one idea.
3. Markdown changes are their own `docs:` commit.
4. Minimal changes push automatically; anything larger is confirmed first.
5. Pushes to `test` and `prod` are always confirmed.
6. Every PR and every merge is approved before it is opened.
7. `main`, `test`, and `prod` are never force-pushed and never deleted.
