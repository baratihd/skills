#!/usr/bin/env bash
# Run from the extracted ZIP root: ./install-skill.sh /path/to/django-project
set -euo pipefail
PROJECT_ROOT="${1:-.}"
PROJECT_ROOT="$(cd "$PROJECT_ROOT" && pwd)"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SOURCE="$SCRIPT_DIR/treatment-backend-testing"
CANONICAL="$PROJECT_ROOT/.agents/skills/treatment-backend-testing"
mkdir -p "$PROJECT_ROOT/.agents/skills" "$PROJECT_ROOT/.claude/skills" "$PROJECT_ROOT/.opencode/skills"
if [[ -e "$CANONICAL" || -L "$CANONICAL" ]]; then
  echo "Refusing to overwrite an existing skill: $CANONICAL" >&2
  echo 'Back up or update that directory explicitly; rerun after resolving.' >&2
  exit 1
fi
cp -a "$SOURCE" "$CANONICAL"
for host in .claude .opencode; do
  dest="$PROJECT_ROOT/$host/skills/treatment-backend-testing"
  if [[ -e "$dest" || -L "$dest" ]]; then
    echo "Existing $dest: not overwritten; please verify it points at the canonical skill." >&2
  else
    ln -s ../../.agents/skills/treatment-backend-testing "$dest"
    echo "Linked $dest"
  fi
done
printf 'Canonical skill: %s\n' "$CANONICAL"
printf 'Skills share one physical copy. Start a new agent session to refresh discovery.\n'
