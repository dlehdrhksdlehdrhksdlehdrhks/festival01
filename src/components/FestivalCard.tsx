import React from 'react';
import { FestivalItem } from '../types';
import { MapPin, Calendar, Bookmark, ArrowUpRight, Clock, Tag } from 'lucide-react';
import { formatKoreanDateStr } from '../utils/dateUtils';

interface FestivalCardProps {
  festival: FestivalItem;
  isBookmarked: boolean;
  onToggleBookmark: (id: string, e: React.MouseEvent) => void;
  onSelect: (festival: FestivalItem) => void;
}

export const FestivalCard: React.FC<FestivalCardProps> = ({
  festival,
  isBookmarked,
  onToggleBookmark,
  onSelect,
}) => {
  const getStatusBadge = () => {
    switch (festival.status) {
      case 'ONGOING':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/90 text-white shadow-lg shadow-emerald-500/30 backdrop-blur-md border border-emerald-400/40">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
            지금 진행중
          </span>
        );
      case 'UPCOMING':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-cyan-500/90 text-white shadow-lg shadow-cyan-500/30 backdrop-blur-md border border-cyan-400/40">
            개최 예정
          </span>
        );
      case 'ENDED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800/90 text-slate-300 backdrop-blur-md border border-white/10">
            지난 축제
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-500/90 text-white backdrop-blur-md border border-indigo-400/30">
            상시 운영
          </span>
        );
    }
  };

  return (
    <div
      onClick={() => onSelect(festival)}
      className="group bg-slate-900/40 hover:bg-slate-800/60 backdrop-blur-xl rounded-2xl border border-white/10 hover:border-cyan-400/50 shadow-2xl transition-all duration-300 flex flex-col overflow-hidden cursor-pointer transform hover:-translate-y-1"
    >
      {/* Image Banner */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-950">
        <img
          src={festival.imgNormal || festival.imgThumb}
          alt={festival.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80';
          }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-1.5 pointer-events-auto">
            {getStatusBadge()}
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-950/80 text-slate-100 border border-white/20 backdrop-blur-md">
              {festival.district}
            </span>
          </div>

          <button
            onClick={(e) => onToggleBookmark(festival.id, e)}
            className={`pointer-events-auto p-2 rounded-full backdrop-blur-md transition-all shadow-lg ${
              isBookmarked
                ? 'bg-amber-400 text-slate-950 hover:bg-amber-300 border border-amber-300'
                : 'bg-slate-950/60 text-white hover:bg-slate-900/90 border border-white/20'
            }`}
            title={isBookmarked ? '북마크 취소' : '북마크 저장'}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-slate-950' : ''}`} />
          </button>
        </div>

        {/* Category Pill at bottom of image */}
        <div className="absolute bottom-3 left-3 pointer-events-none">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[11px] font-medium bg-white/10 text-slate-200 backdrop-blur-md border border-white/20">
            <Tag className="w-3 h-3 text-cyan-300" />
            {festival.category}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1 leading-snug drop-shadow-sm">
            {festival.title}
          </h3>

          {festival.subtitle && (
            <p className="text-xs text-slate-400 line-clamp-1 font-medium">
              {festival.subtitle}
            </p>
          )}

          <div className="pt-2 space-y-1.5 text-xs text-slate-300">
            {/* Date Range */}
            <div className="flex items-start gap-2">
              <Calendar className="w-3.5 h-3.5 text-cyan-400 mt-0.5 shrink-0" />
              <span className="font-semibold text-slate-200 leading-tight">
                {festival.startDate
                  ? `${formatKoreanDateStr(festival.startDate)} ${festival.endDate && festival.endDate !== festival.startDate ? `~ ${formatKoreanDateStr(festival.endDate)}` : ''}`
                  : festival.usageDay || '일정 미정'}
              </span>
            </div>

            {/* Venue / Address */}
            <div className="flex items-start gap-2">
              <MapPin className="w-3.5 h-3.5 text-rose-400 mt-0.5 shrink-0" />
              <span className="text-slate-300 line-clamp-1">
                {festival.place} ({festival.district})
              </span>
            </div>
          </div>
        </div>

        {/* Card Footer Action */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
          <span className="text-slate-400 font-medium line-clamp-1 max-w-[65%]">
            요금: <strong className="text-cyan-300">{festival.fee || '무료'}</strong>
          </span>

          <span className="inline-flex items-center gap-1 font-bold text-cyan-300 group-hover:translate-x-0.5 transition-transform">
            상세보기
            <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
        </div>

      </div>
    </div>
  );
};
