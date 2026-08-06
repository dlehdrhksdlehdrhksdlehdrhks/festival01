import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { FALLBACK_FESTIVALS } from './src/data/fallbackFestivals.js';
import { FestivalItem, RawFestivalItem, FestivalStatus } from './src/types.js';

// Default service key provided by user if env var is not explicitly set
const DEFAULT_SERVICE_KEY = 'q3e4QbwXW%2Fto8HK95PCVl%2BE9YtSajlZDOXgS3P%2F6v2U6Tb%2BnGAHP%2BzQRMehofJi29FiazWuU6qaLn6TwRGsCiA%3D%3D';

// Helper function to normalize dates (e.g., "2026.08.01~2026.08.15" -> ["2026-08-01", "2026-08-15"])
function parseFestivalDates(usageDayStr: string): { startDate?: string; endDate?: string } {
  if (!usageDayStr) return {};

  // Extract all 8-digit or dot-separated dates like 2026.10.01 or 2026-10-01 or 20261001
  const matches = usageDayStr.match(/\d{4}[\.\-\/]?\d{2}[\.\-\/]?\d{2}/g);
  if (matches && matches.length >= 1) {
    const cleanDate = (d: string) => {
      const numbers = d.replace(/\D/g, '');
      if (numbers.length === 8) {
        return `${numbers.slice(0, 4)}-${numbers.slice(4, 6)}-${numbers.slice(6, 8)}`;
      }
      return d;
    };

    const startDate = cleanDate(matches[0]);
    const endDate = matches.length > 1 ? cleanDate(matches[matches.length - 1]) : startDate;
    return { startDate, endDate };
  }

  return {};
}

// Calculate status based on today's date (2026-08-04)
function calculateStatus(startDate?: string, endDate?: string): FestivalStatus {
  if (!startDate || !endDate) return 'ALWAYS';

  const todayStr = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  if (todayStr >= startDate && todayStr <= endDate) {
    return 'ONGOING';
  } else if (todayStr < startDate) {
    return 'UPCOMING';
  } else {
    return 'ENDED';
  }
}

// Infer category from title/contents
function inferCategory(title: string, contents: string, gugun: string): string {
  const text = (title + ' ' + contents + ' ' + gugun).toLowerCase();
  if (text.includes('불꽃') || text.includes('야경') || text.includes('드론')) return '야경/불꽃';
  if (text.includes('영화') || text.includes('미술') || text.includes('비엔날레') || text.includes('연등') || text.includes('골목')) return '문화/예술';
  if (text.includes('바다') || text.includes('해수욕장') || text.includes('모래') || text.includes('항구') || text.includes('어방')) return '해변/바다';
  if (text.includes('먹거리') || text.includes('자갈치') || text.includes('파전') || text.includes('음식') || text.includes('수산')) return '먹거리/음식';
  if (text.includes('역사') || text.includes('읍성') || text.includes('다리') || text.includes('전통') || text.includes('박물관')) return '역사/체험';
  if (text.includes('록') || text.includes('음악') || text.includes('콘서트') || text.includes('가요제') || text.includes('밴드')) return '음악/공연';
  return '문화/예술';
}

function normalizeRawItem(raw: RawFestivalItem, index: number): FestivalItem {
  const usageDay = raw.USAGE_DAY || raw.USAGE_DAY_WEEK_AND_TIME || '';
  const { startDate, endDate } = parseFestivalDates(usageDay);
  const title = raw.TITLE || raw.MAIN_TITLE || '부산 축제';
  const contents = raw.ITEMCNTNTS || raw.SUBTITLE || '';
  const district = raw.GUGUN_NM || '부산전체';

  const lat = raw.LAT ? parseFloat(String(raw.LAT)) : 35.179558;
  const lng = raw.LNG ? parseFloat(String(raw.LNG)) : 129.075641;

  return {
    id: raw.UC_SEQ ? String(raw.UC_SEQ) : `api-fest-${index}`,
    title: title.replace(/<[^>]*>?/gm, ''), // strip HTML tags if any
    district: district,
    homepageUrl: raw.HOMEPAGE_URL || '',
    tel: raw.TEL_NO || '051-120',
    usageDay: usageDay,
    usageTime: raw.USAGE_DAY_WEEK_AND_TIME || '상세 정보 참조',
    place: raw.MAIN_PLACE || raw.ADDR1 || '부산광역시 일원',
    address: raw.ADDR1 || '부산광역시',
    detailedAddress: raw.ADDR2 || '',
    mainTitle: raw.MAIN_TITLE || title,
    subtitle: raw.SUBTITLE || '',
    imgNormal: raw.MAIN_IMG_NORMAL || raw.MAIN_IMG_THUMB || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
    imgThumb: raw.MAIN_IMG_THUMB || raw.MAIN_IMG_NORMAL || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80',
    contents: contents.replace(/<[^>]*>?/gm, ''),
    lat: isNaN(lat) || lat === 0 ? 35.179558 : lat,
    lng: isNaN(lng) || lng === 0 ? 129.075641 : lng,
    fee: raw.USAGE_AMOUNT || '무료 또는 세부 정보 확인',
    notes: raw.MIDDLE_SIZE_RM1 || '',
    startDate: startDate,
    endDate: endDate,
    status: calculateStatus(startDate, endDate),
    category: inferCategory(title, contents, district),
  };
}

