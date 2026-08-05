import React, { useState } from 'react';
import { FestivalItem } from '../types';
import {
  X,
  MapPin,
  Calendar,
  Clock,
  Phone,
  ExternalLink,
  Bookmark,
  Share2,
  Copy,
  Check,
  Tag,
  Info,
  Car,
  DollarSign,
  Compass,
} from 'lucide-react';
import { formatKoreanDateStr } from '../utils/dateUtils';

interface FestivalDetailModalProps {
  festival: FestivalItem | null;
  onClose: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (id: string, e?: React.MouseEvent) => void;
}

export const FestivalDetailModal: React.FC<FestivalDetailModalProps> = ({
  festival,
  onClose,
  isBookmarked,
  onToggleBookmark,
}) => {
  const [copied, setCopied] = useState(false);

  if (!festival) return null;

  const handleCopyAddress = () => {
    const fullAddr = `${festival.address} ${festival.detailedAddress}`.trim() || festival.place;
    navigator.clipboard.writeText(fullAddr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: festival.title,
        text: `[부산 축제 정보] ${festival.title} - ${festival.place}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      handleCopyAddress();
    }
  };

  const naverMapUrl = `https://map.naver.com/v5/search/${encodeURIComponent(festival.address || festival.place)}`;
  const kakaoMapUrl = `https://map.kakao.com/link/search/${encodeURIComponent(festival.address || festival.place)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      
      <div className="bg-slate-900/90 backdrop-blur-2xl rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-white/15 text-white flex flex-col relative my-auto">
        
        {/* Sticky Close & Action Bar */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          <button
            onClick={(e) => onToggleBookmark(festival.id, e)}
            className={`p-2.5 rounded-full backdrop-blur-md shadow-lg transition-all ${
              isBookmarked
                ? 'bg-amber-400 text-slate-950 font-bold border border-amber-300'
                : 'bg-slate-950/70 text-white hover:bg-slate-900 border border-white/20'
            }`}
            title="북마크"
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-slate-950' : ''}`} />
          </button>

          <button
            onClick={handleShare}
            className="p-2.5 rounded-full bg-slate-950/70 text-white hover:bg-slate-900 backdrop-blur-md border border-white/20 shadow-lg transition-all"
            title="공유하기"
          >
            <Share2 className="w-4 h-4" />
          </button>

          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-slate-950/80 text-white hover:bg-slate-900 backdrop-blur-md border border-white/20 shadow-lg transition-all"
            title="닫기"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Hero Image Section */}
        <div className="relative h-64 sm:h-80 w-full bg-slate-950 shrink-0">
          <img
            src={festival.imgNormal || festival.imgThumb}
            alt={festival.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          {/* Badges and Overlay Title */}
          <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500 text-slate-950 border border-cyan-300 shadow-md">
                {festival.district}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-slate-100 backdrop-blur-md border border-white/20">
                {festival.category}
              </span>
              {festival.status === 'ONGOING' && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500 text-white shadow-md">
                  ● 진행중
                </span>
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight drop-shadow-md text-white">
              {festival.title}
            </h2>

            {festival.subtitle && (
              <p className="text-sm text-slate-300 font-medium">
                {festival.subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 sm:p-8 space-y-6 text-slate-200">
          
          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white/5 p-5 rounded-2xl border border-white/10 text-sm backdrop-blur-md">
            
            {/* Date */}
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-cyan-500/20 text-cyan-300 rounded-xl shrink-0 border border-cyan-500/30">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-400 block">축제 기간</span>
                <span className="font-bold text-white block mt-0.5">
                  {festival.startDate
                    ? `${formatKoreanDateStr(festival.startDate)} ${festival.endDate && festival.endDate !== festival.startDate ? `~ ${formatKoreanDateStr(festival.endDate)}` : ''}`
                    : festival.usageDay || '일정 확인 필요'}
                </span>
                <span className="text-xs text-slate-400 block mt-0.5">
                  {festival.usageTime}
                </span>
              </div>
            </div>

            {/* Place */}
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-rose-500/20 text-rose-300 rounded-xl shrink-0 border border-rose-500/30">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-400 block">장소 및 주소</span>
                <span className="font-bold text-white block mt-0.5">
                  {festival.place}
                </span>
                <span className="text-xs text-slate-300 block mt-0.5">
                  {festival.address} {festival.detailedAddress}
                </span>
              </div>
            </div>

            {/* Fee */}
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-amber-500/20 text-amber-300 rounded-xl shrink-0 border border-amber-500/30">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-400 block">이용 요금</span>
                <span className="font-semibold text-amber-300 block mt-0.5">
                  {festival.fee || '무료 관람'}
                </span>
              </div>
            </div>

            {/* Contact */}
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-emerald-500/20 text-emerald-300 rounded-xl shrink-0 border border-emerald-500/30">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-400 block">문의 전화</span>
                <a
                  href={`tel:${festival.tel}`}
                  className="font-semibold text-cyan-300 hover:underline block mt-0.5"
                >
                  {festival.tel}
                </a>
              </div>
            </div>

          </div>

          {/* Description / Contents */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-white/10 pb-2">
              <Info className="w-4 h-4 text-cyan-400" />
              축제 소개
            </h3>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed whitespace-pre-line">
              {festival.contents || '상세 소개 내용이 준비 중입니다.'}
            </p>
          </div>

          {/* Parking / Traffic Notes */}
          {festival.notes && (
            <div className="bg-indigo-950/60 border border-indigo-500/30 p-4 rounded-2xl flex items-start gap-3 text-xs sm:text-sm text-indigo-200 backdrop-blur-md">
              <Car className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold block mb-0.5 text-indigo-100">주차 및 교통 안내</strong>
                <p className="text-indigo-300 leading-normal">{festival.notes}</p>
              </div>
            </div>
          )}

          {/* Location Map Links & Copy Address */}
          <div className="space-y-3 pt-2 border-t border-white/10">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Compass className="w-4 h-4 text-rose-400" />
              위치 및 지도 길찾기
            </h3>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              <button
                onClick={handleCopyAddress}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 border border-white/10 font-semibold transition-all backdrop-blur-md"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? '주소 복사완료!' : '주소 복사'}
              </button>

              <a
                href={naverMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition-all shadow-md"
              >
                네이버 지도로 보기
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <a
                href={kakaoMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-400 text-slate-950 font-bold hover:bg-amber-300 transition-all shadow-md"
              >
                카카오맵으로 보기
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* External Homepage Link */}
          {festival.homepageUrl && (
            <div className="pt-4 border-t border-white/10 flex justify-end">
              <a
                href={festival.homepageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-xl shadow-cyan-500/25 transition-all"
              >
                공식 홈페이지 바로가기
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
