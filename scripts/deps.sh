#!/usr/bin/env bash
#
# Dependency bootstrap for dubeeshoes.
#
# Modes:
#   (default)     gates -> show plan -> confirm -> converge node_modules to lockfile
#   --update      gates -> show semver-available updates -> confirm -> refresh
#                 lockfile within existing ranges -> re-audit (auto-rollback on
#                 findings) -> converge
#   --check-only  gates + report only; never mutates anything
#
# WHY fail-closed prompting: dependency changes are supply-chain decisions.
# This script treats them as explicit transactions — displayed plan, default-deny
# confirmation, and byte-exact lockfile rollback when the security audit refuses.
#
# Usage:
#   npm run deps                            # converge (interactive confirm)
#   npm run deps -- --update                # refresh within semver, then converge
#   npm run deps -- --check-only            # verify & report, mutate nothing
#   DEPS_ASSUME_YES=1 npm run deps          # automation escape hatch (non-TTY)
#   DEPS_AUDIT_LEVEL=critical npm run deps  # raise audit threshold
#   DEPS_SKIP_AUDIT=1 npm run deps          # offline escape hatch (use sparingly)

set -euo pipefail

# --- configuration -----------------------------------------------------------

readonly MIN_NODE_MAJOR=18
readonly MIN_NPM_MAJOR=9
readonly AUDIT_LEVEL="${DEPS_AUDIT_LEVEL:-high}"
readonly LOCKFILE="package-lock.json"
readonly MANIFEST="package.json"

# --- exit codes (documented in README) ---------------------------------------

readonly EXIT_OK=0
readonly EXIT_TOOLCHAIN=1        # also: refused/aborted before any change
readonly EXIT_LOCKFILE_SYNC=2
readonly EXIT_AUDIT=3
readonly EXIT_INSTALL=4
readonly EXIT_NETWORK=5

MODE="install"

# --- logging -----------------------------------------------------------------

log()  { printf '[deps] %s\n' "$*"; }
fail() { printf '[deps] ERROR: %s\n' "$*" >&2; }

usage() {
  cat <<'EOF'
[deps] usage: scripts/deps.sh [--update | --check-only]

  (no flags)     verify toolchain/lockfile/security, show plan, confirm,
                 then converge node_modules to package-lock.json
  --update       additionally refresh package-lock.json within existing
                 semver ranges first; refuses (and rolls back the lockfile)
                 if the updated tree contains known vulnerabilities
  --check-only   run all verification gates and print the report without
                 modifying anything

Environment:
  DEPS_AUDIT_LEVEL=high    minimum severity that fails the audit gate
  DEPS_SKIP_AUDIT=1        skip audit (offline only)
  DEPS_ASSUME_YES=1        required for non-interactive runs
EOF
}

parse_args() {
  while [ "$#" -gt 0 ]; do
    case "$1" in
      --update)
        if [ "$MODE" != "install" ]; then
          fail "--update and --check-only are mutually exclusive."
          exit "$EXIT_TOOLCHAIN"
        fi
        MODE="update"
        ;;
      --check-only)
        if [ "$MODE" != "install" ]; then
          fail "--update and --check-only are mutually exclusive."
          exit "$EXIT_TOOLCHAIN"
        fi
        MODE="check-only"
        ;;
      -h|--help) usage; exit "$EXIT_OK" ;;
      *) fail "unknown argument: $1"; usage; exit "$EXIT_TOOLCHAIN" ;;
    esac
    shift
  done
}
parse_args "$@"

# --- confirmation gate ---------------------------------------------------------

confirm_or_die() {
  local plan_summary="$1"
  log "plan: $plan_summary"
  if [ "${DEPS_ASSUME_YES:-0}" = "1" ]; then
    log "DEPS_ASSUME_YES=1 — skipping confirmation prompt"
    return 0
  fi
  if [ ! -t 0 ]; then
    fail "refusing to proceed without an interactive terminal."
    fail "automation must set DEPS_ASSUME_YES=1 explicitly."
    exit "$EXIT_TOOLCHAIN"
  fi
  local reply=""
  read -r -p "[deps] Proceed? [y/N] " reply || true
  case "$reply" in
    y|Y|yes|Yes|YES) return 0 ;;
    *)
      log "aborted by user — nothing was modified."
      exit "$EXIT_TOOLCHAIN"
      ;;
  esac
}

