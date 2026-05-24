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

  # Update all three packages
  for PKG in "$CORE/package.json" "$MCP/package.json" "$CLI/package.json" "$INTEGRATIONS/package.json"; do
    jq --arg v "$NEW_VERSION" '.version = $v' "$PKG" > "$PKG.tmp" && mv "$PKG.tmp" "$PKG"
  done

  git -C "$ROOT" add packages/*/package.json
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
bun test
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

# Step 6: Copy skills into core package for publishing
# npm does not support files outside the package root via relative paths.
# We copy skills/ into core's dist/ so they ship with the package.
echo "=== Bundling skills ==="
rm -rf "$CORE/dist/skills"
cp -r "$ROOT/skills" "$CORE/dist/skills"
SKILL_COUNT=$(find "$CORE/dist/skills" -name "SKILL.md" | wc -l | tr -d ' ')
echo "  Copied $SKILL_COUNT skills into @copydoc/core dist/"
echo ""

# Step 7: Fix core's files field (point to dist/ which now includes skills/)
# Temporarily update files field for publish, restore after
CORE_PKG_BACKUP=$(cat "$CORE/package.json")
jq '.files = ["dist"]' "$CORE/package.json" > "$CORE/package.json.tmp" && mv "$CORE/package.json.tmp" "$CORE/package.json"

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

# Step 9: Restore core's package.json
echo "$CORE_PKG_BACKUP" > "$CORE/package.json"

# Step 10: Clean up copied skills
rm -rf "$CORE/dist/skills"

echo "=== Done ==="
if $DRY_RUN; then
  echo "This was a dry run. To publish for real:"
  echo "  ./scripts/publish.sh --publish"
fi
