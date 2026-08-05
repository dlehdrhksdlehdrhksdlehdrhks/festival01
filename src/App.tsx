import React, { useState, useEffect, useMemo } from 'react';
import { FestivalItem, FilterState, ViewMode } from './types';
import { Header } from './components/Header';
import { FilterSection } from './components/FilterSection';
import { FestivalCard } from './components/FestivalCard';
import { FestivalDetailModal } from './components/FestivalDetailModal';
import { CalendarView } from './components/CalendarView';
import { MapView } from './components/MapView';
import { ListView } from './components/ListView';
import { checkDateMatch } from './utils/dateUtils';
import { Sparkles, MapPin, Calendar, Heart, Layers, AlertCircle, RefreshCw } from 'lucide-react';

export default function App() {
  const [festivals, setFestivals] = useState<FestivalItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<'api' | 'fallback' | 'loading'>('loading');
  const [selectedFestival, setSelectedFestival] = useState<FestivalItem | null>(null);

  // Bookmarks saved in LocalStorage
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('busan_festival_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [showOnlyBookmarks, setShowOnlyBookmarks] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // Filter state
  const [filter, setFilter] = useState<FilterState>({
    district: '전체',
    dateMode: 'all',
    selectedDate: '2026-08-04',
    startDate: '',
    endDate: '',
    searchQuery: '',
    category: '전체',
    sortBy: 'date_asc',
  });

  // Fetch Festivals
  const fetchFestivals = async (isManualRefresh = false) => {
    if (isManualRefresh) setIsRefreshing(true);
    else setIsLoading(true);

    try {
      const res = await fetch('/api/festivals');
      const json = await res.json();

      if (json.data && Array.isArray(json.data)) {
        setFestivals(json.data);
        setDataSource(json.source || 'api');
      }
    } catch (err) {
      console.error('Failed to fetch festivals:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchFestivals();
  }, []);

  // Save Bookmarks
  useEffect(() => {
    try {
      localStorage.setItem('busan_festival_bookmarks', JSON.stringify(bookmarks));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [bookmarks]);

  const toggleBookmark = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setBookmarks((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleFilterChange = (updated: Partial<FilterState>) => {
    setFilter((prev) => ({ ...prev, ...updated }));
  };

  const resetFilter = () => {
    setFilter({
      district: '전체',
      dateMode: 'all',
      selectedDate: '2026-08-04',
      startDate: '',
      endDate: '',
      searchQuery: '',
      category: '전체',
      sortBy: 'date_asc',
    });
    setShowOnlyBookmarks(false);
  };

  // Filter and Sort Logic
  const filteredFestivals = useMemo(() => {
    return festivals
      .filter((item) => {
        // Bookmarks filter
        if (showOnlyBookmarks && !bookmarks.includes(item.id)) {
          return false;
        }

        // Region / District filter
        if (filter.district !== '전체' && item.district !== filter.district) {
          return false;
        }

        // Category filter
        if (filter.category !== '전체' && item.category !== filter.category) {
          return false;
        }

        // Date filter
        const matchesDate = checkDateMatch(
          item.startDate,
          item.endDate,
          filter.dateMode,
          filter.selectedDate,
          filter.startDate,
          filter.endDate
        );
        if (!matchesDate) return false;

        // Keyword Search Filter
        if (filter.searchQuery.trim() !== '') {
          const q = filter.searchQuery.toLowerCase().trim();
          const matchTitle = item.title.toLowerCase().includes(q);
          const matchDistrict = item.district.toLowerCase().includes(q);
          const matchPlace = item.place.toLowerCase().includes(q);
          const matchContents = item.contents.toLowerCase().includes(q);
          const matchCategory = item.category.toLowerCase().includes(q);

          if (!matchTitle && !matchDistrict && !matchPlace && !matchContents && !matchCategory) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (filter.sortBy === 'date_asc') {
          return (a.startDate || '9999') > (b.startDate || '9999') ? 1 : -1;
        }
        if (filter.sortBy === 'date_desc') {
          return (a.startDate || '0000') < (b.startDate || '0000') ? 1 : -1;
        }
        if (filter.sortBy === 'title') {
          return a.title.localeCompare(b.title, 'ko');
        }
        if (filter.sortBy === 'district') {
          return a.district.localeCompare(b.district, 'ko');
        }
        return 0;
      });
  }, [festivals, filter, showOnlyBookmarks, bookmarks]);

  // Counts for Metrics
  const ongoingCount = useMemo(
    () => festivals.filter((f) => f.status === 'ONGOING').length,
    [festivals]
  );
  const upcomingCount = useMemo(
    () => festivals.filter((f) => f.status === 'UPCOMING').length,
    [festivals]
  );

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 font-sans flex flex-col selection:bg-cyan-500 selection:text-slate-950 relative overflow-hidden">
      
      {/* Background Ambient Glowing Gradient Orbs for Frosted Glass Refraction */}
      <div className="fixed top-[-10%] left-[-10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] rounded-full bg-indigo-600/20 blur-[130px] pointer-events-none z-0" />
      <div className="fixed top-[20%] right-[-10%] w-[45vw] h-[45vw] max-w-[550px] max-h-[550px] rounded-full bg-cyan-500/15 blur-[140px] pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] left-[20%] w-[55vw] h-[55vw] max-w-[650px] max-h-[650px] rounded-full bg-fuchsia-600/15 blur-[150px] pointer-events-none z-0" />

      {/* Header */}
      <Header
        totalCount={festivals.length}
        ongoingCount={ongoingCount}
        upcomingCount={upcomingCount}
        bookmarkedCount={bookmarks.length}
        showOnlyBookmarks={showOnlyBookmarks}
        onToggleBookmarks={() => setShowOnlyBookmarks(!showOnlyBookmarks)}
        dataSource={dataSource}
        onRefresh={() => fetchFestivals(true)}
        isRefreshing={isRefreshing}
      />

      {/* Filter Bar */}
      <FilterSection
        filter={filter}
        onFilterChange={handleFilterChange}
        onResetFilter={resetFilter}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        totalFiltered={filteredFestivals.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        
        {/* Loading Spinner */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4 bg-slate-900/30 backdrop-blur-xl rounded-3xl border border-white/10 my-8">
            <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm font-semibold text-cyan-200 animate-pulse">
              부산 지역 축제 및 행사 정보를 불러오는 중입니다...
            </p>
          </div>
        ) : filteredFestivals.length === 0 ? (
          /* Empty Search State */
          <div className="bg-slate-900/40 backdrop-blur-xl rounded-3xl border border-white/10 p-12 text-center max-w-xl mx-auto my-8 space-y-4 shadow-2xl">
            <div className="w-16 h-16 bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">
                조회된 축제가 없습니다.
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                선택하신 지역, 날짜 또는 검색어 조건에 맞는 축제 정보가 없습니다.<br />
                필터를 변경하거나 초기화해 보세요.
              </p>
            </div>
            <button
              onClick={resetFilter}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 hover:from-cyan-400 hover:to-blue-500 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              모든 필터 초기화
            </button>
          </div>
        ) : (
          /* View Mode Render */
          <>
            {/* 1. Card Grid View */}
            {viewMode === 'grid' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredFestivals.map((festival) => (
                  <FestivalCard
                    key={festival.id}
                    festival={festival}
                    isBookmarked={bookmarks.includes(festival.id)}
                    onToggleBookmark={toggleBookmark}
                    onSelect={setSelectedFestival}
                  />
                ))}
              </div>
            )}

            {/* 2. Interactive Calendar View */}
            {viewMode === 'calendar' && (
              <CalendarView
                festivals={filteredFestivals}
                onSelectFestival={setSelectedFestival}
              />
            )}

            {/* 3. Interactive Map View */}
            {viewMode === 'map' && (
              <MapView
                festivals={filteredFestivals}
                onSelectFestival={setSelectedFestival}
                selectedDistrict={filter.district}
                onSelectDistrict={(d) => handleFilterChange({ district: d })}
              />
            )}

            {/* 4. List View */}
            {viewMode === 'list' && (
              <ListView
                festivals={filteredFestivals}
                onSelectFestival={setSelectedFestival}
                bookmarks={bookmarks}
                onToggleBookmark={toggleBookmark}
              />
            )}
          </>
        )}

      </main>

      {/* Festival Detail Modal */}
      <FestivalDetailModal
        festival={selectedFestival}
        onClose={() => setSelectedFestival(null)}
        isBookmarked={selectedFestival ? bookmarks.includes(selectedFestival.id) : false}
        onToggleBookmark={toggleBookmark}
      />

      {/* Footer */}
      <footer className="bg-slate-950/70 backdrop-blur-xl text-slate-400 border-t border-white/10 py-10 mt-12 text-xs relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 text-center sm:text-left sm:flex sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="font-bold text-slate-200 text-sm flex items-center justify-center sm:justify-start gap-1.5">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              부산 축제 가이드 서비스
            </p>
            <p className="text-slate-400">
              부산광역시 문화관광 포털 및 공공데이터포털(data.go.kr) Open API 기반 정보 서비스
            </p>
          </div>

          <p className="text-slate-400">
            © {new Date().getFullYear()} Busan Festival Guide. Designed with Frosted Glass Theme.
          </p>
        </div>
      </footer>

    </div>
  );
}
