#!/usr/bin/env bash
# PRO-233 Gate 3 — unprompted agent compliance, one attempt.
#
# Protocol (docs/plans/PRO-233-plan.md): a claude CLI subprocess gets ONLY the
# product brief; the ccm-ds skill + AGENTS.md are already wired into
# spikes/spike-app the way a consuming app installs them. Zero human
# corrections — after the run, the DS-6 lint gates are executed verbatim and
# violations counted. Requires working `claude` auth (claude auth status).
#
# Usage: bash scripts/gate3-attempt.sh <attempt-number>
# Evidence lands in docs/solutions/PRO-233-gate3/attempt-<N>/.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
APP="$ROOT/spikes/spike-app"
N="${1:?usage: gate3-attempt.sh <attempt-number>}"
OUT="$ROOT/docs/solutions/PRO-233-gate3/attempt-$N"
BRIEF="$ROOT/docs/solutions/PRO-233-gate3/brief.txt"

mkdir -p "$OUT"

# Clean slate: revert the spike app to HEAD and drop the stand-in page so the
# agent starts from the bare scaffold every attempt.
git -C "$ROOT" checkout -- spikes/spike-app
rm -f "$APP/app/pages/review.vue"

echo "== Gate 3 attempt $N: running agent (this can take minutes) =="
(cd "$APP" && claude -p "$(cat "$BRIEF")" --permission-mode bypassPermissions) \
  | tee "$OUT/transcript.txt"

echo "== Archiving the agent's diff =="
git -C "$ROOT" add -N spikes/spike-app
git -C "$ROOT" diff -- spikes/spike-app > "$OUT/diff.patch"

echo "== DS-6 lint gates (zero corrections applied) =="
ESLINT_STATUS=0
STYLELINT_STATUS=0
BUILD_STATUS=0
(cd "$ROOT" && pnpm exec eslint spikes/spike-app --format json) \
  > "$OUT/eslint.json" 2> "$OUT/eslint.stderr.txt" || ESLINT_STATUS=$?
(cd "$ROOT" && pnpm exec stylelint "spikes/spike-app/**/*.{css,vue}" --allow-empty-input --formatter json) \
  > "$OUT/stylelint.json" 2> "$OUT/stylelint.stderr.txt" || STYLELINT_STATUS=$?
(cd "$ROOT" && pnpm build:spike) \
  > "$OUT/build.log" 2>&1 || BUILD_STATUS=$?

ESLINT_ERRORS=$(node -e "const r=require('$OUT/eslint.json');console.log(r.reduce((n,f)=>n+f.errorCount,0))" 2>/dev/null || echo "?")
STYLELINT_ERRORS=$(node -e "const r=require('$OUT/stylelint.json');console.log(r.reduce((n,f)=>n+f.warnings.length,0))" 2>/dev/null || echo "?")

{
  echo "attempt: $N"
  echo "eslint errors: $ESLINT_ERRORS (exit $ESLINT_STATUS)"
  echo "stylelint errors: $STYLELINT_ERRORS (exit $STYLELINT_STATUS)"
  echo "build: $([ "$BUILD_STATUS" -eq 0 ] && echo pass || echo FAIL) (exit $BUILD_STATUS)"
} | tee "$OUT/summary.txt"

echo "== Done. Evidence in $OUT =="
