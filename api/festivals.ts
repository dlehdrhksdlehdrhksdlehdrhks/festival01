import { FALLBACK_FESTIVALS } from '../src/data/fallbackFestivals';
import { FestivalItem, RawFestivalItem, FestivalStatus } from '../src/types';

// Default service key provided by user if env var is not explicitly set
const DEFAULT_SERVICE_KEY = 'q3e4QbwXW%2Fto8HK95PCVl%2BE9YtSajlZDOXgS3P%2F6v2U6Tb%2BnGAHP%2BzQRMehofJi29FiazWuU6qaLn6TwRGsCiA%3D%3D';

function parseFestivalDates(usageDayStr: string): { startDate?: string; endDate?: string } {
  if (!usageDayStr) return {};

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

function calculateStatus(startDate?: string, endDate?: string): FestivalStatus {
  if (!startDate || !endDate) return 'ALWAYS';

  const todayStr = new Date().toISOString().split('T')[0];
  if (todayStr >= startDate && todayStr <= endDate) {
    return 'ONGOING';
  } else if (todayStr < startDate) {
    return 'UPCOMING';
  } else {
    return 'ENDED';
  }
}

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
    title: title.replace(/<[^>]*>?/gm, ''),
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

export default async function handler(req: any, res: any) {
  try {
    const rawServiceKey =
      process.env.BUSAN_FESTIVAL_SERVICE_KEY ||
      process.env.PUBLIC_DATA_API_KEY ||
      process.env.SERVICE_KEY ||
      process.env.VITE_BUSAN_FESTIVAL_SERVICE_KEY ||
      DEFAULT_SERVICE_KEY;

    let serviceKey = rawServiceKey;
    try {
      if (rawServiceKey.includes('%')) {
        serviceKey = decodeURIComponent(rawServiceKey);
      }
    } catch (e) {
      serviceKey = rawServiceKey;
    }

    const apiUrl = `https://apis.data.go.kr/6260000/FestivalService/getFestivalKr?serviceKey=${encodeURIComponent(serviceKey)}&pageNo=1&numOfRows=150&resultType=json`;

    let festivalItems: FestivalItem[] = [];
    let source: 'api' | 'fallback' = 'fallback';

    try {
      const apiResponse = await fetch(apiUrl, {
        headers: { Accept: 'application/json' },
        signal: AbortSignal.timeout(6000),
      });

      if (apiResponse.ok) {
        const text = await apiResponse.text();
        try {
          const json = JSON.parse(text);
          const items = json?.getFestivalKr?.item;
          if (Array.isArray(items) && items.length > 0) {
            festivalItems = items.map((raw: RawFestivalItem, idx: number) => normalizeRawItem(raw, idx));
            source = 'api';
          }
        } catch (e) {
          console.warn('Response from data.go.kr was not JSON:', text.slice(0, 200));
        }
      }
    } catch (fetchErr) {
      console.warn('Fetch from data.go.kr failed:', fetchErr);
    }

    if (festivalItems.length === 0) {
      festivalItems = [...FALLBACK_FESTIVALS];
      source = 'fallback';
    } else {
      const existingTitles = new Set(festivalItems.map((f) => f.title));
      for (const fbItem of FALLBACK_FESTIVALS) {
        if (!existingTitles.has(fbItem.title)) {
          festivalItems.push(fbItem);
        }
      }
    }

    return res.status(200).json({
      success: true,
      count: festivalItems.length,
      source: source,
      data: festivalItems,
    });
  } catch (err: any) {
    return res.status(200).json({
      success: true,
      count: FALLBACK_FESTIVALS.length,
      source: 'fallback',
      data: FALLBACK_FESTIVALS,
      error: err?.message || 'Server error, used fallback data',
    });
  }
}
