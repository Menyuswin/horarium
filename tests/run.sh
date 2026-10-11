#!/bin/sh
# Runs every browser check and lists the failures. Needs node and playwright-core.
# NODE_PATH may point to a global playwright-core; CHROMIUM to the browser binary.
cd "$(dirname "$0")"
fails=0
for t in t*.js; do
  out=$(node "$t" 2>&1)
  n=$(printf '%s\n' "$out" | grep -c '^FAIL')
  [ "$n" -gt 0 ] && { printf '%s\n' "$out" | grep '^FAIL' | sed "s/^/$t: /"; fails=$((fails+n)); }
  printf '%s\n' "$out" | grep -q '^PASS' || { echo "$t: no checks ran"; printf '%s\n' "$out" | tail -3; fails=$((fails+1)); }
done
echo "failures: $fails"
[ "$fails" -eq 0 ]
