import React, { useState, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Filter,
  CheckSquare,
  ShoppingBag,
  Clock,
  AlertTriangle,
  User,
  Plus,
  CheckCircle2,
} from 'lucide-react';
import { useHome } from '../../context/HomeContext';
import { Chore, GroceryItem } from '../../types';

interface Props {
  onOpenRescheduleModal: (chore: Chore) => void;
  onOpenChoreCreateForDate: (dateStr: string) => void;
}

export const FamilyCalendar: React.FC<Props> = ({
  onOpenRescheduleModal,
  onOpenChoreCreateForDate,
}) => {
  const { chores, groceryItems, familyMembers } = useHome();

  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [eventTypeFilter, setEventTypeFilter] = useState<'all' | 'chores' | 'expiries' | 'topups'>('all');
  const [selectedMemberId, setSelectedMemberId] = useState<string>('all');
  const [activeDayDetail, setActiveDayDetail] = useState<string | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const jumpToToday = () => {
    setCurrentDate(new Date());
  };

  // Days in current month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0 is Sunday

  // Build calendar matrix
  const calendarCells = useMemo(() => {
    const cells: { dateStr: string; dayNum: number; isCurrentMonth: boolean }[] = [];

    // Prev month days
    const prevMonthDays = new Date(year, month, 0).getDate();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const d = prevMonthDays - i;
      const prevDate = new Date(year, month - 1, d);
      cells.push({
        dateStr: prevDate.toISOString().split('T')[0],
        dayNum: d,
        isCurrentMonth: false,
      });
    }

    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      const curDate = new Date(year, month, d);
      cells.push({
        dateStr: curDate.toISOString().split('T')[0],
        dayNum: d,
        isCurrentMonth: true,
      });
    }

    // Next month filling
    const remaining = (7 - (cells.length % 7)) % 7;
    for (let d = 1; d <= remaining; d++) {
      const nextDate = new Date(year, month + 1, d);
      cells.push({
        dateStr: nextDate.toISOString().split('T')[0],
        dayNum: d,
        isCurrentMonth: false,
      });
    }

    return cells;
  }, [year, month, daysInMonth, firstDayOfWeek]);

  // Aggregate events per date
  const eventsByDate = useMemo(() => {
    const map: Record<
      string,
      {
        chores: Chore[];
        expiries: GroceryItem[];
        topups: GroceryItem[];
      }
    > = {};

    // Group chores
    if (eventTypeFilter === 'all' || eventTypeFilter === 'chores') {
      chores.forEach((c) => {
        if (selectedMemberId !== 'all' && c.assignedTo.id !== selectedMemberId) return;

        // Use chore deadline (or completedAt)
        const dateKey = c.status === 'completed' && c.completedAt ? c.completedAt : c.deadline;
        if (!map[dateKey]) {
          map[dateKey] = { chores: [], expiries: [], topups: [] };
        }
        map[dateKey].chores.push(c);
      });
    }

    // Group grocery expiries
    if (eventTypeFilter === 'all' || eventTypeFilter === 'expiries') {
      groceryItems.forEach((item) => {
        const dateKey = item.expiryDate;
        if (!map[dateKey]) {
          map[dateKey] = { chores: [], expiries: [], topups: [] };
        }
        map[dateKey].expiries.push(item);
      });
    }

    // Group grocery topups
    if (eventTypeFilter === 'all' || eventTypeFilter === 'topups') {
      groceryItems.forEach((item) => {
        const dateKey = item.topUpDate;
        if (!map[dateKey]) {
          map[dateKey] = { chores: [], expiries: [], topups: [] };
        }
        map[dateKey].topups.push(item);
      });
    }

    return map;
  }, [chores, groceryItems, eventTypeFilter, selectedMemberId]);

  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  const todayStr = new Date().toISOString().split('T')[0];

  const selectedDayEvents = activeDayDetail ? eventsByDate[activeDayDetail] : null;

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold text-xs uppercase tracking-wider">
            <CalendarIcon className="w-4 h-4" />
            <span>Shared Family Schedule</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {monthName}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Unified view of chore deadlines, completed achievements, and grocery expiry/top-up milestones.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Month Navigation */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={prevMonth}
              title="Previous Month"
              className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={jumpToToday}
              className="px-3 py-1 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-indigo-600 transition cursor-pointer"
            >
              Today
            </button>
            <button
              onClick={nextMonth}
              title="Next Month"
              className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Schedule Button */}
          <button
            onClick={() => onOpenChoreCreateForDate(todayStr)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Task</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm text-xs">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="font-semibold text-slate-400 uppercase tracking-wider text-[10px] mr-1">
            Display:
          </span>
          <button
            onClick={() => setEventTypeFilter('all')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition cursor-pointer ${
              eventTypeFilter === 'all'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            All Events
          </button>
          <button
            onClick={() => setEventTypeFilter('chores')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition cursor-pointer ${
              eventTypeFilter === 'chores'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Chores Only
          </button>
          <button
            onClick={() => setEventTypeFilter('expiries')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition cursor-pointer ${
              eventTypeFilter === 'expiries'
                ? 'bg-rose-500 text-white'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Grocery Expiries
          </button>
          <button
            onClick={() => setEventTypeFilter('topups')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition cursor-pointer ${
              eventTypeFilter === 'topups'
                ? 'bg-emerald-600 text-white'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Pantry Restocks
          </button>
        </div>

        {/* Member filter */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-slate-400 text-[11px]">Filter Member:</span>
          <select
            value={selectedMemberId}
            onChange={(e) => setSelectedMemberId(e.target.value)}
            className="px-2.5 py-1 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="all">Everyone</option>
            {familyMembers.map((m) => (
              <option key={m.id} value={m.id}>
                {m.avatar} {m.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Interactive Month Grid */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        {/* Day of Week Headers */}
        <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs uppercase tracking-wider text-slate-400 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>

        {/* Calendar Day Cells */}
        <div className="grid grid-cols-7 gap-1.5 mt-2">
          {calendarCells.map((cell, idx) => {
            const isToday = cell.dateStr === todayStr;
            const events = eventsByDate[cell.dateStr];
            const hasChores = events && events.chores.length > 0;
            const hasExpiries = events && events.expiries.length > 0;
            const hasTopups = events && events.topups.length > 0;
            const isSelected = activeDayDetail === cell.dateStr;

            return (
              <div
                key={idx}
                onClick={() => setActiveDayDetail(cell.dateStr)}
                className={`min-h-[58px] sm:min-h-[115px] p-1.5 sm:p-2 rounded-xl sm:rounded-2xl border transition flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? 'ring-2 ring-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/40 border-indigo-300'
                    : isToday
                    ? 'border-indigo-400 bg-indigo-50/20 dark:bg-indigo-950/20'
                    : cell.isCurrentMonth
                    ? 'border-slate-200/60 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-800/20 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                    : 'border-slate-100 dark:border-slate-800/40 opacity-40 bg-slate-50/20'
                }`}
              >
                {/* Day Header */}
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[11px] sm:text-xs font-bold flex items-center justify-center h-5 w-5 sm:h-6 sm:w-6 rounded-full ${
                      isToday
                        ? 'bg-indigo-600 text-white'
                        : cell.isCurrentMonth
                        ? 'text-slate-800 dark:text-slate-200'
                        : 'text-slate-400'
                    }`}
                  >
                    {cell.dayNum}
                  </span>

                  {/* Add chore quick shortcut on hover */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenChoreCreateForDate(cell.dateStr);
                    }}
                    title="Add task on this day"
                    className="opacity-0 group-hover:opacity-100 p-0.5 text-slate-400 hover:text-indigo-600 transition hidden sm:block"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Mobile: Compact Colored Indicator Dots */}
                <div className="flex sm:hidden items-center justify-center gap-1 mt-1 flex-wrap">
                  {hasChores && (
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                  )}
                  {hasExpiries && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                  )}
                  {hasTopups && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  )}
                </div>

                {/* Desktop: Day Event Chips */}
                <div className="hidden sm:block space-y-1 mt-1 overflow-hidden">
                  {/* Chores chips */}
                  {hasChores && (
                    <div className="space-y-0.5">
                      {events.chores.slice(0, 2).map((c) => (
                        <div
                          key={c.id}
                          className={`truncate text-[10px] font-semibold px-1.5 py-0.5 rounded-md flex items-center gap-1 ${
                            c.status === 'completed'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 line-through opacity-75'
                              : c.deadline < todayStr
                              ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                              : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                          }`}
                        >
                          <span className="text-[9px]">{c.assignedTo.avatar}</span>
                          <span className="truncate">{c.title}</span>
                        </div>
                      ))}
                      {events.chores.length > 2 && (
                        <div className="text-[9px] font-bold text-indigo-600 dark:text-indigo-400 pl-1">
                          +{events.chores.length - 2} more tasks
                        </div>
                      )}
                    </div>
                  )}

                  {/* Expiry chips */}
                  {hasExpiries && (
                    <div className="truncate text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 flex items-center gap-1">
                      <span>⚠️ Exp:</span>
                      <span className="truncate">{events.expiries[0].name}</span>
                    </div>
                  )}

                  {/* Top-up chips */}
                  {hasTopups && (
                    <div className="truncate text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 flex items-center gap-1">
                      <span>📦 Restock</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Day Details Card (if clicked) */}
      {activeDayDetail && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="text-xs uppercase font-bold text-indigo-500 tracking-wider">
                Schedule Details
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                {new Date(activeDayDetail + 'T00:00:00').toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenChoreCreateForDate(activeDayDetail)}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Task for this Day</span>
              </button>
              <button
                onClick={() => setActiveDayDetail(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Day Chores */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <CheckSquare className="w-3.5 h-3.5 text-indigo-500" />
                <span>Chores &amp; Tasks ({selectedDayEvents?.chores.length || 0})</span>
              </h4>

              {selectedDayEvents && selectedDayEvents.chores.length > 0 ? (
                selectedDayEvents.chores.map((chore) => (
                  <div
                    key={chore.id}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <span>{chore.title}</span>
                        {chore.status === 'completed' && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-semibold">Done</span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Assigned to {chore.assignedTo.avatar} {chore.assignedTo.name}
                      </div>
                    </div>

                    {chore.status === 'pending' && (
                      <button
                        onClick={() => onOpenRescheduleModal(chore)}
                        className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Done</span>
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic py-2">No chores scheduled on this day.</p>
              )}
            </div>

            {/* Day Grocery Alerts */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <ShoppingBag className="w-3.5 h-3.5 text-emerald-500" />
                <span>Grocery Expiries &amp; Restocks</span>
              </h4>

              {selectedDayEvents && (selectedDayEvents.expiries.length > 0 || selectedDayEvents.topups.length > 0) ? (
                <div className="space-y-2">
                  {selectedDayEvents.expiries.map((item) => (
                    <div
                      key={`exp-${item.id}`}
                      className="p-3 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 text-xs flex items-center justify-between"
                    >
                      <span className="font-semibold text-amber-900 dark:text-amber-200">
                        ⚠️ Expiry: {item.name} ({item.quantity} {item.unit})
                      </span>
                    </div>
                  ))}
                  {selectedDayEvents.topups.map((item) => (
                    <div
                      key={`top-${item.id}`}
                      className="p-3 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 text-xs flex items-center justify-between"
                    >
                      <span className="font-semibold text-emerald-900 dark:text-emerald-200">
                        📦 Restocked: {item.name} by {item.updatedBy?.name}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic py-2">No grocery events on this day.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
