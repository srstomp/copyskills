#!/bin/bash
# After generation: units, guards, bundles, then all scoring jobs detached. Rerun to resume.
set -u
ROOT=/Users/steve/Projects/copyskills; R=$ROOT/eval/runs/${1:?usage: run-score.example.sh <run>}; S=$R/scores
# Opus scorers may read only the bundles and write only the scores folder (dontAsk denies the rest).
mkdir -p $S $R/prompts/score /tmp/eval-gen-cwd
cd $ROOT
[ -s $R/units.jsonl ] || bun eval/scripts/eval.ts units $R
[ -s $R/guards.json ] || bun eval/scripts/eval.ts guards $R
[ -d $R/read ] || bun eval/scripts/eval.ts read-bundles $R
[ -d $R/judge ] || bun eval/scripts/eval.ts judge-bundles $R
[ -d $R/factcheck ] || bun eval/scripts/eval.ts factcheck-bundles $R
R="$R" python3 -I - <<'PY'
import json,os,re
root='/Users/steve/Projects/copyskills'; R=os.environ['R']
rd=open(f'{root}/eval/prompts/reader.md').read(); jd=open(f'{root}/eval/prompts/judge.md').read(); fc=open(f'{root}/eval/prompts/factcheck.md').read()
q=[]
for t in json.load(open(f'{R}/run.json'))['tasks']:
    loc=re.search(r'^locale:\s*(\S+)',open(f'{root}/eval/tasks/{t}.md').read(),re.M).group(1)
    lang={'nl':'Dutch','en':'English','de':'German'}[loc.split('-')[0]]
    for who in ('opus','sol'):
        open(f'{R}/prompts/score/read-{who}-{t}.md','w').write(rd.replace('__LANGUAGE__',lang).replace('__BUNDLE__',f'{R}/read/{t}.md').replace('__OUT__',f'{R}/scores/read-{who}-{t}.jsonl')); q.append(f'read-{who}-{t}')
        for o in ('order1','order2'):
            open(f'{R}/prompts/score/judge-{who}-{o}-{t}.md','w').write(jd.replace('__BUNDLE__',f'{R}/judge/{t}.{o}.md').replace('__OUT__',f'{R}/scores/judge-{who}-{o}-{t}.jsonl')); q.append(f'judge-{who}-{o}-{t}')
    open(f'{R}/prompts/score/fact-{t}.md','w').write(fc.replace('__OUTPUTS__',f'{R}/factcheck/{t}.md').replace('__OUT__',f'{R}/scores/fact-{t}.jsonl')); q.append(f'fact-{t}')
open(f'{R}/prompts/score-queue.txt','w').write('\n'.join(q)+'\n')
PY
while read -r job; do
  [ -s "$S/$job.jsonl" ] && grep -q "exit: 0" "$S/$job.log" 2>/dev/null && continue
  while [ "$(jobs -rp | wc -l)" -ge 8 ]; do sleep 3; done
  case $job in
    *-opus-*) ( cd /tmp/eval-gen-cwd && claude -p --model claude-opus-5-5 --permission-mode dontAsk --allowedTools "Read(/$R/read/**)" "Read(/$R/judge/**)" "Read(/$R/factcheck/**)" "Edit(/$S/**)" -- "$(cat $R/prompts/score/$job.md)" > $S/$job.log 2>&1 < /dev/null; echo "exit: $?" >> $S/$job.log ) & ;;
    *) ( codex exec -s workspace-write --skip-git-repo-check -m gpt-6.1-sol -C $ROOT "$(cat $R/prompts/score/$job.md)" > $S/$job.log 2>&1 < /dev/null; echo "exit: $?" >> $S/$job.log ) & ;;
  esac
done < $R/prompts/score-queue.txt
wait
# Never let an older score decide: remove previous scores and results first; a failed step then counts as missing evidence.
rm -f $R/read-score.json $R/judge-score.json $R/factcheck-score.json $R/results.md
cat $S/read-opus-*.jsonl > $S/all-read-opus.jsonl; cat $S/read-sol-*.jsonl > $S/all-read-sol.jsonl
for w in opus sol; do for o in order1 order2; do cat $S/judge-$w-$o-*.jsonl > $S/all-judge-$w-$o.jsonl; done; done
cat $S/fact-*.jsonl > $S/all-fact.jsonl
bun eval/scripts/eval.ts read-score $R $S/all-read-opus.jsonl $S/all-read-sol.jsonl > $R/read-score.txt 2>&1
bun eval/scripts/eval.ts judge-score $R $S/all-judge-opus-order1.jsonl $S/all-judge-opus-order2.jsonl $S/all-judge-sol-order1.jsonl $S/all-judge-sol-order2.jsonl > $R/judge-score.txt 2>&1
bun eval/scripts/eval.ts factcheck-score $R $S/all-fact.jsonl > $R/fact-score.txt 2>&1
bun eval/scripts/eval.ts report $R > $R/report.txt 2>&1
echo "scoring done: $(ls $S/*.jsonl | wc -l) files"
