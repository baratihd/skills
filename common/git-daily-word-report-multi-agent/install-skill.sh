#!/usr/bin/env bash
set -euo pipefail
if [[ $# -ne 1 ]]; then echo "Usage: $0 /path/to/project" >&2; exit 2; fi
SOURCE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/git-daily-word-report"
PROJECT="$(cd "$1" && pwd)"
TARGET="$PROJECT/.agents/skills/git-daily-word-report"
mkdir -p "$PROJECT/.agents/skills" "$PROJECT/.claude/skills" "$PROJECT/.opencode/skills"
if [[ -e "$TARGET" || -L "$TARGET" ]]; then
  echo "Refusing to replace existing $TARGET" >&2; exit 1
fi
cp -R "$SOURCE" "$TARGET"
for dir in .claude .opencode; do
  link="$PROJECT/$dir/skills/git-daily-word-report"
  if [[ -e "$link" || -L "$link" ]]; then
    echo "Existing $link preserved (not overwritten)" >&2
  else
    ln -s ../../.agents/skills/git-daily-word-report "$link"
  fi
done
echo "Installed skill at $TARGET"
