import type {
  ClientId,
  ClientCompatibility,
  CSSCompatibilityRule,
  Warning,
} from '@email-renderer/types';

interface CanIEmailData {
  api_version: string;
  last_update_date: string;
  nicenames: {
    family: Record<string, string>;
    platform: Record<string, string>;
    support: Record<string, string>;
    category: Record<string, string>;
  };
  data: Array<{
    slug: string;
    title: string;
    description: string;
    category: string;
    stats: Record<string, Record<string, Record<string, string>>>;
    notes: string | null;
    notes_by_num: Record<string, string>;
  }>;
}

type SupportStatus = 'y' | 'n' | 'a' | 'u';

interface ClientPlatformMapping {
  family: string;
  platform: string;
}

const CLIENT_MAPPINGS: Record<ClientId, ClientPlatformMapping> = {
  'gmail-web': { family: 'gmail', platform: 'desktop-webmail' },
  'apple-mail': { family: 'apple-mail', platform: 'macos' },
  'outlook-win': { family: 'outlook', platform: 'windows' },
  'yahoo-mail': { family: 'yahoo', platform: 'desktop-webmail' },
};

let cachedData: CanIEmailData | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 24 * 60 * 60 * 1000;

async function fetchCanIEmailData(): Promise<CanIEmailData> {
  const now = Date.now();

  if (cachedData && now - cacheTimestamp < CACHE_DURATION) {
    return cachedData;
  }

  try {
    const response = await fetch('https://www.caniemail.com/api/data.json');
    if (!response.ok) {
      throw new Error(`Failed to fetch caniemail data: ${response.statusText}`);
    }

    const data = (await response.json()) as CanIEmailData;
    cachedData = data;
    cacheTimestamp = now;
    return data;
  } catch (error) {
    if (cachedData) {
      return cachedData;
    }
    throw error;
  }
}

function getLatestVersion(
  stats: Record<string, string>,
): { version: string; status: string; noteRefs: string[] } | null {
  const versions = Object.keys(stats).sort().reverse();
  if (versions.length === 0) return null;

  const latestVersion = versions[0];
  const statusValue = stats[latestVersion];
  const statusMatch = statusValue.match(/^([ynau])(?:\s+(.+))?$/);

  if (!statusMatch) return null;

  const status = statusMatch[1] as SupportStatus;
  const noteRefs = statusMatch[2]
    ? statusMatch[2].split(/\s+/).filter((ref) => ref.startsWith('#'))
    : [];

  return { version: latestVersion, status, noteRefs };
}

function getSupportStatus(
  data: CanIEmailData,
  clientId: ClientId,
  slug: string,
): { status: SupportStatus; noteRefs: string[] } | null {
  const mapping = CLIENT_MAPPINGS[clientId];
  if (!mapping) {
    console.warn(`[CANIEMAIL] No mapping found for clientId: ${clientId}`);
    return null;
  }

  const feature = data.data.find((item) => item.slug === slug);
  if (!feature) return null;

  let familyStats = feature.stats[mapping.family];

  if (!familyStats && clientId === 'yahoo-mail') {
    familyStats = feature.stats['yahoo-mail'] || feature.stats['yahoo'];
    if (familyStats) {
      console.log(`[CANIEMAIL] Yahoo Mail: Using fallback family identifier for slug "${slug}"`);
    }
  }

  if (!familyStats) {
    if (clientId === 'yahoo-mail') {
      const availableFamilies = Object.keys(feature.stats);
      console.warn(
        `[CANIEMAIL] Yahoo Mail: Family "${mapping.family}" not found for slug "${slug}". Available families: ${availableFamilies.join(', ')}`,
      );
    }
    return null;
  }

  let platformStats = familyStats[mapping.platform];

  if (!platformStats && clientId === 'yahoo-mail') {
    platformStats = familyStats['webmail'] || familyStats['desktop'];
    if (platformStats) {
      console.log(`[CANIEMAIL] Yahoo Mail: Using fallback platform identifier for slug "${slug}"`);
    }
  }

  if (!platformStats) {
    if (clientId === 'yahoo-mail') {
      const availablePlatforms = Object.keys(familyStats);
      console.warn(
        `[CANIEMAIL] Yahoo Mail: Platform "${mapping.platform}" not found for slug "${slug}". Available platforms: ${availablePlatforms.join(', ')}`,
      );
    }
    return null;
  }

  const latest = getLatestVersion(platformStats);
  if (!latest) return null;

  return { status: latest.status as SupportStatus, noteRefs: latest.noteRefs as string[] };
}

function normalizeCSSProperty(property: string): string {
  return property.replace(/^css-/, '').replace(/-/g, '-').toLowerCase();
}

function extractCSSPropertyFromSlug(slug: string): string | null {
  if (!slug.startsWith('css-')) return null;

  const property = slug.replace(/^css-/, '');
  return property.replace(/-/g, '-');
}

