# 📌 [PRD] 부산 축제 가이드 (Busan Festival Guide)

## 1. 프로젝트 개요 (Overview)
- **앱 이름**: 부산 축제 가이드 (Busan Festival Guide)
- **목적**: 부산광역시 16개 구·군의 사계절 문화·해양·예술 축제 및 행사 정보를 한눈에 조회, 검색, 필터링하고 지도 및 달력 뷰로 손쉽게 탐색할 수 있는 웹 서비스
- **주요 대상**: 부산 지역 주민, 관광객, 문화 행사 방문 예정자
- **배포 플랫폼**: Vercel 및 Cloud Run 컨테이너 지원

---

## 2. 환경 변수 설정 가이드 (Environment Variables)

Vercel 또는 프로젝트 환경 설정(`Settings -> Environment Variables`) 등록 시 아래 **변수명 중 하나**를 선택하여 공공데이터포털(data.go.kr) API 키를 설정하시면 됩니다.

| 권장 여부 | 환경 변수명 (Key Name) | 설명 및 예시 |
| :--- | :--- | :--- |
| **권장 (Primary)** | `BUSAN_FESTIVAL_SERVICE_KEY` | 부산 축제 API 전용 키 (`q3e4QbwXW...`) |
| **대체 지원 (Secondary)** | `PUBLIC_DATA_API_KEY` | 공공데이터포털 범용 키 |
| **대체 지원** | `SERVICE_KEY` | 범용 서비스 키 |
| **대체 지원** | `API_KEY` | 범용 API 키 |

> 💡 **참고 사항**:
> - API 키에 `%2F`, `%2B` 등 인코딩된 문자가 포함되어 있더라도 서버 핸들러에서 자동 디코딩 및 재인코딩 조합 시도를 수행하여 연동 성공률을 극대화합니다.
> - 환경 변수가 입력되지 않았거나 API 서버 장애 시, 준비된 부산 대표 축제 폴백(Fallback) 데이터로 자동 전환되어 서비스 연속성을 유지합니다.

---

## 3. 핵심 기능 (Key Features)

### 3.1 상단 글로벌 네비게이션
- **외부 홈 이동**: 상단 헤더의 `[홈]` 버튼 클릭 시 설정된 외부 사이트(`https://dlehdrhksdlehdrhksdlehdrhks.github.io/AI2026/index.html`)로 현재 탭에서 즉시 이동
- **상태 배지**: 전체 축제 수, 진행 중, 개최 예정 및 북마크 등록 수 실시간 카운트 배지 제공
- **데이터 출처 표시**: 공공데이터 API 연동 성공 여부(`API 연동 성공` vs `추천 데이터 모드`) 실시간 인디케이터 제공

### 3.2 검색 및 다중 필터링
- **키워드 검색**: 축제명, 장소, 주요 상세 내용 기반 실시간 텍스트 검색
- **구/군 지역 필터**: 부산시 16개 구·군(해운대구, 수영구, 부산진구 등) 단일/전체 선택 필터
- **날짜 필터**: 전체 일정, 오늘, 이번 주, 8월 전체, 진행 중, 개최 예정, 날짜 직접 지정(Custom Date Picker) 지원
- **카테고리 필터**: 문화/예술, 해변/바다, 야경/불꽃, 먹거리/음식, 역사/체험, 음악/공연 분류

### 3.3 다양한 데이터 뷰 (Multi-View)
1. **카드 뷰 (Grid Card View)**: 고화질 썸네일 이미지, 카테고리 태그, 축제 기간, 장소, 상태 배지(진행중/개최예정/종료) 및 세부 정보 모달
2. **달력 뷰 (Calendar View)**: 월별 축제 일정을 직관적인 캘린더 그리드 상에 이벤트 바 형태로 시각화
3. **지도 뷰 (Interactive Map View)**: 부산 지역 위경도 위치 마커 표시 및 인터랙티브 포커싱
4. **목록 뷰 (Table/List View)**: 축제 정보를 한눈에 파악하기 쉬운 리스트 형태 배치

### 3.4 북마크 및 폴백(Fallback) 보장
- **관심 축제 북마크**: `localStorage` 기반 관심 축제 저장 및 모아보기
- **안전 장치 (Graceful Degradation)**: API 연동 실패 시 고화질 이미지와 위치 정보가 포함된 20+개의 부산 대표 축제 추천 데이터를 자동으로 로드하며, 상단 알림 바를 통해 상태 알림 및 'API 재연동 시도' 버튼 제공

---

## 4. 기술 스택 (Tech Stack)

- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide React Icons, Motion (Framer Motion)
- **Build System**: Vite, Esbuild
- **Backend / API Router**: Express.js (로컬 개발 및 컨테이너) + Vercel Serverless Functions (`/api/festivals.ts`)
- **데이터 출처**: 공공데이터포털(data.go.kr) 부산광역시 축제 행사 정보 API (`FestivalService/getFestivalKr`)

---

## 5. 프로젝트 파일 구조 (Directory Structure)

```text
├── api/
│   └── festivals.ts              # Vercel Serverless API 엔드포인트
├── src/
│   ├── components/
│   │   ├── Header.tsx            # 상단 헤더 & 외부 홈 이동 버튼
│   │   ├── FilterSection.tsx     # 지역/날짜/카테고리 필터
│   │   ├── CardView.tsx          # 축제 카드 그리드
│   │   ├── CalendarView.tsx      # 월별 달력 뷰
│   │   ├── MapView.tsx           # 지도 뷰
│   │   ├── ListView.tsx          # 리스트 뷰
│   │   └── FestivalDetailModal.tsx # 세부 정보 모달
│   ├── data/
│   │   ├── fallbackFestivals.ts  # 백업 오프라인 추천 데이터
│   │   └── busanDistricts.ts     # 부산 16개 구/군 목록
│   ├── types.ts                  # TypeScript 인터페이스 정의
│   ├── App.tsx                   # 메인 어플리케이션 상태 관리
│   └── main.tsx
├── server.ts                     # Node.js/Express 커스텀 서버
├── vercel.json                   # Vercel 배포 빌드 설정
├── .env.example                  # 환경 변수 가이드 문서
└── PRD.md                        # 본 제품 요구사항 문서
```

---

## 6. 배포 방법 (Deployment Instructions)

### Vercel 배포 절차
1. GitHub 리포지토리를 Vercel에 연결합니다.
2. Vercel 대시보드의 **Settings -> Environment Variables**로 이동합니다.
3. Key에 `BUSAN_FESTIVAL_SERVICE_KEY` (또나 `PUBLIC_DATA_API_KEY`), Value에 공공데이터포털 API 키를 입력합니다.
4. 배포(Deploy)를 실행하면 `/api/festivals` 무서버 함수와 프론트엔드가 자동으로 빌드되어 배포됩니다.
