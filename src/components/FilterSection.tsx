import React from 'react';
import { BUSAN_DISTRICTS, FESTIVAL_CATEGORIES } from '../data/busanDistricts';
import { FilterState, ViewMode, DateFilterMode } from '../types';
import {
  Search,
  MapPin,
  Calendar as CalendarIcon,
  Filter,
  Grid,
  Calendar,
  Map,
  List,
  RotateCcw,
  Sparkles,
  SlidersHorizontal,
} from 'lucide-react';

interface FilterSectionProps {
  filter: FilterState;
  onFilterChange: (updated: Partial<FilterState>) => void;
  onResetFilter: () => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  totalFiltered: number;
}

export const FilterSection: React.FC<FilterSectionProps> = ({
  filter,
  onFilterChange,
  onResetFilter,
  viewMode,
  onViewModeChange,
  totalFiltered,
}) => {
  const dateModeOptions: { id: DateFilterMode; label: string }[] = [
    { id: 'all', label: '전체 일정' },
    { id: 'today', label: '오늘 (8/4)' },
    { id: 'this_week', label: '이번 주' },
    { id: 'this_month', label: '8월 전체' },
    { id: 'ongoing', label: '진행 중' },
    { id: 'upcoming', label: '개최 예정' },
    { id: 'custom', label: '날짜 지정' },
  ];

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border-b border-white/10 shadow-2xl sticky top-[69px] z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 space-y-3.5">
        
        {/* Top Controls: Search Bar + View Mode + Sort */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          {/* Keyword Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-400" />
            <input
              type="text"
              value={filter.searchQuery}
              onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
              placeholder="축제명, 장소, 키워드로 검색 (예: 불꽃, 해운대, 먹거리)..."
              className="w-full pl-10 pr-12 py-2.5 bg-white/5 border border-white/10 rounded-2xl text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-400/80 focus:bg-white/10 backdrop-blur-md transition-all"
            />
            {filter.searchQuery && (
              <button
                onClick={() => onFilterChange({ searchQuery: '' })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-300 hover:text-white bg-white/10 border border-white/15 px-2 py-0.5 rounded-full backdrop-blur-md transition-all"
              >
                삭제
              </button>
            )}
          </div>

          {/* Sort Selector & View Mode Switcher */}
          <div className="flex items-center justify-between md:justify-end gap-2">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400 hidden sm:block" />
              <select
                value={filter.sortBy}
                onChange={(e) => onFilterChange({ sortBy: e.target.value as any })}
                className="bg-slate-900/80 border border-white/15 text-slate-200 text-xs sm:text-sm rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 backdrop-blur-md cursor-pointer"
              >
                <option value="date_asc" className="bg-slate-900 text-white">일정순 (빠른순)</option>
                <option value="date_desc" className="bg-slate-900 text-white">일정순 (최신순)</option>
                <option value="title" className="bg-slate-900 text-white">축제명 (가나다순)</option>
                <option value="district" className="bg-slate-900 text-white">지역구별</option>
              </select>
            </div>

            {/* View Mode Buttons */}
            <div className="bg-white/5 p-1 rounded-2xl flex items-center border border-white/10 backdrop-blur-md">
              <button
                onClick={() => onViewModeChange('grid')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  viewMode === 'grid'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
                title="카드 그리드 보기"
              >
                <Grid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">카드</span>
              </button>

              <button
                onClick={() => onViewModeChange('calendar')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  viewMode === 'calendar'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
                title="달력별 보기"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">달력</span>
              </button>

              <button
                onClick={() => onViewModeChange('map')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  viewMode === 'map'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
                title="지도 보기"
              >
                <Map className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">지도</span>
              </button>

              <button
                onClick={() => onViewModeChange('list')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  viewMode === 'list'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
                title="목록 보기"
              >
                <List className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">목록</span>
              </button>
            </div>
          </div>

        </div>

        {/* 1. Region (구/군) Selection Pills */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <span className="flex items-center gap-1 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              부산 지역별 선택 (구/군)
            </span>
            {filter.district !== '전체' && (
              <span className="text-cyan-300 font-bold">
                선택: {filter.district}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            <button
              onClick={() => onFilterChange({ district: '전체' })}
              className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all border backdrop-blur-md ${
                filter.district === '전체'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-cyan-400/50 shadow-lg shadow-cyan-500/20'
                  : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10 hover:text-white'
              }`}
            >
              전체 구·군 ({BUSAN_DISTRICTS.length})
            </button>
            {BUSAN_DISTRICTS.map((d) => (
              <button
                key={d.name}
                onClick={() => onFilterChange({ district: d.name })}
                className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all border backdrop-blur-md ${
                  filter.district === d.name
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-cyan-400/60 shadow-lg shadow-cyan-500/20'
                    : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10 hover:text-white'
                }`}
              >
                {d.name}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Date Filter Presets + Custom Date Selector */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2.5 border-t border-white/10">
          
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none text-xs">
            <span className="flex items-center gap-1 font-semibold text-slate-300 mr-1 whitespace-nowrap">
              <CalendarIcon className="w-3.5 h-3.5 text-cyan-400" />
              날짜별 조회:
            </span>
            {dateModeOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => onFilterChange({ dateMode: opt.id })}
                className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all border backdrop-blur-md ${
                  filter.dateMode === opt.id
                    ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white border-cyan-400/60 shadow-lg shadow-cyan-500/20'
                    : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10 hover:text-white'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Custom Date Input if 'custom' dateMode is selected */}
          {filter.dateMode === 'custom' && (
            <div className="flex items-center gap-2 bg-white/5 p-2 rounded-xl border border-white/15 text-xs backdrop-blur-md">
              <input
                type="date"
                value={filter.selectedDate}
                onChange={(e) => onFilterChange({ selectedDate: e.target.value })}
                className="bg-slate-900/90 border border-white/20 rounded-lg px-2 py-1 text-white focus:outline-none focus:ring-1 focus:ring-cyan-400"
              />
              <span className="text-slate-300 text-xs">특정 날짜 관람</span>
            </div>
          )}

          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto text-xs">
            <span className="text-slate-400 font-medium whitespace-nowrap">분류:</span>
            {FESTIVAL_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => onFilterChange({ category: cat })}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all border backdrop-blur-md ${
                  filter.category === cat
                    ? 'bg-white/20 text-white border-white/30 font-bold'
                    : 'bg-white/5 text-slate-400 hover:text-slate-200 border-white/5 hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>

        {/* Active Filters Summary & Reset */}
        <div className="flex items-center justify-between text-xs text-slate-400 pt-0.5">
          <div>
            검색 결과: <strong className="text-cyan-300 font-bold">{totalFiltered}</strong>개의 부산 축제가 조회되었습니다.
          </div>
          {(filter.district !== '전체' ||
            filter.dateMode !== 'all' ||
            filter.category !== '전체' ||
            filter.searchQuery !== '') && (
            <button
              onClick={onResetFilter}
              className="flex items-center gap-1 text-slate-400 hover:text-cyan-300 transition-all font-semibold"
            >
              <RotateCcw className="w-3 h-3" />
              필터 초기화
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
