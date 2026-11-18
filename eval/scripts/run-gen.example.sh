#!/bin/bash
# Prepare the run with prep-gen.example.py first. One task per headless Sonnet run; A and B interleaved; 8 at a time. Rerun to resume (skips finished outputs).
# Writers may read only the task files and their own arm's suite copy, and write only their own output folder
# (dontAsk denies everything not allowed; absolute paths in rules need a leading // ).
ROOT=/Users/steve/Projects/copyskills
R=$ROOT/eval/runs/${1:?usage: run-gen.example.sh <run>}
mkdir -p /tmp/eval-gen-cwd
while read -r name; do
  arm=$(echo $name | cut -d- -f2); n=$(echo $name | cut -d- -f3); task=$(echo $name | cut -d- -f4-)
  [ -s "$R/out/$arm/$task/$n.md" ] && continue
  # A writer given voice samples may also read that one sample file (never the judges' disjoint set).
  sample=$(grep -o "$ROOT/eval/samples/[a-z0-9-]*/generator.md" "$R/prompts/gen/$name.md" | head -1)
  while [ "$(jobs -rp | wc -l)" -ge 8 ]; do sleep 3; done
  ( cd /tmp/eval-gen-cwd && claude -p --model claude-sonnet-5-5 --permission-mode dontAsk \
      --allowedTools "Read(/$ROOT/eval/tasks/**)" "Read(/$R/suite-$arm/**)" "Edit(/$R/out/$arm/$task/**)" ${sample:+"Read(/$sample)"} "Agent" \
      -- "$(cat "$R/prompts/gen/$name.md")" > "$R/genlogs/$name.log" 2>&1 < /dev/null; echo "exit: $?" >> "$R/genlogs/$name.log" ) &
done < "$R/prompts/gen-queue.txt"
wait
echo "outputs: $(ls $R/out/*/*/*.md 2>/dev/null | wc -l)"
