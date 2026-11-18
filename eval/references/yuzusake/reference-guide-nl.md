status: approved
approval: Owner-approved yuzusake deck, approved 2026-11-12 (SAK-824; copyskills eval brief of 2026-11-17)
use: held-out parity reference. Reference for yuzusake-04 (serving article, NL): the strings about definition, cold, mixing and food. Never shown to a generator or to the task file.
source: /Users/steve/Projects/sakebase/platform/apps/yuzusake/src/content/nl/guide.ts (exact excerpt, TypeScript syntax kept)

```ts
  title: 'Wat is yuzusake? Zo serveer, mix en proef je het',
  description: 'Yuzusake (yuzushu) is Japanse sake gemengd met yuzusap: zurig, bloemig, een tikje bitter. Hoe koud je het serveert, hoe je het 1:2 mixt met bruiswater, en hoe het smaakt.',
  h1: ['Wat is', 'yuzu', 'sake?'],
  oneLineLabel: 'In één zin:',
  oneLine: 'yuzusake (yuzushu) is Japanse sake of shōchū gemengd met het sap van yuzu, een geurige citrusvrucht. Zurig, bloemig, een tikje bitter. Geen citroen.',
  strength: {
    shelf: 'Meestal 7–14% alcohol. De onze: {range}{free}. Het lekkerst koud of met bruiswater.',
    none: 'Meestal 7–14% alcohol. Het lekkerst koud of met bruiswater.',
    free: { one: ', plus één alcoholvrije yuzudrank', other: ', plus {n} alcoholvrije yuzudranken' },
  },
  chapters: [
    {
      id: 'what',
      title: 'Wat het is',
      q: 'Wat is yuzusake?',
      a: 'Brouwers persen verse yuzu en mengen het sap met sake, soms met wat suiker. Sommigen, zoals Kozaemon, nemen een junmai-basis voor een drogere afdronk waarin je de rijst proeft; anderen gaan zoeter en sappiger.',
    },
    {
      id: 'cold',
      title: 'Hoe koud',
      q: 'Hoe koud serveer je yuzusake?',
      a: 'Zo uit de koelkast, 5–10 °C, puur in een klein glas of op ijs. Eenmaal open bewaar je de fles in de koelkast; dan blijft hij ongeveer een maand goed.',
    },
    {
      id: 'mix',
      title: 'Hoe je mixt',
      q: 'Hoe mix je yuzusake?',
      a: '1 deel yuzusake : 2 delen bruiswater. Veel ijs.',
    },
    {
      id: 'taste',
      title: 'Hoe het smaakt',
      q: 'Wat eet je bij yuzusake?',
      a: 'Alles wat gefrituurd is (ja, bitterballen), sushi en sashimi, geitenkaas en citroentaart. Vooruit, één citroen mag.',
    },
  ],
  cold: {
    giant: ['5–10°C'],
    giantSr: 'Serveren op 5 tot 10 °C',
    facts: [
      ['Puur', 'Een klein glas, koelkastkoud'],
      ['Op ijs', 'Eén groot ijsblok of een vol glas'],
      ['Open', 'In de koelkast, ongeveer een maand'],
    ],
  },
  mix: {
    giant: ['1:2'],
    glass: { top: ['bruis-', 'water'], bottom: ['yuzu-', 'sake'] },
    poursTitle: 'Drie manieren om te schenken',
    pours: [
      { title: 'Yuzu-highball', body: 'Een hoog glas vol ijs, aangevuld met bruiswater.', note: 'de klassieker' },
      { title: 'Eén groot ijsblok', body: 'Over één groot ijsblok. Hij opent zich terwijl het ijs smelt.', note: 'de rustige' },
      { title: 'In een flute', body: 'De mousserende, koelkastkoud. Geen ijs, geen bruiswater nodig.', note: 'de bruisende' },
    ],
  },
  taste: {
    giant: ['Geen', 'citroen.'],
    tableCaption: 'Yuzu vergeleken met citroen',
    traitHead: 'Kenmerk',
    yuzu: 'Yuzu',
    lemon: 'Citroen',
    traits: [
      ['Geur', 'Bloemig, mandarijn, den', 'Fris, helder'],
      ['Smaak', 'Zurig, met een bittere schil in de afdronk', 'Zuur'],
      ['Sap', 'Heel weinig per vrucht', 'Veel'],
      ['Groeit in', 'Japan (Kōchi), Korea, China', 'Overal waar het warm is'],
    ],
    eatTitle: 'Wat eet je erbij',
    /** The whole page is Dutch here; the word keeps its lang="nl" span, which changes nothing. */
    dutchWord: 'bitterballen',
  },
```
