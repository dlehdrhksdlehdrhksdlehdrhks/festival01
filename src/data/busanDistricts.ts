export interface BusanDistrict {
  name: string;
  engName: string;
  lat: number;
  lng: number;
  description: string;
  badgeColor?: string;
}

export const BUSAN_DISTRICTS: BusanDistrict[] = [
  { name: '강서구', engName: 'Gangseo-gu', lat: 35.2122, lng: 128.9806, description: '낙동강 하구, 벚꽃과 가덕도 해양 문화' },
  { name: '금정구', engName: 'Geumjeong-gu', lat: 35.2431, lng: 129.0921, description: '금정산성과 범어사, 산성 문화 축제' },
  { name: '기장군', engName: 'Gijang-gun', lat: 35.2446, lng: 129.2224, description: '기장 멸치, 미역, 오시리아 해양 관광' },
  { name: '남구', engName: 'Nam-gu', lat: 35.1363, lng: 129.0844, description: 'UN기념공원, 오륙도, 박물관 문화' },
  { name: '동구', engName: 'Dong-gu', lat: 35.1294, lng: 129.0454, description: '부산역, 차이나타운, 초량 이바구길' },
  { name: '동래구', engName: 'Dongnae-gu', lat: 35.2048, lng: 129.0838, description: '동래 온천, 동래읍성 역사 축제' },
  { name: '부산진구', engName: 'Busanjin-gu', lat: 35.1631, lng: 129.0532, description: '서면 중심가, 전포카페거리, 연등축제' },
  { name: '북구', engName: 'Buk-gu', lat: 35.1972, lng: 128.9902, description: '낙동강 감동진, 생태공원 행사' },
  { name: '사상구', engName: 'Sasang-gu', lat: 35.1526, lng: 128.9912, description: '삼락생태공원, 벚꽃 및 록 페스티벌' },
  { name: '사하구', engName: 'Saha-gu', lat: 35.1045, lng: 128.9748, description: '다대포 꿈의 낙조분수, 감천문화마을' },
  { name: '서구', engName: 'Seo-gu', lat: 35.0979, lng: 129.0244, description: '송도해수욕장, 송도 고등어 축제' },
  { name: '수영구', engName: 'Suyeong-gu', lat: 35.1456, lng: 129.1132, description: '광안리해수욕장, 불꽃축제, 어방축제' },
  { name: '연제구', engName: 'Yeonje-gu', lat: 35.1763, lng: 129.0797, description: '연산동 고분군, 온천천 시민공원' },
  { name: '영도구', engName: 'Yeongdo-gu', lat: 35.0912, lng: 129.0678, description: '태종대, 영도다리 축제, 흰여울문화마을' },
  { name: '중구', engName: 'Jung-gu', lat: 35.1062, lng: 129.0324, description: '남포동, 자갈치시장 축제, 용두산공원' },
  { name: '해운대구', engName: 'Haeundae-gu', lat: 35.1631, lng: 129.1636, description: '해운대 모래축제, 부산국제영화제, 센텀시티' },
];

export const FESTIVAL_CATEGORIES = [
  '전체',
  '문화/예술',
  '해변/바다',
  '야경/불꽃',
  '먹거리/음식',
  '역사/체험',
  '음악/공연',
];
