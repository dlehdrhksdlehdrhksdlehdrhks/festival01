import React, { useState } from 'react';
import { FestivalItem } from '../types';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Sparkles } from 'lucide-react';
import { getDaysInMonth, getFirstDayOfMonth, formatKoreanDateStr } from '../utils/dateUtils';

interface CalendarViewProps {
  festivals: FestivalItem[];
  onSelectFestival: (festival: FestivalItem) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  festivals,
  onSelectFestival,
}) => {
  // Default to August 2026 or current date
  const [currentDate, setCurrentDate] = useState(new Date(2026, 7, 1)); // 2026 August
  const [selectedDay, setSelectedDay] = useState<number | null>(4); // Default selected Aug 4th

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed (7 = August)

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDay(null);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDay(null);
  };

  const monthNames = [
    '1월', '2월', '3월', '4월', '5월', '6월',
    '7월', '8월', '9월', '10월', '11월', '12월'
  ];

  // Helper to find festivals for a given day in this month
  const getFestivalsForDay = (dayNumber: number) => {
    const formattedDay = String(dayNumber).padStart(2, '0');
    const formattedMonth = String(month + 1).padStart(2, '0');
    const targetDateStr = `${year}-${formattedMonth}-${formattedDay}`;

    return festivals.filter((f) => {
      const fStart = f.startDate;
      const fEnd = f.endDate || f.startDate;
      if (!fStart) return false;
      return targetDateStr >= fStart && targetDateStr <= fEnd;
    });
  };

  const festivalsOnSelectedDay = selectedDay ? getFestivalsForDay(selectedDay) : [];

  return (
    <div className="space-y-6">
      
      {/* Calendar Header Card */}
      <div className="bg-slate-900/40 backdrop-blur-xl rounded-3xl border border-white/10 p-6 shadow-2xl space-y-4">
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-cyan-500/20 text-cyan-300 rounded-2xl border border-cyan-500/30">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {year}년 {monthNames[month]} 부산 축제 일정표
              </h2>
              <p className="text-xs text-slate-400">
                날짜를 클릭하시면 해당 일자에 진행 중이거나 개최되는 부산 축제를 확인하실 수 있습니다.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={prevMonth}
              className="p-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-slate-200 transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm font-bold text-white px-3">
              {year}.{month + 1}
            </span>
            <button
              onClick={nextMonth}
              className="p-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-slate-200 transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Days of Week Header */}
        <div className="grid grid-cols-7 text-center text-xs font-bold text-slate-400 py-2 border-b border-white/10">
          <span className="text-rose-400">일</span>
          <span>월</span>
          <span>화</span>
          <span>수</span>
          <span>목</span>
          <span>금</span>
          <span className="text-cyan-400">토</span>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1.5 text-xs">
          {/* Empty cells before month start */}
          {Array.from({ length: firstDay }).map((_, idx) => (
            <div key={`empty-${idx}`} className="h-20 sm:h-24 bg-white/5 rounded-2xl opacity-40 border border-white/5" />
          ))}

          {/* Month Days */}
          {Array.from({ length: daysInMonth }).map((_, idx) => {
            const dayNum = idx + 1;
            const dayFestivals = getFestivalsForDay(dayNum);
            const isSelected = selectedDay === dayNum;
            const hasFestivals = dayFestivals.length > 0;

            return (
              <button
                key={dayNum}
                onClick={() => setSelectedDay(dayNum)}
                className={`h-20 sm:h-24 p-2 rounded-2xl border flex flex-col justify-between text-left transition-all backdrop-blur-md ${
                  isSelected
                    ? 'border-cyan-400 ring-2 ring-cyan-400/40 bg-cyan-500/20 shadow-lg shadow-cyan-500/10'
                    : hasFestivals
                    ? 'border-white/15 bg-white/10 hover:border-cyan-400/50 hover:bg-white/15'
                    : 'border-white/5 bg-white/5 text-slate-500 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span
                    className={`font-bold text-xs sm:text-sm px-1.5 py-0.5 rounded-lg ${
                      isSelected
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-extrabold'
                        : hasFestivals
                        ? 'text-white font-extrabold'
                        : 'text-slate-400'
                    }`}
                  >
                    {dayNum}
                  </span>

                  {hasFestivals && (
                    <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded-full bg-cyan-500 text-slate-950 shadow-md">
                      {dayFestivals.length}
                    </span>
                  )}
                </div>

                {/* Micro Preview Tags inside day cell */}
                <div className="space-y-1 overflow-hidden w-full hidden sm:block">
                  {dayFestivals.slice(0, 2).map((f) => (
                    <div
                      key={f.id}
                      className="text-[10px] px-1.5 py-0.5 rounded-md bg-cyan-500/20 text-cyan-200 border border-cyan-500/30 font-medium truncate"
                    >
                      {f.title}
                    </div>
                  ))}
                  {dayFestivals.length > 2 && (
                    <div className="text-[9px] text-cyan-300 font-bold px-1">
                      +{dayFestivals.length - 2}개 더보기
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

      </div>

      {/* Selected Day Festivals Details Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            {year}년 {month + 1}월 {selectedDay || 1}일 부산 축제 목록
            <span className="text-xs font-bold px-3 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              총 {festivalsOnSelectedDay.length}건
            </span>
          </h3>
        </div>

        {festivalsOnSelectedDay.length === 0 ? (
          <div className="bg-slate-900/40 backdrop-blur-xl rounded-3xl border border-white/10 p-8 text-center text-slate-400 space-y-2 shadow-2xl">
            <p className="font-semibold text-slate-200">선택하신 날짜에 등록된 축제가 없습니다.</p>
            <p className="text-xs text-slate-400">상단의 달력에서 숫자에 배지가 있는 날짜를 클릭해 보세요.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {festivalsOnSelectedDay.map((f) => (
              <div
                key={f.id}
                onClick={() => onSelectFestival(f)}
                className="bg-slate-900/40 hover:bg-slate-800/60 backdrop-blur-xl p-4 rounded-2xl border border-white/10 hover:border-cyan-400/50 shadow-2xl transition-all cursor-pointer flex gap-4 items-center"
              >
                <img
                  src={f.imgThumb || f.imgNormal}
                  alt={f.title}
                  className="w-20 h-20 rounded-xl object-cover shrink-0 bg-slate-950 border border-white/10"
                />
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-950 text-white border border-white/10">
                      {f.district}
                    </span>
                    <span className="text-xs font-medium text-cyan-300">
                      {f.category}
                    </span>
                  </div>
                  <h4 className="font-bold text-white truncate text-sm hover:text-cyan-300">
                    {f.title}
                  </h4>
                  <p className="text-xs text-slate-400 truncate">
                    {f.place}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
