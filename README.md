# DuubeeShoes

Luxury footwear storefront — landing page, product catalog, product detail, and
account flows (sign in / registration). Built as a multi-page Vite application
with a bespoke, project-restricted design language.

## Stack

| Layer      | Choice                                            |
|------------|---------------------------------------------------|
| Build/dev  | Vite 8                                            |
| Language   | TypeScript 5.4 (strict)                           |
| Runtime    | Vanilla DOM modules — no framework runtime        |
| Styling    | Custom token system ("DubeeShoes" design language)|

## Prerequisites

- Node.js ≥ 18
- npm ≥ 9

## Quick start

```bash
npm run deps     # check toolchain → verify lockfile → security audit → clean install
npm run dev      # start the dev server
```

## Scripts

| Script              | Purpose                                              |
|---------------------|------------------------------------------------------|
| `npm run deps`      | Dependency bootstrap (see policy below)              |
| `npm run dev`       | Vite dev server                                      |
| `npm run build`     | Production build to `dist/`                          |
| `npm run preview`   | Serve the production build locally                   |
| `npm run typecheck` | `tsc --noEmit`                                       |
| `npm run lint`      | ESLint (flat config, `typescript-eslint` recommended) |

## Dependency policy

Installs are **lockfile-driven and fail-closed**. `scripts/deps.sh` runs four
gates in order and stops at the first failure:

1. **Toolchain** — node/npm present, minimum versions met (`engines` in package.json).
2. **Lockfile sync** — `package-lock.json` must satisfy `package.json`
   (`npm ci --dry-run`). Desync exits with instructions to regenerate.
3. **Security audit** — fails on vulnerabilities at or above `high` by default.
4. **Reproducible install** — `npm ci` only; never bare `npm install`.

### Usage

Run from the project root (the script resolves paths relative to the working
directory). Every mutating run displays its plan and asks for confirmation
before touching anything:

```bash
npm run deps                    # verify → show plan → confirm → converge
npm run deps -- --update        # verify → show available updates → confirm →
                                #   refresh lockfile within semver ranges →
                                #   re-audit → converge
npm run deps -- --check-only    # verify & report only; never mutates
bash scripts/deps.sh            # direct invocation also works (executable)
```

### Modes

| Mode          | Mutates lockfile | Installs | Notes                                            |
|---------------|------------------|----------|--------------------------------------------------|
| default       | never            | yes      | Converges node_modules to the pinned lockfile    |
| `--update`    | within semver ranges only | yes | Pending **majors are shown but never auto-applied** |
| `--check-only`| never            | never    | Safe for CI status checks                        |

### Safety guarantees

- **Confirmation gate:** every install/update prints what it is about to do and
  waits for explicit `y`. Default answer is no.
- **Non-interactive refusal:** with no terminal attached (CI), the script
  refuses rather than guessing; automation must set `DEPS_ASSUME_YES=1`.
- **Vulnerability refusal with rollback:** in `--update` mode the refreshed
  tree is re-audited before install; any finding at or above the threshold
  restores `package-lock.json` byte-for-byte and exits non-zero. Known holes
  are never installed.
- **Majors are decisions, not side effects:** `--update` moves only within
  existing semver ranges; major bumps go through the ADR process.

### Configuration

| Variable           | Default | Effect                                                        |
|--------------------|---------|---------------------------------------------------------------|
| `DEPS_AUDIT_LEVEL` | `high`  | Minimum audit severity that fails the gate (`low`…`critical`) |
| `DEPS_SKIP_AUDIT`  | unset   | `1` skips the audit step entirely — offline escape hatch only |
| `DEPS_ASSUME_YES`  | unset   | `1` skips the confirmation prompt — required for non-TTY runs |

### Exit codes

| Code | Meaning                          | Response                                                  |
|------|----------------------------------|-----------------------------------------------------------|
| `0`  | Success                          | —                                                          |
| `1`  | Toolchain failure / refused or aborted before any change | Install Node ≥ 18 / npm ≥ 9, or re-run interactively |
| `2`  | Lockfile desync                  | Intentional change? run `npm install --package-lock-only` |
| `3`  | Audit findings                   | Resolve vulnerabilities or record an accepted risk in the ADR |
| `4`  | Install failure                  | Re-run unredirected for full npm output                   |
| `5`  | Registry unreachable             | Fix connectivity before retrying                          |


## Project structure

```
├── index.html            # Landing page
├── catalog.html          # Product catalog
├── product.html          # Product detail shell
├── login.html            # Sign in
├── register.html         # Create account
├── public/images/        # Static imagery (served verbatim)
├── src/
│   ├── css/              # Design language: tokens → reset → atoms → molecules → organisms
│   └── ts/               # App modules: errors (taxonomy), auth, validation, products…
├── scripts/deps.sh       # Dependency check / verify / install
└── dist/                 # Build output — generated, never committed
```

## Design language

The visual system is declared in [`src/css/design-language.md`](src/css/design-language.md):
primitive tokens (`--dubee-*`) resolve into role-named semantic tokens
(`--color-*`, `--font-*`, `--space-*`); component code references semantic
tokens only.

## Notes

- Private project — not published to npm (`"private": true`).
- Client-side validation and auth here are UX-layer only; any real backend must
  re-validate everything at its own boundary.
