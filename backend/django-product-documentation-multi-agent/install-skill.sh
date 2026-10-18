#!/usr/bin/env bash
set -euo pipefail
if [[ $# -ne 1 ]]; then echo "Usage: $0 /path/to/project" >&2; exit 2; fi
ROOT="$(cd "$1" && pwd)"
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
NAME="django-product-documentation"
SRC="$HERE/$NAME"
DEST="$ROOT/.agents/skills/$NAME"
mkdir -p "$ROOT/.agents/skills" "$ROOT/.claude/skills" "$ROOT/.opencode/skills"
if [[ -e "$DEST" || -L "$DEST" ]]; then
  echo "Existing skill at $DEST. Nothing overwritten. Back it up and remove it before reinstalling." >&2
  exit 1
fi
cp -R "$SRC" "$DEST"
for AGENT in .claude .opencode; do
  LINK="$ROOT/$AGENT/skills/$NAME"
  if [[ -e "$LINK" || -L "$LINK" ]]; then
    echo "Existing $LINK; unchanged." >&2
  else
    ln -s "../../.agents/skills/$NAME" "$LINK"
  fi
done
printf 'Installed canonical skill: %s\n' "$DEST"
printf 'MkDocs scaffold is at %s/site (copy separately into your documentation repository).\n' "$DEST"
