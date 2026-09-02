#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
WORK_DIR="$(mktemp -d "${TMPDIR:-/tmp}/copyskills-packages.XXXXXX")"
PACK_DIR="$WORK_DIR/packs"
PROJECT_DIR="$WORK_DIR/project"
export NPM_CONFIG_CACHE="$WORK_DIR/npm-cache"

cleanup() {
  rm -rf "$WORK_DIR"
}
trap cleanup EXIT

mkdir -p "$PACK_DIR" "$PROJECT_DIR" "$NPM_CONFIG_CACHE"

for PACKAGE_DIR in core mcp-server cli integrations; do
  if [[ ! -d "$ROOT/packages/$PACKAGE_DIR/dist" ]]; then
    echo "ERROR: packages must be built before running packed-artifact tests"
    exit 1
  fi
  npm pack "$ROOT/packages/$PACKAGE_DIR" --pack-destination "$PACK_DIR" >/dev/null
done

for ARCHIVE in "$PACK_DIR"/*.tgz; do
  if tar -xOf "$ARCHIVE" package/package.json | grep -q '"workspace:'; then
    echo "ERROR: $ARCHIVE contains an unsupported workspace: dependency"
    exit 1
  fi
done

cd "$PROJECT_DIR"
npm init --yes >/dev/null
npm install --ignore-scripts --no-audit --no-fund "$PACK_DIR"/*.tgz >/dev/null

node --input-type=module -e '
  import { createBundledLoader, resolveSkillsDir } from "@copydoc/core";
  const loader = createBundledLoader();
  if (loader.listSkills().length !== 15) throw new Error("Expected 15 bundled skills");
  if (!resolveSkillsDir().endsWith("dist/skills")) throw new Error("Unexpected bundled skills path");
'

"$PROJECT_DIR/node_modules/.bin/copydoc" list | grep -q 'copy-workflow'
"$PROJECT_DIR/node_modules/.bin/copydoc-integrations" help | grep -q 'Install copydoc skills'
node "$PROJECT_DIR/node_modules/@copydoc/mcp/dist/index.js" </dev/null

CODEX_PROJECT="$WORK_DIR/codex-project"
mkdir -p "$CODEX_PROJECT"
cd "$CODEX_PROJECT"
"$PROJECT_DIR/node_modules/.bin/copydoc-integrations" install --tool codex >/dev/null

SKILL_COUNT="$(find .agents/skills -name SKILL.md | wc -l | tr -d ' ')"
if [[ "$SKILL_COUNT" != "15" ]]; then
  echo "ERROR: expected 15 Codex skills, found $SKILL_COUNT"
  exit 1
fi

if find .agents/skills -type l | grep -q .; then
  echo "ERROR: the default npx install must copy skills, not create cache-backed links"
  exit 1
fi

grep -q 'args = \["--yes", "@copydoc/mcp@0.1.1"\]' .codex/config.toml
"$PROJECT_DIR/node_modules/.bin/copydoc-integrations" status | grep -q 'configured'

echo "Packed artifact smoke test passed"
