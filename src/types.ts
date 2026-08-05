export interface RawFestivalItem {
  UC_SEQ?: string | number;
  TITLE?: string;
  GUGUN_NM?: string;
  HOMEPAGE_URL?: string;
  TEL_NO?: string;
  USAGE_DAY?: string;
  USAGE_DAY_WEEK_AND_TIME?: string;
  MAIN_PLACE?: string;
  ADDR1?: string;
  ADDR2?: string;
  MAIN_TITLE?: string;
  SUBTITLE?: string;
  MAIN_IMG_NORMAL?: string;
  MAIN_IMG_THUMB?: string;
  ITEMCNTNTS?: string;
  LAT?: string | number;
  LNG?: string | number;
  USAGE_AMOUNT?: string;
  MIDDLE_SIZE_RM1?: string;
}

export type FestivalStatus = 'ONGOING' | 'UPCOMING' | 'ENDED' | 'ALWAYS';

export interface FestivalItem {
  id: string;
  title: string;
  district: string; // 구/군 (e.g., 해운대구, 수영구)
  homepageUrl: string;
  tel: string;
  usageDay: string; // Raw date string e.g., "2026.10.01~2026.10.05"
  usageTime: string;
  place: string;
  address: string;
  detailedAddress: string;
  mainTitle: string;
  subtitle: string;
  imgNormal: string;
  imgThumb: string;
  contents: string;
  lat: number;
  lng: number;
  fee: string;
  notes: string;
  startDate?: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
  status: FestivalStatus;
  category: string;
}

export type ViewMode = 'grid' | 'calendar' | 'map' | 'list';

export type DateFilterMode = 'all' | 'today' | 'this_week' | 'this_month' | 'ongoing' | 'upcoming' | 'custom';

export interface FilterState {
  district: string; // '전체' or specific district
  dateMode: DateFilterMode;
  selectedDate: string; // YYYY-MM-DD for single date view
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  searchQuery: string;
  category: string;
  sortBy: 'date_asc' | 'date_desc' | 'title' | 'district';
}
