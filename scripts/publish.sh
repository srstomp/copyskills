#!/usr/bin/env bash
set -euo pipefail

# Copydoc publish script
# Usage:
#   ./scripts/publish.sh              # dry run (default)
#   ./scripts/publish.sh --publish    # actual publish
#   ./scripts/publish.sh --bump minor # bump version, then dry run
#   ./scripts/publish.sh --bump patch --publish  # bump + publish

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CORE="$ROOT/packages/core"
MCP="$ROOT/packages/mcp-server"
CLI="$ROOT/packages/cli"
INTEGRATIONS="$ROOT/packages/integrations"

DRY_RUN=true
BUMP=""

# Parse args
while [[ $# -gt 0 ]]; do
  case $1 in
    --publish) DRY_RUN=false; shift ;;
    --bump) BUMP="$2"; shift 2 ;;
    *) echo "Unknown flag: $1"; echo "Usage: ./scripts/publish.sh [--bump major|minor|patch] [--publish]"; exit 1 ;;
  esac
done

echo "=== Copydoc Publish ==="
echo ""

# Step 1: Check git is clean
if [[ -n "$(git -C "$ROOT" status --porcelain)" ]]; then
  echo "ERROR: Working directory is not clean. Commit or stash changes first."
  exit 1
fi

# Step 2: Bump version (if requested)
if [[ -n "$BUMP" ]]; then
  echo "Bumping version ($BUMP)..."
  CURRENT=$(jq -r .version "$CORE/package.json")
  IFS='.' read -r MAJOR MINOR PATCH <<< "$CURRENT"

  case $BUMP in
    major) MAJOR=$((MAJOR + 1)); MINOR=0; PATCH=0 ;;
    minor) MINOR=$((MINOR + 1)); PATCH=0 ;;
    patch) PATCH=$((PATCH + 1)) ;;
    *) echo "ERROR: --bump must be major, minor, or patch"; exit 1 ;;
  esac

  NEW_VERSION="$MAJOR.$MINOR.$PATCH"
  echo "  $CURRENT -> $NEW_VERSION"

  node "$ROOT/scripts/set-version.mjs" "$NEW_VERSION"

  git -C "$ROOT" add packages .codex-plugin .claude-plugin README.md USAGE.md \
    scripts/test-packed-artifacts.sh
  git -C "$ROOT" commit -m "chore: bump version to $NEW_VERSION"
  echo ""
fi

VERSION=$(jq -r .version "$CORE/package.json")
echo "Version: $VERSION"
echo "Mode: $(if $DRY_RUN; then echo 'DRY RUN'; else echo 'PUBLISH'; fi)"
echo ""

# Step 3: Run tests
echo "=== Running tests ==="
cd "$ROOT"
bun run test
bun run validate:plugin
bun run validate:skills
bun run typecheck
echo ""

# Step 4: Clean dist
echo "=== Cleaning dist ==="
rm -rf "$CORE/dist" "$MCP/dist" "$CLI/dist" "$INTEGRATIONS/dist"
echo "  Cleaned all dist/ directories"
echo ""

# Step 5: Build all packages
echo "=== Building ==="
cd "$CORE" && bun run build
echo "  @copydoc/core built"
cd "$MCP" && bun run build
echo "  @copydoc/mcp built"
cd "$CLI" && bun run build
echo "  @copydoc/cli built"
cd "$INTEGRATIONS" && bun run build
echo "  @copydoc/integrations built"
echo ""

# Step 6: Reject package metadata that npm cannot install.
if rg -n '"workspace:' "$ROOT"/packages/*/package.json; then
  echo "ERROR: package manifests still contain workspace: dependencies"
  exit 1
fi

# Step 7: Install and execute the packed artifacts in a clean temporary project.
echo "=== Testing packed artifacts ==="
"$ROOT/scripts/test-packed-artifacts.sh"
echo ""

# Step 8: Publish (or dry run)
echo "=== $(if $DRY_RUN; then echo 'Dry Run'; else echo 'Publishing'; fi) ==="

publish_pkg() {
  local dir="$1"
  local name="$2"
  cd "$dir"
  if $DRY_RUN; then
    echo "  $name: npm pack --dry-run"
    npm pack --dry-run 2>&1 | grep -E "^(npm notice|Tarball)" | head -5
  else
    echo "  $name: npm publish --access public"
    npm publish --access public
  fi
  echo ""
}

# Publish in dependency order: core first, then mcp and cli
publish_pkg "$CORE" "@copydoc/core"
publish_pkg "$MCP" "@copydoc/mcp"
publish_pkg "$CLI" "@copydoc/cli"
publish_pkg "$INTEGRATIONS" "@copydoc/integrations"

echo "=== Done ==="
if $DRY_RUN; then
  echo "This was a dry run. To publish for real:"
  echo "  ./scripts/publish.sh --publish"
fi
