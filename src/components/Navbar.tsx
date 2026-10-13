import React, { useState } from 'react';
import {
  LayoutDashboard,
  ShoppingBag,
  CheckSquare,
  Calendar,
  Users,
  RotateCcw,
  Plus,
  Home,
  ChevronDown,
  Sparkles,
  Edit3,
  User,
  Settings,
} from 'lucide-react';
import { useHome } from '../context/HomeContext';
import { EditProfileModal } from './profile/EditProfileModal';
import { FamilyMember } from '../types';

interface Props {
  currentTab: 'dashboard' | 'groceries' | 'chores' | 'calendar';
  onSelectTab: (tab: 'dashboard' | 'groceries' | 'chores' | 'calendar') => void;
  onOpenNewChoreModal: () => void;
  onOpenNewItemModal: () => void;
}

export const Navbar: React.FC<Props> = ({
  currentTab,
  onSelectTab,
  onOpenNewChoreModal,
  onOpenNewItemModal,
}) => {
  const {
    familyMembers,
    activeUser,
    setActiveUser,
    addFamilyMember,
    chores,
    groceryItems,
    choreMetrics,
    resetToDemoData,
  } = useHome();

  const [isMemberDropdownOpen, setIsMemberDropdownOpen] = useState(false);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [memberToEdit, setMemberToEdit] = useState<FamilyMember | null>(null);

  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('');
  const [newMemberAvatar, setNewMemberAvatar] = useState('🧑');
  const [newMemberColor, setNewMemberColor] = useState('#3b82f6');

  const overdueCount = chores.filter(
    (c) => c.status === 'pending' && c.deadline < new Date().toISOString().split('T')[0]
  ).length;

  const lowStockCount = groceryItems.filter((i) => i.quantity <= i.minThreshold).length;

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;

    addFamilyMember(newMemberName.trim(), newMemberRole.trim() || 'Member', newMemberAvatar, newMemberColor);
    setNewMemberName('');
    setNewMemberRole('');
    setIsAddMemberModalOpen(false);
  };

  const openEditProfile = (member?: FamilyMember) => {
    setMemberToEdit(member || activeUser);
    setIsMemberDropdownOpen(false);
    setIsEditProfileModalOpen(true);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-20 gap-2 sm:gap-4">
            {/* Logo & Brand */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="h-9 w-9 sm:h-11 sm:w-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 shrink-0">
                <Home className="w-4 h-4 sm:w-6 sm:h-6" />
              </div>
              <div>
                <div className="flex items-center gap-1 sm:gap-1.5">
                  <span className="font-black text-base sm:text-xl tracking-tight text-slate-900 dark:text-white">
                    KinPulse
                  </span>
                  <span className="px-1.5 py-0.2 text-[9px] sm:text-[10px] font-bold rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    HUB
                  </span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-slate-400 hidden sm:block">
                  Collaborative Home &amp; Inventory Hub
                </p>
              </div>
            </div>

            {/* Desktop Navigation Tabs */}
            <nav className="hidden md:flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-2xl">
              <button
                onClick={() => onSelectTab('dashboard')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  currentTab === 'dashboard'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
                {overdueCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-500 text-white font-black">
                    {overdueCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => onSelectTab('groceries')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  currentTab === 'groceries'
                    ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Groceries &amp; Pantry</span>
                {lowStockCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500 text-white font-bold">
                    {lowStockCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => onSelectTab('chores')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  currentTab === 'chores'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <CheckSquare className="w-4 h-4" />
                <span>Chore Schedule</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-bold">
                  {choreMetrics.pendingCount}
                </span>
              </button>

              <button
                onClick={() => onSelectTab('calendar')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  currentTab === 'calendar'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>Family Calendar</span>
              </button>
            </nav>

            {/* Right Action: Active User Switcher & Edit Profile */}
            <div className="flex items-center gap-1.5 sm:gap-3">
              {/* Quick Profile Switcher / Editor */}
              <div className="relative">
                <button
                  onClick={() => setIsMemberDropdownOpen(!isMemberDropdownOpen)}
                  className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 hover:border-indigo-400 transition cursor-pointer"
                >
                  <span className="text-lg sm:text-xl">{activeUser.avatar}</span>
                  <div className="text-left">
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">
                      {activeUser.name}
                    </div>
                    <div className="text-[9px] sm:text-[10px] text-slate-400 leading-tight hidden xs:block">
                      {activeUser.role}
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {isMemberDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-72 max-w-[90vw] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-2.5 z-50 animate-in fade-in">
                    <div className="flex items-center justify-between px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800">
                      <span>Family Profiles</span>
                      <button
                        onClick={() => openEditProfile(activeUser)}
                        className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer font-bold lowercase first-letter:uppercase"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>edit active</span>
                      </button>
                    </div>

                    <div className="space-y-1 py-1.5 max-h-56 overflow-y-auto">
                      {familyMembers.map((member) => (
                        <div
                          key={member.id}
                          className={`w-full px-2.5 py-1.5 rounded-xl text-xs flex items-center justify-between transition group ${
                            activeUser.id === member.id
                              ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold'
                              : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <button
                            onClick={() => {
                              setActiveUser(member);
                              setIsMemberDropdownOpen(false);
                            }}
                            className="flex items-center gap-2 flex-1 text-left cursor-pointer truncate"
                          >
                            <span className="text-lg shrink-0">{member.avatar}</span>
                            <div className="truncate">
                              <div className="truncate">{member.name}</div>
                              <div className="text-[10px] text-slate-400 font-normal truncate">{member.role}</div>
                            </div>
                          </button>

                          <div className="flex items-center gap-1 shrink-0">
                            {activeUser.id === member.id && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-indigo-600 text-white font-bold">
                                Active
                              </span>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openEditProfile(member);
                              }}
                              title={`Edit ${member.name}'s profile`}
                              className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-indigo-600 transition cursor-pointer"
                            >
                              <Edit3 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <button
                        onClick={() => {
                          setIsMemberDropdownOpen(false);
                          setIsAddMemberModalOpen(true);
                        }}
                        className="text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>+ Add Member</span>
                      </button>

                      <button
                        onClick={() => {
                          if (window.confirm('Reset all groceries, chores, and 30-day logs to initial sample data?')) {
                            resetToDemoData();
                            setIsMemberDropdownOpen(false);
                          }
                        }}
                        title="Reset to sample demo data"
                        className="text-[11px] text-slate-400 hover:text-rose-500 transition flex items-center gap-1 cursor-pointer"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Reset Demo</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Fixed Bottom Mobile Navigation Bar (Phones) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 md:hidden py-1 px-2 shadow-lg safe-bottom">
        <div className="flex items-center justify-around text-xs">
          <button
            onClick={() => onSelectTab('dashboard')}
            className={`flex flex-col items-center py-1 px-2 rounded-xl transition cursor-pointer relative ${
              currentTab === 'dashboard'
                ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <div className="relative">
              <LayoutDashboard className="w-5 h-5" />
              {overdueCount > 0 && (
                <span className="absolute -top-1 -right-2 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-rose-500 text-[9px] font-black text-white">
                  {overdueCount}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-0.5">Dashboard</span>
          </button>

          <button
            onClick={() => onSelectTab('groceries')}
            className={`flex flex-col items-center py-1 px-2 rounded-xl transition cursor-pointer relative ${
              currentTab === 'groceries'
                ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5" />
              {lowStockCount > 0 && (
                <span className="absolute -top-1 -right-2 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-amber-500 text-[9px] font-black text-white">
                  {lowStockCount}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-0.5">Groceries</span>
          </button>

          <button
            onClick={() => onSelectTab('chores')}
            className={`flex flex-col items-center py-1 px-2 rounded-xl transition cursor-pointer relative ${
              currentTab === 'chores'
                ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <div className="relative">
              <CheckSquare className="w-5 h-5" />
              <span className="absolute -top-1 -right-2 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-indigo-500 text-[9px] font-black text-white">
                {choreMetrics.pendingCount}
              </span>
            </div>
            <span className="text-[10px] mt-0.5">Chores</span>
          </button>

          <button
            onClick={() => onSelectTab('calendar')}
            className={`flex flex-col items-center py-1 px-2 rounded-xl transition cursor-pointer relative ${
              currentTab === 'calendar'
                ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Calendar</span>
          </button>
        </div>
      </nav>

      {/* Edit Profile Modal */}
      {isEditProfileModalOpen && (
        <EditProfileModal
          memberToEdit={memberToEdit}
          onClose={() => {
            setIsEditProfileModalOpen(false);
            setMemberToEdit(null);
          }}
        />
      )}

      {/* Add Member Modal */}
      {isAddMemberModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Add Family Member
            </h3>

            <form onSubmit={handleAddMember} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Olivia, Liam, Grandma Rose..."
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Family Role
                </label>
                <input
                  type="text"
                  placeholder="e.g. Daughter, Brother, Roommate..."
                  value={newMemberRole}
                  onChange={(e) => setNewMemberRole(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Avatar Emoji
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {['👩', '👨', '🧑', '👧', '👦', '👵', '👴', '👶', '🐱', '🐶'].map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setNewMemberAvatar(emoji)}
                      className={`text-xl p-2 rounded-xl border cursor-pointer flex items-center justify-center ${
                        newMemberAvatar === emoji ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/60' : 'border-transparent hover:bg-slate-100'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddMemberModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-sm cursor-pointer"
                >
                  Save Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
