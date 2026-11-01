#!/usr/bin/env bash
set -euo pipefail
if [[ $# -ne 1 ]]; then
  echo "Usage: $0 /path/to/project" >&2
  exit 2
fi
ROOT="$(cd "$1" && pwd)"
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
NAME=test-scenario-tracker
SRC="$HERE/$NAME"
DEST="$ROOT/.agents/skills/$NAME"
if [[ ! -f "$SRC/SKILL.md" ]]; then echo "Missing $SRC/SKILL.md" >&2; exit 1; fi
if [[ -e "$DEST" || -L "$DEST" ]]; then
  echo "Already exists: $DEST. Preserve existing files; manually upgrade after backup." >&2
  exit 1
fi
mkdir -p "$ROOT/.agents/skills" "$ROOT/.claude/skills" "$ROOT/.opencode/skills"
cp -R "$SRC" "$DEST"
for agent in .claude .opencode; do
  LINK="$ROOT/$agent/skills/$NAME"
  if [[ -e "$LINK" || -L "$LINK" ]]; then
    echo "Existing $LINK; left untouched" >&2
  else
    ln -s "../../.agents/skills/$NAME" "$LINK"
  fi
done
printf 'Installed %s at %s\n' "$NAME" "$DEST"
