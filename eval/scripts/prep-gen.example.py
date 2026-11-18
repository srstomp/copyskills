#!/usr/bin/env python3 -I
"""Prepare a run folder for run-gen.example.sh: run.json, one suite copy per arm, one prompt per (arm, n, task).

Usage: python3 -I eval/scripts/prep-gen.example.py <run> <samplesA:0|1> <samplesB:0|1> [task ...]
Default tasks: every dev task. With samples on, tasks whose front matter says `samples: none` still get none.
Both arms copy the current skills/ folder; for a suite experiment, replace suite-B/skills afterwards.
"""
import json, os, re, shutil, sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '../..'))
run, samples_a, samples_b, *tasks = sys.argv[1:]
R = f'{ROOT}/eval/runs/{run}'
if os.path.exists(f'{R}/run.json'):
    sys.exit(f'{R} already prepared')
meta = lambda t: open(f'{ROOT}/eval/tasks/{t}.md').read()
if not tasks:
    tasks = sorted(f[:-3] for f in os.listdir(f'{ROOT}/eval/tasks') if f != 'TEMPLATE.md' and re.search(r'^set: dev$', meta(f[:-3]), re.M))
samples = {'A': samples_a == '1', 'B': samples_b == '1'}
os.makedirs(f'{R}/prompts/gen'); os.makedirs(f'{R}/genlogs')
json.dump({'run': run, 'arms': ['A', 'B'], 'n': 4, 'tasks': tasks, 'samples': samples}, open(f'{R}/run.json', 'w'), indent=1)
for arm in 'AB':
    shutil.copytree(f'{ROOT}/skills', f'{R}/suite-{arm}/skills')
gen = open(f'{ROOT}/eval/prompts/generator.md').read()
block = open(f'{ROOT}/eval/prompts/samples-block.md').read()
queue = []
for n in range(1, 5):
    for t in tasks:
        m = meta(t)
        project = re.search(r'^project:\s*(\S+)', m, re.M).group(1)
        none = re.search(r'^samples:\s*none\b', m, re.M)
        for arm in 'AB':
            path = f'{ROOT}/eval/samples/{project}/generator.md'
            sample = block.replace('__SAMPLE_FILES__', f'- {path}') if samples[arm] and not none and os.path.exists(path) else 'No voice samples are supplied for this task.'
            name = f'gen-{arm}-{n}-{t}'
            text = gen.replace('__SUITE__', f'{R}/suite-{arm}').replace('__TASKS__', f'- {ROOT}/eval/tasks/{t}.md').replace('__SAMPLES__', sample).replace('__OUT__', f'{R}/out/{arm}').replace('__N__', str(n))
            assert '__' not in text, name
            open(f'{R}/prompts/gen/{name}.md', 'w').write(text)
            queue.append(name)
open(f'{R}/prompts/gen-queue.txt', 'w').write('\n'.join(queue) + '\n')
print(f'{R}: {len(tasks)} tasks, {len(queue)} prompts, samples {samples}')
