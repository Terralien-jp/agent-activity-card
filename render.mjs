import { readFile, writeFile } from 'node:fs/promises';
import { renderUsageCard } from './card.mjs';

const [input = 'activity.json', output = 'usage.svg'] = process.argv.slice(2);
const activity = JSON.parse(await readFile(input, 'utf8'));
await writeFile(output, renderUsageCard(activity));
console.log(`Wrote ${output}`);
