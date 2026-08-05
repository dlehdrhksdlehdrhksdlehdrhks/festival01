import React, { useState } from 'react';
import { FestivalItem } from '../types';
import { BUSAN_DISTRICTS } from '../data/busanDistricts';
import { MapPin, Navigation, ExternalLink, ArrowRight, Info } from 'lucide-react';

interface MapViewProps {
  festivals: FestivalItem[];
  onSelectFestival: (festival: FestivalItem) => void;
  selectedDistrict: string;
  onSelectDistrict: (district: string) => void;
}

export const MapView: React.FC<MapViewProps> = ({
  festivals,
  onSelectFestival,
  selectedDistrict,
  onSelectDistrict,
}) => {
  const [hoveredFestival, setHoveredFestival] = useState<FestivalItem | null>(null);

  // Group festivals by district
  const festivalsByDistrict = BUSAN_DISTRICTS.map((d) => {
    const list = festivals.filter((f) => f.district === d.name);
    return {
      ...d,
      count: list.length,
      festivals: list,
    };
  });

  const activeDistrictInfo = BUSAN_DISTRICTS.find((d) => d.name === selectedDistrict);
  const activeFestivals = selectedDistrict === '전체'
    ? festivals
    : festivals.filter((f) => f.district === selectedDistrict);

  return (
    <div className="space-y-6">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left / Top: Interactive Busan District Grid Map */}
        <div className="lg:col-span-5 bg-slate-900/40 backdrop-blur-xl rounded-3xl border border-white/10 p-6 shadow-2xl space-y-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Navigation className="w-5 h-5 text-cyan-400" />
              부산광역시 16개 구·군 위치 탐색
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              구/군을 선택하면 해당 지역의 위치 기반 개최 축제 리스트를 볼 수 있습니다.
            </p>
          </div>

          {/* Interactive District Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <button
              onClick={() => onSelectDistrict('전체')}
              className={`p-3 rounded-2xl border text-left transition-all backdrop-blur-md ${
                selectedDistrict === '전체'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-cyan-400 shadow-lg shadow-cyan-500/25 font-bold'
                  : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10 hover:text-white'
              }`}
            >
              <div className="font-bold">전체 부산</div>
              <div className="text-[11px] opacity-80 mt-0.5">총 {festivals.length}개 개최</div>
            </button>

            {festivalsByDistrict.map((d) => (
              <button
                key={d.name}
                onClick={() => onSelectDistrict(d.name)}
                className={`p-3 rounded-2xl border text-left transition-all backdrop-blur-md ${
                  selectedDistrict === d.name
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-cyan-400 shadow-lg shadow-cyan-500/25 font-bold'
                    : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="font-bold truncate">{d.name}</div>
                <div className={`text-[11px] mt-0.5 font-semibold ${selectedDistrict === d.name ? 'text-white' : 'text-cyan-300'}`}>
                  {d.count}개 축제
                </div>
              </button>
            ))}
          </div>

          {activeDistrictInfo && (
            <div className="bg-cyan-500/10 p-4 rounded-2xl border border-cyan-500/20 space-y-1 text-xs backdrop-blur-md">
              <span className="font-bold text-cyan-300 text-sm block">
                📍 {activeDistrictInfo.name} ({activeDistrictInfo.engName})
              </span>
              <p className="text-slate-200">{activeDistrictInfo.description}</p>
              <div className="text-[11px] text-cyan-400 pt-1 font-mono">
                위도: {activeDistrictInfo.lat} | 경도: {activeDistrictInfo.lng}
              </div>
            </div>
          )}

        </div>

        {/* Right / Bottom: District Festivals Pins List */}
        <div className="lg:col-span-7 bg-slate-900/40 backdrop-blur-xl rounded-3xl border border-white/10 p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-rose-400" />
                [{selectedDistrict}] 축제 및 행사장 목록
              </h3>
              <p className="text-xs text-slate-400">
                지도 상의 좌표 및 주소 정보를 기반으로 축제 장소를 안내합니다.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              {activeFestivals.length}개 선택됨
            </span>
          </div>

          {activeFestivals.length === 0 ? (
            <div className="p-8 text-center text-slate-400 space-y-2">
              <p className="font-semibold text-slate-200">해당 지역에 등록된 축제가 없습니다.</p>
              <p className="text-xs text-slate-400">다른 구/군을 선택하시거나 검색 조건을 변경해 주세요.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1 scrollbar-none">
              {activeFestivals.map((f) => (
                <div
                  key={f.id}
                  onClick={() => onSelectFestival(f)}
                  onMouseEnter={() => setHoveredFestival(f)}
                  onMouseLeave={() => setHoveredFestival(null)}
                  className="p-4 rounded-2xl border border-white/10 hover:border-cyan-400/50 hover:shadow-xl transition-all cursor-pointer flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-white/5 hover:bg-white/10 backdrop-blur-md"
                >
                  <div className="flex gap-3 items-center">
                    <img
                      src={f.imgThumb || f.imgNormal}
                      alt={f.title}
                      className="w-16 h-16 rounded-xl object-cover shrink-0 bg-slate-950 border border-white/10"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-950 text-white border border-white/10">
                          {f.district}
                        </span>
                        <span className="text-xs font-semibold text-cyan-300">
                          {f.category}
                        </span>
                      </div>
                      <h4 className="font-bold text-white text-sm hover:text-cyan-300">
                        {f.title}
                      </h4>
                      <p className="text-xs text-slate-300 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-rose-400 shrink-0" />
                        {f.place}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <a
                      href={`https://map.naver.com/v5/search/${encodeURIComponent(f.address || f.place)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold flex items-center gap-1 transition-all shadow-md"
                    >
                      지도보기
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <button
                      onClick={() => onSelectFestival(f)}
                      className="p-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white transition-all shadow-md"
                      title="상세 정보"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
