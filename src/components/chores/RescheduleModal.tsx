import React, { useState } from 'react';
import {
  CheckCircle2,
  Calendar,
  RotateCw,
  Sparkles,
  User,
  ArrowRight,
  Clock,
  X,
} from 'lucide-react';
import { useHome } from '../../context/HomeContext';
import { Chore } from '../../types';

interface Props {
  chore: Chore;
  onClose: () => void;
}

export const RescheduleModal: React.FC<Props> = ({ chore, onClose }) => {
  const { completeChore, familyMembers, activeUser } = useHome();

  // Helper to format offset date
  const getOffsetDate = (days: number): string => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString().split('T')[0];
  };

  const [rescheduleChoice, setRescheduleChoice] = useState<'preset' | 'custom' | 'none'>('preset');
  const [selectedPresetDays, setSelectedPresetDays] = useState<number>(7);
  const [customDate, setCustomDate] = useState<string>(getOffsetDate(7));
  const [assigneeId, setAssigneeId] = useState<string>(chore.assignedTo.id);

  const presets = [
    { label: 'Tomorrow', days: 1, desc: '+1 day' },
    { label: 'In 3 Days', days: 3, desc: '+3 days' },
    { label: 'Next Week', days: 7, desc: '+7 days' },
    { label: 'In 2 Weeks', days: 14, desc: '+14 days' },
    { label: 'Next Month', days: 30, desc: '+30 days' },
  ];

  const handleCompleteAndSchedule = (shouldReschedule: boolean) => {
    if (!shouldReschedule) {
      completeChore(chore.id, { shouldReschedule: false });
    } else {
      const nextDeadline =
        rescheduleChoice === 'custom' ? customDate : getOffsetDate(selectedPresetDays);

      completeChore(chore.id, {
        shouldReschedule: true,
        newDeadline: nextDeadline,
        assignToMemberId: assigneeId,
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-4 sm:p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 sm:space-y-5 animate-in fade-in duration-200 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Log Chore Completed
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Logged done by <strong>{activeUser.name} {activeUser.avatar}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Task Card Highlight */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-1">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
            Task Finished
          </span>
          <div className="font-bold text-base text-slate-900 dark:text-white">
            {chore.title}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Original planned deadline: {chore.originalDeadline} • Assigned to {chore.assignedTo.name}
          </div>
        </div>

        {/* Feature 2b Prompt Question */}
        <div className="space-y-3 pt-1">
          <div className="flex items-center gap-2">
            <RotateCw className="w-4 h-4 text-indigo-500" />
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Schedule this task again for a future date?
            </h4>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Most household chores are recurring. Choose a recurrence cadence below, or mark this task as one-time complete.
          </p>

          {/* Preset Buttons Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {presets.map((preset) => {
              const isSelected =
                rescheduleChoice === 'preset' && selectedPresetDays === preset.days;

              return (
                <button
                  key={preset.days}
                  type="button"
                  onClick={() => {
                    setRescheduleChoice('preset');
                    setSelectedPresetDays(preset.days);
                  }}
                  className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-200 shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="font-bold text-xs">{preset.label}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{getOffsetDate(preset.days)}</div>
                </button>
              );
            })}

            {/* Custom Date Picker Card */}
            <button
              type="button"
              onClick={() => setRescheduleChoice('custom')}
              className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
                rescheduleChoice === 'custom'
                  ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-200 shadow-xs'
                  : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <div className="font-bold text-xs flex items-center gap-1">
                <Calendar className="w-3 h-3 text-indigo-500" />
                <span>Custom Date</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Pick specific day</div>
            </button>
          </div>

          {/* If custom date is picked */}
          {rescheduleChoice === 'custom' && (
            <div className="pt-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Choose Specific Future Date
              </label>
              <input
                type="date"
                min={getOffsetDate(1)}
                value={customDate}
                onChange={(e) => setCustomDate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          )}

          {/* Member Assignment for Next Cycle */}
          {rescheduleChoice !== 'none' && (
            <div className="pt-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Assign Next Cycle To
              </label>
              <select
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {familyMembers.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.avatar} {m.name} ({m.role}) {m.id === chore.assignedTo.id ? '• [Current Assignee]' : ''}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={() => handleCompleteAndSchedule(false)}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            Just Complete (Don't Reschedule)
          </button>

          <button
            type="button"
            onClick={() => handleCompleteAndSchedule(true)}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Complete &amp; Schedule Next</span>
          </button>
        </div>
      </div>
    </div>
  );
};
