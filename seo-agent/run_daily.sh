#!/usr/bin/env bash
# HireReady daily SEO publisher — generate post, commit, push.
set -euo pipefail

ROOT="/root/resume-ats"
AGENT="$ROOT/seo-agent"
LOG_DIR="$AGENT/logs"
LOG="$LOG_DIR/daily.log"
VENV="$AGENT/.venv"
PYTHON="$VENV/bin/python"

mkdir -p "$LOG_DIR"
exec >>"$LOG" 2>&1

echo "======== $(date -Is) ========"

cd "$ROOT"

# Optional secrets (OPENROUTER_API_KEY=...)
if [[ -f "$AGENT/.env" ]]; then
  set -a
  # shellcheck disable=SC1091
  source "$AGENT/.env"
  set +a
fi

export GIT_AUTHOR_NAME="${GIT_AUTHOR_NAME:-Adil Khatri}"
export GIT_AUTHOR_EMAIL="${GIT_AUTHOR_EMAIL:-khatriadil044@gmail.com}"
export GIT_COMMITTER_NAME="${GIT_COMMITTER_NAME:-HireReady SEO Agent}"
export GIT_COMMITTER_EMAIL="${GIT_COMMITTER_EMAIL:-seo-agent@hireready.app}"

# Prefer gh credentials for HTTPS push
if command -v gh >/dev/null 2>&1; then
  gh auth setup-git >/dev/null 2>&1 || true
fi

git pull --ff-only origin main

ARGS=(--once-per-day)
if [[ -z "${OPENROUTER_API_KEY:-}" ]]; then
  ARGS+=(--fallback)
  echo "No OPENROUTER_API_KEY — using fallback template"
fi

if [[ ! -x "$PYTHON" ]]; then
  echo "Missing venv at $VENV — bootstrap with: python3 -m venv $VENV && $VENV/bin/pip install openai"
  PYTHON=python3
fi

"$PYTHON" "$AGENT/generate_post.py" "${ARGS[@]}"

if git diff --quiet && [[ -z "$(git status --porcelain)" ]]; then
  echo "No changes to commit"
  exit 0
fi

git add frontend/content/blog seo-agent/queue.json seo-agent/published.json
git commit -m "seo: daily HireReady blog post $(date -u +%Y-%m-%d)"
git push origin main

echo "Pushed OK"