# --- audit ---------------------------------------------------------------------

AUDIT_OUTPUT=""

audit_tree() {
  AUDIT_OUTPUT="$(npm audit --audit-level="$AUDIT_LEVEL" 2>&1)" && return 0
  return 1
}

handle_audit_failure() {
  local context_note="${1:-}"
  printf '%s\n' "$AUDIT_OUTPUT"
  if [ -n "$context_note" ]; then
    log "$context_note"
  fi
  if printf '%s' "$AUDIT_OUTPUT" | grep -qE 'ENOTFOUND|EAI_AGAIN|ECONNREFUSED|ETIMEDOUT|ECONNRESET'; then
    fail "could not reach the npm registry advisory database."
    fail "fix connectivity, or bypass with DEPS_SKIP_AUDIT=1 if genuinely offline."
    exit "$EXIT_NETWORK"
  fi
  fail "audit found vulnerabilities at or above '$AUDIT_LEVEL' — refusing."
  exit "$EXIT_AUDIT"
}

run_audit_gate() {
  if [ "${DEPS_SKIP_AUDIT:-0}" = "1" ]; then
    log "DEPS_SKIP_AUDIT=1 — skipping security audit (offline mode)"
    return 0
  fi
  log "auditing dependency tree (threshold: $AUDIT_LEVEL)..."
  if ! audit_tree; then
    handle_audit_failure
  fi
  log "audit clean (no vulnerabilities at or above '$AUDIT_LEVEL')"
}

# --- lockfile backup / restore --------------------------------------------------

LOCKFILE_BACKUP=""

backup_lockfile() {
  LOCKFILE_BACKUP="$(mktemp)"
  cp "$LOCKFILE" "$LOCKFILE_BACKUP"
}

restore_lockfile() {
  if ! cp "$LOCKFILE_BACKUP" "$LOCKFILE" || ! cmp -s "$LOCKFILE_BACKUP" "$LOCKFILE"; then
    fail "CRITICAL: could not restore original $LOCKFILE."
    fail "pristine copy preserved at: $LOCKFILE_BACKUP"
    exit "$EXIT_INSTALL"
  fi
  rm -f "$LOCKFILE_BACKUP"
  LOCKFILE_BACKUP=""
}
trap '[ -n "$LOCKFILE_BACKUP" ] && rm -f "$LOCKFILE_BACKUP"' EXIT

# --- reporting helpers -----------------------------------------------------------

count_locked_packages() {
  node -e "const l=require('./$LOCKFILE'); console.log(Object.keys(l.packages || {}).filter(Boolean).length)"
}

# Classifies npm outdated --json output. Emits 'NONE', 'PARSE_ERROR', or one
# TSV-ish line per package where wanted > current (the semver-moveable set).
compute_update_report() {
  local outdated_json="$1"
  printf '%s' "$outdated_json" | node -e '
let raw = "";
process.stdin.on("data", (d) => (raw += d));
process.stdin.on("end", () => {
  let o = {};
  try { o = JSON.parse(raw || "{}"); } catch { console.log("PARSE_ERROR"); return; }
  const cmp = (a, b) => {
    const A = String(a || "").split(".").map(Number);
    const B = String(b || "").split(".").map(Number);
    for (let i = 0; i < Math.max(A.length, B.length); i++) {
      const d = (A[i] || 0) - (B[i] || 0);
      if (d !== 0) return d;
    }
    return 0;
  };
  const rows = Object.entries(o).filter(([, v]) => cmp(v.wanted, v.current) > 0);
  if (rows.length === 0) { console.log("NONE"); return; }
  for (const [name, v] of rows) {
    const latestMajor = String(v.latest || "").split(".")[0];
    const wantedMajor = String(v.wanted || "").split(".")[0];
    const note = latestMajor !== wantedMajor ? `(pending major ${latestMajor})` : "";
    console.log(
      `${String(name).padEnd(22)}${String(v.current).padEnd(10)}${String(v.wanted).padEnd(10)}${String(v.latest).padEnd(10)}${note}`
    );
  }
});'
}

