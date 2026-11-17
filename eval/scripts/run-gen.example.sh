#!/bin/bash
# One task per headless Sonnet run; A and B interleaved; 8 at a time. Rerun to resume (skips finished outputs).
R=/Users/steve/Projects/copyskills/eval/runs/2026-11-18-aa2
mkdir -p /tmp/eval-gen-cwd
while read -r name; do
  arm=$(echo $name | cut -d- -f2); n=$(echo $name | cut -d- -f3); task=$(echo $name | cut -d- -f4-)
  [ -s "$R/out/$arm/$task/$n.md" ] && continue
  while [ "$(jobs -rp | wc -l)" -ge 8 ]; do sleep 3; done
  ( cd /tmp/eval-gen-cwd && claude -p --model claude-sonnet-5-5 --permission-mode bypassPermissions "$(cat "$R/prompts/gen/$name.md")" > "$R/genlogs/$name.log" 2>&1 < /dev/null; echo "exit: $?" >> "$R/genlogs/$name.log" ) &
done < "$R/prompts/gen-queue.txt"
wait
echo "outputs: $(ls $R/out/*/*/*.md 2>/dev/null | wc -l)"
