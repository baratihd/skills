#!/usr/bin/env bash
set -euo pipefail
NAME="treatment-backend-release-note"
SRC_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/$NAME"
TARGET="${1:-.}"
TARGET="$(cd "$TARGET" && pwd)"
CANON="$TARGET/.agents/skills/$NAME"
[[ -f "$SRC_DIR/SKILL.md" ]] || { echo "Missing packaged SKILL.md" >&2; exit 1; }
mkdir -p "$TARGET/.agents/skills" "$TARGET/.claude/skills" "$TARGET/.opencode/skills"
if [[ -e "$CANON" || -L "$CANON" ]]; then
  echo "Refusing to overwrite existing canonical skill: $CANON" >&2
  echo "Back up or remove the previous version explicitly, then rerun." >&2
  exit 2
fi
for provider in .claude .opencode; do
  path="$TARGET/$provider/skills/$NAME"
  if [[ -e "$path" || -L "$path" ]]; then
    echo "Refusing to overwrite existing provider skill: $path" >&2
    exit 2
  fi
done
cp -R "$SRC_DIR" "$CANON"
ln -s "../../.agents/skills/$NAME" "$TARGET/.claude/skills/$NAME"
ln -s "../../.agents/skills/$NAME" "$TARGET/.opencode/skills/$NAME"
for p in "$CANON/SKILL.md" "$TARGET/.claude/skills/$NAME/SKILL.md" "$TARGET/.opencode/skills/$NAME/SKILL.md"; do
  [[ -r "$p" ]] || { echo "Install validation failed: $p" >&2; exit 3; }
done
echo "Installed one canonical skill in .agents/skills with Claude/OpenCode symlinks."