fetch_outdated_json() {
  local err_file="$1"
  local rc=0
  npm outdated --json >"$err_file.json" 2>"$err_file" || rc=$?
  if [ "$rc" -gt 1 ]; then
    if grep -qE 'ENOTFOUND|EAI_AGAIN|ECONNREFUSED|ETIMEDOUT|ECONNRESET' "$err_file"; then
      fail "could not reach the npm registry while checking for updates."
      exit "$EXIT_NETWORK"
    fi
    fail "'npm outdated' failed unexpectedly (rc=$rc)."
    exit "$EXIT_INSTALL"
  fi
  cat "$err_file.json"
}

show_update_report() {
  log "available updates (semver ranges only — majors are never auto-applied):"
  printf 'PACKAGE                CURRENT   WANTED    LATEST    NOTE\n'
  printf '%s\n' "$UPDATE_REPORT"
}

# --- 1. toolchain ----------------------------------------------------------------

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

# --- 2. manifest & lockfile presence ----------------------------------------------

for required_file in "$MANIFEST" "$LOCKFILE"; do
  if [ ! -f "$required_file" ]; then
    fail "required file '$required_file' missing — run from the project root."
    exit "$EXIT_LOCKFILE_SYNC"
  fi
done

# --- 3. lockfile sync ---------------------------------------------------------------

log "verifying lockfile is in sync with $MANIFEST..."
if ! npm ci --dry-run >/dev/null 2>&1; then
  fail "$LOCKFILE is out of sync with $MANIFEST."
  fail "if the change is intentional, regenerate with: npm install --package-lock-only"
  exit "$EXIT_LOCKFILE_SYNC"
fi
log "lockfile in sync"

# --- 4. security audit (baseline tree) -----------------------------------------------

run_audit_gate

# --- 5. mode dispatch -----------------------------------------------------------------

run_install() {
  log "installing (npm ci — clean, lockfile-driven)..."
  if ! npm ci --no-fund --no-audit >/dev/null 2>&1; then
    fail "npm ci failed. re-run without redirection for full output: bash scripts/deps.sh"
    exit "$EXIT_INSTALL"
  fi
  local installed_count
  installed_count="$(npm ls --depth=0 2>/dev/null | grep -c '─' || true)"
  log "installed top-level packages: ${installed_count:-unknown}"
}

case "$MODE" in
  check-only)
    log "check-only mode — verifying without modifying anything."
    log "locked tree: $(count_locked_packages) packages (lockfile-pinned)."
    UPDATE_REPORT="$(compute_update_report "$(fetch_outdated_json /tmp/opencode/deps-outdated)")"
    if [ "$UPDATE_REPORT" = "PARSE_ERROR" ]; then
      fail "could not parse 'npm outdated' output."
      exit "$EXIT_INSTALL"
    fi
    if [ "$UPDATE_REPORT" = "NONE" ]; then
      log "dependencies already current within semver ranges."
    else
      show_update_report
      log "run 'npm run deps -- --update' to apply."
    fi
    log "check complete — nothing was modified."
    exit "$EXIT_OK"
    ;;

  update)
    UPDATE_REPORT="$(compute_update_report "$(fetch_outdated_json /tmp/opencode/deps-outdated)")"
    if [ "$UPDATE_REPORT" = "PARSE_ERROR" ]; then
      fail "could not parse 'npm outdated' output."
      exit "$EXIT_INSTALL"
    fi
    if [ "$UPDATE_REPORT" = "NONE" ]; then
      log "dependencies already current within semver ranges — nothing to update."
      exit "$EXIT_OK"
    fi
    show_update_report
    confirm_or_die "refresh $LOCKFILE within semver ranges, re-audit, then reinstall $(count_locked_packages) packages."
    backup_lockfile
    log "updating lockfile..."
    if ! npm update --package-lock-only >/dev/null 2>&1; then
      restore_lockfile
      fail "npm update failed — $LOCKFILE restored; nothing was changed."
      exit "$EXIT_INSTALL"
    fi
    log "re-auditing updated tree..."
    if ! audit_tree; then
      restore_lockfile
      handle_audit_failure "updated tree refused — $LOCKFILE restored byte-for-byte; nothing was changed."
    fi
    log "audit clean after update."
    run_install
    log "$LOCKFILE was modified by this update — commit it."
    exit "$EXIT_OK"
    ;;

  install)
    confirm_or_die "converge node_modules to $LOCKFILE ($(count_locked_packages) packages, no version changes)."
    run_install
    log "dependency bootstrap complete."
    exit "$EXIT_OK"
    ;;
esac
