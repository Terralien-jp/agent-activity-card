const accents = ['#efa67d', '#8ad9ae', '#b9a7fc', '#e4cc7b'];
const full = new Intl.NumberFormat('en-US');
const short = new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 });
const xmlEntities = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' };

function escapeXml(text) {
  return text.replace(/[&<>"']/g, character => xmlEntities[character]);
}

function isCount(value) {
  return Number.isSafeInteger(value) && value >= 0;
}

export function renderUsageCard({ sample, agents } = {}) {
  if (typeof sample !== 'boolean' || !Array.isArray(agents) || !agents.length) {
    throw new Error('Provide a boolean sample flag and a non-empty agents array.');
  }
  for (const row of agents) {
    if (typeof row?.name !== 'string' || !row.name.trim()
      || (row.tokens !== null && !isCount(row.tokens))
      || ![row.conversations, row.requests, row.success].every(isCount) || row.success > row.requests) {
      throw new Error('Each agent needs a name, token count or null, and non-negative conversation, request and success counts.');
    }
  }

  const maxTokens = Math.max(1, ...agents.map(row => row.tokens ?? 0));
  const panelWidth = Math.max(450, 36 + agents.length * 272);
  const firstCardX = (panelWidth - (agents.length * 272 - 12)) / 2;
  const badge = sample ? 'SAMPLE DATA' : 'RECORDED USAGE';
  const description = agents.map(row => `${escapeXml(row.name)}, ${row.tokens === null ? 'unmeasured' : full.format(row.tokens)} tokens, ${row.conversations} conversations, ${row.requests} requests.`).join(' ');
  const cards = agents.map((row, index) => {
    const width = Math.round(234 * (row.tokens ?? 0) / maxTokens);
    const accent = accents[index % accents.length];
    const nameSize = Math.min(15, 213 / [...row.name].length);
    return `<g transform="translate(${firstCardX + index * 272}, 84)">
  <rect width="260" height="173" rx="12" fill="#1a2923" stroke="#31463c"/>
  <circle cx="16" cy="24" r="4" fill="${accent}"/>
  <text x="28" y="29" font-size="${nameSize}" font-weight="650">${escapeXml(row.name)}</text>
  <text x="13" y="70" font-size="33" font-weight="700">${row.tokens === null ? '—' : short.format(row.tokens)}</text>
  <text x="15" y="91" class="secondary">Input + output tokens</text>
  <rect x="13" y="103" width="234" height="4" rx="2" fill="#344c40"/>
  <rect x="13" y="103" width="${width}" height="4" rx="2" fill="${accent}"/>
  <text x="15" y="130" class="secondary">Conversations</text>
  <text x="245" y="130" class="value">${full.format(row.conversations)}</text>
  <text x="15" y="153" class="secondary">Requests · successful</text>
  <text x="245" y="153" class="value">${full.format(row.requests)} · ${full.format(row.success)}</text>
</g>`;
  }).join('\n');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${panelWidth} 280" width="${panelWidth}" height="280" role="img" aria-labelledby="heading description">
  <title id="heading">Agent activity · ${badge}</title>
  <desc id="description">${description}</desc>
  <style>
    text { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; fill: #f0f6ef; }
    .secondary { fill: #b4c8bc; font-size: 12px; }
    .value { font-size: 13px; font-weight: 650; text-anchor: end; }
    .badge { fill: #d5e6da; text-anchor: middle; font-size: 10px; font-weight: 650; letter-spacing: 1px; }
  </style>
  <rect width="${panelWidth}" height="280" rx="16" fill="#111d18"/>
  <text x="24" y="48" font-size="28" font-weight="700">Agent activity</text>
  <rect x="${panelWidth - 168}" y="28" width="144" height="26" rx="13" fill="#304639"/>
  <text x="${panelWidth - 96}" y="45" class="badge">${badge}</text>
  ${cards}
</svg>
`;
}
