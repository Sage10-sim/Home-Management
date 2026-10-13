import React, { useState, useMemo } from 'react';
import {
  CheckSquare,
  Plus,
  FolderPlus,
  Calendar,
  User,
  Clock,
  RotateCcw,
  AlertTriangle,
  ChevronRight,
  ChevronDown,
  ChevronsUpDown,
  Search,
  Filter,
  CheckCircle2,
  Trash2,
  Edit,
  Sparkles,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { useHome } from '../../context/HomeContext';
import { Chore, ChoreCategory } from '../../types';
import {
  getAllDescendantChoreCategoryIds,
  getChoreCategoryBreadcrumbs,
} from '../../utils/choreUtils';

interface Props {
  onOpenRescheduleModal: (chore: Chore) => void;
}

export const ChoreManager: React.FC<Props> = ({ onOpenRescheduleModal }) => {
  const {
    choreCategories,
    addChoreCategory,
    deleteChoreCategory,
    chores,
    addChore,
    updateChore,
    deleteChore,
    postponeChore,
    familyMembers,
    activeUser,
  } = useHome();

  // Filters & State
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'pending' | 'overdue' | 'completed' | 'all'>('pending');
  const [memberFilter, setMemberFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Collapsible category state (all parent categories expanded by default)
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => {
    return new Set(choreCategories.map((c) => c.id));
  });

  const toggleCategoryExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const expandAllCategories = () => {
    setExpandedIds(new Set(choreCategories.map((c) => c.id)));
  };

  const collapseAllCategories = () => {
    setExpandedIds(new Set());
  };

  // Mobile drawer state
  const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] = useState(false);

  // Modals state
  const [isAddCatModalOpen, setIsAddCatModalOpen] = useState(false);
  const [newCatParentId, setNewCatParentId] = useState<string | null>(null);
  const [newCatName, setNewCatName] = useState('');

  const [isAddChoreModalOpen, setIsAddChoreModalOpen] = useState(false);
  const [editingChore, setEditingChore] = useState<Chore | null>(null);

  // Form State for Add / Edit Chore
  const [choreTitle, setChoreTitle] = useState('');
  const [choreDesc, setChoreDesc] = useState('');
  const [choreCategoryId, setChoreCategoryId] = useState('');
  const [choreDeadline, setChoreDeadline] = useState(new Date().toISOString().split('T')[0]);
  const [choreAssignedId, setChoreAssignedId] = useState(familyMembers[0]?.id || '');
  const [chorePriority, setChorePriority] = useState<'low' | 'medium' | 'high'>('medium');

  // Open add modal
  const openAddChoreModal = (catId?: string) => {
    setEditingChore(null);
    setChoreTitle('');
    setChoreDesc('');
    setChoreCategoryId(catId || selectedCategoryId || choreCategories[0]?.id || '');
    setChoreDeadline(new Date().toISOString().split('T')[0]);
    setChoreAssignedId(activeUser.id);
    setChorePriority('medium');
    setIsAddChoreModalOpen(true);
  };

  const openEditChoreModal = (chore: Chore) => {
    setEditingChore(chore);
    setChoreTitle(chore.title);
    setChoreDesc(chore.description || '');
    setChoreCategoryId(chore.categoryId);
    setChoreDeadline(chore.deadline);
    setChoreAssignedId(chore.assignedTo.id);
    setChorePriority(chore.priority);
    setIsAddChoreModalOpen(true);
  };

  const handleSaveChore = (e: React.FormEvent) => {
    e.preventDefault();
    if (!choreTitle.trim() || !choreCategoryId) return;

    const assignedMember = familyMembers.find((m) => m.id === choreAssignedId) || activeUser;

    if (editingChore) {
      updateChore(editingChore.id, {
        title: choreTitle.trim(),
        description: choreDesc.trim(),
        categoryId: choreCategoryId,
        deadline: choreDeadline,
        assignedTo: assignedMember,
        priority: chorePriority,
      });
    } else {
      addChore({
        title: choreTitle.trim(),
        description: choreDesc.trim(),
        categoryId: choreCategoryId,
        deadline: choreDeadline,
        originalDeadline: choreDeadline,
        assignedTo: assignedMember,
        priority: chorePriority,
      });
    }

    setIsAddChoreModalOpen(false);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    addChoreCategory(newCatName.trim(), newCatParentId);
    setNewCatName('');
    setIsAddCatModalOpen(false);
  };

  const todayStr = new Date().toISOString().split('T')[0];

  // Filtered chores
  const filteredChores = useMemo(() => {
    const matchingCatIds = getAllDescendantChoreCategoryIds(choreCategories, selectedCategoryId);

    return chores.filter((chore) => {
      // Category filter
      if (!matchingCatIds.includes(chore.categoryId)) return false;

      // Member filter
      if (memberFilter !== 'all' && chore.assignedTo.id !== memberFilter) {
        return false;
      }

      // Status filter
      if (statusFilter === 'pending') {
        if (chore.status !== 'pending') return false;
      } else if (statusFilter === 'overdue') {
        if (chore.status !== 'pending' || chore.deadline >= todayStr) return false;
      } else if (statusFilter === 'completed') {
        if (chore.status !== 'completed') return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = chore.title.toLowerCase().includes(q);
        const matchesDesc = (chore.description || '').toLowerCase().includes(q);
        const matchesAssignee = chore.assignedTo.name.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesAssignee) return false;
      }

      return true;
    }).sort((a, b) => {
      // Pending first sorted by deadline
      if (a.status === 'pending' && b.status === 'pending') {
        return a.deadline.localeCompare(b.deadline);
      }
      if (a.status === 'pending') return -1;
      if (b.status === 'pending') return 1;
      return (b.completedAt || '').localeCompare(a.completedAt || '');
    });
  }, [chores, choreCategories, selectedCategoryId, memberFilter, statusFilter, searchQuery, todayStr]);

  // Breadcrumbs
  const breadcrumbs = useMemo(() => {
    if (!selectedCategoryId) return [];
    return getChoreCategoryBreadcrumbs(choreCategories, selectedCategoryId);
  }, [choreCategories, selectedCategoryId]);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold text-xs uppercase tracking-wider">
            <CheckSquare className="w-4 h-4" />
            <span>Chore Scheduling • Multi-User Accountability</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            Household Chore Scheduling
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Infinite nested chore categories, proactive completion tracking, and automatic future reschedule prompts upon completion.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setNewCatParentId(selectedCategoryId);
              setIsAddCatModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold transition cursor-pointer"
          >
            <FolderPlus className="w-4 h-4 text-indigo-500" />
            <span>+ Add Subtype</span>
          </button>
          <button
            onClick={() => openAddChoreModal()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add New Chore</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Category Tree & Right Chore Board */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left: Infinite Nested Chore Categories (Collapsible on Mobile, Sidebar on Desktop) */}
        <div className="lg:col-span-1 bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between pb-2 sm:pb-3 border-b border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsMobileCategoriesOpen(!isMobileCategoriesOpen)}
              className="lg:pointer-events-none flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 text-left cursor-pointer"
            >
              <span>Chore Types</span>
              <span className="lg:hidden text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-full">
                {isMobileCategoriesOpen ? 'Hide' : 'Browse'}
              </span>
            </button>
            <div className="flex items-center gap-1">
              <button
                onClick={expandedIds.size > 0 ? collapseAllCategories : expandAllCategories}
                title={expandedIds.size > 0 ? 'Collapse all categories' : 'Expand all categories'}
                className="px-2 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 text-[11px] font-semibold flex items-center gap-1 transition cursor-pointer"
              >
                <ChevronsUpDown className="w-3 h-3 text-slate-400" />
                <span className="hidden xs:inline">{expandedIds.size > 0 ? 'Collapse' : 'Expand'}</span>
              </button>
              <button
                onClick={() => {
                  setNewCatParentId(null);
                  setIsAddCatModalOpen(true);
                }}
                title="Add Root Category"
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs flex items-center gap-1 cursor-pointer"
              >
                <FolderPlus className="w-3.5 h-3.5 text-indigo-500" />
                <span className="hidden xs:inline">Root</span>
              </button>
            </div>
          </div>

          <div className={`${isMobileCategoriesOpen ? 'block' : 'hidden lg:block'} space-y-3 animate-in fade-in`}>
            <button
              onClick={() => {
                setSelectedCategoryId(null);
                setIsMobileCategoriesOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
                selectedCategoryId === null
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4" />
                <span>All Chores (Global)</span>
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] ${selectedCategoryId === null ? 'bg-indigo-700' : 'bg-slate-200 dark:bg-slate-700'}`}>
                {chores.length}
              </span>
            </button>

            <div className="space-y-1 max-h-[380px] sm:max-h-[500px] overflow-y-auto pr-1">
              {renderChoreCategoryTree(
                choreCategories,
                null,
                0,
                selectedCategoryId,
                expandedIds,
                toggleCategoryExpand,
                (id) => {
                  setSelectedCategoryId(id);
                  if (window.innerWidth < 1024) {
                    setIsMobileCategoriesOpen(false);
                  }
                },
                (parentId) => {
                  setNewCatParentId(parentId);
                  setIsAddCatModalOpen(true);
                },
                deleteChoreCategory
              )}
            </div>
          </div>
        </div>

        {/* Right: Chore Filters & Cards */}
        <div className="lg:col-span-3 space-y-6">
          {/* Breadcrumb banner */}
          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Category:</span>
              <button
                onClick={() => setSelectedCategoryId(null)}
                className="hover:text-indigo-600 transition cursor-pointer"
              >
                All Chores
              </button>
              {breadcrumbs.map((crumb) => (
                <React.Fragment key={crumb.id}>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-bold text-slate-900 dark:text-white">{crumb.name}</span>
                </React.Fragment>
              ))}
            </div>

            <div className="text-xs text-slate-500">
              Showing <strong>{filteredChores.length}</strong> tasks
            </div>
          </div>

          {/* Search & Filters Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search chores, assignee..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              {/* Member select */}
              <select
                value={memberFilter}
                onChange={(e) => setMemberFilter(e.target.value)}
                className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none"
              >
                <option value="all">All Family Members</option>
                {familyMembers.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.avatar} {m.name} ({m.role})
                  </option>
                ))}
              </select>

              {/* Status pills */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                <button
                  onClick={() => setStatusFilter('pending')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    statusFilter === 'pending'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Pending
                </button>
                <button
                  onClick={() => setStatusFilter('overdue')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    statusFilter === 'overdue'
                      ? 'bg-rose-500 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-rose-500'
                  }`}
                >
                  Overdue
                </button>
                <button
                  onClick={() => setStatusFilter('completed')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    statusFilter === 'completed'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-emerald-500'
                  }`}
                >
                  Completed
                </button>
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    statusFilter === 'all'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  All
                </button>
              </div>
            </div>
          </div>

          {/* Chore Cards Grid */}
          {filteredChores.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6">
              <CheckSquare className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                No chores found
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1">
                There are no chores in this view. Schedule a new task or change your filter settings.
              </p>
              <button
                onClick={() => openAddChoreModal()}
                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Schedule First Chore</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredChores.map((chore) => {
                const isOverdue = chore.status === 'pending' && chore.deadline < todayStr;
                const isCompleted = chore.status === 'completed';
                const daysOver = isOverdue
                  ? Math.round((new Date().getTime() - new Date(chore.deadline).getTime()) / (1000 * 60 * 60 * 24))
                  : 0;

                return (
                  <div
                    key={chore.id}
                    className={`bg-white dark:bg-slate-900 rounded-2xl p-5 border transition flex flex-col justify-between space-y-4 shadow-xs ${
                      isOverdue
                        ? 'border-rose-300 dark:border-rose-900/60 bg-rose-50/20 dark:bg-rose-950/10'
                        : isCompleted
                        ? 'border-emerald-200 dark:border-emerald-950 bg-emerald-50/15 dark:bg-emerald-950/10 opacity-80'
                        : 'border-slate-200/80 dark:border-slate-800 hover:border-indigo-300'
                    }`}
                  >
                    <div>
                      {/* Priority & Category tags */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              chore.priority === 'high'
                                ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                                : chore.priority === 'medium'
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                                : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                            }`}
                          >
                            {chore.priority} Priority
                          </span>

                          {isOverdue && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white animate-pulse">
                              {daysOver}d Overdue
                            </span>
                          )}

                          {isCompleted && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white">
                              Completed
                            </span>
                          )}

                          {(chore.postponedCount || 0) > 0 && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800">
                              Pushed +{chore.postponedDaysTotal}d ({chore.postponedCount}x)
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => openEditChoreModal(chore)}
                            title="Edit Chore"
                            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition cursor-pointer"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteChore(chore.id)}
                            title="Delete Chore"
                            className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950 text-slate-400 hover:text-rose-600 transition cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Title & Description */}
                      <h3 className={`font-bold text-base mt-2 text-slate-900 dark:text-white ${isCompleted ? 'line-through text-slate-500' : ''}`}>
                        {chore.title}
                      </h3>

                      {chore.description && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                          {chore.description}
                        </p>
                      )}

                      <div className="text-[11px] text-slate-400 mt-2">
                        {getChoreCategoryBreadcrumbs(choreCategories, chore.categoryId)
                          .map((c) => c.name)
                          .join(' > ')}
                      </div>

                      {/* People Details: Assigned To, Created By, Done By */}
                      <div className="mt-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-1.5 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 flex items-center gap-1 text-[11px]">
                            <User className="w-3.5 h-3.5" /> Assigned to:
                          </span>
                          <span className="font-semibold text-slate-800 dark:text-slate-200">
                            {chore.assignedTo.avatar} {chore.assignedTo.name} ({chore.assignedTo.role})
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-slate-400">
                          <span>Created by:</span>
                          <span>{chore.createdBy?.name || 'Sarah'}</span>
                        </div>

                        {chore.doneBy && (
                          <div className="flex items-center justify-between text-[11px] text-emerald-600 dark:text-emerald-400 font-medium pt-1 border-t border-slate-200 dark:border-slate-700">
                            <span>Completed by:</span>
                            <span>{chore.doneBy.avatar} {chore.doneBy.name} ({chore.completedAt})</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Deadline & Action Controls */}
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1.5 text-slate-500">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Deadline:</span>
                        </span>
                        <span className={`font-semibold ${isOverdue ? 'text-rose-600 dark:text-rose-400' : 'text-slate-800 dark:text-slate-200'}`}>
                          {chore.deadline} {chore.originalDeadline !== chore.deadline ? `(Orig: ${chore.originalDeadline})` : ''}
                        </span>
                      </div>

                      {chore.status === 'pending' ? (
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => postponeChore(chore.id, 2, 'Pushed 2 days from chore board')}
                            className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <RotateCcw className="w-3.5 h-3.5 text-amber-500" />
                            <span>Postpone (+2d)</span>
                          </button>

                          {/* Trigger Reschedule Dialog on Complete! */}
                          <button
                            onClick={() => onOpenRescheduleModal(chore)}
                            className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Mark Done</span>
                          </button>
                        </div>
                      ) : (
                        <div className="text-center py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Task Finished</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* MODAL: Add / Edit Chore Category Modal */}
      {isAddCatModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {newCatParentId ? 'Add Nested Chore Subtype' : 'Add Root Chore Category'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {newCatParentId
                ? `Creating subtype under: ${getChoreCategoryBreadcrumbs(choreCategories, newCatParentId).map((c) => c.name).join(' > ')}`
                : 'Creating a top-level category node for infinite chore nesting.'}
            </p>

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Chore Category Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Daily Sanitizing, Garden Care, Car Maintenance..."
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Parent Category
                </label>
                <select
                  value={newCatParentId || ''}
                  onChange={(e) => setNewCatParentId(e.target.value || null)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">[Root Category - No Parent]</option>
                  {choreCategories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {getChoreCategoryBreadcrumbs(choreCategories, c.id).map((b) => b.name).join(' > ')}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddCatModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-sm cursor-pointer"
                >
                  Create Chore Subtype
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Add / Edit Chore Modal */}
      {isAddChoreModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {editingChore ? 'Edit Chore Task' : 'Schedule New Household Chore'}
            </h3>

            <form onSubmit={handleSaveChore} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Chore Task Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Scrub oven grates, Walk Cooper, Empty dish rack..."
                  value={choreTitle}
                  onChange={(e) => setChoreTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Category / Subtype
                </label>
                <select
                  required
                  value={choreCategoryId}
                  onChange={(e) => setChoreCategoryId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {choreCategories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {getChoreCategoryBreadcrumbs(choreCategories, c.id).map((b) => b.name).join(' > ')}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Task Assigned To
                  </label>
                  <select
                    value={choreAssignedId}
                    onChange={(e) => setChoreAssignedId(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {familyMembers.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.avatar} {m.name} ({m.role})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Priority Level
                  </label>
                  <select
                    value={chorePriority}
                    onChange={(e) => setChorePriority(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Scheduled Deadline Date
                </label>
                <input
                  type="date"
                  required
                  value={choreDeadline}
                  onChange={(e) => setChoreDeadline(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Description &amp; Detailed Instructions (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Take trash bags from kitchen, bathroom, and garage bins..."
                  value={choreDesc}
                  onChange={(e) => setChoreDesc(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                <span className="text-[11px] text-slate-400">
                  Task created by: <strong>{activeUser.name} {activeUser.avatar}</strong>
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddChoreModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-sm cursor-pointer"
                  >
                    {editingChore ? 'Save Updates' : 'Create Task'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Recursive Tree Renderer for Chore Categories with Collapsible Parents
 */
function renderChoreCategoryTree(
  categories: ChoreCategory[],
  parentId: string | null,
  depth: number,
  selectedId: string | null,
  expandedIds: Set<string>,
  onToggleExpand: (id: string) => void,
  onSelect: (id: string) => void,
  onAddSubcategory: (parentId: string) => void,
  onDeleteCategory: (id: string) => void
): React.ReactNode {
  const children = categories.filter((c) => c.parentId === parentId);
  if (children.length === 0) return null;

  return children.map((cat) => {
    const isSelected = selectedId === cat.id;
    const directChildren = categories.filter((c) => c.parentId === cat.id);
    const hasChildren = directChildren.length > 0;
    const isExpanded = expandedIds.has(cat.id);

    return (
      <div key={cat.id} className="space-y-1">
        <div
          style={{ paddingLeft: `${depth * 12}px` }}
          className={`group flex items-center justify-between rounded-xl transition py-1 pr-1.5 ${
            isSelected
              ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-200 shadow-xs'
              : 'hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-300'
          }`}
        >
          {/* Chevron expand/collapse toggle + Category selection */}
          <div className="flex items-center flex-1 min-w-0 gap-0.5">
            {hasChildren ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleExpand(cat.id);
                }}
                title={isExpanded ? 'Collapse subcategories' : 'Expand subcategories'}
                aria-label={isExpanded ? 'Collapse' : 'Expand'}
                className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition cursor-pointer shrink-0"
              >
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 text-slate-400 ${
                    isExpanded ? 'rotate-0' : '-rotate-90'
                  }`}
                />
              </button>
            ) : (
              <span className="w-5.5 inline-block shrink-0" />
            )}

            <button
              onClick={() => {
                onSelect(cat.id);
                if (hasChildren && !isExpanded) {
                  onToggleExpand(cat.id);
                }
              }}
              className={`flex-1 text-left px-1.5 py-1 text-xs font-medium flex items-center justify-between gap-1.5 cursor-pointer truncate ${
                isSelected ? 'font-bold text-indigo-700 dark:text-indigo-300' : ''
              }`}
            >
              <span className="truncate">{cat.name}</span>
              {hasChildren && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200/70 dark:bg-slate-700/70 text-slate-500 dark:text-slate-400 font-semibold shrink-0">
                  {directChildren.length}
                </span>
              )}
            </button>
          </div>

          {/* Action buttons on hover */}
          <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition shrink-0">
            <button
              onClick={() => onAddSubcategory(cat.id)}
              title="Add Subtype"
              className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 hover:text-indigo-600 transition cursor-pointer"
            >
              <FolderPlus className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDeleteCategory(cat.id)}
              title="Delete Category"
              className="p-1 rounded hover:bg-rose-100 dark:hover:bg-rose-950 text-slate-400 hover:text-rose-600 transition cursor-pointer"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Recurse for deeper subtypes ONLY when expanded */}
        {hasChildren && isExpanded && (
          <div className="space-y-1">
            {renderChoreCategoryTree(
              categories,
              cat.id,
              depth + 1,
              selectedId,
              expandedIds,
              onToggleExpand,
              onSelect,
              onAddSubcategory,
              onDeleteCategory
            )}
          </div>
        )}
      </div>
    );
  });
}
