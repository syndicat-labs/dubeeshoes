#!/usr/bin/env bash
#
# Dependency bootstrap for dubeeshoes.
#
# WHY this exists: a bare `npm install` neither validates that the lockfile is in
# sync with package.json, nor gates on known CVEs before code lands on disk.
# This script makes dependency state explicit and fail-closed:
#   1. toolchain check      (node/npm present, minimum versions met)
#   2. lockfile sync check  (package-lock.json satisfies package.json)
#   3. security audit       (registry advisory DB, threshold-gated)
#   4. reproducible install (npm ci — lockfile-only, self-healing)
#
# Usage:
#   npm run deps                      # full flow
#   DEPS_AUDIT_LEVEL=critical npm run deps   # raise audit threshold
#   DEPS_SKIP_AUDIT=1 npm run deps    # offline escape hatch (use sparingly)

set -euo pipefail

# --- configuration -----------------------------------------------------------

readonly MIN_NODE_MAJOR=18
readonly MIN_NPM_MAJOR=9
readonly AUDIT_LEVEL="${DEPS_AUDIT_LEVEL:-high}"
readonly LOCKFILE="package-lock.json"
readonly MANIFEST="package.json"

# --- exit codes (documented in README) ---------------------------------------

readonly EXIT_OK=0
readonly EXIT_TOOLCHAIN=1
readonly EXIT_LOCKFILE_SYNC=2
readonly EXIT_AUDIT=3
readonly EXIT_INSTALL=4
readonly EXIT_NETWORK=5

# --- logging -----------------------------------------------------------------

log()  { printf '[deps] %s\n' "$*"; }
fail() { printf '[deps] ERROR: %s\n' "$*" >&2; }

# --- 1. toolchain ------------------------------------------------------------

require_tool() {
  local tool="$1"
  if ! command -v "$tool" >/dev/null 2>&1; then
    fail "'$tool' not found on PATH."
    exit "$EXIT_TOOLCHAIN"
  fi
}

major_version_of() {
  printf '%s' "$1" | sed -E 's/^v?([0-9]+).*/\1/'
}

log "checking toolchain..."
require_tool node
require_tool npm

NODE_VERSION="$(node --version)"
NPM_VERSION="$(npm --version)"
NODE_MAJOR="$(major_version_of "$NODE_VERSION")"
NPM_MAJOR="$(major_version_of "$NPM_VERSION")"

if [ "$NODE_MAJOR" -lt "$MIN_NODE_MAJOR" ]; then
  fail "node $NODE_VERSION found; this project requires >= $MIN_NODE_MAJOR."
  exit "$EXIT_TOOLCHAIN"
fi
if [ "$NPM_MAJOR" -lt "$MIN_NPM_MAJOR" ]; then
  fail "npm $NPM_VERSION found; this project requires >= $MIN_NPM_MAJOR."
  exit "$EXIT_TOOLCHAIN"
fi
log "toolchain OK (node $NODE_VERSION, npm $NPM_VERSION)"

# --- manifest & lockfile presence ---------------------------------------------

for required_file in "$MANIFEST" "$LOCKFILE"; do
  if [ ! -f "$required_file" ]; then
    fail "required file '$required_file' missing — run from the project root."
    exit "$EXIT_LOCKFILE_SYNC"
  fi
done

# --- 2. lockfile sync ----------------------------------------------------------

log "verifying lockfile is in sync with $MANIFEST..."
if ! npm ci --dry-run >/dev/null 2>&1; then
  fail "$LOCKFILE is out of sync with $MANIFEST."
  fail "if the change is intentional, regenerate with: npm install --package-lock-only"
  exit "$EXIT_LOCKFILE_SYNC"
fi
log "lockfile in sync"

# --- 3. security audit ---------------------------------------------------------

if [ "${DEPS_SKIP_AUDIT:-0}" = "1" ]; then
  log "DEPS_SKIP_AUDIT=1 — skipping security audit (offline mode)"
else
  log "auditing dependency tree (threshold: $AUDIT_LEVEL)..."
  audit_output="$(npm audit --audit-level="$AUDIT_LEVEL" 2>&1)" && audit_rc=0 || audit_rc=$?
  if [ "$audit_rc" -ne 0 ]; then
    printf '%s\n' "$audit_output"
    if printf '%s' "$audit_output" | grep -qE 'ENOTFOUND|EAI_AGAIN|ECONNREFUSED|ETIMEDOUT|ECONNRESET'; then
      fail "could not reach the npm registry advisory database."
      fail "fix connectivity, or bypass with DEPS_SKIP_AUDIT=1 if genuinely offline."
      exit "$EXIT_NETWORK"
    fi
    fail "audit found vulnerabilities at or above '$AUDIT_LEVEL' — resolve before installing."
    exit "$EXIT_AUDIT"
  fi
  log "audit clean (no vulnerabilities at or above '$AUDIT_LEVEL')"
fi

# --- 4. reproducible install ----------------------------------------------------

log "installing (npm ci — clean, lockfile-driven)..."
if ! npm ci --no-fund --no-audit >/dev/null 2>&1; then
  fail "npm ci failed. re-run without redirection for full output: bash scripts/deps.sh"
  exit "$EXIT_INSTALL"
fi

INSTALLED_COUNT="$(npm ls --depth=0 2>/dev/null | grep -c '─' || true)"
log "installed top-level packages: ${INSTALLED_COUNT:-unknown}"

log "dependency bootstrap complete."
exit "$EXIT_OK"