function parseXmlItems(xmlText: string): RawFestivalItem[] {
  const items: RawFestivalItem[] = [];
  const itemMatches = xmlText.match(/<item>([\s\S]*?)<\/item>/gi);
  if (!itemMatches) return items;

  for (const itemXml of itemMatches) {
    const rawObj: Record<string, any> = {};
    const inner = itemXml.replace(/^<item>/i, '').replace(/<\/item>$/i, '');
    const tagRegex = /<([A-Za-z0-9_]+)>(?:<!\[CDATA\[([\s\S]*?)\]\]>|([\s\S]*?))<\/\1>/gi;
    let match;
    while ((match = tagRegex.exec(inner)) !== null) {
      const tag = match[1];
      const val = (match[2] !== undefined ? match[2] : match[3]).trim();
      rawObj[tag] = val;
    }
    if (Object.keys(rawObj).length > 0) {
      items.push(rawObj as RawFestivalItem);
    }
  }
  return items;
}

function getServiceKeyCandidates(): string[] {
  const possibleEnvNames = [
    process.env.BUSAN_FESTIVAL_SERVICE_KEY,
    process.env.PUBLIC_DATA_API_KEY,
    process.env.SERVICE_KEY,
    process.env.API_KEY,
    process.env.BUSAN_API_KEY,
    process.env.DATA_GO_KR_KEY,
    process.env.PUBLIC_API_KEY,
    process.env.VITE_BUSAN_FESTIVAL_SERVICE_KEY,
    process.env.VITE_PUBLIC_DATA_API_KEY,
    process.env.VITE_SERVICE_KEY,
    process.env.VITE_API_KEY,
    process.env.NEXT_PUBLIC_BUSAN_FESTIVAL_SERVICE_KEY,
    process.env.NEXT_PUBLIC_PUBLIC_DATA_API_KEY,
    process.env.NEXT_PUBLIC_SERVICE_KEY,
    process.env.NEXT_PUBLIC_API_KEY,
    DEFAULT_SERVICE_KEY,
  ];

  const keys: string[] = [];
  for (const v of possibleEnvNames) {
    if (v && typeof v === 'string' && v.trim() !== '' && !keys.includes(v.trim())) {
      keys.push(v.trim());
    }
  }
  return keys;
}

async function fetchFromDataGoKr(): Promise<{ items: RawFestivalItem[]; keyUsed: string } | null> {
  const candidateKeys = getServiceKeyCandidates();

  for (const rawKey of candidateKeys) {
    const urlVariants: string[] = [];

    // 1. Raw Key (for URL-encoded keys like '...%2F...')
    urlVariants.push(`https://apis.data.go.kr/6260000/FestivalService/getFestivalKr?serviceKey=${rawKey}&pageNo=1&numOfRows=150&resultType=json`);

    // 2. Encoded Key (for raw decoding keys containing +, /, =)
    try {
      const decoded = rawKey.includes('%') ? decodeURIComponent(rawKey) : rawKey;
      const reEncoded = encodeURIComponent(decoded);
      const url = `https://apis.data.go.kr/6260000/FestivalService/getFestivalKr?serviceKey=${reEncoded}&pageNo=1&numOfRows=150&resultType=json`;
      if (!urlVariants.includes(url)) {
        urlVariants.push(url);
      }
    } catch (e) {}

    for (const apiUrl of urlVariants) {
      try {
        const apiResponse = await fetch(apiUrl, {
          headers: {
            'Accept': 'application/json, text/xml, */*',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          },
          signal: AbortSignal.timeout(15000),
        });

        if (apiResponse.ok) {
          const text = await apiResponse.text();

          let items: RawFestivalItem[] = [];
          try {
            const json = JSON.parse(text);
            items = json?.getFestivalKr?.item || [];
          } catch (e) {
            items = parseXmlItems(text);
          }

          if (Array.isArray(items) && items.length > 0) {
            return { items, keyUsed: rawKey };
          }
        }
      } catch (err) {
        // Try next URL variant
      }
    }
  }

  return null;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API endpoint for Busan Festival data
  app.get('/api/festivals', async (req, res) => {
    try {
      const apiResult = await fetchFromDataGoKr();

      let festivalItems: FestivalItem[] = [];
      let source: 'api' | 'fallback' = 'fallback';

      if (apiResult && apiResult.items.length > 0) {
        festivalItems = apiResult.items.map((raw: RawFestivalItem, idx: number) => normalizeRawItem(raw, idx));
        source = 'api';
        console.log(`Successfully fetched ${festivalItems.length} festival items from data.go.kr`);
      } else {
        festivalItems = [...FALLBACK_FESTIVALS];
        source = 'fallback';
      }

      if (source === 'api') {
        const existingTitles = new Set(festivalItems.map((f) => f.title));
        for (const fbItem of FALLBACK_FESTIVALS) {
          if (!existingTitles.has(fbItem.title)) {
            festivalItems.push(fbItem);
          }
        }
      }

      res.json({
        success: true,
        count: festivalItems.length,
        source: source,
        data: festivalItems,
      });
    } catch (err: any) {
      console.error('Error in /api/festivals route:', err);
      res.json({
        success: true,
        count: FALLBACK_FESTIVALS.length,
        source: 'fallback',
        data: FALLBACK_FESTIVALS,
        error: err?.message || 'Server error, used fallback data',
      });
    }
  });

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Serve Vite in development mode or Static files in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Busan Festival Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
