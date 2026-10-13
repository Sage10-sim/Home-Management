import React, { useState } from 'react';
import {
  User,
  X,
  Check,
  Trash2,
  Sparkles,
  Palette,
  ShieldAlert,
} from 'lucide-react';
import { useHome } from '../../context/HomeContext';
import { FamilyMember } from '../../types';

interface Props {
  memberToEdit?: FamilyMember | null;
  onClose: () => void;
}

const PRESET_EMOJIS = ['👩', '👨', '🧑', '👧', '👦', '👵', '👴', '👶', '🐱', '🐶', '🦄', '🧙‍♂️', '🦸‍♀️', '🚴'];

const COLOR_PALETTE = [
  { name: 'Rose', hex: '#ec4899' },
  { name: 'Blue', hex: '#3b82f6' },
  { name: 'Indigo', hex: '#6366f1' },
  { name: 'Emerald', hex: '#10b981' },
  { name: 'Amber', hex: '#f59e0b' },
  { name: 'Purple', hex: '#8b5cf6' },
  { name: 'Cyan', hex: '#06b6d4' },
  { name: 'Orange', hex: '#f97316' },
];

export const EditProfileModal: React.FC<Props> = ({ memberToEdit, onClose }) => {
  const {
    familyMembers,
    activeUser,
    updateFamilyMember,
    deleteFamilyMember,
    setActiveUser,
  } = useHome();

  const [selectedMemberId, setSelectedMemberId] = useState<string>(
    memberToEdit?.id || activeUser.id
  );

  const currentMember = familyMembers.find((m) => m.id === selectedMemberId) || activeUser;

  const [name, setName] = useState(currentMember.name);
  const [role, setRole] = useState(currentMember.role);
  const [avatar, setAvatar] = useState(currentMember.avatar);
  const [color, setColor] = useState(currentMember.color);

  // Sync state when switching member in modal
  const handleSelectMember = (member: FamilyMember) => {
    setSelectedMemberId(member.id);
    setName(member.name);
    setRole(member.role);
    setAvatar(member.avatar);
    setColor(member.color);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    updateFamilyMember(selectedMemberId, {
      name: name.trim(),
      role: role.trim() || 'Family Member',
      avatar: avatar.trim() || '🧑',
      color,
    });

    onClose();
  };

  const handleDelete = () => {
    if (familyMembers.length <= 1) {
      alert('You must have at least one family member in your household.');
      return;
    }
    if (window.confirm(`Are you sure you want to remove ${currentMember.name} from the household?`)) {
      deleteFamilyMember(selectedMemberId);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5 animate-in fade-in duration-200 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Edit Household Profile
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
                Customize avatar, family role, and theme color
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

        {/* Member Selector Pills */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Select Member to Edit
          </label>
          <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-thin">
            {familyMembers.map((member) => (
              <button
                key={member.id}
                type="button"
                onClick={() => handleSelectMember(member)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition cursor-pointer border ${
                  selectedMemberId === member.id
                    ? 'bg-indigo-50 dark:bg-indigo-950/80 border-indigo-400 text-indigo-900 dark:text-indigo-200 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200/60 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                }`}
              >
                <span>{member.avatar}</span>
                <span>{member.name}</span>
                {member.id === activeUser.id && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Live Profile Badge Preview */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              style={{ backgroundColor: `${color}20`, borderColor: color }}
              className="w-12 h-12 rounded-2xl border-2 flex items-center justify-center text-2xl shadow-xs"
            >
              {avatar || '🧑'}
            </div>
            <div>
              <div className="font-bold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>{name || 'Member Name'}</span>
                {selectedMemberId === activeUser.id && (
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                    Active
                  </span>
                )}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {role || 'Family Member'}
              </div>
            </div>
          </div>

          <div
            style={{ backgroundColor: color }}
            className="w-3.5 h-3.5 rounded-full ring-4 ring-white dark:ring-slate-900 shadow-xs"
            title="Theme Color"
          />
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Display Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sarah, Dad, Leo..."
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Household Role
            </label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Mom, Dad, Teenager, Kid, Roommate..."
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Avatar Emoji Selector */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Choose Avatar Emoji
              </label>
              <input
                type="text"
                maxLength={4}
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                placeholder="Custom emoji"
                className="w-20 px-2 py-0.5 text-xs text-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
            <div className="grid grid-cols-7 gap-1.5 bg-slate-50 dark:bg-slate-800/40 p-2 rounded-2xl border border-slate-200/60 dark:border-slate-800">
              {PRESET_EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setAvatar(emoji)}
                  className={`text-xl p-2 rounded-xl flex items-center justify-center transition cursor-pointer hover:scale-110 ${
                    avatar === emoji
                      ? 'bg-indigo-100 dark:bg-indigo-950 border border-indigo-400'
                      : 'hover:bg-slate-200/60 dark:hover:bg-slate-700'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Theme Color Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Accent Color
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              {COLOR_PALETTE.map((pal) => (
                <button
                  key={pal.hex}
                  type="button"
                  onClick={() => setColor(pal.hex)}
                  style={{ backgroundColor: pal.hex }}
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition cursor-pointer hover:scale-110 ${
                    color === pal.hex ? 'ring-2 ring-offset-2 ring-indigo-500 scale-105' : ''
                  }`}
                  title={pal.name}
                >
                  {color === pal.hex && <Check className="w-3.5 h-3.5 text-white" />}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            {familyMembers.length > 1 ? (
              <button
                type="button"
                onClick={handleDelete}
                className="text-xs text-rose-500 hover:text-rose-700 font-semibold flex items-center gap-1 transition cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            ) : (
              <span className="text-[10px] text-slate-400">Primary profile</span>
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-sm cursor-pointer"
              >
                Save Profile
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
