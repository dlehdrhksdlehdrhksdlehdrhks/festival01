import React from 'react';
import { FestivalItem } from '../types';
import { formatKoreanDateStr } from '../utils/dateUtils';
import { MapPin, Calendar, ExternalLink, Bookmark, ChevronRight } from 'lucide-react';

interface ListViewProps {
  festivals: FestivalItem[];
  onSelectFestival: (festival: FestivalItem) => void;
  bookmarks: string[];
  onToggleBookmark: (id: string, e: React.MouseEvent) => void;
}

export const ListView: React.FC<ListViewProps> = ({
  festivals,
  onSelectFestival,
  bookmarks,
  onToggleBookmark,
}) => {
  return (
    <div className="bg-slate-900/40 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-200">
          <thead className="bg-white/5 border-b border-white/10 text-xs text-slate-400 uppercase tracking-wider font-bold">
            <tr>
              <th className="px-6 py-4">축제명 및 지역</th>
              <th className="px-6 py-4">일정 (날짜)</th>
              <th className="px-6 py-4">개최 장소</th>
              <th className="px-6 py-4">상태 및 분류</th>
              <th className="px-6 py-4 text-right">상세보기</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {festivals.map((f) => {
              const isBookmarked = bookmarks.includes(f.id);
              return (
                <tr
                  key={f.id}
                  onClick={() => onSelectFestival(f)}
                  className="hover:bg-white/10 transition-colors cursor-pointer group"
                >
                  {/* Title & District */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={(e) => onToggleBookmark(f.id, e)}
                        className={`p-1.5 rounded-lg transition-all backdrop-blur-md ${
                          isBookmarked
                            ? 'text-amber-400 bg-amber-400/20 border border-amber-400/30'
                            : 'text-slate-500 hover:text-slate-300 hover:bg-white/10'
                        }`}
                      >
                        <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-400' : ''}`} />
                      </button>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-950 text-white border border-white/10">
                            {f.district}
                          </span>
                          <span className="font-bold text-white group-hover:text-cyan-300 transition-colors">
                            {f.title}
                          </span>
                        </div>
                        {f.subtitle && (
                          <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                            {f.subtitle}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Dates */}
                  <td className="px-6 py-4 whitespace-nowrap text-xs font-semibold text-slate-200">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      {f.startDate
                        ? `${formatKoreanDateStr(f.startDate)} ${f.endDate && f.endDate !== f.startDate ? `~ ${formatKoreanDateStr(f.endDate)}` : ''}`
                        : f.usageDay || '일정 확인'}
                    </div>
                  </td>

                  {/* Venue */}
                  <td className="px-6 py-4 text-xs text-slate-300">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      <span className="line-clamp-1">{f.place}</span>
                    </div>
                  </td>

                  {/* Status & Category */}
                  <td className="px-6 py-4 whitespace-nowrap text-xs">
                    <div className="flex items-center gap-2">
                      {f.status === 'ONGOING' && (
                        <span className="px-2.5 py-0.5 rounded-full font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          진행중
                        </span>
                      )}
                      {f.status === 'UPCOMING' && (
                        <span className="px-2.5 py-0.5 rounded-full font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                          개최 예정
                        </span>
                      )}
                      {f.status === 'ENDED' && (
                        <span className="px-2.5 py-0.5 rounded-full font-medium bg-slate-800 text-slate-400 border border-white/10">
                          종료
                        </span>
                      )}
                      <span className="text-slate-400 font-medium">
                        {f.category}
                      </span>
                    </div>
                  </td>

                  {/* Arrow Action */}
                  <td className="px-6 py-4 text-right">
                    <div className="inline-flex items-center justify-center p-2 rounded-xl bg-white/5 text-slate-300 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-all shadow-md">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
