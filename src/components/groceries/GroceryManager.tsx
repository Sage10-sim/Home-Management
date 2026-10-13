import React, { useState, useMemo } from 'react';
import {
  FolderPlus,
  Plus,
  Package,
  Layers,
  Search,
  Calendar,
  DollarSign,
  TrendingDown,
  Clock,
  User,
  AlertTriangle,
  ChevronRight,
  ChevronDown,
  ChevronsUpDown,
  Filter,
  Trash2,
  Edit,
  ArrowUpDown,
  History,
  ShoppingBag,
} from 'lucide-react';
import { useHome } from '../../context/HomeContext';
import { GroceryCategory, GroceryItem } from '../../types';
import {
  calculateConsumptionRate,
  calculateGroceryRollup,
  getCategoryBreadcrumbs,
  getExpiryStatus,
  getAllDescendantCategoryIds,
} from '../../utils/groceryUtils';

interface Props {
  initialSelectedItemId?: string | null;
}

export const GroceryManager: React.FC<Props> = ({ initialSelectedItemId }) => {
  const {
    groceryCategories,
    addGroceryCategory,
    deleteGroceryCategory,
    groceryItems,
    addGroceryItem,
    updateGroceryItem,
    deleteGroceryItem,
    topUpGroceryItem,
    consumeGroceryItem,
    activeUser,
  } = useHome();

  // Navigation & Filtering
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'lowStock' | 'expiringSoon'>('all');

  // Collapsible category state (all parent categories expanded by default)
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => {
    return new Set(groceryCategories.map((c) => c.id));
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
    setExpandedIds(new Set(groceryCategories.map((c) => c.id)));
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

  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GroceryItem | null>(null);

  // Top Up Modal State
  const [topUpItem, setTopUpItem] = useState<GroceryItem | null>(() => {
    if (initialSelectedItemId) {
      return groceryItems.find((i) => i.id === initialSelectedItemId) || null;
    }
    return null;
  });
  const [topUpQty, setTopUpQty] = useState<number>(1);
  const [topUpPrice, setTopUpPrice] = useState<number>(0);
  const [topUpExpiry, setTopUpExpiry] = useState<string>('');
  const [topUpNotes, setTopUpNotes] = useState<string>('');

  // Consume Modal State
  const [consumeItem, setConsumeItem] = useState<GroceryItem | null>(null);
  const [consumeQty, setConsumeQty] = useState<number>(1);
  const [consumeNotes, setConsumeNotes] = useState<string>('');

  // History Log Modal State
  const [historyItem, setHistoryItem] = useState<GroceryItem | null>(null);

  // Form State for Add / Edit Item
  const [itemName, setItemName] = useState('');
  const [itemCategoryId, setItemCategoryId] = useState('');
  const [itemQty, setItemQty] = useState(1);
  const [itemUnit, setItemUnit] = useState('kg');
  const [itemMinThreshold, setItemMinThreshold] = useState(1);
  const [itemPrice, setItemPrice] = useState(3.5);
  const [itemTopUpDate, setItemTopUpDate] = useState(new Date().toISOString().split('T')[0]);
  const [itemExpiryDate, setItemExpiryDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split('T')[0];
  });
  const [itemNotes, setItemNotes] = useState('');

  // Open item create modal
  const openAddItemModal = (catId?: string) => {
    setEditingItem(null);
    setItemName('');
    setItemCategoryId(catId || selectedCategoryId || groceryCategories[0]?.id || '');
    setItemQty(1);
    setItemUnit('kg');
    setItemMinThreshold(1);
    setItemPrice(3.0);
    setItemTopUpDate(new Date().toISOString().split('T')[0]);
    const d = new Date();
    d.setDate(d.getDate() + 30);
    setItemExpiryDate(d.toISOString().split('T')[0]);
    setItemNotes('');
    setIsAddItemModalOpen(true);
  };

  const openEditItemModal = (item: GroceryItem) => {
    setEditingItem(item);
    setItemName(item.name);
    setItemCategoryId(item.categoryId);
    setItemQty(item.quantity);
    setItemUnit(item.unit);
    setItemMinThreshold(item.minThreshold);
    setItemPrice(item.lastPricePerUnit);
    setItemTopUpDate(item.topUpDate);
    setItemExpiryDate(item.expiryDate);
    setItemNotes(item.notes || '');
    setIsAddItemModalOpen(true);
  };

  // Roll-up calculation for the currently selected category or entire hierarchy
  const rollup = useMemo(() => {
    return calculateGroceryRollup(groceryCategories, groceryItems, selectedCategoryId);
  }, [groceryCategories, groceryItems, selectedCategoryId]);

  // Breadcrumbs for selected category
  const breadcrumbs = useMemo(() => {
    if (!selectedCategoryId) return [];
    return getCategoryBreadcrumbs(groceryCategories, selectedCategoryId);
  }, [groceryCategories, selectedCategoryId]);

  // Filtered items list
  const filteredItems = useMemo(() => {
    const matchingCatIds = getAllDescendantCategoryIds(groceryCategories, selectedCategoryId);

    return groceryItems.filter((item) => {
      // Category match
      if (!matchingCatIds.includes(item.categoryId)) return false;

      // Search match
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesUnit = item.unit.toLowerCase().includes(query);
        const matchesUser = item.updatedBy?.name.toLowerCase().includes(query);
        if (!matchesName && !matchesUnit && !matchesUser) return false;
      }

      // Filter tabs
      if (filterMode === 'lowStock') {
        return item.quantity <= item.minThreshold;
      }
      if (filterMode === 'expiringSoon') {
        const status = getExpiryStatus(item.expiryDate);
        return status.isUrgent;
      }

      return true;
    });
  }, [groceryCategories, groceryItems, selectedCategoryId, searchQuery, filterMode]);

  // Handle submit Add/Edit item
  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName.trim() || !itemCategoryId) return;

    if (editingItem) {
      updateGroceryItem(editingItem.id, {
        name: itemName.trim(),
        categoryId: itemCategoryId,
        quantity: Number(itemQty),
        unit: itemUnit,
        minThreshold: Number(itemMinThreshold),
        lastPricePerUnit: Number(itemPrice),
        topUpDate: itemTopUpDate,
        expiryDate: itemExpiryDate,
        notes: itemNotes.trim(),
      });
    } else {
      addGroceryItem({
        name: itemName.trim(),
        categoryId: itemCategoryId,
        quantity: Number(itemQty),
        unit: itemUnit,
        minThreshold: Number(itemMinThreshold),
        lastPricePerUnit: Number(itemPrice),
        topUpDate: itemTopUpDate,
        expiryDate: itemExpiryDate,
        notes: itemNotes.trim(),
      });
    }

    setIsAddItemModalOpen(false);
  };

  // Handle add category
  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    addGroceryCategory(newCatName.trim(), newCatParentId);
    setNewCatName('');
    setIsAddCatModalOpen(false);
  };

  // Handle Top-Up Submit
  const handlePerformTopUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topUpItem || topUpQty <= 0) return;

    topUpGroceryItem(
      topUpItem.id,
      Number(topUpQty),
      Number(topUpPrice) || topUpItem.lastPricePerUnit,
      topUpExpiry || undefined,
      topUpNotes || undefined
    );

    setTopUpItem(null);
  };

  // Handle Consume Submit
  const handlePerformConsume = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consumeItem || consumeQty <= 0) return;

    consumeGroceryItem(consumeItem.id, Number(consumeQty), consumeNotes || undefined);
    setConsumeItem(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-xs uppercase tracking-wider">
            <ShoppingBag className="w-4 h-4" />
            <span>Inventory Tracking • Infinite Nesting</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            Grocery &amp; Pantry Supplies
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Organize types and subtypes infinitely. Automated consumption rate analysis, restock logs, and category rollups.
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
            <span>+ Add Subcategory</span>
          </button>
          <button
            onClick={() => openAddItemModal()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Grocery Item</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Category Tree Navigation & Right Items + Rollup */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column: Infinite Nested Category Tree (Collapsible on Mobile, Sidebar on Desktop) */}
        <div className="lg:col-span-1 bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between pb-2 sm:pb-3 border-b border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsMobileCategoriesOpen(!isMobileCategoriesOpen)}
              className="lg:pointer-events-none flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 text-left cursor-pointer"
            >
              <span>Categories</span>
              <span className="lg:hidden text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
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
                  ? 'bg-emerald-500 text-white shadow-xs'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                <span>All Groceries (Global)</span>
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] ${selectedCategoryId === null ? 'bg-emerald-600' : 'bg-slate-200 dark:bg-slate-700'}`}>
                {groceryItems.length}
              </span>
            </button>

            {/* Render Nested Categories Tree */}
            <div className="space-y-1 max-h-[380px] sm:max-h-[500px] overflow-y-auto pr-1">
              {renderCategoryTree(
                groceryCategories,
                null,
                0,
                selectedCategoryId,
                expandedIds,
                toggleCategoryExpand,
                (id) => {
                  setSelectedCategoryId(id);
                  // On mobile, auto-close the drawer on selection so user sees items right away
                  if (window.innerWidth < 1024) {
                    setIsMobileCategoriesOpen(false);
                  }
                },
                (parentId) => {
                  setNewCatParentId(parentId);
                  setIsAddCatModalOpen(true);
                },
                deleteGroceryCategory
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Category Rollup & Items List */}
        <div className="lg:col-span-3 space-y-6">
          {/* Category Breadcrumbs & Rollup Metrics Card */}
          <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-3xl p-6 shadow-md border border-slate-800">
            {/* Breadcrumb Path */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-indigo-300 font-medium mb-3">
              <button
                onClick={() => setSelectedCategoryId(null)}
                className="hover:text-white transition cursor-pointer"
              >
                All Groceries
              </button>
              {breadcrumbs.map((crumb) => (
                <React.Fragment key={crumb.id}>
                  <ChevronRight className="w-3.5 h-3.5 text-indigo-400" />
                  <button
                    onClick={() => setSelectedCategoryId(crumb.id)}
                    className="hover:text-white transition font-semibold cursor-pointer"
                  >
                    {crumb.name}
                  </button>
                </React.Fragment>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-indigo-800/60">
              <div>
                <h2 className="text-xl sm:text-2xl font-black">
                  {breadcrumbs.length > 0
                    ? breadcrumbs[breadcrumbs.length - 1].name
                    : 'All Household Inventory'}
                </h2>
                <p className="text-xs text-indigo-200/80 mt-1">
                  Rollup metrics aggregated dynamically across this category and all nested subtypes
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => openAddItemModal(selectedCategoryId || undefined)}
                  className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Item Here</span>
                </button>
              </div>
            </div>

            {/* 4 Rollup Metric Counters */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5">
              <div className="bg-white/10 rounded-2xl p-3.5 backdrop-blur border border-white/5">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-indigo-200">
                  Total Items
                </div>
                <div className="text-2xl font-black mt-1">{rollup.totalItemCount}</div>
                <div className="text-[10px] text-indigo-200/70 mt-0.5">Tracked products</div>
              </div>

              <div className="bg-white/10 rounded-2xl p-3.5 backdrop-blur border border-white/5">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-indigo-200">
                  Inventory Value
                </div>
                <div className="text-2xl font-black mt-1 text-emerald-300">
                  ${rollup.totalInventoryValue.toFixed(2)}
                </div>
                <div className="text-[10px] text-indigo-200/70 mt-0.5">At last unit price</div>
              </div>

              <div className="bg-white/10 rounded-2xl p-3.5 backdrop-blur border border-white/5">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-indigo-200">
                  Low Stock
                </div>
                <div className={`text-2xl font-black mt-1 ${rollup.lowStockItemsCount > 0 ? 'text-amber-300' : 'text-white'}`}>
                  {rollup.lowStockItemsCount}
                </div>
                <div className="text-[10px] text-indigo-200/70 mt-0.5">Below safety min</div>
              </div>

              <div className="bg-white/10 rounded-2xl p-3.5 backdrop-blur border border-white/5">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-indigo-200">
                  Expiring &lt;5d
                </div>
                <div className={`text-2xl font-black mt-1 ${rollup.expiringSoonCount > 0 ? 'text-rose-300' : 'text-white'}`}>
                  {rollup.expiringSoonCount}
                </div>
                <div className="text-[10px] text-indigo-200/70 mt-0.5">Needs consumption</div>
              </div>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search items, unit, updated by..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-center gap-1.5 self-start sm:self-auto">
              <button
                onClick={() => setFilterMode('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  filterMode === 'all'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                All ({rollup.totalItemCount})
              </button>
              <button
                onClick={() => setFilterMode('lowStock')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  filterMode === 'lowStock'
                    ? 'bg-amber-500 text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                Low Stock ({rollup.lowStockItemsCount})
              </button>
              <button
                onClick={() => setFilterMode('expiringSoon')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  filterMode === 'expiringSoon'
                    ? 'bg-rose-500 text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                Expiring Soon ({rollup.expiringSoonCount})
              </button>
            </div>
          </div>

          {/* Grocery Items List */}
          {filteredItems.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6">
              <Package className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                No grocery items found
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1">
                There are no grocery items matching the selected filters. Add a new item or select a different category.
              </p>
              <button
                onClick={() => openAddItemModal()}
                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add First Item</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredItems.map((item) => {
                const consumption = calculateConsumptionRate(item);
                const expiry = getExpiryStatus(item.expiryDate);
                const isLow = item.quantity <= item.minThreshold;
                const totalVal = (item.quantity * item.lastPricePerUnit).toFixed(2);

                return (
                  <div
                    key={item.id}
                    className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition space-y-4 flex flex-col justify-between"
                  >
                    <div>
                      {/* Card Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-base text-slate-900 dark:text-white">
                              {item.name}
                            </h3>
                            {isLow && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                                Low Stock
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {getCategoryBreadcrumbs(groceryCategories, item.categoryId)
                              .map((c) => c.name)
                              .join(' > ')}
                          </p>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => openEditItemModal(item)}
                            title="Edit Item"
                            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition cursor-pointer"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteGroceryItem(item.id)}
                            title="Delete Item"
                            className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-400 hover:text-rose-600 transition cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Quantity & Value Stats */}
                      <div className="mt-3 grid grid-cols-2 gap-2 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                        <div>
                          <div className="text-[10px] uppercase font-bold text-slate-400">Current Stock</div>
                          <div className="text-lg font-black text-slate-900 dark:text-white">
                            {item.quantity}{' '}
                            <span className="text-xs font-normal text-slate-500">{item.unit}</span>
                          </div>
                          <div className="text-[10px] text-slate-400">Min safety: {item.minThreshold} {item.unit}</div>
                        </div>

                        <div>
                          <div className="text-[10px] uppercase font-bold text-slate-400">Unit Price &amp; Val</div>
                          <div className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                            ${totalVal}
                          </div>
                          <div className="text-[10px] text-slate-400">${item.lastPricePerUnit}/{item.unit}</div>
                        </div>
                      </div>

                      {/* Consumption Rate & Expiry details */}
                      <div className="mt-3 space-y-1.5 text-xs">
                        <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                          <span className="flex items-center gap-1 text-[11px]">
                            <TrendingDown className="w-3.5 h-3.5 text-indigo-500" />
                            <span>Consumption Rate:</span>
                          </span>
                          <span className="font-semibold text-slate-800 dark:text-slate-200">
                            {consumption.formattedRate}
                          </span>
                        </div>

                        {consumption.daysUntilStockout !== null && (
                          <div className="flex items-center justify-between text-[11px] text-slate-500">
                            <span>Est. Stockout:</span>
                            <span className={`font-semibold ${consumption.daysUntilStockout <= 5 ? 'text-amber-500' : 'text-slate-700 dark:text-slate-300'}`}>
                              ~{consumption.daysUntilStockout} days
                            </span>
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-1">
                          <span className="flex items-center gap-1 text-[11px] text-slate-500">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Expiry:</span>
                          </span>
                          <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border ${expiry.colorClass}`}>
                            {item.expiryDate} ({expiry.label})
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Footer: User who updated last & Action Buttons */}
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span className="flex items-center gap-1">
                          <span>Updated by {item.updatedBy?.avatar || '👤'}</span>
                          <strong className="text-slate-600 dark:text-slate-300">{item.updatedBy?.name}</strong>
                        </span>
                        <button
                          onClick={() => setHistoryItem(item)}
                          className="hover:text-indigo-500 flex items-center gap-1 transition cursor-pointer"
                        >
                          <History className="w-3 h-3" />
                          <span>Logs ({item.logs?.length || 0})</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => {
                            setConsumeItem(item);
                            setConsumeQty(1);
                            setConsumeNotes('');
                          }}
                          className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <TrendingDown className="w-3.5 h-3.5 text-amber-500" />
                          <span>Consume</span>
                        </button>

                        <button
                          onClick={() => {
                            setTopUpItem(item);
                            setTopUpQty(1);
                            setTopUpPrice(item.lastPricePerUnit);
                            setTopUpExpiry(item.expiryDate);
                            setTopUpNotes('');
                          }}
                          className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Top Up</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* MODAL 1: Add/Edit Category Modal */}
      {isAddCatModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {newCatParentId ? 'Add Nested Subcategory' : 'Add Root Grocery Category'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {newCatParentId
                ? `Creating subtype under: ${getCategoryBreadcrumbs(groceryCategories, newCatParentId).map((c) => c.name).join(' > ')}`
                : 'Creating a top-level category node for infinite nesting.'}
            </p>

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Category / Subtype Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Grains, Breakfast Cereals, Organic Dairy..."
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Parent Category (Infinite Nesting)
                </label>
                <select
                  value={newCatParentId || ''}
                  onChange={(e) => setNewCatParentId(e.target.value || null)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">[Root Category - No Parent]</option>
                  {groceryCategories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {getCategoryBreadcrumbs(groceryCategories, c.id).map((b) => b.name).join(' > ')}
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
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-sm cursor-pointer"
                >
                  Create Subcategory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Add / Edit Item Modal */}
      {isAddItemModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {editingItem ? 'Edit Grocery Item' : 'Add New Grocery Item'}
            </h3>

            <form onSubmit={handleSaveItem} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Item Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Basmati Rice, Whole Milk, Dish Soap..."
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Assigned Category / Subtype
                </label>
                <select
                  required
                  value={itemCategoryId}
                  onChange={(e) => setItemCategoryId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {groceryCategories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {getCategoryBreadcrumbs(groceryCategories, c.id).map((b) => b.name).join(' > ')}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Current Quantity
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    required
                    value={itemQty}
                    onChange={(e) => setItemQty(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Measurement Unit
                  </label>
                  <select
                    value={itemUnit}
                    onChange={(e) => setItemUnit(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="kg">kg (Kilograms)</option>
                    <option value="g">g (Grams)</option>
                    <option value="L">L (Litres)</option>
                    <option value="ml">ml (Millilitres)</option>
                    <option value="pcs">pcs (Pieces)</option>
                    <option value="packs">packs (Packs)</option>
                    <option value="cans">cans (Cans)</option>
                    <option value="bottles">bottles (Bottles)</option>
                    <option value="boxes">boxes (Boxes)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Min Safety Threshold
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    required
                    value={itemMinThreshold}
                    onChange={(e) => setItemMinThreshold(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Last Price per Unit ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={itemPrice}
                    onChange={(e) => setItemPrice(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Top Up Date
                  </label>
                  <input
                    type="date"
                    required
                    value={itemTopUpDate}
                    onChange={(e) => setItemTopUpDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    required
                    value={itemExpiryDate}
                    onChange={(e) => setItemExpiryDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Notes / Brand Preferences
                </label>
                <input
                  type="text"
                  placeholder="Optional brand notes, storage location..."
                  value={itemNotes}
                  onChange={(e) => setItemNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                <span className="text-[11px] text-slate-400">
                  Will record update by: <strong>{activeUser.name} {activeUser.avatar}</strong>
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddItemModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-sm cursor-pointer"
                  >
                    {editingItem ? 'Save Changes' : 'Create Item'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Top Up / Restock Modal */}
      {topUpItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <ShoppingBag className="w-5 h-5" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Restock &amp; Top Up Item
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Adding quantity to <strong>{topUpItem.name}</strong>. Current quantity is {topUpItem.quantity} {topUpItem.unit}.
            </p>

            <form onSubmit={handlePerformTopUp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Quantity to Add ({topUpItem.unit})
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  required
                  value={topUpQty}
                  onChange={(e) => setTopUpQty(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Last Unit Purchase Price ($ per {topUpItem.unit})
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={topUpPrice}
                  onChange={(e) => setTopUpPrice(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  New Batch Expiry Date (Optional)
                </label>
                <input
                  type="date"
                  value={topUpExpiry}
                  onChange={(e) => setTopUpExpiry(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Notes
                </label>
                <input
                  type="text"
                  placeholder="e.g. Bought from Farmers Market, 2 for 1 deal..."
                  value={topUpNotes}
                  onChange={(e) => setTopUpNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs">
                New stock will become: <strong>{(topUpItem.quantity + Number(topUpQty)).toFixed(2)} {topUpItem.unit}</strong>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-slate-400">
                  Logged by: {activeUser.name} {activeUser.avatar}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setTopUpItem(null)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-sm cursor-pointer"
                  >
                    Confirm Restock
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: Log Consumption Modal */}
      {consumeItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
              <TrendingDown className="w-5 h-5" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Log Consumption
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Record usage for <strong>{consumeItem.name}</strong> to update automatic consumption rate metrics.
            </p>

            <form onSubmit={handlePerformConsume} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Quantity Consumed ({consumeItem.unit})
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  max={consumeItem.quantity}
                  required
                  value={consumeQty}
                  onChange={(e) => setConsumeQty(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Note / Recipe / Reason (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Used for Sunday family dinner, breakfast shakes..."
                  value={consumeNotes}
                  onChange={(e) => setConsumeNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300">
                Remaining stock will be: <strong>{Math.max(0, consumeItem.quantity - Number(consumeQty)).toFixed(2)} {consumeItem.unit}</strong>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-slate-400">
                  Logged by: {activeUser.name} {activeUser.avatar}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setConsumeItem(null)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition shadow-sm cursor-pointer"
                  >
                    Log Consumption
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: Item History & Consumption Logs */}
      {historyItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[85vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-indigo-500" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Activity Logs: {historyItem.name}
                </h3>
              </div>
              <button
                onClick={() => setHistoryItem(null)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold p-1 cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            <div className="space-y-2.5">
              {historyItem.logs && historyItem.logs.length > 0 ? (
                historyItem.logs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          log.action === 'topup'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}>
                          {log.action === 'topup' ? `+${log.deltaQuantity} ${historyItem.unit} Restock` : `${log.deltaQuantity} ${historyItem.unit} Used`}
                        </span>
                        <span className="text-slate-400">{log.date}</span>
                      </div>
                      {log.notes && (
                        <p className="text-slate-600 dark:text-slate-300 mt-1 italic">
                          "{log.notes}"
                        </p>
                      )}
                    </div>

                    <div className="text-right text-[11px] text-slate-500">
                      <span>Logged by</span>
                      <div className="font-semibold text-slate-700 dark:text-slate-300">{log.userName}</div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic text-center py-4">No logged history events yet.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Recursive Tree Renderer for Infinite Nesting Categories with Collapsible Parents
 */
function renderCategoryTree(
  categories: GroceryCategory[],
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
              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 shadow-xs'
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
                isSelected ? 'font-bold text-emerald-700 dark:text-emerald-300' : ''
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
              className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 hover:text-emerald-600 transition cursor-pointer"
            >
              <FolderPlus className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDeleteCategory(cat.id)}
              title="Delete Category &amp; Subtypes"
              className="p-1 rounded hover:bg-rose-100 dark:hover:bg-rose-950 text-slate-400 hover:text-rose-600 transition cursor-pointer"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Recurse for deeper subtypes ONLY when expanded */}
        {hasChildren && isExpanded && (
          <div className="space-y-1">
            {renderCategoryTree(
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