function createWarningMessage(
  feature: CanIEmailData['data'][0],
  clientId: ClientId,
  status: SupportStatus,
  noteRefs: string[] = [],
): string {
  const mapping = CLIENT_MAPPINGS[clientId];
  const clientName =
    mapping.family === 'gmail'
      ? 'Gmail'
      : mapping.family === 'apple-mail'
        ? 'Apple Mail'
        : mapping.family === 'yahoo-mail'
          ? 'Yahoo Mail'
          : 'Outlook';

  let baseMessage = `CSS property "${feature.title}"`;

  if (status === 'n') {
    baseMessage += ` is not supported in ${clientName}`;
  } else if (status === 'a') {
    baseMessage += ` has partial support in ${clientName}`;
  } else {
    baseMessage += ` support is unknown in ${clientName}`;
  }

  const notes: string[] = [];
  if (feature.notes) {
    notes.push(feature.notes);
  }

  for (const ref of noteRefs) {
    const noteNum = ref.replace('#', '');
    if (feature.notes_by_num && feature.notes_by_num[noteNum]) {
      notes.push(feature.notes_by_num[noteNum]);
    }
  }

  if (notes.length > 0) {
    baseMessage += `. ${notes.join(' ')}`;
  }

  return baseMessage;
}

function severityFromStatus(status: SupportStatus): Warning['severity'] {
  switch (status) {
    case 'n':
      return 'error';
    case 'a':
      return 'warning';
    case 'u':
      return 'info';
    default:
      return 'warning';
  }
}

export async function buildClientCompatibilityFromCanIEmail(
  clientId: ClientId,
): Promise<ClientCompatibility> {
  const data = await fetchCanIEmailData();
  const mapping = CLIENT_MAPPINGS[clientId];

  if (clientId === 'yahoo-mail') {
    const sampleFeature = data.data.find((f) => f.category === 'css');
    if (sampleFeature) {
      const allFamilies = Object.keys(sampleFeature.stats);
      console.log(
        `[CANIEMAIL] Yahoo Mail: Checking data structure. All family keys: ${allFamilies.join(', ')}`,
      );

      const yahooFamily = sampleFeature.stats['yahoo'] || sampleFeature.stats['yahoo-mail'];
      if (yahooFamily) {
        const familyKey = sampleFeature.stats['yahoo'] ? 'yahoo' : 'yahoo-mail';
        console.log(
          `[CANIEMAIL] Yahoo Mail: Found "${familyKey}" family. Platform keys: ${Object.keys(yahooFamily).join(', ')}`,
        );
      } else {
        console.warn(`[CANIEMAIL] Yahoo Mail: No yahoo/yahoo-mail family found in sample feature`);
      }
    }
  }

  const unsupportedProperties: string[] = [];
  const rules: CSSCompatibilityRule[] = [];

  let processedCount = 0;
  let foundCount = 0;

  for (const feature of data.data) {
    if (feature.category !== 'css') continue;
    processedCount++;

    const supportInfo = getSupportStatus(data, clientId, feature.slug);
    if (!supportInfo) continue;
    if (supportInfo.status === 'y') continue;

    foundCount++;
    const property = extractCSSPropertyFromSlug(feature.slug);
    if (!property) continue;

    if (supportInfo.status === 'n') {
      unsupportedProperties.push(property);
    }

    const message = createWarningMessage(
      feature,
      clientId,
      supportInfo.status,
      supportInfo.noteRefs,
    );
    const severity = severityFromStatus(supportInfo.status);

    rules.push({
      pattern: new RegExp(`${property.replace(/-/g, '\\-')}\\s*:`, 'gi'),
      message,
      severity,
    });
  }

  if (clientId === 'yahoo-mail') {
    console.log(
      `[CANIEMAIL] Yahoo Mail: Processed ${processedCount} CSS features, found ${foundCount} compatibility issues`,
    );
  }

  return {
    clientId,
    unsupportedProperties,
    rules,
  };
}

export async function getHTMLCompatibilityRules(
  clientId: ClientId,
): Promise<CSSCompatibilityRule[]> {
  const data = await fetchCanIEmailData();
  const mapping = CLIENT_MAPPINGS[clientId];

  const rules: CSSCompatibilityRule[] = [];

  for (const feature of data.data) {
    if (feature.category !== 'html') continue;

    const supportInfo = getSupportStatus(data, clientId, feature.slug);
    if (!supportInfo || supportInfo.status === 'y') continue;

    const elementName = feature.title.trim().replace(/^<|>$/g, '').toLowerCase();
    if (!elementName) continue;

    const mapping = CLIENT_MAPPINGS[clientId];
    const clientName =
      mapping.family === 'gmail'
        ? 'Gmail'
        : mapping.family === 'apple-mail'
          ? 'Apple Mail'
          : mapping.family === 'yahoo-mail'
            ? 'Yahoo Mail'
            : 'Outlook';

    let message = `HTML element "${elementName}"`;

    if (supportInfo.status === 'n') {
      message += ` is not supported in ${clientName}`;
    } else if (supportInfo.status === 'a') {
      message += ` has partial support in ${clientName}`;
    } else {
      message += ` support is unknown in ${clientName}`;
    }

    const notes: string[] = [];
    if (feature.notes) {
      notes.push(feature.notes);
    }

    for (const ref of supportInfo.noteRefs) {
      const noteNum = ref.replace('#', '');
      if (feature.notes_by_num && feature.notes_by_num[noteNum]) {
        notes.push(feature.notes_by_num[noteNum]);
      }
    }

    if (notes.length > 0) {
      message += `. ${notes.join(' ')}`;
    }

    const severity = severityFromStatus(supportInfo.status);
    const pattern = new RegExp(`<${elementName}[^>]*>|<${elementName}\\s+`, 'gi');

    rules.push({
      pattern,
      message,
      severity,
    });
  }

  return rules;
}
