export function parseDate(dateStr?: string): Date | null {
  if (!dateStr) return null;
  const clean = dateStr.replace(/\./g, '-').trim();
  const d = new Date(clean);
  return isNaN(d.getTime()) ? null : d;
}

export function formatKoreanDateStr(dateStr?: string): string {
  if (!dateStr) return '일정 미정';
  const d = parseDate(dateStr);
  if (!d) return dateStr;
  
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][d.getDay()];

  return `${year}년 ${month}월 ${day}일 (${dayOfWeek})`;
}

export function formatShortDateStr(dateStr?: string): string {
  if (!dateStr) return '';
  const d = parseDate(dateStr);
  if (!d) return dateStr;
  return `${d.getMonth() + 1}.${d.getDate()}`;
}

export function checkDateMatch(
  festivalStart?: string,
  festivalEnd?: string,
  filterMode?: string,
  targetDate?: string, // YYYY-MM-DD
  filterStart?: string,
  filterEnd?: string
): boolean {
  if (!festivalStart) return true; // If festival has no date, show by default

  const fStart = festivalStart;
  const fEnd = festivalEnd || festivalStart;

  const todayStr = '2026-08-04'; // Fixed reference current date or Date().toISOString()
  const now = new Date(todayStr);

  if (filterMode === 'today') {
    return todayStr >= fStart && todayStr <= fEnd;
  }

  if (filterMode === 'ongoing') {
    return todayStr >= fStart && todayStr <= fEnd;
  }

  if (filterMode === 'upcoming') {
    return fStart > todayStr;
  }

  if (filterMode === 'this_week') {
    // Current week range
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    const sWeekStr = startOfWeek.toISOString().split('T')[0];
    const eWeekStr = endOfWeek.toISOString().split('T')[0];

    // Check overlap
    return fStart <= eWeekStr && fEnd >= sWeekStr;
  }

  if (filterMode === 'this_month') {
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const monthPrefix = `${year}-${month}`;

    return fStart.startsWith(monthPrefix) || fEnd.startsWith(monthPrefix) || (fStart <= `${monthPrefix}-31` && fEnd >= `${monthPrefix}-01`);
  }

  if (filterMode === 'custom') {
    if (targetDate) {
      return targetDate >= fStart && targetDate <= fEnd;
    }
    if (filterStart && filterEnd) {
      return fStart <= filterEnd && fEnd >= filterStart;
    }
  }

  return true;
}

export function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

export function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}
