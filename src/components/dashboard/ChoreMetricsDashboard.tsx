import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  Calendar,
  TrendingUp,
  TrendingDown,
  User,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
} from 'lucide-react';
import { useHome } from '../../context/HomeContext';
import { Chore } from '../../types';
import { getExpiryStatus } from '../../utils/groceryUtils';

interface Props {
  onNavigateToChores: () => void;
  onNavigateToGroceries: () => void;
  onOpenRescheduleModal: (chore: Chore) => void;
  onOpenTopUpModal: (itemId: string) => void;
}

export const ChoreMetricsDashboard: React.FC<Props> = ({
  onNavigateToChores,
  onNavigateToGroceries,
  onOpenRescheduleModal,
  onOpenTopUpModal,
}) => {
  const {
    choreMetrics,
    chores,
    groceryItems,
    activeUser,
    postponeChore,
  } = useHome();

  const [timeRangeTab, setTimeRangeTab] = useState<'30days' | 'weeklyTrend'>('30days');

  // Filter overdue chores
  const todayStr = new Date().toISOString().split('T')[0];
  const overdueChores = chores.filter(
    (c) => c.status === 'pending' && c.deadline < todayStr
  );

  // Filter upcoming chores (next 7 days)
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  const nextWeekStr = nextWeek.toISOString().split('T')[0];
  const upcomingChores = chores
    .filter((c) => c.status === 'pending' && c.deadline >= todayStr && c.deadline <= nextWeekStr)
    .sort((a, b) => a.deadline.localeCompare(b.deadline));

  // Urgent grocery items (expiring in <= 3 days or low stock)
  const urgentGroceries = groceryItems.filter((item) => {
    const status = getExpiryStatus(item.expiryDate);
    const isLow = item.quantity <= item.minThreshold;
    return status.isUrgent || isLow;
  });

  // Pie chart data for execution health
  const pieData = [
    { name: 'Proactive (On Schedule)', value: choreMetrics.proactiveCount, color: '#10b981' },
    { name: 'Postponed / Delayed', value: choreMetrics.postponedOrDelayedCount, color: '#f59e0b' },
    { name: 'Currently Overdue', value: overdueChores.length, color: '#ef4444' },
  ].filter((d) => d.value > 0);

  return (
    <div className="space-y-6 sm:space-y-8 pb-12">
      {/* Top Welcome & KPI Highlight Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 p-4 sm:p-8 text-white shadow-xl">
        <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 -bottom-12 h-48 w-48 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
          <div>
            <div className="flex items-center gap-2 text-indigo-200 text-xs sm:text-sm font-medium mb-1 sm:mb-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Live Household Health • Past 30 Days</span>
            </div>
            <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {activeUser.name} {activeUser.avatar}
            </h1>
            <p className="mt-1 sm:mt-1.5 text-xs sm:text-base text-indigo-200/90 max-w-2xl leading-relaxed">
              Family performance is tracking at a{' '}
              <span className="font-semibold text-emerald-300">{choreMetrics.proactiveRate}% proactive rate</span>. Keep
              tasks within planned schedules to minimize household backlog!
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onNavigateToChores}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-white text-indigo-950 font-semibold text-xs sm:text-sm hover:bg-indigo-50 transition shadow-sm cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-600" />
              <span>Manage Chores</span>
            </button>
            <button
              onClick={onNavigateToGroceries}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-indigo-700/60 hover:bg-indigo-700/80 text-white font-medium text-xs sm:text-sm backdrop-blur border border-indigo-500/30 transition cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
              <span>Pantry Stock</span>
            </button>
          </div>
        </div>

        {/* 4 Metric KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-indigo-700/50">
          {/* 1. Proactive Rate */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-white/10 hover:border-emerald-400/40 transition">
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-xs uppercase tracking-wider font-semibold text-indigo-200">Proactive Rate</span>
              <div className="p-1 sm:p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300">
                <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
            </div>
            <div className="mt-1.5 sm:mt-2 flex items-baseline gap-1.5 sm:gap-2">
              <span className="text-2xl sm:text-3xl font-black tracking-tight text-white">{choreMetrics.proactiveRate}%</span>
              <span className="text-[10px] sm:text-xs text-emerald-300 font-medium">on-time</span>
            </div>
            <p className="mt-1 text-xs text-indigo-200/80">
              {choreMetrics.proactiveCount} of {choreMetrics.totalLoggedLast30Days} tasks finished on or before deadline
            </p>
          </div>

          {/* 2. Postpone Rate */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 hover:border-amber-400/40 transition">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider font-semibold text-indigo-200">Postpone Rate</span>
              <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300">
                <TrendingDown className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-black tracking-tight text-white">{choreMetrics.postponeRate}%</span>
              <span className="text-xs text-amber-300 font-medium">delayed</span>
            </div>
            <p className="mt-1 text-xs text-indigo-200/80">
              Avg delay: {choreMetrics.avgDelayDays} days across {choreMetrics.postponedOrDelayedCount} delayed items
            </p>
          </div>

          {/* 3. Overdue Chores */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 hover:border-rose-400/40 transition">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider font-semibold text-indigo-200">Needs Action</span>
              <div className={`p-1.5 rounded-lg ${overdueChores.length > 0 ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'}`}>
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className={`text-3xl font-black tracking-tight ${overdueChores.length > 0 ? 'text-rose-300' : 'text-white'}`}>
                {overdueChores.length}
              </span>
              <span className="text-xs text-indigo-200 font-medium">overdue tasks</span>
            </div>
            <p className="mt-1 text-xs text-indigo-200/80">
              {overdueChores.length === 0 ? 'All tasks are on track!' : 'Resolve or reschedule to stay on schedule'}
            </p>
          </div>

          {/* 4. Upcoming (Next 7 Days) */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 hover:border-indigo-300/40 transition">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider font-semibold text-indigo-200">Scheduled Ahead</span>
              <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-300">
                <Calendar className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-black tracking-tight text-white">{upcomingChores.length}</span>
              <span className="text-xs text-indigo-200 font-medium">next 7 days</span>
            </div>
            <p className="mt-1 text-xs text-indigo-200/80">
              Distributed across family chore boards
            </p>
          </div>
        </div>
      </div>

      {/* RECHARTS SECTION: 30-Day Proactive vs Postpone Rates */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main 30-Day Recharts Trend Area Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  30-Day Rate Trend Visualization
                </h2>
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                  Recharts Engine
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Dynamic cumulative progression of the proactive completion rate vs postpone delay rate over past 30 days
              </p>
            </div>

            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-medium self-start sm:self-auto">
              <button
                onClick={() => setTimeRangeTab('30days')}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  timeRangeTab === '30days'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Cumulative Rate (%)
              </button>
              <button
                onClick={() => setTimeRangeTab('weeklyTrend')}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  timeRangeTab === 'weeklyTrend'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Daily Count
              </button>
            </div>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              {timeRangeTab === '30days' ? (
                <AreaChart
                  data={choreMetrics.dailyTrend}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="proactiveGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="postponeGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.6} />
                  <XAxis
                    dataKey="label"
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    interval={4}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={11}
                    domain={[0, 100]}
                    tickFormatter={(val) => `${val}%`}
                    tickLine={false}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs space-y-1.5 border border-slate-700">
                            <p className="font-semibold text-slate-200">{label}</p>
                            <div className="flex items-center gap-2 text-emerald-400">
                              <span className="w-2 h-2 rounded-full bg-emerald-400" />
                              <span>Proactive Rate: <strong>{payload[0]?.value}%</strong></span>
                            </div>
                            <div className="flex items-center gap-2 text-amber-400">
                              <span className="w-2 h-2 rounded-full bg-amber-400" />
                              <span>Postpone Rate: <strong>{payload[1]?.value}%</strong></span>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend
                    verticalAlign="top"
                    align="right"
                    iconType="circle"
                    wrapperStyle={{ fontSize: '12px', paddingBottom: '10px' }}
                  />
                  <Area
                    type="monotone"
                    name="Proactive Rate (%)"
                    dataKey="cumulativeProactiveRate"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#proactiveGradient)"
                  />
                  <Area
                    type="monotone"
                    name="Postpone Rate (%)"
                    dataKey="cumulativePostponeRate"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#postponeGradient)"
                  />
                </AreaChart>
              ) : (
                <BarChart
                  data={choreMetrics.dailyTrend.slice(-14)} // Last 14 days for clearer bar view
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.6} />
                  <XAxis dataKey="label" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} allowDecimals={false} tickLine={false} />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs space-y-1.5 border border-slate-700">
                            <p className="font-semibold text-slate-200">{label}</p>
                            <div className="text-emerald-400">Proactive Completed: {payload[0]?.value} tasks</div>
                            <div className="text-amber-400">Postponed / Delayed: {payload[1]?.value} tasks</div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ fontSize: '12px', paddingBottom: '10px' }} />
                  <Bar name="Proactive Completed" dataKey="proactive" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar name="Postponed / Delayed" dataKey="postponed" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-4 text-xs text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span><strong>Proactive:</strong> Finished before or on original deadline</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span><strong>Postpone:</strong> Delayed past planned date or rescheduled</span>
            </div>
          </div>
        </div>

        {/* Execution Health Ratio (Recharts Donut) */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Health Distribution
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Task proportion in the 30-day evaluation window
            </p>

            <div className="h-52 w-full relative mt-2 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0];
                        return (
                          <div className="bg-slate-900 text-white px-3 py-2 rounded-lg text-xs shadow-lg">
                            <span className="font-semibold">{data.name}:</span> {data.value} tasks
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* Center stat inside donut */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-black text-slate-900 dark:text-white">
                  {choreMetrics.proactiveRate}%
                </span>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Proactive
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            {pieData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-700 dark:text-slate-300 font-medium">{item.name}</span>
                </div>
                <span className="font-bold text-slate-900 dark:text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RECHARTS: Family Member Accountability Breakdown */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-2">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Family Member Performance
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Proactive vs postponed chore completion breakdown by household member (30 Days)
            </p>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Hover over bars to inspect individual proactivity rates
          </span>
        </div>

        <div className="h-64 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={choreMetrics.memberBreakdown}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.6} />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} allowDecimals={false} tickLine={false} />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const member = choreMetrics.memberBreakdown.find((m) => m.name === label);
                    return (
                      <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs space-y-1.5 border border-slate-700">
                        <div className="flex items-center gap-1.5 font-bold text-sm">
                          <span>{member?.avatar}</span>
                          <span>{label}</span>
                        </div>
                        <div className="text-emerald-400">Proactive Completed: {member?.proactive} tasks</div>
                        <div className="text-amber-400">Delayed / Postponed: {member?.delayed} tasks</div>
                        <div className="pt-1 border-t border-slate-700 text-indigo-300 font-semibold">
                          Proactive Rate: {member?.proactiveRate}%
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ fontSize: '12px', paddingBottom: '8px' }} />
              <Bar name="Proactive (Within Schedule)" dataKey="proactive" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar name="Delayed / Postponed" dataKey="delayed" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Member cards pills */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          {choreMetrics.memberBreakdown.map((m, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 text-center"
            >
              <div className="text-xl">{m.avatar}</div>
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1">{m.name}</div>
              <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">
                {m.proactiveRate}% Proactive
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                {m.proactive} on-time • {m.delayed} late
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* TWO COLUMNS: Overdue / Upcoming Chores & Grocery Urgent Rollup */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* OVERDUE & UPCOMING CHORES */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Urgent & Upcoming Chores
              </h2>
            </div>
            <button
              onClick={onNavigateToChores}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Overdue Section */}
          {overdueChores.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-rose-500" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                  Overdue Chores ({overdueChores.length})
                </h3>
              </div>
              {overdueChores.map((chore) => {
                const daysOver = Math.round(
                  (new Date().getTime() - new Date(chore.deadline).getTime()) / (1000 * 60 * 60 * 24)
                );
                return (
                  <div
                    key={chore.id}
                    className="p-3.5 rounded-2xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-slate-900 dark:text-white">
                          {chore.title}
                        </span>
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-rose-200 text-rose-800 dark:bg-rose-900 dark:text-rose-300">
                          {daysOver}d overdue
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
                        <span className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5" /> Assigned to {chore.assignedTo.name} {chore.assignedTo.avatar}
                        </span>
                        <span>•</span>
                        <span>Due {chore.deadline}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => postponeChore(chore.id, 2, 'Delayed from dashboard quick action')}
                        title="Postpone by 2 days"
                        className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition flex items-center gap-1 cursor-pointer"
                      >
                        <RotateCcw className="w-3 h-3 text-amber-500" />
                        <span>+2d</span>
                      </button>
                      <button
                        onClick={() => onOpenRescheduleModal(chore)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Done</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Upcoming Section */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Upcoming Chores (Next 7 Days)
            </h3>
            {upcomingChores.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-2">No chores scheduled for the upcoming 7 days.</p>
            ) : (
              upcomingChores.slice(0, 4).map((chore) => {
                const isToday = chore.deadline === todayStr;
                return (
                  <div
                    key={chore.id}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between gap-3 hover:border-indigo-300 transition"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-slate-800 dark:text-slate-200">
                          {chore.title}
                        </span>
                        {isToday && (
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                            Today
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-2">
                        <span>{chore.assignedTo.avatar} {chore.assignedTo.name}</span>
                        <span>•</span>
                        <span>Due {chore.deadline}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => onOpenRescheduleModal(chore)}
                      className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-700 dark:text-slate-300 hover:text-emerald-600 border border-slate-200 dark:border-slate-700 text-xs font-medium transition flex items-center gap-1 cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Log Done</span>
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* PANTRY INVENTORY HEALTH ROLLUP */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Pantry &amp; Grocery Health Alerts
              </h2>
            </div>
            <button
              onClick={onNavigateToGroceries}
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Open Pantry</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Items with low quantities below minimum threshold or approaching expiry dates:
            </p>

            {urgentGroceries.length === 0 ? (
              <div className="text-center py-8 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-200/60 dark:border-emerald-900/30">
                <ShieldCheck className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  All Groceries Fully Stocked &amp; Fresh!
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  No impending expiries or low thresholds detected.
                </p>
              </div>
            ) : (
              urgentGroceries.map((item) => {
                const expiryInfo = getExpiryStatus(item.expiryDate);
                const isLow = item.quantity <= item.minThreshold;

                return (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between gap-3 hover:border-emerald-300 transition"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-slate-900 dark:text-white">
                          {item.name}
                        </span>
                        <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border ${expiryInfo.colorClass}`}>
                          {expiryInfo.label}
                        </span>
                        {isLow && (
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                            Low Stock
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-3">
                        <span>
                          Current: <strong className="text-slate-700 dark:text-slate-300">{item.quantity} {item.unit}</strong> (Min: {item.minThreshold})
                        </span>
                        <span>•</span>
                        <span>${item.lastPricePerUnit}/{item.unit}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => onOpenTopUpModal(item.id)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold transition cursor-pointer"
                    >
                      Restock
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
