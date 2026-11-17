status: approved
approval: Owner-approved yuzusake deck, approved 2026-11-12 (SAK-824; copyskills eval brief of 2026-11-17)
use: held-out parity reference. Reference for yuzusake-01 (Heiwa, EN). Never shown to a generator or to the task file.
source: /Users/steve/Projects/sakebase/platform/apps/yuzusake/src/content/en/bottles.ts (exact excerpt, TypeScript syntax kept)

```ts
  heiwa: {
    word: 'Juicy',
    tags: ['yuzu', 'juicy', 'bitter', 'sweet', 'wakayama', 'gift'],
    vibe: {
      title: ['Bitter\u00ADsweet.'],
      line: 'You like it round with an edge. Heiwa is juicy, with a bitter peel finish. Best fridge-cold.',
      lineAnyServe: 'You like it round with an edge. Heiwa is juicy, with a bitter peel finish.',
    },
    says: 'A long dinner? {name}, one part to two of soda, over ice.',
    callouts: ['juicy', 'bitter peel', 'best fridge-cold'],
    notesHeading: 'Yuzu, juicy, bitter peel.',
    notes: [
      { name: 'Yuzu', line: 'the fruit', icon: 'citrus' },
      { name: 'Juicy', line: 'the middle', icon: 'drop' },
      { name: 'Bitter peel', line: 'the finish', icon: 'peel' },
    ],
    // The brief: "Best fridge-cold". So the best serve is neat from the fridge; the house highball is second.
    serves: [
      { rank: 'best', name: 'Neat, fridge-cold', glass: 'small' },
      { rank: 'great', name: 'Highball 1:2', how: 'Long and fizzy, the house serve.', glass: 'highball' },
      { rank: 'good', name: 'On the rocks', how: 'One big cube. Let it sit a minute.', glass: 'highball' },
    ],
    moment: 'A long dinner',
    dialNote: 'Heiwa is the juicy one.',
  },
```
