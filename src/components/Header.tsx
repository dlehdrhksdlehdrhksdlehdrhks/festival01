import React from 'react';
import { Sparkles, Bookmark, RefreshCw, MapPin, Calendar, CheckCircle2, ShieldAlert } from 'lucide-react';

interface HeaderProps {
  totalCount: number;
  ongoingCount: number;
  upcomingCount: number;
  bookmarkedCount: number;
  showOnlyBookmarks: boolean;
  onToggleBookmarks: () => void;
  dataSource: 'api' | 'fallback' | 'loading';
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  totalCount,
  ongoingCount,
  upcomingCount,
  bookmarkedCount,
  showOnlyBookmarks,
  onToggleBookmarks,
  dataSource,
  onRefresh,
  isRefreshing,
}) => {
  return (
    <header className="bg-slate-900/60 backdrop-blur-xl border-b border-white/10 text-white sticky top-0 z-30 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Logo & Title */}
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-fuchsia-500 p-0.5 shadow-lg shadow-cyan-500/20 flex items-center justify-center shrink-0">
              <div className="w-full h-full bg-slate-950/80 backdrop-blur-sm rounded-[14px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-cyan-300 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white drop-shadow-sm">
                  부산 축제 가이드
                </h1>
                {dataSource === 'api' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 backdrop-blur-md">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    공공데이터 API
                  </span>
                )}
                {dataSource === 'fallback' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 backdrop-blur-md">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    추천 데이터 모드
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-slate-400 font-normal">
                부산광역시 16개 구·군의 사계절 문화·해양 축제를 한눈에
              </p>
            </div>
          </div>

          {/* Quick Metrics & Actions */}
          <div className="flex items-center justify-between md:justify-end gap-3 flex-wrap">
            {/* Quick Metrics Badges */}
            <div className="hidden sm:flex items-center gap-2 text-xs">
              <div className="bg-white/5 border border-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                <span className="text-slate-400">전체</span>
                <span className="font-bold text-white">{totalCount}개</span>
              </div>
              <div className="bg-white/5 border border-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span className="text-slate-400">진행중</span>
                <span className="font-bold text-emerald-300">{ongoingCount}개</span>
              </div>
              <div className="bg-white/5 border border-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                <span className="text-slate-400">예정</span>
                <span className="font-bold text-indigo-300">{upcomingCount}개</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={onToggleBookmarks}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all backdrop-blur-md ${
                  showOnlyBookmarks
                    ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 shadow-lg shadow-amber-500/25 border border-amber-300'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-white/10'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${showOnlyBookmarks ? 'fill-slate-950' : 'text-amber-400'}`} />
                <span>북마크</span>
                {bookmarkedCount > 0 && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[11px] font-bold ${showOnlyBookmarks ? 'bg-slate-950 text-amber-400' : 'bg-amber-400/20 text-amber-300 border border-amber-400/30'}`}>
                    {bookmarkedCount}
                  </span>
                )}
              </button>

              <button
                onClick={onRefresh}
                disabled={isRefreshing}
                className="p-2 rounded-xl bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-white/10 backdrop-blur-md transition-all disabled:opacity-50"
                title="데이터 새로고침"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
              </button>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
