/**
 * KinPulse - Family Home & Inventory Hub
 * Pure Native Vanilla JavaScript (No React, No Build Tools Required)
 * Can run directly in any browser and on GitHub Pages!
 */

// ==========================================
// 1. INITIAL DATA & CONSTANTS
// ==========================================

const INITIAL_MEMBERS = [
  { id: 'user-1', name: 'Sarah', role: 'Mom', avatar: '👩', color: '#ec4899' },
  { id: 'user-2', name: 'David', role: 'Dad', avatar: '👨', color: '#3b82f6' },
  { id: 'user-3', name: 'Alex', role: 'Teen', avatar: '🧑', color: '#10b981' },
  { id: 'user-4', name: 'Maya', role: 'Kid', avatar: '👧', color: '#f59e0b' },
  { id: 'user-5', name: 'Joe', role: 'Grandpa', avatar: '👴', color: '#8b5cf6' },
];

const INITIAL_GROCERY_CATS = [
  { id: 'cat-food', name: 'Food & Groceries', parentId: null },
  { id: 'cat-household', name: 'Household & Supplies', parentId: null },
  { id: 'cat-pantry', name: 'Pantry Staples', parentId: 'cat-food' },
  { id: 'cat-dairy', name: 'Dairy & Chilled', parentId: 'cat-food' },
  { id: 'cat-produce', name: 'Fresh Produce', parentId: 'cat-food' },
  { id: 'cat-grains', name: 'Grains & Pasta', parentId: 'cat-pantry' },
  { id: 'cat-oils', name: 'Oils & Condiments', parentId: 'cat-pantry' },
  { id: 'cat-milk', name: 'Milk & Alternatives', parentId: 'cat-dairy' },
  { id: 'cat-cheese', name: 'Cheese & Spreads', parentId: 'cat-dairy' },
  { id: 'cat-fruits', name: 'Fruits', parentId: 'cat-produce' },
  { id: 'cat-veg', name: 'Vegetables & Greens', parentId: 'cat-produce' },
  { id: 'cat-cleaning', name: 'Cleaning Essentials', parentId: 'cat-household' },
  { id: 'cat-paper', name: 'Paper & Hygiene', parentId: 'cat-household' },
];

const getRelDate = (offset) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().split('T')[0];
};

const INITIAL_GROCERY_ITEMS = [
  {
    id: 'item-1',
    name: 'Basmati Rice (Aged)',
    categoryId: 'cat-grains',
    quantity: 4.5,
    unit: 'kg',
    minThreshold: 2.0,
    lastPricePerUnit: 3.4,
    topUpDate: getRelDate(-14),
    expiryDate: getRelDate(180),
    updatedBy: INITIAL_MEMBERS[0],
    updatedAt: new Date(Date.now() - 14 * 86400000).toISOString(),
    notes: 'Royal Himalayan brand',
    logs: [
      { id: 'l1', date: getRelDate(-35), deltaQuantity: 10, action: 'topup', pricePerUnit: 3.2, userName: 'Sarah' },
      { id: 'l2', date: getRelDate(-25), deltaQuantity: -2.5, action: 'consume', userName: 'David' },
      { id: 'l3', date: getRelDate(-14), deltaQuantity: 5, action: 'topup', pricePerUnit: 3.4, userName: 'Sarah' },
      { id: 'l4', date: getRelDate(-5), deltaQuantity: -3.0, action: 'consume', userName: 'Alex' },
    ],
  },
  {
    id: 'item-2',
    name: 'Organic Penne Rigate',
    categoryId: 'cat-grains',
    quantity: 1.2,
    unit: 'kg',
    minThreshold: 1.5,
    lastPricePerUnit: 2.8,
    topUpDate: getRelDate(-20),
    expiryDate: getRelDate(240),
    updatedBy: INITIAL_MEMBERS[1],
    updatedAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    logs: [
      { id: 'l5', date: getRelDate(-40), deltaQuantity: 4, action: 'topup', pricePerUnit: 2.7, userName: 'David' },
      { id: 'l6', date: getRelDate(-18), deltaQuantity: -1.8, action: 'consume', userName: 'Sarah' },
      { id: 'l7', date: getRelDate(-4), deltaQuantity: -1.0, action: 'consume', userName: 'Maya' },
    ],
  },
  {
    id: 'item-3',
    name: 'Extra Virgin Olive Oil',
    categoryId: 'cat-oils',
    quantity: 1.8,
    unit: 'L',
    minThreshold: 0.8,
    lastPricePerUnit: 14.5,
    topUpDate: getRelDate(-12),
    expiryDate: getRelDate(120),
    updatedBy: INITIAL_MEMBERS[0],
    updatedAt: new Date(Date.now() - 12 * 86400000).toISOString(),
    logs: [
      { id: 'l8', date: getRelDate(-12), deltaQuantity: 2.5, action: 'topup', pricePerUnit: 14.5, userName: 'Sarah' },
      { id: 'l9', date: getRelDate(-3), deltaQuantity: -0.7, action: 'consume', userName: 'David' },
    ],
  },
  {
    id: 'item-4',
    name: 'Whole Milk Organic',
    categoryId: 'cat-milk',
    quantity: 1.5,
    unit: 'L',
    minThreshold: 2.0,
    lastPricePerUnit: 2.1,
    topUpDate: getRelDate(-4),
    expiryDate: getRelDate(2),
    updatedBy: INITIAL_MEMBERS[1],
    updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    logs: [
      { id: 'l10', date: getRelDate(-11), deltaQuantity: 4, action: 'topup', pricePerUnit: 2.1, userName: 'David' },
      { id: 'l11', date: getRelDate(-7), deltaQuantity: -2.5, action: 'consume', userName: 'Alex' },
      { id: 'l12', date: getRelDate(-4), deltaQuantity: 3, action: 'topup', pricePerUnit: 2.1, userName: 'Sarah' },
      { id: 'l13', date: getRelDate(-1), deltaQuantity: -1.5, action: 'consume', userName: 'Maya' },
    ],
  },
  {
    id: 'item-5',
    name: 'Oat Barista Blend',
    categoryId: 'cat-milk',
    quantity: 3.0,
    unit: 'L',
    minThreshold: 1.5,
    lastPricePerUnit: 3.75,
    topUpDate: getRelDate(-6),
    expiryDate: getRelDate(45),
    updatedBy: INITIAL_MEMBERS[2],
    updatedAt: new Date(Date.now() - 6 * 86400000).toISOString(),
    logs: [
      { id: 'l14', date: getRelDate(-20), deltaQuantity: 6, action: 'topup', pricePerUnit: 3.7, userName: 'David' },
      { id: 'l15', date: getRelDate(-12), deltaQuantity: -3, action: 'consume', userName: 'David' },
      { id: 'l16', date: getRelDate(-6), deltaQuantity: 4, action: 'topup', pricePerUnit: 3.75, userName: 'Alex' },
    ],
  },
  {
    id: 'item-6',
    name: 'Sharp Cheddar Block',
    categoryId: 'cat-cheese',
    quantity: 0.8,
    unit: 'kg',
    minThreshold: 0.5,
    lastPricePerUnit: 12.0,
    topUpDate: getRelDate(-9),
    expiryDate: getRelDate(18),
    updatedBy: INITIAL_MEMBERS[0],
    updatedAt: new Date(Date.now() - 9 * 86400000).toISOString(),
    logs: [
      { id: 'l17', date: getRelDate(-9), deltaQuantity: 1.2, action: 'topup', pricePerUnit: 12.0, userName: 'Sarah' },
      { id: 'l18', date: getRelDate(-3), deltaQuantity: -0.4, action: 'consume', userName: 'Maya' },
    ],
  },
  {
    id: 'item-7',
    name: 'Organic Bananas',
    categoryId: 'cat-fruits',
    quantity: 1.2,
    unit: 'kg',
    minThreshold: 1.0,
    lastPricePerUnit: 1.95,
    topUpDate: getRelDate(-3),
    expiryDate: getRelDate(3),
    updatedBy: INITIAL_MEMBERS[1],
    updatedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    logs: [
      { id: 'l19', date: getRelDate(-8), deltaQuantity: 3.0, action: 'topup', pricePerUnit: 1.85, userName: 'Sarah' },
      { id: 'l20', date: getRelDate(-3), deltaQuantity: 2.0, action: 'topup', pricePerUnit: 1.95, userName: 'David' },
    ],
  },
  {
    id: 'item-8',
    name: 'Fresh Baby Spinach',
    categoryId: 'cat-veg',
    quantity: 0.3,
    unit: 'kg',
    minThreshold: 0.6,
    lastPricePerUnit: 9.5,
    topUpDate: getRelDate(-4),
    expiryDate: getRelDate(1),
    updatedBy: INITIAL_MEMBERS[0],
    updatedAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    logs: [
      { id: 'l21', date: getRelDate(-10), deltaQuantity: 1.0, action: 'topup', pricePerUnit: 9.5, userName: 'Sarah' },
      { id: 'l22', date: getRelDate(-4), deltaQuantity: -0.7, action: 'consume', userName: 'Sarah' },
    ],
  },
  {
    id: 'item-9',
    name: 'Eco Dishwasher Pods',
    categoryId: 'cat-cleaning',
    quantity: 38,
    unit: 'pcs',
    minThreshold: 20,
    lastPricePerUnit: 0.32,
    topUpDate: getRelDate(-18),
    expiryDate: getRelDate(360),
    updatedBy: INITIAL_MEMBERS[1],
    updatedAt: new Date(Date.now() - 18 * 86400000).toISOString(),
    logs: [
      { id: 'l23', date: getRelDate(-35), deltaQuantity: 60, action: 'topup', pricePerUnit: 0.32, userName: 'David' },
      { id: 'l24', date: getRelDate(-18), deltaQuantity: -22, action: 'consume', userName: 'Alex' },
    ],
  },
];

const INITIAL_CHORE_CATS = [
  { id: 'chore-indoor', name: 'Indoor Maintenance', parentId: null },
  { id: 'chore-outdoor', name: 'Outdoor & Yard', parentId: null },
  { id: 'chore-pets', name: 'Pet Care', parentId: null },
  { id: 'chore-kitchen', name: 'Kitchen & Dining', parentId: 'chore-indoor' },
  { id: 'chore-living', name: 'Living & Bedrooms', parentId: 'chore-indoor' },
  { id: 'chore-bath', name: 'Bathrooms', parentId: 'chore-indoor' },
  { id: 'chore-kitchen-daily', name: 'Daily Cleanup', parentId: 'chore-kitchen' },
  { id: 'chore-kitchen-deep', name: 'Deep Appliance Clean', parentId: 'chore-kitchen' },
  { id: 'chore-lawn', name: 'Lawn & Garden', parentId: 'chore-outdoor' },
  { id: 'chore-waste', name: 'Trash & Recycling', parentId: 'chore-outdoor' },
  { id: 'chore-dog', name: 'Cooper (Golden Retriever)', parentId: 'chore-pets' },
];

const INITIAL_CHORES = [
  {
    id: 'c1',
    title: 'Clean Oven and Stovetop Grates',
    description: 'Use degreaser and scrub baking racks in warm soapy water',
    categoryId: 'chore-kitchen-deep',
    deadline: getRelDate(-2),
    originalDeadline: getRelDate(-2),
    assignedTo: INITIAL_MEMBERS[1],
    createdBy: INITIAL_MEMBERS[0],
    status: 'pending',
    priority: 'high',
    postponedCount: 1,
    postponedDaysTotal: 3,
  },
  {
    id: 'c2',
    title: 'Deep Scrub Shower Tile & Grout',
    description: 'Spray anti-mildew solution, let sit for 15 mins then brush',
    categoryId: 'chore-bath',
    deadline: getRelDate(-1),
    originalDeadline: getRelDate(-1),
    assignedTo: INITIAL_MEMBERS[2],
    createdBy: INITIAL_MEMBERS[0],
    status: 'pending',
    priority: 'medium',
    postponedCount: 0,
    postponedDaysTotal: 0,
  },
  {
    id: 'c3',
    title: 'Unload & Sanitize Dishwasher',
    description: 'Empty clean plates and restock morning mugs',
    categoryId: 'chore-kitchen-daily',
    deadline: getRelDate(0),
    originalDeadline: getRelDate(0),
    assignedTo: INITIAL_MEMBERS[3],
    createdBy: INITIAL_MEMBERS[1],
    status: 'pending',
    priority: 'high',
    postponedCount: 0,
    postponedDaysTotal: 0,
  },
  {
    id: 'c4',
    title: 'Take Wheelie Bins to Curb',
    description: 'Trash and recycling curbside before 7 AM',
    categoryId: 'chore-waste',
    deadline: getRelDate(1),
    originalDeadline: getRelDate(1),
    assignedTo: INITIAL_MEMBERS[2],
    createdBy: INITIAL_MEMBERS[0],
    status: 'pending',
    priority: 'high',
    postponedCount: 0,
    postponedDaysTotal: 0,
  },
  {
    id: 'c5',
    title: 'Mow Front & Back Lawn',
    description: 'Sweep clippings off driveway and sidewalk',
    categoryId: 'chore-lawn',
    deadline: getRelDate(3),
    originalDeadline: getRelDate(3),
    assignedTo: INITIAL_MEMBERS[1],
    createdBy: INITIAL_MEMBERS[0],
    status: 'pending',
    priority: 'medium',
    postponedCount: 0,
    postponedDaysTotal: 0,
  },
  {
    id: 'c6',
    title: 'Brush Cooper & Check Paws',
    description: 'Deshedding coat session (20 mins)',
    categoryId: 'chore-dog',
    deadline: getRelDate(2),
    originalDeadline: getRelDate(2),
    assignedTo: INITIAL_MEMBERS[4],
    createdBy: INITIAL_MEMBERS[0],
    status: 'pending',
    priority: 'low',
    postponedCount: 0,
    postponedDaysTotal: 0,
  },
  // Past 30 days completed tasks (historical data for Proactive & Postpone analytics)
  {
    id: 'ch1',
    title: 'Disinfect Kitchen Countertops',
    categoryId: 'chore-kitchen-daily',
    deadline: getRelDate(-1),
    originalDeadline: getRelDate(-1),
    assignedTo: INITIAL_MEMBERS[0],
    createdBy: INITIAL_MEMBERS[0],
    doneBy: INITIAL_MEMBERS[0],
    completedAt: getRelDate(-1),
    status: 'completed',
    priority: 'medium',
    postponedCount: 0,
    postponedDaysTotal: 0,
  },
  {
    id: 'ch2',
    title: 'Walk Cooper in Sunset Park',
    categoryId: 'chore-dog',
    deadline: getRelDate(-2),
    originalDeadline: getRelDate(-2),
    assignedTo: INITIAL_MEMBERS[2],
    createdBy: INITIAL_MEMBERS[0],
    doneBy: INITIAL_MEMBERS[2],
    completedAt: getRelDate(-3), // Early -> proactive
    status: 'completed',
    priority: 'medium',
    postponedCount: 0,
    postponedDaysTotal: 0,
  },
  {
    id: 'ch3',
    title: 'Clean Refrigerator Vegetable Crisper',
    categoryId: 'chore-kitchen-deep',
    deadline: getRelDate(-4),
    originalDeadline: getRelDate(-7), // Late -> postponed
    assignedTo: INITIAL_MEMBERS[1],
    createdBy: INITIAL_MEMBERS[0],
    doneBy: INITIAL_MEMBERS[1],
    completedAt: getRelDate(-4),
    status: 'completed',
    priority: 'medium',
    postponedCount: 1,
    postponedDaysTotal: 3,
  },
  {
    id: 'ch4',
    title: 'Sort Cardboard Recycling',
    categoryId: 'chore-waste',
    deadline: getRelDate(-5),
    originalDeadline: getRelDate(-5),
    assignedTo: INITIAL_MEMBERS[2],
    createdBy: INITIAL_MEMBERS[1],
    doneBy: INITIAL_MEMBERS[2],
    completedAt: getRelDate(-5),
    status: 'completed',
    priority: 'high',
    postponedCount: 0,
    postponedDaysTotal: 0,
  },
  {
    id: 'ch5',
    title: 'Wash Dog Bedding & Towels',
    categoryId: 'chore-dog',
    deadline: getRelDate(-6),
    originalDeadline: getRelDate(-8),
    assignedTo: INITIAL_MEMBERS[4],
    createdBy: INITIAL_MEMBERS[0],
    doneBy: INITIAL_MEMBERS[4],
    completedAt: getRelDate(-6),
    status: 'completed',
    priority: 'low',
    postponedCount: 1,
    postponedDaysTotal: 2,
  },
  {
    id: 'ch6',
    title: 'Dust Living Room Ceiling Fan',
    categoryId: 'chore-living',
    deadline: getRelDate(-9),
    originalDeadline: getRelDate(-9),
    assignedTo: INITIAL_MEMBERS[1],
    createdBy: INITIAL_MEMBERS[0],
    doneBy: INITIAL_MEMBERS[1],
    completedAt: getRelDate(-9),
    status: 'completed',
    priority: 'low',
    postponedCount: 0,
    postponedDaysTotal: 0,
  },
  {
    id: 'ch7',
    title: 'Fold Family Laundry & Hampers',
    categoryId: 'chore-living',
    deadline: getRelDate(-11),
    originalDeadline: getRelDate(-11),
    assignedTo: INITIAL_MEMBERS[0],
    createdBy: INITIAL_MEMBERS[0],
    doneBy: INITIAL_MEMBERS[0],
    completedAt: getRelDate(-11),
    status: 'completed',
    priority: 'high',
    postponedCount: 0,
    postponedDaysTotal: 0,
  },
  {
    id: 'ch8',
    title: 'Edge Lawn Borders & Sweep Patio',
    categoryId: 'chore-lawn',
    deadline: getRelDate(-13),
    originalDeadline: getRelDate(-16),
    assignedTo: INITIAL_MEMBERS[1],
    createdBy: INITIAL_MEMBERS[0],
    doneBy: INITIAL_MEMBERS[1],
    completedAt: getRelDate(-13),
    status: 'completed',
    priority: 'medium',
    postponedCount: 1,
    postponedDaysTotal: 3,
  },
  {
    id: 'ch9',
    title: 'Wash Bathroom Mirrors',
    categoryId: 'chore-bath',
    deadline: getRelDate(-14),
    originalDeadline: getRelDate(-14),
    assignedTo: INITIAL_MEMBERS[3],
    createdBy: INITIAL_MEMBERS[0],
    doneBy: INITIAL_MEMBERS[3],
    completedAt: getRelDate(-15),
    status: 'completed',
    priority: 'medium',
    postponedCount: 0,
    postponedDaysTotal: 0,
  },
  {
    id: 'ch10',
    title: 'Run Dishwasher Vinegar Cycle',
    categoryId: 'chore-kitchen-deep',
    deadline: getRelDate(-18),
    originalDeadline: getRelDate(-18),
    assignedTo: INITIAL_MEMBERS[0],
    createdBy: INITIAL_MEMBERS[1],
    doneBy: INITIAL_MEMBERS[0],
    completedAt: getRelDate(-18),
    status: 'completed',
    priority: 'medium',
    postponedCount: 0,
    postponedDaysTotal: 0,
  },
];

// ==========================================
// 2. STATE STORE & LOCALSTORAGE
// ==========================================

const STORAGE_KEY = 'kinpulse_vanilla_state_v1';

let appState = {
  activeTab: 'dashboard',
  familyMembers: INITIAL_MEMBERS,
  activeUserId: INITIAL_MEMBERS[0].id,
  groceryCategories: INITIAL_GROCERY_CATS,
  groceryItems: INITIAL_GROCERY_ITEMS,
  choreCategories: INITIAL_CHORE_CATS,
  chores: INITIAL_CHORES,
  selectedGroceryCatId: null,
  selectedChoreCatId: null,
  groceryFilterMode: 'all',
  grocerySearch: '',
  choreFilterMode: 'pending',
  choreMemberFilter: 'all',
  choreSearch: '',
  calendarDate: new Date().toISOString().split('T')[0],
  calendarMonth: new Date(),
  calendarFilter: 'all',
  calendarMember: 'all',
  expandedGroceryCats: new Set(INITIAL_GROCERY_CATS.map((c) => c.id)),
  expandedChoreCats: new Set(INITIAL_CHORE_CATS.map((c) => c.id)),
  mobileGroceryCatsOpen: false,
  mobileChoreCatsOpen: false,
};

function loadSavedState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      appState = {
        ...appState,
        ...parsed,
        expandedGroceryCats: new Set(parsed.expandedGroceryCats || INITIAL_GROCERY_CATS.map((c) => c.id)),
        expandedChoreCats: new Set(parsed.expandedChoreCats || INITIAL_CHORE_CATS.map((c) => c.id)),
        calendarMonth: new Date(parsed.calendarMonth || Date.now()),
      };
    }
  } catch (e) {
    console.warn('Failed to load local storage state:', e);
  }
}

function saveState() {
  try {
    const toSave = {
      ...appState,
      expandedGroceryCats: Array.from(appState.expandedGroceryCats),
      expandedChoreCats: Array.from(appState.expandedChoreCats),
      calendarMonth: appState.calendarMonth.toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch (e) {
    console.warn('Failed to save state:', e);
  }
}

function getActiveUser() {
  return appState.familyMembers.find((m) => m.id === appState.activeUserId) || appState.familyMembers[0];
}

// ==========================================
// 3. UTILITIES & METRICS CALCULATIONS
// ==========================================

function getAllDescendantCategoryIds(categories, targetId) {
  if (!targetId) return categories.map((c) => c.id);
  const result = [targetId];
  const findChildren = (parentId) => {
    const children = categories.filter((c) => c.parentId === parentId);
    for (const ch of children) {
      result.push(ch.id);
      findChildren(ch.id);
    }
  };
  findChildren(targetId);
  return result;
}

function getCategoryBreadcrumbs(categories, catId) {
  const crumbs = [];
  let current = categories.find((c) => c.id === catId);
  while (current) {
    crumbs.unshift(current);
    if (!current.parentId) break;
    current = categories.find((c) => c.id === current.parentId);
  }
  return crumbs;
}

function calculateConsumptionRate(item) {
  const consumeLogs = (item.logs || []).filter((l) => l.action === 'consume' || l.deltaQuantity < 0);
  if (consumeLogs.length >= 1) {
    const totalConsumed = consumeLogs.reduce((acc, log) => acc + Math.abs(log.deltaQuantity), 0);
    const dates = consumeLogs.map((l) => new Date(l.date).getTime()).sort();
    const daysElapsed = Math.max(1, Math.round((Date.now() - dates[0]) / (1000 * 60 * 60 * 24)));
    const dailyRate = totalConsumed / daysElapsed;
    const weeklyRate = dailyRate * 7;
    const daysUntilStockout = dailyRate > 0 ? Math.round(item.quantity / dailyRate) : null;
    return {
      formatted: `${weeklyRate.toFixed(2)} ${item.unit}/wk`,
      daysUntilStockout,
    };
  }
  const estDaily = item.quantity > 0 ? item.quantity * 0.05 : 0;
  return {
    formatted: `${(estDaily * 7).toFixed(2)} ${item.unit}/wk (est.)`,
    daysUntilStockout: estDaily > 0 ? Math.round(item.quantity / estDaily) : null,
  };
}

function getExpiryStatus(expiryStr) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(expiryStr);
  target.setHours(0, 0, 0, 0);
  const days = Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (days < 0) {
    return { label: `Expired ${Math.abs(days)}d ago`, isUrgent: true, cls: 'bg-rose-100 text-rose-700 border-rose-300' };
  }
  if (days === 0) {
    return { label: 'Expires today!', isUrgent: true, cls: 'bg-rose-100 text-rose-700 font-bold border-rose-300' };
  }
  if (days <= 3) {
    return { label: `Expires in ${days}d`, isUrgent: true, cls: 'bg-amber-100 text-amber-800 border-amber-300' };
  }
  if (days <= 7) {
    return { label: `Expires in ${days}d`, isUrgent: false, cls: 'bg-yellow-50 text-yellow-800 border-yellow-200' };
  }
  return { label: `${days}d left`, isUrgent: false, cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
}

function calculateGroceryRollup(categoryId = null) {
  const catIds = getAllDescendantCategoryIds(appState.groceryCategories, categoryId);
  const matched = appState.groceryItems.filter((i) => catIds.includes(i.categoryId));
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const fiveDays = new Date(now.getTime() + 5 * 86400000);

  let totalVal = 0;
  let lowStock = 0;
  let expiringSoon = 0;

  matched.forEach((item) => {
    totalVal += item.quantity * (item.lastPricePerUnit || 0);
    if (item.quantity <= item.minThreshold) lowStock++;
    const exp = new Date(item.expiryDate);
    exp.setHours(0, 0, 0, 0);
    if (exp <= fiveDays) expiringSoon++;
  });

  return {
    count: matched.length,
    value: totalVal.toFixed(2),
    lowStock,
    expiringSoon,
    items: matched,
  };
}

function calculateChoreMetrics() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const thirtyDaysAgo = new Date(today.getTime() - 30 * 86400000);

  const past30 = appState.chores.filter((c) => {
    const comp = c.completedAt ? new Date(c.completedAt) : null;
    if (comp) comp.setHours(0, 0, 0, 0);
    const orig = new Date(c.originalDeadline);
    orig.setHours(0, 0, 0, 0);
    return (comp && comp >= thirtyDaysAgo && comp <= today) || (orig >= thirtyDaysAgo && orig <= today);
  });

  let proactive = 0;
  let delayed = 0;
  let totalDelayDays = 0;
  let overdue = 0;

  const memberStats = {};
  appState.familyMembers.forEach((m) => {
    memberStats[m.id] = { proactive: 0, delayed: 0, total: 0 };
  });

  const dailyTrendMap = {};
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today.getTime() - i * 86400000);
    const key = d.toISOString().split('T')[0];
    dailyTrendMap[key] = {
      date: key,
      label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      proactive: 0,
      delayed: 0,
    };
  }

  past30.forEach((c) => {
    const memId = c.assignedTo.id;
    if (!memberStats[memId]) memberStats[memId] = { proactive: 0, delayed: 0, total: 0 };

    if (c.status === 'completed' && c.completedAt) {
      const comp = new Date(c.completedAt);
      comp.setHours(0, 0, 0, 0);
      const orig = new Date(c.originalDeadline);
      orig.setHours(0, 0, 0, 0);
      const key = comp.toISOString().split('T')[0];

      if (comp <= orig && (c.postponedCount || 0) === 0) {
        proactive++;
        memberStats[memId].proactive++;
        memberStats[memId].total++;
        if (dailyTrendMap[key]) dailyTrendMap[key].proactive++;
      } else {
        delayed++;
        memberStats[memId].delayed++;
        memberStats[memId].total++;
        const delayDays = Math.max(1, Math.round((comp - orig) / 86400000));
        totalDelayDays += delayDays;
        if (dailyTrendMap[key]) dailyTrendMap[key].delayed++;
      }
    } else if (c.status === 'pending') {
      const dead = new Date(c.deadline);
      dead.setHours(0, 0, 0, 0);
      if (dead < today) {
        overdue++;
        delayed++;
        memberStats[memId].delayed++;
        memberStats[memId].total++;
        totalDelayDays += Math.round((today - dead) / 86400000);
      }
    }
  });

  const totalEvaluated = Math.max(1, proactive + delayed);
  const proactiveRate = Number(((proactive / totalEvaluated) * 100).toFixed(1));
  const postponeRate = Number(((delayed / totalEvaluated) * 100).toFixed(1));
  const avgDelayDays = delayed > 0 ? (totalDelayDays / delayed).toFixed(1) : 0;

  // Compute daily cumulative rates for Chart.js
  let runProactive = 0;
  let runDelayed = 0;
  const trendLabels = [];
  const proactiveTrendData = [];
  const postponeTrendData = [];

  Object.values(dailyTrendMap).forEach((entry) => {
    runProactive += entry.proactive;
    runDelayed += entry.delayed;
    const runTotal = runProactive + runDelayed;
    trendLabels.push(entry.label);
    proactiveTrendData.push(runTotal > 0 ? Number(((runProactive / runTotal) * 100).toFixed(1)) : 100);
    postponeTrendData.push(runTotal > 0 ? Number(((runDelayed / runTotal) * 100).toFixed(1)) : 0);
  });

  const memberBreakdown = appState.familyMembers.map((m) => {
    const s = memberStats[m.id] || { proactive: 0, delayed: 0, total: 0 };
    const rate = s.total > 0 ? Math.round((s.proactive / s.total) * 100) : 100;
    return {
      name: m.name,
      avatar: m.avatar,
      color: m.color,
      proactive: s.proactive,
      delayed: s.delayed,
      rate,
    };
  });

  return {
    proactive,
    delayed,
    overdue,
    proactiveRate,
    postponeRate,
    avgDelayDays,
    trendLabels,
    proactiveTrendData,
    postponeTrendData,
    memberBreakdown,
  };
}

// Chart instance cache to avoid multiple canvas bindings
let chartInstances = {};

function destroyCharts() {
  Object.values(chartInstances).forEach((chart) => {
    if (chart && typeof chart.destroy === 'function') {
      chart.destroy();
    }
  });
  chartInstances = {};
}

// ==========================================
// 4. MAIN RENDER ROUTING
// ==========================================

function renderApp() {
  const activeUser = getActiveUser();
  const todayStr = new Date().toISOString().split('T')[0];
  const overdueCount = appState.chores.filter((c) => c.status === 'pending' && c.deadline < todayStr).length;
  const lowStockCount = appState.groceryItems.filter((i) => i.quantity <= i.minThreshold).length;
  const pendingChoresCount = appState.chores.filter((c) => c.status === 'pending').length;

  // Header and Navigation
  document.getElementById('header-active-avatar').textContent = activeUser.avatar;
  document.getElementById('header-active-name').textContent = activeUser.name;
  document.getElementById('header-active-role').textContent = activeUser.role;

  // Nav badges
  const overdueBadge = document.getElementById('badge-overdue');
  if (overdueBadge) {
    overdueBadge.textContent = overdueCount;
    overdueBadge.style.display = overdueCount > 0 ? 'inline-flex' : 'none';
  }
  const lowStockBadge = document.getElementById('badge-lowstock');
  if (lowStockBadge) {
    lowStockBadge.textContent = lowStockCount;
    lowStockBadge.style.display = lowStockCount > 0 ? 'inline-flex' : 'none';
  }
  const pendingBadge = document.getElementById('badge-chores');
  if (pendingBadge) {
    pendingBadge.textContent = pendingChoresCount;
  }

  // Active desktop & mobile tabs styling
  const tabs = ['dashboard', 'groceries', 'chores', 'calendar'];
  tabs.forEach((tab) => {
    const desktopBtn = document.getElementById(`nav-tab-${tab}`);
    if (desktopBtn) {
      if (appState.activeTab === tab) {
        desktopBtn.className = 'flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-white text-indigo-600 shadow-xs cursor-pointer';
      } else {
        desktopBtn.className = 'flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer';
      }
    }
    const mobileBtn = document.getElementById(`mobile-nav-${tab}`);
    if (mobileBtn) {
      if (appState.activeTab === tab) {
        mobileBtn.className = 'flex flex-col items-center py-1 px-2 rounded-xl text-indigo-600 font-bold cursor-pointer';
      } else {
        mobileBtn.className = 'flex flex-col items-center py-1 px-2 rounded-xl text-slate-500 hover:text-slate-900 cursor-pointer';
      }
    }
  });

  // Render view
  destroyCharts();
  const container = document.getElementById('main-content');
  if (appState.activeTab === 'dashboard') {
    renderDashboard(container);
  } else if (appState.activeTab === 'groceries') {
    renderGroceries(container);
  } else if (appState.activeTab === 'chores') {
    renderChores(container);
  } else if (appState.activeTab === 'calendar') {
    renderCalendar(container);
  }
}

// Switch Tab
window.switchTab = function (tab) {
  appState.activeTab = tab;
  saveState();
  renderApp();
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Switch User
window.switchUser = function (userId) {
  appState.activeUserId = userId;
  document.getElementById('member-dropdown').classList.add('hidden');
  saveState();
  renderApp();
};

window.toggleMemberDropdown = function () {
  const el = document.getElementById('member-dropdown');
  if (el) {
    el.classList.toggle('hidden');
    if (!el.classList.contains('hidden')) {
      renderMemberDropdownItems();
    }
  }
};

function renderMemberDropdownItems() {
  const list = document.getElementById('member-dropdown-list');
  if (!list) return;
  list.innerHTML =
    appState.familyMembers
      .map(
        (m) => `
    <div class="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition cursor-pointer text-xs">
      <div class="flex items-center gap-2 flex-1 truncate" onclick="switchUser('${m.id}')">
        <span class="text-xl">${m.avatar}</span>
        <div class="truncate">
          <div class="font-bold text-slate-800">${m.name}</div>
          <div class="text-[10px] text-slate-400">${m.role}</div>
        </div>
      </div>
      <div class="flex items-center gap-1.5 shrink-0">
        ${m.id === appState.activeUserId ? '<span class="text-[9px] bg-indigo-600 text-white font-bold px-1.5 py-0.5 rounded-full">Active</span>' : ''}
        <button onclick="event.stopPropagation(); openEditProfileModal('${m.id}')" title="Edit Profile" class="p-1 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 transition cursor-pointer">
          ✏️
        </button>
      </div>
    </div>
  `
      )
      .join('') +
    `
    <div class="pt-2 border-t border-slate-100 mt-1 space-y-1">
      <button onclick="toggleMemberDropdown(); openAddMemberModal()" class="w-full py-1.5 px-2.5 rounded-xl text-left text-xs font-semibold text-indigo-600 hover:bg-indigo-50 transition cursor-pointer flex items-center gap-2">
        <span>➕</span> Add Family Member
      </button>
      <button onclick="toggleMemberDropdown(); resetToDemoData()" class="w-full py-1.5 px-2.5 rounded-xl text-left text-xs font-medium text-slate-500 hover:bg-slate-100 transition cursor-pointer flex items-center gap-2">
        <span>🔄</span> Reset Starter Demo Data
      </button>
    </div>
    `;
}

// ==========================================
// 5. DASHBOARD VIEW (WITH CHART.JS ENGINE)
// ==========================================

function renderDashboard(container) {
  const metrics = calculateChoreMetrics();
  const activeUser = getActiveUser();
  const todayStr = new Date().toISOString().split('T')[0];

  const overdueList = appState.chores.filter((c) => c.status === 'pending' && c.deadline < todayStr);
  const nextWeekStr = getRelDate(7);
  const upcomingList = appState.chores
    .filter((c) => c.status === 'pending' && c.deadline >= todayStr && c.deadline <= nextWeekStr)
    .sort((a, b) => a.deadline.localeCompare(b.deadline));

  const urgentGroceries = appState.groceryItems.filter((item) => {
    const status = getExpiryStatus(item.expiryDate);
    return status.isUrgent || item.quantity <= item.minThreshold;
  });

  container.innerHTML = `
    <div class="space-y-6 sm:space-y-8 pb-8">
      <!-- Top Hero Banner -->
      <div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 p-4 sm:p-8 text-white shadow-xl">
        <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
          <div>
            <div class="flex items-center gap-2 text-indigo-200 text-xs sm:text-sm font-medium mb-1">
              <span class="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>Live Household Health • Past 30 Days</span>
            </div>
            <h1 class="text-xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, ${activeUser.name} ${activeUser.avatar}
            </h1>
            <p class="mt-1 text-xs sm:text-base text-indigo-200/90 max-w-2xl leading-relaxed">
              Family performance is tracking at a <span class="font-bold text-emerald-300">${metrics.proactiveRate}% proactive rate</span>. Keep tasks on schedule to eliminate delays!
            </p>
          </div>

          <div class="flex items-center gap-2 sm:gap-3">
            <button onclick="switchTab('chores')" class="flex-1 sm:flex-none px-3.5 py-2.5 rounded-xl bg-white text-indigo-950 font-bold text-xs sm:text-sm hover:bg-indigo-50 shadow-sm cursor-pointer transition">
              ✓ Manage Chores
            </button>
            <button onclick="switchTab('groceries')" class="flex-1 sm:flex-none px-3.5 py-2.5 rounded-xl bg-indigo-700/60 hover:bg-indigo-700 text-white font-medium text-xs sm:text-sm border border-indigo-500/30 cursor-pointer transition">
              🛍️ Pantry Stock
            </button>
          </div>
        </div>

        <!-- 4 Metric KPI Cards -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 mt-6 pt-4 border-t border-indigo-700/50">
          <div class="bg-white/10 backdrop-blur rounded-2xl p-3 sm:p-4 border border-white/10">
            <span class="text-[10px] sm:text-xs uppercase font-semibold text-indigo-200">Proactive Rate</span>
            <div class="mt-1 flex items-baseline gap-1.5">
              <span class="text-2xl sm:text-3xl font-black text-white">${metrics.proactiveRate}%</span>
              <span class="text-[10px] text-emerald-300 font-medium">on-time</span>
            </div>
            <p class="mt-0.5 text-[10px] text-indigo-200/80">${metrics.proactive} completed on or before deadline</p>
          </div>

          <div class="bg-white/10 backdrop-blur rounded-2xl p-3 sm:p-4 border border-white/10">
            <span class="text-[10px] sm:text-xs uppercase font-semibold text-indigo-200">Postpone Rate</span>
            <div class="mt-1 flex items-baseline gap-1.5">
              <span class="text-2xl sm:text-3xl font-black text-white">${metrics.postponeRate}%</span>
              <span class="text-[10px] text-amber-300 font-medium">delayed</span>
            </div>
            <p class="mt-0.5 text-[10px] text-indigo-200/80">Avg delay: ${metrics.avgDelayDays}d across delayed tasks</p>
          </div>

          <div class="bg-white/10 backdrop-blur rounded-2xl p-3 sm:p-4 border border-white/10">
            <span class="text-[10px] sm:text-xs uppercase font-semibold text-indigo-200">Needs Action</span>
            <div class="mt-1 flex items-baseline gap-1.5">
              <span class="text-2xl sm:text-3xl font-black ${overdueList.length > 0 ? 'text-rose-300' : 'text-white'}">${overdueList.length}</span>
              <span class="text-[10px] text-indigo-200 font-medium">overdue</span>
            </div>
            <p class="mt-0.5 text-[10px] text-indigo-200/80">${overdueList.length === 0 ? 'All chores on schedule!' : 'Resolve or reschedule tasks'}</p>
          </div>

          <div class="bg-white/10 backdrop-blur rounded-2xl p-3 sm:p-4 border border-white/10">
            <span class="text-[10px] sm:text-xs uppercase font-semibold text-indigo-200">Upcoming (7d)</span>
            <div class="mt-1 flex items-baseline gap-1.5">
              <span class="text-2xl sm:text-3xl font-black text-white">${upcomingList.length}</span>
              <span class="text-[10px] text-indigo-200 font-medium">scheduled</span>
            </div>
            <p class="mt-0.5 text-[10px] text-indigo-200/80">Distributed across family members</p>
          </div>
        </div>
      </div>

      <!-- VISUAL CHARTS SECTION (Chart.js Engine) -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main 30-Day Rate Trend Area Chart -->
        <div class="lg:col-span-2 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-3">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <div class="flex items-center gap-2">
                <h2 class="text-base sm:text-lg font-bold text-slate-900">30-Day Rate Trend</h2>
                <span class="px-2 py-0.5 text-[10px] font-bold rounded-full bg-indigo-100 text-indigo-700">Native Canvas</span>
              </div>
              <p class="text-xs text-slate-400">Cumulative Proactive Rate vs Postpone Rate trajectory over past 30 days</p>
            </div>
          </div>
          <div class="h-60 sm:h-72 w-full relative">
            <canvas id="trendChart"></canvas>
          </div>
        </div>

        <!-- Health Distribution Donut -->
        <div class="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <h2 class="text-base sm:text-lg font-bold text-slate-900">Execution Health Ratio</h2>
            <p class="text-xs text-slate-400">30-day task completion balance</p>
            <div class="h-48 w-full relative mt-2 flex items-center justify-center">
              <canvas id="healthChart"></canvas>
            </div>
          </div>
          <div class="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
            <div class="flex items-center justify-between">
              <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Proactive (On-time)</span>
              <strong>${metrics.proactive}</strong>
            </div>
            <div class="flex items-center justify-between">
              <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Delayed / Postponed</span>
              <strong>${metrics.delayed}</strong>
            </div>
            <div class="flex items-center justify-between">
              <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Currently Overdue</span>
              <strong>${metrics.overdue}</strong>
            </div>
          </div>
        </div>
      </div>

      <!-- Family Member Performance Bar Chart -->
      <div class="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 class="text-base sm:text-lg font-bold text-slate-900">Family Member Accountability</h2>
            <p class="text-xs text-slate-400">Proactive vs postponed completions by family member (30 Days)</p>
          </div>
        </div>
        <div class="h-56 sm:h-64 w-full relative">
          <canvas id="memberChart"></canvas>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 pt-2 border-t border-slate-100">
          ${metrics.memberBreakdown
            .map(
              (m) => `
            <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <div class="text-xl">${m.avatar}</div>
              <div class="text-xs font-bold text-slate-800 mt-0.5">${m.name}</div>
              <div class="text-xs font-semibold text-emerald-600">${m.rate}% Proactive</div>
              <div class="text-[10px] text-slate-400">${m.proactive} on-time • ${m.delayed} late</div>
            </div>
          `
            )
            .join('')}
        </div>
      </div>

      <!-- Overdue & Upcoming Chores + Grocery Alerts -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Chores Attention Panel -->
        <div class="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 class="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              ⏰ Needs Action & Upcoming Chores
            </h2>
            <button onclick="switchTab('chores')" class="text-xs font-bold text-indigo-600 hover:underline cursor-pointer">View All →</button>
          </div>

          ${
            overdueList.length > 0
              ? `
            <div class="space-y-2">
              <div class="text-[11px] font-bold text-rose-600 uppercase tracking-wider">Overdue Chores (${overdueList.length})</div>
              ${overdueList
                .map(
                  (c) => `
                <div class="p-3 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-between gap-3 text-xs">
                  <div>
                    <div class="font-bold text-slate-900">${c.title}</div>
                    <div class="text-slate-500 mt-0.5">${c.assignedTo.avatar} ${c.assignedTo.name} • Due ${c.deadline}</div>
                  </div>
                  <div class="flex items-center gap-1.5 shrink-0">
                    <button onclick="postponeChoreAction('${c.id}', 2)" class="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 cursor-pointer">+2d</button>
                    <button onclick="openRescheduleModal('${c.id}')" class="px-3 py-1 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-700 cursor-pointer">✓ Done</button>
                  </div>
                </div>
              `
                )
                .join('')}
            </div>
          `
              : ''
          }

          <div class="space-y-2">
            <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Upcoming This Week</div>
            ${
              upcomingList.length === 0
                ? '<p class="text-xs text-slate-400 italic">No chores scheduled in the next 7 days.</p>'
                : upcomingList
                    .slice(0, 4)
                    .map(
                      (c) => `
              <div class="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2 text-xs">
                <div>
                  <div class="font-bold text-slate-800">${c.title}</div>
                  <div class="text-slate-500 mt-0.5">${c.assignedTo.avatar} ${c.assignedTo.name} • Due ${c.deadline}</div>
                </div>
                <button onclick="openRescheduleModal('${c.id}')" class="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:bg-emerald-50 text-slate-700 hover:text-emerald-600 font-bold cursor-pointer">
                  ✓ Mark Done
                </button>
              </div>
            `
                    )
                    .join('')
            }
          </div>
        </div>

        <!-- Grocery Inventory Health Alerts -->
        <div class="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 class="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              🛍️ Pantry & Grocery Alerts
            </h2>
            <button onclick="switchTab('groceries')" class="text-xs font-bold text-emerald-600 hover:underline cursor-pointer">Open Pantry →</button>
          </div>

          <p class="text-xs text-slate-500">Items with low quantities below safety stock or expiring within 5 days:</p>

          <div class="space-y-2.5">
            ${
              urgentGroceries.length === 0
                ? '<div class="text-center py-6 text-emerald-600 font-bold text-xs bg-emerald-50 rounded-2xl">✨ All grocery items are fresh and well stocked!</div>'
                : urgentGroceries
                    .map((item) => {
                      const exp = getExpiryStatus(item.expiryDate);
                      const isLow = item.quantity <= item.minThreshold;
                      return `
                <div class="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2 text-xs">
                  <div>
                    <div class="flex items-center gap-1.5">
                      <span class="font-bold text-slate-900">${item.name}</span>
                      <span class="px-1.5 py-0.2 rounded-full text-[10px] font-semibold border ${exp.cls}">${exp.label}</span>
                      ${isLow ? '<span class="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700">Low Stock</span>' : ''}
                    </div>
                    <div class="text-slate-500 mt-1">Stock: <strong>${item.quantity} ${item.unit}</strong> (Min: ${item.minThreshold}) • $${item.lastPricePerUnit}/${item.unit}</div>
                  </div>
                  <button onclick="openTopUpModal('${item.id}')" class="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold hover:bg-emerald-100 cursor-pointer shrink-0">
                    + Restock
                  </button>
                </div>
              `;
                    })
                    .join('')
            }
          </div>
        </div>
      </div>
    </div>
  `;

  // Initialize Chart.js charts after DOM render
  initDashboardCharts(metrics);
}

function initDashboardCharts(metrics) {
  if (typeof Chart === 'undefined') {
    console.warn('Chart.js CDN not yet loaded');
    return;
  }

  // 1. 30-Day Trend Chart
  const trendCtx = document.getElementById('trendChart')?.getContext('2d');
  if (trendCtx) {
    chartInstances.trend = new Chart(trendCtx, {
      type: 'line',
      data: {
        labels: metrics.trendLabels,
        datasets: [
          {
            label: 'Proactive Rate (%)',
            data: metrics.proactiveTrendData,
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.15)',
            fill: true,
            tension: 0.35,
            borderWidth: 2.5,
          },
          {
            label: 'Postpone Rate (%)',
            data: metrics.postponeTrendData,
            borderColor: '#f59e0b',
            backgroundColor: 'rgba(245, 158, 11, 0.1)',
            fill: true,
            tension: 0.35,
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            min: 0,
            max: 100,
            ticks: { callback: (v) => v + '%' },
          },
        },
      },
    });
  }

  // 2. Health Donut Chart
  const healthCtx = document.getElementById('healthChart')?.getContext('2d');
  if (healthCtx) {
    chartInstances.health = new Chart(healthCtx, {
      type: 'doughnut',
      data: {
        labels: ['Proactive', 'Delayed/Postponed', 'Overdue'],
        datasets: [
          {
            data: [metrics.proactive, metrics.delayed, metrics.overdue],
            backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
      },
    });
  }

  // 3. Member Accountability Bar Chart
  const memberCtx = document.getElementById('memberChart')?.getContext('2d');
  if (memberCtx) {
    chartInstances.member = new Chart(memberCtx, {
      type: 'bar',
      data: {
        labels: metrics.memberBreakdown.map((m) => `${m.avatar} ${m.name}`),
        datasets: [
          {
            label: 'Proactive (On-time)',
            data: metrics.memberBreakdown.map((m) => m.proactive),
            backgroundColor: '#10b981',
            borderRadius: 4,
          },
          {
            label: 'Delayed / Postponed',
            data: metrics.memberBreakdown.map((m) => m.delayed),
            backgroundColor: '#f59e0b',
            borderRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: true, ticks: { precision: 0 } },
        },
      },
    });
  }
}

// ==========================================
// 6. GROCERY & PANTRY MANAGER (INFINITE NESTING)
// ==========================================

function renderGroceries(container) {
  const rollup = calculateGroceryRollup(appState.selectedGroceryCatId);
  const breadcrumbs = appState.selectedGroceryCatId
    ? getCategoryBreadcrumbs(appState.groceryCategories, appState.selectedGroceryCatId)
    : [];

  const activeCatIds = getAllDescendantCategoryIds(appState.groceryCategories, appState.selectedGroceryCatId);
  const filteredItems = appState.groceryItems.filter((item) => {
    if (!activeCatIds.includes(item.categoryId)) return false;
    if (appState.groceryFilterMode === 'lowStock' && item.quantity > item.minThreshold) return false;
    if (appState.groceryFilterMode === 'expiringSoon' && !getExpiryStatus(item.expiryDate).isUrgent) return false;
    if (appState.grocerySearch) {
      const q = appState.grocerySearch.toLowerCase();
      if (!item.name.toLowerCase().includes(q) && !(item.updatedBy?.name || '').toLowerCase().includes(q)) return false;
    }
    return true;
  });

  container.innerHTML = `
    <div class="space-y-6">
      <!-- Top Actions Bar -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <div class="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-wider">
            🛍️ Inventory Tracking • Infinite Nesting
          </div>
          <h1 class="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">Grocery & Pantry Supplies</h1>
          <p class="text-xs text-slate-400">Track consumption rates, restock dates, expiry warnings, and category rollups.</p>
        </div>
        <div class="flex items-center gap-2">
          <button onclick="openAddCategoryModal(null, 'grocery')" class="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer">
            📁 + Add Subtype
          </button>
          <button onclick="openAddItemModal()" class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-sm cursor-pointer">
            + Add Grocery Item
          </button>
        </div>
      </div>

      <!-- Main Grid: Left Collapsible Category Tree & Right Items List -->
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <!-- Category Sidebar (Responsive Drawer on Mobile) -->
        <div class="lg:col-span-1 bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-3">
          <div class="flex items-center justify-between pb-2 border-b border-slate-100">
            <button onclick="toggleMobileGroceryDrawer()" class="lg:pointer-events-none flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700 cursor-pointer">
              <span>Categories</span>
              <span class="lg:hidden text-[10px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full font-semibold">
                ${appState.mobileGroceryCatsOpen ? 'Hide' : 'Browse'}
              </span>
            </button>
            <div class="flex items-center gap-1">
              <button onclick="toggleExpandAllGroceryCats()" class="px-2 py-1 rounded-lg text-slate-500 hover:bg-slate-100 text-[11px] font-semibold cursor-pointer">
                ${appState.expandedGroceryCats.size > 0 ? 'Collapse' : 'Expand'}
              </button>
              <button onclick="openAddCategoryModal(null, 'grocery')" title="Add Root Category" class="p-1 rounded-lg hover:bg-slate-100 text-xs cursor-pointer">
                📁+
              </button>
            </div>
          </div>

          <div id="grocery-cats-container" class="${appState.mobileGroceryCatsOpen ? 'block' : 'hidden lg:block'} space-y-2">
            <button onclick="selectGroceryCategory(null)" class="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between cursor-pointer ${appState.selectedGroceryCatId === null ? 'bg-emerald-500 text-white shadow-xs' : 'text-slate-700 hover:bg-slate-50'}">
              <span>📦 All Groceries (Global)</span>
              <span class="px-2 py-0.5 rounded-full text-[10px] ${appState.selectedGroceryCatId === null ? 'bg-emerald-600' : 'bg-slate-200'}">${appState.groceryItems.length}</span>
            </button>
            <div class="space-y-1 max-h-[380px] sm:max-h-[500px] overflow-y-auto pr-1">
              ${renderNestedGroceryTreeHTML(null, 0)}
            </div>
          </div>
        </div>

        <!-- Right: Category Rollup & Items List -->
        <div class="lg:col-span-3 space-y-5">
          <!-- Rollup Metrics Card -->
          <div class="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-3xl p-5 sm:p-6 shadow-md border border-slate-800">
            <div class="flex flex-wrap items-center gap-1 text-xs text-indigo-300 font-medium mb-2">
              <span onclick="selectGroceryCategory(null)" class="hover:underline cursor-pointer">All Groceries</span>
              ${breadcrumbs.map((b) => `<span>›</span><span onclick="selectGroceryCategory('${b.id}')" class="font-bold hover:underline cursor-pointer">${b.name}</span>`).join('')}
            </div>

            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-indigo-800/60">
              <div>
                <h2 class="text-xl font-black">${breadcrumbs.length > 0 ? breadcrumbs[breadcrumbs.length - 1].name : 'All Household Inventory'}</h2>
                <p class="text-xs text-indigo-200/80 mt-0.5">Dynamic roll-up totals across all nested subtypes</p>
              </div>
              <button onclick="openAddItemModal('${appState.selectedGroceryCatId || ''}')" class="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-xs cursor-pointer self-start sm:self-auto">
                + Add Item Here
              </button>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
              <div class="bg-white/10 rounded-2xl p-3 backdrop-blur">
                <div class="text-[10px] uppercase font-bold text-indigo-200">Total Items</div>
                <div class="text-2xl font-black mt-0.5">${rollup.count}</div>
              </div>
              <div class="bg-white/10 rounded-2xl p-3 backdrop-blur">
                <div class="text-[10px] uppercase font-bold text-indigo-200">Total Value</div>
                <div class="text-2xl font-black text-emerald-300 mt-0.5">$${rollup.value}</div>
              </div>
              <div class="bg-white/10 rounded-2xl p-3 backdrop-blur">
                <div class="text-[10px] uppercase font-bold text-indigo-200">Low Stock</div>
                <div class="text-2xl font-black ${rollup.lowStock > 0 ? 'text-amber-300' : 'text-white'} mt-0.5">${rollup.lowStock}</div>
              </div>
              <div class="bg-white/10 rounded-2xl p-3 backdrop-blur">
                <div class="text-[10px] uppercase font-bold text-indigo-200">Expiring &lt;5d</div>
                <div class="text-2xl font-black ${rollup.expiringSoon > 0 ? 'text-rose-300' : 'text-white'} mt-0.5">${rollup.expiringSoon}</div>
              </div>
            </div>
          </div>

          <!-- Search & Filter Controls -->
          <div class="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-xs">
            <input type="text" placeholder="Search items, unit, notes..." value="${appState.grocerySearch}" oninput="searchGroceries(this.value)" class="w-full sm:w-72 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            <div class="flex items-center gap-1.5 self-start sm:self-auto">
              <button onclick="setGroceryFilter('all')" class="px-3 py-1.5 rounded-xl font-bold cursor-pointer ${appState.groceryFilterMode === 'all' ? 'bg-slate-900 text-white' : 'hover:bg-slate-100 text-slate-600'}">All (${rollup.count})</button>
              <button onclick="setGroceryFilter('lowStock')" class="px-3 py-1.5 rounded-xl font-bold cursor-pointer ${appState.groceryFilterMode === 'lowStock' ? 'bg-amber-500 text-white' : 'hover:bg-slate-100 text-slate-600'}">Low Stock (${rollup.lowStock})</button>
              <button onclick="setGroceryFilter('expiringSoon')" class="px-3 py-1.5 rounded-xl font-bold cursor-pointer ${appState.groceryFilterMode === 'expiringSoon' ? 'bg-rose-500 text-white' : 'hover:bg-slate-100 text-slate-600'}">Expiring Soon (${rollup.expiringSoon})</button>
            </div>
          </div>

          <!-- Items Grid -->
          ${
            filteredItems.length === 0
              ? '<div class="text-center py-16 bg-white rounded-3xl border border-slate-200 p-6"><p class="text-sm font-bold text-slate-700">No grocery items found</p><button onclick="openAddItemModal()" class="mt-3 px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl cursor-pointer">+ Add First Item</button></div>'
              : `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              ${filteredItems
                .map((item) => {
                  const rate = calculateConsumptionRate(item);
                  const exp = getExpiryStatus(item.expiryDate);
                  const isLow = item.quantity <= item.minThreshold;
                  return `
                  <div class="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col justify-between space-y-3 hover:border-slate-300 transition">
                    <div>
                      <div class="flex items-start justify-between gap-2">
                        <div>
                          <div class="flex items-center gap-2">
                            <h3 class="font-bold text-base text-slate-900">${item.name}</h3>
                            ${isLow ? '<span class="px-2 py-0.2 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">Low Stock</span>' : ''}
                          </div>
                          <p class="text-xs text-slate-400 mt-0.5">${getCategoryBreadcrumbs(appState.groceryCategories, item.categoryId).map((c) => c.name).join(' › ')}</p>
                        </div>
                        <div class="flex items-center gap-1">
                          <button onclick="openEditItemModal('${item.id}')" title="Edit" class="p-1 rounded text-slate-400 hover:text-slate-700 cursor-pointer">✏️</button>
                          <button onclick="deleteGroceryItemAction('${item.id}')" title="Delete" class="p-1 rounded text-slate-400 hover:text-rose-600 cursor-pointer">🗑️</button>
                        </div>
                      </div>

                      <div class="mt-3 grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs">
                        <div>
                          <span class="text-[10px] uppercase font-bold text-slate-400">Stock</span>
                          <div class="text-base font-black text-slate-900">${item.quantity} ${item.unit}</div>
                          <div class="text-[10px] text-slate-400">Min: ${item.minThreshold} ${item.unit}</div>
                        </div>
                        <div>
                          <span class="text-[10px] uppercase font-bold text-slate-400">Total Value</span>
                          <div class="text-base font-black text-emerald-600">$${(item.quantity * item.lastPricePerUnit).toFixed(2)}</div>
                          <div class="text-[10px] text-slate-400">$${item.lastPricePerUnit}/${item.unit}</div>
                        </div>
                      </div>

                      <div class="mt-3 space-y-1 text-xs">
                        <div class="flex justify-between text-slate-600">
                          <span>Consumption Rate:</span>
                          <strong>${rate.formatted}</strong>
                        </div>
                        ${rate.daysUntilStockout !== null ? `<div class="flex justify-between text-slate-500 text-[11px]"><span>Est. Stockout:</span><strong>~${rate.daysUntilStockout} days</strong></div>` : ''}
                        <div class="flex justify-between pt-1">
                          <span>Expiry:</span>
                          <span class="px-2 py-0.2 rounded-full text-[10px] font-semibold border ${exp.cls}">${item.expiryDate} (${exp.label})</span>
                        </div>
                      </div>
                    </div>

                    <div class="pt-3 border-t border-slate-100 space-y-2.5">
                      <div class="flex items-center justify-between text-[11px] text-slate-400">
                        <span>Updated by <strong>${item.updatedBy?.avatar || '👤'} ${item.updatedBy?.name}</strong></span>
                        <button onclick="openLogsModal('${item.id}')" class="hover:text-indigo-600 cursor-pointer">History (${(item.logs || []).length})</button>
                      </div>
                      <div class="grid grid-cols-2 gap-2">
                        <button onclick="openConsumeModal('${item.id}')" class="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold cursor-pointer transition">
                          📉 Consume
                        </button>
                        <button onclick="openTopUpModal('${item.id}')" class="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer transition">
                          + Top Up
                        </button>
                      </div>
                    </div>
                  </div>
                `;
                })
                .join('')}
            </div>
          `
          }
        </div>
      </div>
    </div>
  `;
}

function renderNestedGroceryTreeHTML(parentId, depth) {
  const children = appState.groceryCategories.filter((c) => c.parentId === parentId);
  if (children.length === 0) return '';

  return children
    .map((cat) => {
      const isSelected = appState.selectedGroceryCatId === cat.id;
      const directChildren = appState.groceryCategories.filter((c) => c.parentId === cat.id);
      const hasChildren = directChildren.length > 0;
      const isExpanded = appState.expandedGroceryCats.has(cat.id);

      return `
      <div class="space-y-1">
        <div style="padding-left: ${depth * 12}px" class="group flex items-center justify-between rounded-xl py-1 pr-1.5 transition ${isSelected ? 'bg-emerald-50 text-emerald-800 font-bold' : 'hover:bg-slate-50 text-slate-700'}">
          <div class="flex items-center flex-1 min-w-0 gap-1">
            ${
              hasChildren
                ? `<button onclick="event.stopPropagation(); toggleGroceryCatExpand('${cat.id}')" class="p-1 rounded text-slate-400 hover:text-slate-700 cursor-pointer shrink-0">${isExpanded ? '▼' : '▶'}</button>`
                : '<span class="w-4 inline-block shrink-0"></span>'
            }
            <button onclick="selectGroceryCategory('${cat.id}')" class="flex-1 text-left px-1 py-0.5 text-xs font-medium truncate cursor-pointer flex items-center justify-between gap-1">
              <span class="truncate">${cat.name}</span>
              ${hasChildren ? `<span class="text-[10px] bg-slate-200 text-slate-500 px-1.5 rounded-full">${directChildren.length}</span>` : ''}
            </button>
          </div>
          <div class="opacity-0 group-hover:opacity-100 flex items-center gap-1 shrink-0">
            <button onclick="openAddCategoryModal('${cat.id}', 'grocery')" title="Add Subtype" class="p-1 text-slate-400 hover:text-emerald-600 cursor-pointer">📁+</button>
            <button onclick="deleteGroceryCategoryAction('${cat.id}')" title="Delete" class="p-1 text-slate-400 hover:text-rose-600 cursor-pointer">🗑️</button>
          </div>
        </div>
        ${hasChildren && isExpanded ? renderNestedGroceryTreeHTML(cat.id, depth + 1) : ''}
      </div>
    `;
    })
    .join('');
}

// ==========================================
// 7. CHORE SCHEDULING (INFINITE NESTING & RESCHEDULE)
// ==========================================

function renderChores(container) {
  const breadcrumbs = appState.selectedChoreCatId
    ? getCategoryBreadcrumbs(appState.choreCategories, appState.selectedChoreCatId)
    : [];

  const activeCatIds = getAllDescendantCategoryIds(appState.choreCategories, appState.selectedChoreCatId);
  const todayStr = new Date().toISOString().split('T')[0];

  const filteredChores = appState.chores
    .filter((chore) => {
      if (!activeCatIds.includes(chore.categoryId)) return false;
      if (appState.choreMemberFilter !== 'all' && chore.assignedTo.id !== appState.choreMemberFilter) return false;
      if (appState.choreFilterMode === 'pending' && chore.status !== 'pending') return false;
      if (appState.choreFilterMode === 'overdue' && (chore.status !== 'pending' || chore.deadline >= todayStr)) return false;
      if (appState.choreFilterMode === 'completed' && chore.status !== 'completed') return false;
      if (appState.choreSearch) {
        const q = appState.choreSearch.toLowerCase();
        if (!chore.title.toLowerCase().includes(q) && !(chore.description || '').toLowerCase().includes(q)) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (a.status === 'pending' && b.status === 'pending') return a.deadline.localeCompare(b.deadline);
      if (a.status === 'pending') return -1;
      if (b.status === 'pending') return 1;
      return (b.completedAt || '').localeCompare(a.completedAt || '');
    });

  container.innerHTML = `
    <div class="space-y-6">
      <!-- Top Actions Bar -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <div class="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider">
            ✓ Chore Scheduling • Collaborative Accountability
          </div>
          <h1 class="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">Household Chore Scheduling</h1>
          <p class="text-xs text-slate-400">Infinite nested chore categories, proactive rate tracking, and automatic future reschedule prompts.</p>
        </div>
        <div class="flex items-center gap-2">
          <button onclick="openAddCategoryModal(null, 'chore')" class="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer">
            📁 + Add Subtype
          </button>
          <button onclick="openAddChoreModal()" class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-sm cursor-pointer">
            + Add New Chore
          </button>
        </div>
      </div>

      <!-- Main Grid: Left Chore Categories & Right Board -->
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <!-- Chore Categories Sidebar (Drawer on mobile) -->
        <div class="lg:col-span-1 bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-3">
          <div class="flex items-center justify-between pb-2 border-b border-slate-100">
            <button onclick="toggleMobileChoreDrawer()" class="lg:pointer-events-none flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700 cursor-pointer">
              <span>Chore Types</span>
              <span class="lg:hidden text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-semibold">
                ${appState.mobileChoreCatsOpen ? 'Hide' : 'Browse'}
              </span>
            </button>
            <div class="flex items-center gap-1">
              <button onclick="toggleExpandAllChoreCats()" class="px-2 py-1 rounded-lg text-slate-500 hover:bg-slate-100 text-[11px] font-semibold cursor-pointer">
                ${appState.expandedChoreCats.size > 0 ? 'Collapse' : 'Expand'}
              </button>
              <button onclick="openAddCategoryModal(null, 'chore')" title="Add Root" class="p-1 rounded-lg hover:bg-slate-100 text-xs cursor-pointer">
                📁+
              </button>
            </div>
          </div>

          <div id="chore-cats-container" class="${appState.mobileChoreCatsOpen ? 'block' : 'hidden lg:block'} space-y-2">
            <button onclick="selectChoreCategory(null)" class="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between cursor-pointer ${appState.selectedChoreCatId === null ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-700 hover:bg-slate-50'}">
              <span>✓ All Chores (Global)</span>
              <span class="px-2 py-0.5 rounded-full text-[10px] ${appState.selectedChoreCatId === null ? 'bg-indigo-700' : 'bg-slate-200'}">${appState.chores.length}</span>
            </button>
            <div class="space-y-1 max-h-[380px] sm:max-h-[500px] overflow-y-auto pr-1">
              ${renderNestedChoreTreeHTML(null, 0)}
            </div>
          </div>
        </div>

        <!-- Right: Filters & Chore Cards -->
        <div class="lg:col-span-3 space-y-5">
          <!-- Filter Controls -->
          <div class="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-xs">
            <input type="text" placeholder="Search chores, assignee..." value="${appState.choreSearch}" oninput="searchChores(this.value)" class="w-full sm:w-64 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            
            <div class="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <select onchange="setChoreMemberFilter(this.value)" class="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none">
                <option value="all">Everyone</option>
                ${appState.familyMembers.map((m) => `<option value="${m.id}" ${appState.choreMemberFilter === m.id ? 'selected' : ''}>${m.avatar} ${m.name}</option>`).join('')}
              </select>

              <div class="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                <button onclick="setChoreFilter('pending')" class="px-3 py-1 rounded-lg font-bold cursor-pointer ${appState.choreFilterMode === 'pending' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'}">Pending</button>
                <button onclick="setChoreFilter('overdue')" class="px-3 py-1 rounded-lg font-bold cursor-pointer ${appState.choreFilterMode === 'overdue' ? 'bg-rose-500 text-white' : 'text-slate-500'}">Overdue</button>
                <button onclick="setChoreFilter('completed')" class="px-3 py-1 rounded-lg font-bold cursor-pointer ${appState.choreFilterMode === 'completed' ? 'bg-emerald-600 text-white' : 'text-slate-500'}">Completed</button>
                <button onclick="setChoreFilter('all')" class="px-3 py-1 rounded-lg font-bold cursor-pointer ${appState.choreFilterMode === 'all' ? 'bg-white text-slate-900' : 'text-slate-500'}">All</button>
              </div>
            </div>
          </div>

          <!-- Chores List -->
          ${
            filteredChores.length === 0
              ? '<div class="text-center py-16 bg-white rounded-3xl border border-slate-200 p-6"><p class="text-sm font-bold text-slate-700">No chores found</p><button onclick="openAddChoreModal()" class="mt-3 px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl cursor-pointer">+ Schedule First Task</button></div>'
              : `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              ${filteredChores
                .map((chore) => {
                  const isOverdue = chore.status === 'pending' && chore.deadline < todayStr;
                  const isCompleted = chore.status === 'completed';
                  return `
                  <div class="bg-white rounded-2xl p-4 sm:p-5 border transition flex flex-col justify-between space-y-3 ${isOverdue ? 'border-rose-300 bg-rose-50/20' : isCompleted ? 'border-emerald-200 bg-emerald-50/15 opacity-80' : 'border-slate-200 hover:border-indigo-300'}">
                    <div>
                      <div class="flex items-center justify-between gap-1.5 flex-wrap">
                        <span class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${chore.priority === 'high' ? 'bg-rose-100 text-rose-800' : chore.priority === 'medium' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'}">
                          ${chore.priority} Priority
                        </span>
                        ${isOverdue ? '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white animate-pulse">Overdue</span>' : ''}
                        ${isCompleted ? '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white">Completed</span>' : ''}
                        ${(chore.postponedCount || 0) > 0 ? `<span class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">+${chore.postponedDaysTotal}d delayed</span>` : ''}
                        <div class="flex items-center gap-1 ml-auto">
                          <button onclick="openEditChoreModal('${chore.id}')" title="Edit" class="p-1 rounded text-slate-400 hover:text-slate-700 cursor-pointer">✏️</button>
                          <button onclick="deleteChoreAction('${chore.id}')" title="Delete" class="p-1 rounded text-slate-400 hover:text-rose-600 cursor-pointer">🗑️</button>
                        </div>
                      </div>

                      <h3 class="font-bold text-base mt-2 text-slate-900 ${isCompleted ? 'line-through text-slate-500' : ''}">${chore.title}</h3>
                      ${chore.description ? `<p class="text-xs text-slate-500 mt-1 line-clamp-2">${chore.description}</p>` : ''}
                      <div class="text-[11px] text-slate-400 mt-1.5">${getCategoryBreadcrumbs(appState.choreCategories, chore.categoryId).map((c) => c.name).join(' › ')}</div>

                      <div class="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                        <div class="flex justify-between">
                          <span class="text-slate-400">Assigned To:</span>
                          <span class="font-bold text-slate-800">${chore.assignedTo.avatar} ${chore.assignedTo.name} (${chore.assignedTo.role})</span>
                        </div>
                        <div class="flex justify-between text-slate-400 text-[11px]">
                          <span>Created By:</span>
                          <span>${chore.createdBy?.name || 'Sarah'}</span>
                        </div>
                        ${chore.doneBy ? `<div class="flex justify-between text-emerald-600 font-bold text-[11px] pt-1 border-t border-slate-200"><span>Done By:</span><span>${chore.doneBy.avatar} ${chore.doneBy.name} (${chore.completedAt})</span></div>` : ''}
                      </div>
                    </div>

                    <div class="pt-3 border-t border-slate-100 space-y-2">
                      <div class="flex justify-between text-xs font-semibold">
                        <span class="text-slate-400">Deadline:</span>
                        <span class="${isOverdue ? 'text-rose-600 font-bold' : 'text-slate-800'}">${chore.deadline}</span>
                      </div>
                      ${
                        chore.status === 'pending'
                          ? `
                        <div class="grid grid-cols-2 gap-2">
                          <button onclick="postponeChoreAction('${chore.id}', 2)" class="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer transition">
                            ⏱ +2d Postpone
                          </button>
                          <button onclick="openRescheduleModal('${chore.id}')" class="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs cursor-pointer transition">
                            ✓ Mark Done
                          </button>
                        </div>
                      `
                          : '<div class="text-center py-1 text-xs font-bold text-emerald-600">✓ Task Complete</div>'
                      }
                    </div>
                  </div>
                `;
                })
                .join('')}
            </div>
          `
          }
        </div>
      </div>
    </div>
  `;
}

function renderNestedChoreTreeHTML(parentId, depth) {
  const children = appState.choreCategories.filter((c) => c.parentId === parentId);
  if (children.length === 0) return '';

  return children
    .map((cat) => {
      const isSelected = appState.selectedChoreCatId === cat.id;
      const directChildren = appState.choreCategories.filter((c) => c.parentId === cat.id);
      const hasChildren = directChildren.length > 0;
      const isExpanded = appState.expandedChoreCats.has(cat.id);

      return `
      <div class="space-y-1">
        <div style="padding-left: ${depth * 12}px" class="group flex items-center justify-between rounded-xl py-1 pr-1.5 transition ${isSelected ? 'bg-indigo-50 text-indigo-700 font-bold' : 'hover:bg-slate-50 text-slate-700'}">
          <div class="flex items-center flex-1 min-w-0 gap-1">
            ${
              hasChildren
                ? `<button onclick="event.stopPropagation(); toggleChoreCatExpand('${cat.id}')" class="p-1 rounded text-slate-400 hover:text-slate-700 cursor-pointer shrink-0">${isExpanded ? '▼' : '▶'}</button>`
                : '<span class="w-4 inline-block shrink-0"></span>'
            }
            <button onclick="selectChoreCategory('${cat.id}')" class="flex-1 text-left px-1 py-0.5 text-xs font-medium truncate cursor-pointer flex items-center justify-between gap-1">
              <span class="truncate">${cat.name}</span>
              ${hasChildren ? `<span class="text-[10px] bg-slate-200 text-slate-500 px-1.5 rounded-full">${directChildren.length}</span>` : ''}
            </button>
          </div>
          <div class="opacity-0 group-hover:opacity-100 flex items-center gap-1 shrink-0">
            <button onclick="openAddCategoryModal('${cat.id}', 'chore')" title="Add Subtype" class="p-1 text-slate-400 hover:text-indigo-600 cursor-pointer">📁+</button>
            <button onclick="deleteChoreCategoryAction('${cat.id}')" title="Delete" class="p-1 text-slate-400 hover:text-rose-600 cursor-pointer">🗑️</button>
          </div>
        </div>
        ${hasChildren && isExpanded ? renderNestedChoreTreeHTML(cat.id, depth + 1) : ''}
      </div>
    `;
    })
    .join('');
}

// ==========================================
// 8. FAMILY CALENDAR (SHARED RESPONSIVE GRID)
// ==========================================

function renderCalendar(container) {
  const currentMonthDate = appState.calendarMonth;
  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth();
  const monthName = currentMonthDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  const todayStr = new Date().toISOString().split('T')[0];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  // Aggregate events map
  const eventsMap = {};
  appState.chores.forEach((c) => {
    if (appState.calendarMember !== 'all' && c.assignedTo.id !== appState.calendarMember) return;
    const d = c.status === 'completed' && c.completedAt ? c.completedAt : c.deadline;
    if (!eventsMap[d]) eventsMap[d] = { chores: [], expiries: [], restocks: [] };
    eventsMap[d].chores.push(c);
  });
  appState.groceryItems.forEach((item) => {
    if (!eventsMap[item.expiryDate]) eventsMap[item.expiryDate] = { chores: [], expiries: [], restocks: [] };
    eventsMap[item.expiryDate].expiries.push(item);
    if (!eventsMap[item.topUpDate]) eventsMap[item.topUpDate] = { chores: [], expiries: [], restocks: [] };
    eventsMap[item.topUpDate].restocks.push(item);
  });

  const cells = [];
  const prevMonthDays = new Date(year, month, 0).getDate();
  for (let i = firstDay - 1; i >= 0; i--) {
    const d = prevMonthDays - i;
    const dateStr = new Date(year, month - 1, d).toISOString().split('T')[0];
    cells.push({ dateStr, dayNum: d, current: false });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = new Date(year, month, d).toISOString().split('T')[0];
    cells.push({ dateStr, dayNum: d, current: true });
  }
  const remaining = (7 - (cells.length % 7)) % 7;
  for (let d = 1; d <= remaining; d++) {
    const dateStr = new Date(year, month + 1, d).toISOString().split('T')[0];
    cells.push({ dateStr, dayNum: d, current: false });
  }

  const selectedDayEvents = eventsMap[appState.calendarDate] || { chores: [], expiries: [], restocks: [] };

  container.innerHTML = `
    <div class="space-y-6">
      <!-- Calendar Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <div class="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider">
            📅 Shared Family Calendar
          </div>
          <h1 class="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">${monthName}</h1>
          <p class="text-xs text-slate-400">Integrated schedule for chore deadlines, completions, and pantry expiries.</p>
        </div>

        <div class="flex items-center gap-2">
          <div class="flex items-center bg-slate-100 p-1 rounded-xl">
            <button onclick="changeMonth(-1)" class="p-1.5 rounded-lg hover:bg-white text-xs cursor-pointer">◀</button>
            <button onclick="jumpCalendarToday()" class="px-2.5 py-1 text-xs font-bold text-slate-700 cursor-pointer">Today</button>
            <button onclick="changeMonth(1)" class="p-1.5 rounded-lg hover:bg-white text-xs cursor-pointer">▶</button>
          </div>
          <button onclick="openAddChoreModal('${todayStr}')" class="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs cursor-pointer">
            + Add Task
          </button>
        </div>
      </div>

      <!-- Filters & Member Selector -->
      <div class="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-xs">
        <div class="flex items-center gap-1.5 flex-wrap">
          <button onclick="setCalendarFilter('all')" class="px-3 py-1.5 rounded-xl font-bold cursor-pointer ${appState.calendarFilter === 'all' ? 'bg-slate-900 text-white' : 'hover:bg-slate-100 text-slate-600'}">All Events</button>
          <button onclick="setCalendarFilter('chores')" class="px-3 py-1.5 rounded-xl font-bold cursor-pointer ${appState.calendarFilter === 'chores' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-100 text-slate-600'}">Chores Only</button>
          <button onclick="setCalendarFilter('expiries')" class="px-3 py-1.5 rounded-xl font-bold cursor-pointer ${appState.calendarFilter === 'expiries' ? 'bg-rose-500 text-white' : 'hover:bg-slate-100 text-slate-600'}">Grocery Expiries</button>
          <button onclick="setCalendarFilter('restocks')" class="px-3 py-1.5 rounded-xl font-bold cursor-pointer ${appState.calendarFilter === 'restocks' ? 'bg-emerald-600 text-white' : 'hover:bg-slate-100 text-slate-600'}">Restocks</button>
        </div>
        <select onchange="setCalendarMember(this.value)" class="px-2.5 py-1 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none">
          <option value="all">Everyone</option>
          ${appState.familyMembers.map((m) => `<option value="${m.id}" ${appState.calendarMember === m.id ? 'selected' : ''}>${m.avatar} ${m.name}</option>`).join('')}
        </select>
      </div>

      <!-- Calendar Grid -->
      <div class="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-2">
        <div class="grid grid-cols-7 gap-1 text-center font-bold text-xs uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-100">
          <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
        </div>

        <div class="grid grid-cols-7 gap-1.5">
          ${cells
            .map((cell) => {
              const isToday = cell.dateStr === todayStr;
              const isSelected = cell.dateStr === appState.calendarDate;
              const ev = eventsMap[cell.dateStr] || { chores: [], expiries: [], restocks: [] };
              const hasC = (appState.calendarFilter === 'all' || appState.calendarFilter === 'chores') && ev.chores.length > 0;
              const hasE = (appState.calendarFilter === 'all' || appState.calendarFilter === 'expiries') && ev.expiries.length > 0;
              const hasR = (appState.calendarFilter === 'all' || appState.calendarFilter === 'restocks') && ev.restocks.length > 0;

              return `
              <div onclick="selectCalendarDate('${cell.dateStr}')" class="min-h-[58px] sm:min-h-[110px] p-1.5 sm:p-2 rounded-xl sm:rounded-2xl border transition flex flex-col justify-between cursor-pointer ${
                isSelected ? 'ring-2 ring-indigo-500 bg-indigo-50/50 border-indigo-300' : isToday ? 'border-indigo-400 bg-indigo-50/20' : cell.current ? 'border-slate-200 bg-slate-50/30 hover:bg-slate-100' : 'opacity-40 bg-slate-50/10'
              }">
                <div class="flex items-center justify-between">
                  <span class="text-[11px] sm:text-xs font-bold flex items-center justify-center h-5 w-5 sm:h-6 sm:w-6 rounded-full ${isToday ? 'bg-indigo-600 text-white' : 'text-slate-800'}">
                    ${cell.dayNum}
                  </span>
                </div>

                <!-- Mobile Dots Indicator -->
                <div class="flex sm:hidden items-center justify-center gap-1 mt-1 flex-wrap">
                  ${hasC ? '<span class="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>' : ''}
                  ${hasE ? '<span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>' : ''}
                  ${hasR ? '<span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>' : ''}
                </div>

                <!-- Desktop Event Chips -->
                <div class="hidden sm:block space-y-0.5 mt-1 overflow-hidden">
                  ${
                    hasC
                      ? ev.chores.slice(0, 2).map((c) => `<div class="truncate text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${c.status === 'completed' ? 'bg-emerald-100 text-emerald-800 line-through' : 'bg-indigo-100 text-indigo-800'}">${c.assignedTo.avatar} ${c.title}</div>`).join('')
                      : ''
                  }
                  ${hasC && ev.chores.length > 2 ? `<div class="text-[9px] font-bold text-indigo-600">+${ev.chores.length - 2} more</div>` : ''}
                  ${hasE ? `<div class="truncate text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-800">⚠️ Exp: ${ev.expiries[0].name}</div>` : ''}
                  ${hasR ? `<div class="truncate text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700">📦 Restock</div>` : ''}
                </div>
              </div>
            `;
            })
            .join('')}
        </div>
      </div>

      <!-- Selected Day Details Panel -->
      <div class="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <span class="text-[10px] uppercase font-bold text-indigo-500">Selected Schedule Date</span>
            <h3 class="text-base sm:text-lg font-black text-slate-900">${new Date(appState.calendarDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</h3>
          </div>
          <button onclick="openAddChoreModal('${appState.calendarDate}')" class="px-3 py-1.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 cursor-pointer">
            + Add Task for this Day
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-2">
            <h4 class="text-xs font-bold uppercase text-slate-400">Chores (${selectedDayEvents.chores.length})</h4>
            ${
              selectedDayEvents.chores.length === 0
                ? '<p class="text-xs text-slate-400 italic">No chores scheduled on this date.</p>'
                : selectedDayEvents.chores
                    .map(
                      (c) => `
                <div class="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <div class="font-bold text-slate-800">${c.title}</div>
                    <div class="text-[11px] text-slate-500">${c.assignedTo.avatar} ${c.assignedTo.name}</div>
                  </div>
                  ${c.status === 'pending' ? `<button onclick="openRescheduleModal('${c.id}')" class="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold cursor-pointer">✓ Done</button>` : '<span class="text-emerald-600 font-bold">Done</span>'}
                </div>
              `
                    )
                    .join('')
            }
          </div>

          <div class="space-y-2">
            <h4 class="text-xs font-bold uppercase text-slate-400">Grocery Expiries & Restocks</h4>
            ${
              selectedDayEvents.expiries.length === 0 && selectedDayEvents.restocks.length === 0
                ? '<p class="text-xs text-slate-400 italic">No grocery milestones on this date.</p>'
                : `
              ${selectedDayEvents.expiries.map((i) => `<div class="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs font-bold text-amber-800">⚠️ Expiring: ${i.name} (${i.quantity} ${i.unit})</div>`).join('')}
              ${selectedDayEvents.restocks.map((i) => `<div class="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800">📦 Restocked: ${i.name} by ${i.updatedBy?.name}</div>`).join('')}
            `
            }
          </div>
        </div>
      </div>
    </div>
  `;
}

// ==========================================
// 9. MODALS & ACTIONS LOGIC
// ==========================================

// Global Modal container helper
function showModal(contentHTML) {
  let modalWrapper = document.getElementById('modal-wrapper');
  if (!modalWrapper) {
    modalWrapper = document.createElement('div');
    modalWrapper.id = 'modal-wrapper';
    document.body.appendChild(modalWrapper);
  }
  modalWrapper.innerHTML = `
    <div class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      ${contentHTML}
    </div>
  `;
}

window.closeModal = function () {
  const modalWrapper = document.getElementById('modal-wrapper');
  if (modalWrapper) modalWrapper.innerHTML = '';
};

// --- A. EDIT PROFILE MODAL ---
window.openEditProfileModal = function (memberId) {
  const member = appState.familyMembers.find((m) => m.id === memberId) || getActiveUser();
  const emojis = ['👩', '👨', '🧑', '👧', '👦', '👵', '👴', '👶', '🐱', '🐶', '🦄', '🧙‍♂️', '🦸‍♀️'];
  const colors = [
    { name: 'Rose', hex: '#ec4899' },
    { name: 'Blue', hex: '#3b82f6' },
    { name: 'Indigo', hex: '#6366f1' },
    { name: 'Emerald', hex: '#10b981' },
    { name: 'Amber', hex: '#f59e0b' },
    { name: 'Purple', hex: '#8b5cf6' },
    { name: 'Cyan', hex: '#06b6d4' },
    { name: 'Orange', hex: '#f97316' },
  ];

  showModal(`
    <div class="bg-white rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[92vh] overflow-y-auto">
      <div class="flex items-center justify-between pb-3 border-b border-slate-100">
        <h3 class="text-base sm:text-lg font-bold text-slate-900">Edit Household Profile</h3>
        <button onclick="closeModal()" class="text-slate-400 hover:text-slate-600 text-lg cursor-pointer">✕</button>
      </div>

      <!-- Live Preview -->
      <div class="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
        <div id="preview-avatar" style="background-color: ${member.color}20; border-color: ${member.color}" class="w-12 h-12 rounded-2xl border-2 flex items-center justify-center text-2xl shadow-xs">
          ${member.avatar}
        </div>
        <div>
          <div id="preview-name" class="font-bold text-slate-900">${member.name}</div>
          <div id="preview-role" class="text-xs text-slate-500">${member.role}</div>
        </div>
      </div>

      <form onsubmit="handleSaveProfile(event, '${member.id}')" class="space-y-4 text-xs">
        <div>
          <label class="block font-semibold text-slate-700 mb-1">Display Name</label>
          <input id="profile-name-input" type="text" required value="${member.name}" oninput="document.getElementById('preview-name').textContent = this.value" class="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>

        <div>
          <label class="block font-semibold text-slate-700 mb-1">Household Role</label>
          <input id="profile-role-input" type="text" value="${member.role}" oninput="document.getElementById('preview-role').textContent = this.value" class="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>

        <div>
          <label class="block font-semibold text-slate-700 mb-1">Avatar Emoji</label>
          <div class="grid grid-cols-7 gap-1.5 p-2 bg-slate-50 rounded-2xl border border-slate-200">
            ${emojis
              .map(
                (e) => `
              <button type="button" onclick="selectProfileAvatar('${e}')" class="text-xl p-1.5 rounded-xl hover:bg-slate-200 transition cursor-pointer ${e === member.avatar ? 'bg-indigo-100 border border-indigo-400' : ''}">
                ${e}
              </button>
            `
              )
              .join('')}
          </div>
          <input id="profile-avatar-hidden" type="hidden" value="${member.avatar}" />
        </div>

        <div>
          <label class="block font-semibold text-slate-700 mb-1">Theme Accent Color</label>
          <div class="flex items-center gap-2 flex-wrap">
            ${colors
              .map(
                (c) => `
              <button type="button" onclick="selectProfileColor('${c.hex}')" style="background-color: ${c.hex}" class="w-7 h-7 rounded-full cursor-pointer hover:scale-110 transition ${c.hex === member.color ? 'ring-2 ring-offset-2 ring-indigo-500 scale-105' : ''}" title="${c.name}"></button>
            `
              )
              .join('')}
          </div>
          <input id="profile-color-hidden" type="hidden" value="${member.color}" />
        </div>

        <div class="flex items-center justify-between pt-3 border-t border-slate-100">
          ${
            appState.familyMembers.length > 1
              ? `<button type="button" onclick="handleDeleteProfile('${member.id}')" class="text-rose-600 font-bold hover:underline cursor-pointer">Delete Member</button>`
              : '<span class="text-slate-400 text-[10px]">Primary Profile</span>'
          }
          <div class="flex items-center gap-2">
            <button type="button" onclick="closeModal()" class="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 cursor-pointer">Cancel</button>
            <button type="submit" class="px-5 py-2 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 cursor-pointer shadow-sm">Save Profile</button>
          </div>
        </div>
      </form>
    </div>
  `);
};

window.selectProfileAvatar = function (avatar) {
  document.getElementById('profile-avatar-hidden').value = avatar;
  document.getElementById('preview-avatar').textContent = avatar;
};

window.selectProfileColor = function (color) {
  document.getElementById('profile-color-hidden').value = color;
  const prev = document.getElementById('preview-avatar');
  prev.style.borderColor = color;
  prev.style.backgroundColor = color + '20';
};

window.handleSaveProfile = function (e, memberId) {
  e.preventDefault();
  const name = document.getElementById('profile-name-input').value.trim();
  const role = document.getElementById('profile-role-input').value.trim();
  const avatar = document.getElementById('profile-avatar-hidden').value;
  const color = document.getElementById('profile-color-hidden').value;

  appState.familyMembers = appState.familyMembers.map((m) => {
    if (m.id === memberId) {
      return { ...m, name, role, avatar, color };
    }
    return m;
  });

  saveState();
  closeModal();
  renderApp();
};

window.handleDeleteProfile = function (memberId) {
  if (appState.familyMembers.length <= 1) return;
  if (confirm('Are you sure you want to remove this family member?')) {
    appState.familyMembers = appState.familyMembers.filter((m) => m.id !== memberId);
    if (appState.activeUserId === memberId) {
      appState.activeUserId = appState.familyMembers[0].id;
    }
    saveState();
    closeModal();
    renderApp();
  }
};

window.openAddMemberModal = function () {
  const emojis = ['👩', '👨', '🧑', '👧', '👦', '👵', '👴', '👶', '🐱', '🐶', '🦄', '🧙‍♂️', '🦸‍♀️'];
  const colors = [
    { name: 'Rose', hex: '#ec4899' },
    { name: 'Blue', hex: '#3b82f6' },
    { name: 'Indigo', hex: '#6366f1' },
    { name: 'Emerald', hex: '#10b981' },
    { name: 'Amber', hex: '#f59e0b' },
    { name: 'Purple', hex: '#8b5cf6' },
    { name: 'Cyan', hex: '#06b6d4' },
    { name: 'Orange', hex: '#f97316' },
  ];

  showModal(`
    <div class="bg-white rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[92vh] overflow-y-auto">
      <div class="flex items-center justify-between pb-3 border-b border-slate-100">
        <h3 class="text-base sm:text-lg font-bold text-slate-900">Add Household Member</h3>
        <button onclick="closeModal()" class="text-slate-400 hover:text-slate-600 text-lg cursor-pointer">✕</button>
      </div>

      <div class="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
        <div id="preview-avatar" style="background-color: #6366f120; border-color: #6366f1" class="w-12 h-12 rounded-2xl border-2 flex items-center justify-center text-2xl shadow-xs">
          🧑
        </div>
        <div>
          <div id="preview-name" class="font-bold text-slate-900">New Member</div>
          <div id="preview-role" class="text-xs text-slate-500">Member</div>
        </div>
      </div>

      <form onsubmit="handleSaveNewMember(event)" class="space-y-4 text-xs">
        <div>
          <label class="block font-semibold text-slate-700 mb-1">Display Name</label>
          <input id="profile-name-input" type="text" required placeholder="e.g. Leo, Jordan, Sam" oninput="document.getElementById('preview-name').textContent = this.value || 'New Member'" class="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>

        <div>
          <label class="block font-semibold text-slate-700 mb-1">Household Role</label>
          <input id="profile-role-input" type="text" placeholder="e.g. Roommate, Teen, Co-parent" oninput="document.getElementById('preview-role').textContent = this.value || 'Member'" class="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>

        <div>
          <label class="block font-semibold text-slate-700 mb-1">Avatar Emoji</label>
          <div class="grid grid-cols-7 gap-1.5 p-2 bg-slate-50 rounded-2xl border border-slate-200">
            ${emojis
              .map(
                (e) => `
              <button type="button" onclick="selectProfileAvatar('${e}')" class="text-xl p-1.5 rounded-xl hover:bg-slate-200 transition cursor-pointer ${e === '🧑' ? 'bg-indigo-100 border border-indigo-400' : ''}">
                ${e}
              </button>
            `
              )
              .join('')}
          </div>
          <input id="profile-avatar-hidden" type="hidden" value="🧑" />
        </div>

        <div>
          <label class="block font-semibold text-slate-700 mb-1">Theme Accent Color</label>
          <div class="flex items-center gap-2 flex-wrap">
            ${colors
              .map(
                (c) => `
              <button type="button" onclick="selectProfileColor('${c.hex}')" style="background-color: ${c.hex}" class="w-7 h-7 rounded-full cursor-pointer hover:scale-110 transition ${c.hex === '#6366f1' ? 'ring-2 ring-offset-2 ring-indigo-500 scale-105' : ''}" title="${c.name}"></button>
            `
              )
              .join('')}
          </div>
          <input id="profile-color-hidden" type="hidden" value="#6366f1" />
        </div>

        <div class="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          <button type="button" onclick="closeModal()" class="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 cursor-pointer">Cancel</button>
          <button type="submit" class="px-5 py-2 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 cursor-pointer shadow-sm">Add Member</button>
        </div>
      </form>
    </div>
  `);
};

window.handleSaveNewMember = function (e) {
  e.preventDefault();
  const name = document.getElementById('profile-name-input').value.trim();
  const role = document.getElementById('profile-role-input').value.trim() || 'Member';
  const avatar = document.getElementById('profile-avatar-hidden').value || '🧑';
  const color = document.getElementById('profile-color-hidden').value || '#6366f1';

  const newMember = {
    id: 'user-' + Date.now(),
    name,
    role,
    avatar,
    color,
  };
  appState.familyMembers.push(newMember);
  appState.activeUserId = newMember.id;
  saveState();
  closeModal();
  renderApp();
};

// --- B. CHORE COMPLETION & RESCHEDULE MODAL ---
window.openRescheduleModal = function (choreId) {
  const chore = appState.chores.find((c) => c.id === choreId);
  if (!chore) return;
  const activeUser = getActiveUser();

  const presets = [
    { label: 'Tomorrow', days: 1, date: getRelDate(1) },
    { label: 'In 3 Days', days: 3, date: getRelDate(3) },
    { label: 'Next Week', days: 7, date: getRelDate(7) },
    { label: 'In 2 Weeks', days: 14, date: getRelDate(14) },
    { label: 'Next Month', days: 30, date: getRelDate(30) },
  ];

  showModal(`
    <div class="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[92vh] overflow-y-auto">
      <div class="flex items-center justify-between pb-2 border-b border-slate-100">
        <div>
          <h3 class="text-base sm:text-lg font-bold text-slate-900">✓ Log Chore Completed</h3>
          <p class="text-xs text-slate-400">Logged by <strong>${activeUser.name} ${activeUser.avatar}</strong></p>
        </div>
        <button onclick="closeModal()" class="text-slate-400 hover:text-slate-600 text-lg cursor-pointer">✕</button>
      </div>

      <div class="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
        <span class="text-[10px] uppercase font-bold text-slate-400">Task Completed</span>
        <div class="font-bold text-base text-slate-900">${chore.title}</div>
        <div class="text-xs text-slate-500">Planned deadline: ${chore.originalDeadline} • Assigned to ${chore.assignedTo.name}</div>
      </div>

      <div class="space-y-3 pt-1">
        <h4 class="text-xs sm:text-sm font-bold text-slate-800">🔄 Schedule this task again for a future date?</h4>
        <p class="text-xs text-slate-500">Choose a recurrence cadence below to keep up proactive household maintenance:</p>

        <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
          ${presets
            .map(
              (p, idx) => `
            <button type="button" onclick="selectRescheduleCadence(${p.days}, '${p.date}')" class="reschedule-btn p-3 rounded-2xl border border-slate-200 text-left hover:bg-indigo-50 transition cursor-pointer ${idx === 2 ? 'border-indigo-600 bg-indigo-50/70 font-bold' : ''}">
              <div class="font-bold text-xs">${p.label}</div>
              <div class="text-[10px] text-slate-400">${p.date}</div>
            </button>
          `
            )
            .join('')}
        </div>

        <div class="pt-2">
          <label class="block text-xs font-semibold text-slate-700 mb-1">Assign Next Cycle To</label>
          <select id="reschedule-assignee" class="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white">
            ${appState.familyMembers.map((m) => `<option value="${m.id}" ${m.id === chore.assignedTo.id ? 'selected' : ''}>${m.avatar} ${m.name} (${m.role})</option>`).join('')}
          </select>
        </div>
        <input type="hidden" id="reschedule-date-hidden" value="${getRelDate(7)}" />
      </div>

      <div class="flex flex-col sm:flex-row items-center justify-between gap-2 pt-3 border-t border-slate-100">
        <button onclick="confirmCompleteChore('${chore.id}', false)" class="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer">
          Just Complete (No Reschedule)
        </button>
        <button onclick="confirmCompleteChore('${chore.id}', true)" class="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 shadow-sm cursor-pointer">
          Complete & Schedule Next
        </button>
      </div>
    </div>
  `);
};

window.selectRescheduleCadence = function (days, dateStr) {
  document.getElementById('reschedule-date-hidden').value = dateStr;
  document.querySelectorAll('.reschedule-btn').forEach((btn) => {
    btn.className = 'reschedule-btn p-3 rounded-2xl border border-slate-200 text-left hover:bg-indigo-50 transition cursor-pointer';
  });
  if (event && event.currentTarget) {
    event.currentTarget.className = 'reschedule-btn p-3 rounded-2xl border border-indigo-600 bg-indigo-50/70 text-left font-bold transition cursor-pointer';
  }
};

window.confirmCompleteChore = function (choreId, shouldReschedule) {
  const activeUser = getActiveUser();
  const todayStr = new Date().toISOString().split('T')[0];

  let completedChore = null;
  appState.chores = appState.chores.map((c) => {
    if (c.id === choreId) {
      completedChore = c;
      return {
        ...c,
        status: 'completed',
        doneBy: activeUser,
        completedAt: todayStr,
      };
    }
    return c;
  });

  if (shouldReschedule && completedChore) {
    const nextDate = document.getElementById('reschedule-date-hidden')?.value || getRelDate(7);
    const nextAssigneeId = document.getElementById('reschedule-assignee')?.value;
    const nextAssignee = appState.familyMembers.find((m) => m.id === nextAssigneeId) || completedChore.assignedTo;

    const nextChore = {
      id: 'c-' + Date.now(),
      title: completedChore.title,
      description: completedChore.description,
      categoryId: completedChore.categoryId,
      deadline: nextDate,
      originalDeadline: nextDate,
      assignedTo: nextAssignee,
      createdBy: activeUser,
      status: 'pending',
      priority: completedChore.priority,
      postponedCount: 0,
      postponedDaysTotal: 0,
    };
    appState.chores.unshift(nextChore);
  }

  saveState();
  closeModal();
  renderApp();
};

window.postponeChoreAction = function (choreId, days) {
  appState.chores = appState.chores.map((c) => {
    if (c.id === choreId) {
      const d = new Date(c.deadline);
      d.setDate(d.getDate() + days);
      return {
        ...c,
        deadline: d.toISOString().split('T')[0],
        postponedCount: (c.postponedCount || 0) + 1,
        postponedDaysTotal: (c.postponedDaysTotal || 0) + days,
      };
    }
    return c;
  });
  saveState();
  renderApp();
};

// --- C. TOP UP & CONSUME MODALS ---
window.openTopUpModal = function (itemId) {
  const item = appState.groceryItems.find((i) => i.id === itemId);
  if (!item) return;

  showModal(`
    <div class="bg-white rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-200 space-y-4">
      <div class="flex items-center justify-between pb-2 border-b border-slate-100">
        <h3 class="text-base sm:text-lg font-bold text-slate-900">📦 Restock & Top Up</h3>
        <button onclick="closeModal()" class="text-slate-400 hover:text-slate-600 text-lg cursor-pointer">✕</button>
      </div>
      <p class="text-xs text-slate-500">Adding inventory for <strong>${item.name}</strong>. Current: ${item.quantity} ${item.unit}.</p>

      <form onsubmit="handleConfirmTopUp(event, '${item.id}')" class="space-y-3 text-xs">
        <div>
          <label class="block font-semibold text-slate-700 mb-1">Quantity to Add (${item.unit})</label>
          <input id="topup-qty" type="number" step="0.1" min="0.1" required value="1" class="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold" />
        </div>
        <div>
          <label class="block font-semibold text-slate-700 mb-1">Unit Purchase Price ($)</label>
          <input id="topup-price" type="number" step="0.01" min="0" required value="${item.lastPricePerUnit}" class="w-full px-3 py-2 rounded-xl border border-slate-300" />
        </div>
        <div>
          <label class="block font-semibold text-slate-700 mb-1">New Expiry Date (Optional)</label>
          <input id="topup-exp" type="date" value="${item.expiryDate}" class="w-full px-3 py-2 rounded-xl border border-slate-300" />
        </div>
        <div>
          <label class="block font-semibold text-slate-700 mb-1">Notes</label>
          <input id="topup-notes" type="text" placeholder="e.g. Bought from organic market..." class="w-full px-3 py-2 rounded-xl border border-slate-300" />
        </div>
        <div class="flex justify-end gap-2 pt-2">
          <button type="button" onclick="closeModal()" class="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 cursor-pointer">Cancel</button>
          <button type="submit" class="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 cursor-pointer">Confirm Restock</button>
        </div>
      </form>
    </div>
  `);
};

window.handleConfirmTopUp = function (e, itemId) {
  e.preventDefault();
  const addedQty = parseFloat(document.getElementById('topup-qty').value) || 1;
  const price = parseFloat(document.getElementById('topup-price').value) || 0;
  const exp = document.getElementById('topup-exp').value;
  const notes = document.getElementById('topup-notes').value.trim();
  const activeUser = getActiveUser();
  const todayStr = new Date().toISOString().split('T')[0];

  appState.groceryItems = appState.groceryItems.map((item) => {
    if (item.id === itemId) {
      const newLogs = item.logs || [];
      newLogs.unshift({
        id: 'log-' + Date.now(),
        date: todayStr,
        deltaQuantity: addedQty,
        action: 'topup',
        pricePerUnit: price,
        userName: activeUser.name,
        notes: notes || `Restocked +${addedQty} ${item.unit}`,
      });
      return {
        ...item,
        quantity: Number((item.quantity + addedQty).toFixed(2)),
        lastPricePerUnit: price || item.lastPricePerUnit,
        topUpDate: todayStr,
        expiryDate: exp || item.expiryDate,
        updatedBy: activeUser,
        updatedAt: new Date().toISOString(),
        logs: newLogs,
      };
    }
    return item;
  });

  saveState();
  closeModal();
  renderApp();
};

window.openConsumeModal = function (itemId) {
  const item = appState.groceryItems.find((i) => i.id === itemId);
  if (!item) return;

  showModal(`
    <div class="bg-white rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-200 space-y-4">
      <div class="flex items-center justify-between pb-2 border-b border-slate-100">
        <h3 class="text-base sm:text-lg font-bold text-slate-900">📉 Log Consumption</h3>
        <button onclick="closeModal()" class="text-slate-400 hover:text-slate-600 text-lg cursor-pointer">✕</button>
      </div>
      <p class="text-xs text-slate-500">Record usage for <strong>${item.name}</strong> to recalculate burn rate. Current: ${item.quantity} ${item.unit}.</p>

      <form onsubmit="handleConfirmConsume(event, '${item.id}')" class="space-y-3 text-xs">
        <div>
          <label class="block font-semibold text-slate-700 mb-1">Quantity Consumed (${item.unit})</label>
          <input id="consume-qty" type="number" step="0.1" min="0.1" max="${item.quantity}" required value="1" class="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold" />
        </div>
        <div>
          <label class="block font-semibold text-slate-700 mb-1">Reason / Meal Note</label>
          <input id="consume-notes" type="text" placeholder="e.g. Sunday family dinner, breakfast shakes..." class="w-full px-3 py-2 rounded-xl border border-slate-300" />
        </div>
        <div class="flex justify-end gap-2 pt-2">
          <button type="button" onclick="closeModal()" class="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 cursor-pointer">Cancel</button>
          <button type="submit" class="px-5 py-2 rounded-xl bg-amber-600 text-white font-bold hover:bg-amber-700 cursor-pointer">Log Consumption</button>
        </div>
      </form>
    </div>
  `);
};

window.handleConfirmConsume = function (e, itemId) {
  e.preventDefault();
  const consumedQty = parseFloat(document.getElementById('consume-qty').value) || 1;
  const notes = document.getElementById('consume-notes').value.trim();
  const activeUser = getActiveUser();
  const todayStr = new Date().toISOString().split('T')[0];

  appState.groceryItems = appState.groceryItems.map((item) => {
    if (item.id === itemId) {
      const newLogs = item.logs || [];
      newLogs.unshift({
        id: 'log-' + Date.now(),
        date: todayStr,
        deltaQuantity: -consumedQty,
        action: 'consume',
        userName: activeUser.name,
        notes: notes || `Consumed -${consumedQty} ${item.unit}`,
      });
      return {
        ...item,
        quantity: Math.max(0, Number((item.quantity - consumedQty).toFixed(2))),
        updatedBy: activeUser,
        updatedAt: new Date().toISOString(),
        logs: newLogs,
      };
    }
    return item;
  });

  saveState();
  closeModal();
  renderApp();
};

window.openLogsModal = function (itemId) {
  const item = appState.groceryItems.find((i) => i.id === itemId);
  if (!item) return;

  showModal(`
    <div class="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[85vh] overflow-y-auto">
      <div class="flex items-center justify-between pb-2 border-b border-slate-100">
        <h3 class="text-base font-bold text-slate-900">Activity Logs: ${item.name}</h3>
        <button onclick="closeModal()" class="text-slate-400 hover:text-slate-600 text-lg cursor-pointer">✕</button>
      </div>
      <div class="space-y-2">
        ${
          (item.logs || []).length === 0
            ? '<p class="text-xs text-slate-400 italic">No usage history logged yet.</p>'
            : item.logs
                .map(
                  (l) => `
            <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex justify-between text-xs">
              <div>
                <span class="font-bold ${l.action === 'topup' ? 'text-emerald-700' : 'text-amber-700'}">
                  ${l.action === 'topup' ? `+${l.deltaQuantity} Restock` : `${l.deltaQuantity} Used`}
                </span>
                <span class="text-slate-400 ml-1.5">${l.date}</span>
                ${l.notes ? `<div class="text-[11px] text-slate-600 italic mt-0.5">"${l.notes}"</div>` : ''}
              </div>
              <div class="text-right text-[11px] text-slate-500">by ${l.userName}</div>
            </div>
          `
                )
                .join('')
        }
      </div>
    </div>
  `);
};

// --- D. ADD / EDIT GROCERY ITEM ---
window.openAddItemModal = function (preselectedCatId = '') {
  showModal(`
    <div class="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
      <div class="flex items-center justify-between pb-2 border-b border-slate-100">
        <h3 class="text-base sm:text-lg font-bold text-slate-900">Add New Grocery Item</h3>
        <button onclick="closeModal()" class="text-slate-400 hover:text-slate-600 text-lg cursor-pointer">✕</button>
      </div>

      <form onsubmit="handleSaveGroceryItem(event)" class="space-y-3 text-xs">
        <div>
          <label class="block font-semibold text-slate-700 mb-1">Item Name</label>
          <input id="item-name" type="text" required placeholder="e.g. Basmati Rice, Oat Milk..." class="w-full px-3 py-2 rounded-xl border border-slate-300" />
        </div>

        <div>
          <label class="block font-semibold text-slate-700 mb-1">Category / Subtype</label>
          <select id="item-cat" required class="w-full px-3 py-2 rounded-xl border border-slate-300">
            ${appState.groceryCategories.map((c) => `<option value="${c.id}" ${c.id === preselectedCatId ? 'selected' : ''}>${getCategoryBreadcrumbs(appState.groceryCategories, c.id).map((b) => b.name).join(' › ')}</option>`).join('')}
          </select>
        </div>

        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="block font-semibold text-slate-700 mb-1">Current Quantity</label>
            <input id="item-qty" type="number" step="0.1" min="0" required value="1" class="w-full px-3 py-2 rounded-xl border border-slate-300" />
          </div>
          <div>
            <label class="block font-semibold text-slate-700 mb-1">Unit</label>
            <select id="item-unit" class="w-full px-3 py-2 rounded-xl border border-slate-300">
              <option value="kg">kg (Kilograms)</option>
              <option value="g">g (Grams)</option>
              <option value="L">L (Litres)</option>
              <option value="ml">ml (Millilitres)</option>
              <option value="pcs">pcs (Pieces)</option>
              <option value="packs">packs (Packs)</option>
              <option value="cans">cans (Cans)</option>
              <option value="boxes">boxes (Boxes)</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="block font-semibold text-slate-700 mb-1">Min Safety Threshold</label>
            <input id="item-min" type="number" step="0.1" min="0" required value="1" class="w-full px-3 py-2 rounded-xl border border-slate-300" />
          </div>
          <div>
            <label class="block font-semibold text-slate-700 mb-1">Price per Unit ($)</label>
            <input id="item-price" type="number" step="0.01" min="0" required value="3.5" class="w-full px-3 py-2 rounded-xl border border-slate-300" />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="block font-semibold text-slate-700 mb-1">Top Up Date</label>
            <input id="item-topupdate" type="date" required value="${getRelDate(0)}" class="w-full px-3 py-2 rounded-xl border border-slate-300" />
          </div>
          <div>
            <label class="block font-semibold text-slate-700 mb-1">Expiry Date</label>
            <input id="item-expiry" type="date" required value="${getRelDate(30)}" class="w-full px-3 py-2 rounded-xl border border-slate-300" />
          </div>
        </div>

        <div class="flex justify-end gap-2 pt-2">
          <button type="button" onclick="closeModal()" class="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 cursor-pointer">Cancel</button>
          <button type="submit" class="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 cursor-pointer">Create Item</button>
        </div>
      </form>
    </div>
  `);
};

window.handleSaveGroceryItem = function (e) {
  e.preventDefault();
  const activeUser = getActiveUser();
  const newItem = {
    id: 'item-' + Date.now(),
    name: document.getElementById('item-name').value.trim(),
    categoryId: document.getElementById('item-cat').value,
    quantity: parseFloat(document.getElementById('item-qty').value) || 1,
    unit: document.getElementById('item-unit').value,
    minThreshold: parseFloat(document.getElementById('item-min').value) || 1,
    lastPricePerUnit: parseFloat(document.getElementById('item-price').value) || 0,
    topUpDate: document.getElementById('item-topupdate').value,
    expiryDate: document.getElementById('item-expiry').value,
    updatedBy: activeUser,
    updatedAt: new Date().toISOString(),
    logs: [
      {
        id: 'log-' + Date.now(),
        date: document.getElementById('item-topupdate').value,
        deltaQuantity: parseFloat(document.getElementById('item-qty').value) || 1,
        action: 'topup',
        pricePerUnit: parseFloat(document.getElementById('item-price').value) || 0,
        userName: activeUser.name,
        notes: 'Initial stock',
      },
    ],
  };

  appState.groceryItems.unshift(newItem);
  saveState();
  closeModal();
  renderApp();
};

window.deleteGroceryItemAction = function (itemId) {
  if (confirm('Delete this grocery item?')) {
    appState.groceryItems = appState.groceryItems.filter((i) => i.id !== itemId);
    saveState();
    renderApp();
  }
};

// --- E. ADD CATEGORY MODAL (INFINITE NESTING) ---
window.openAddCategoryModal = function (parentId = null, domain = 'grocery') {
  const categories = domain === 'grocery' ? appState.groceryCategories : appState.choreCategories;
  showModal(`
    <div class="bg-white rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-200 space-y-4">
      <div class="flex items-center justify-between pb-2 border-b border-slate-100">
        <h3 class="text-base sm:text-lg font-bold text-slate-900">${parentId ? 'Add Nested Subtype' : 'Add Root Category'}</h3>
        <button onclick="closeModal()" class="text-slate-400 hover:text-slate-600 text-lg cursor-pointer">✕</button>
      </div>

      <form onsubmit="handleSaveCategory(event, '${domain}')" class="space-y-3 text-xs">
        <div>
          <label class="block font-semibold text-slate-700 mb-1">Category / Subtype Name</label>
          <input id="cat-name-input" type="text" required placeholder="e.g. Grains, Cleaning, Lawn Care..." class="w-full px-3 py-2 rounded-xl border border-slate-300" />
        </div>

        <div>
          <label class="block font-semibold text-slate-700 mb-1">Parent Category (Infinite Nesting)</label>
          <select id="cat-parent-input" class="w-full px-3 py-2 rounded-xl border border-slate-300">
            <option value="">[Root Level - No Parent]</option>
            ${categories.map((c) => `<option value="${c.id}" ${c.id === parentId ? 'selected' : ''}>${getCategoryBreadcrumbs(categories, c.id).map((b) => b.name).join(' › ')}</option>`).join('')}
          </select>
        </div>

        <div class="flex justify-end gap-2 pt-2">
          <button type="button" onclick="closeModal()" class="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 cursor-pointer">Cancel</button>
          <button type="submit" class="px-5 py-2 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 cursor-pointer">Create Category</button>
        </div>
      </form>
    </div>
  `);
};

window.handleSaveCategory = function (e, domain) {
  e.preventDefault();
  const name = document.getElementById('cat-name-input').value.trim();
  const parentId = document.getElementById('cat-parent-input').value || null;
  const newCat = {
    id: (domain === 'grocery' ? 'cat-' : 'chore-cat-') + Date.now(),
    name,
    parentId,
  };

  if (domain === 'grocery') {
    appState.groceryCategories.push(newCat);
    appState.expandedGroceryCats.add(newCat.id);
  } else {
    appState.choreCategories.push(newCat);
    appState.expandedChoreCats.add(newCat.id);
  }

  saveState();
  closeModal();
  renderApp();
};

window.deleteGroceryCategoryAction = function (catId) {
  if (confirm('Delete this category and all nested subtypes?')) {
    const toDelete = new Set(getAllDescendantCategoryIds(appState.groceryCategories, catId));
    appState.groceryCategories = appState.groceryCategories.filter((c) => !toDelete.has(c.id));
    appState.groceryItems = appState.groceryItems.filter((i) => !toDelete.has(i.categoryId));
    if (toDelete.has(appState.selectedGroceryCatId)) appState.selectedGroceryCatId = null;
    saveState();
    renderApp();
  }
};

window.deleteChoreCategoryAction = function (catId) {
  if (confirm('Delete this chore subtype and related tasks?')) {
    const toDelete = new Set(getAllDescendantCategoryIds(appState.choreCategories, catId));
    appState.choreCategories = appState.choreCategories.filter((c) => !toDelete.has(c.id));
    appState.chores = appState.chores.filter((c) => !toDelete.has(c.categoryId));
    if (toDelete.has(appState.selectedChoreCatId)) appState.selectedChoreCatId = null;
    saveState();
    renderApp();
  }
};

// --- F. ADD / EDIT CHORE MODAL ---
window.openAddChoreModal = function (preselectedDate = '') {
  showModal(`
    <div class="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
      <div class="flex items-center justify-between pb-2 border-b border-slate-100">
        <h3 class="text-base sm:text-lg font-bold text-slate-900">Schedule Household Chore</h3>
        <button onclick="closeModal()" class="text-slate-400 hover:text-slate-600 text-lg cursor-pointer">✕</button>
      </div>

      <form onsubmit="handleSaveChore(event)" class="space-y-3 text-xs">
        <div>
          <label class="block font-semibold text-slate-700 mb-1">Chore Task Title</label>
          <input id="chore-title" type="text" required placeholder="e.g. Vacuum rugs, Scrub stovetop..." class="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold" />
        </div>

        <div>
          <label class="block font-semibold text-slate-700 mb-1">Category / Subtype</label>
          <select id="chore-cat" required class="w-full px-3 py-2 rounded-xl border border-slate-300">
            ${appState.choreCategories.map((c) => `<option value="${c.id}" ${c.id === appState.selectedChoreCatId ? 'selected' : ''}>${getCategoryBreadcrumbs(appState.choreCategories, c.id).map((b) => b.name).join(' › ')}</option>`).join('')}
          </select>
        </div>

        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="block font-semibold text-slate-700 mb-1">Assigned To</label>
            <select id="chore-assignee" class="w-full px-3 py-2 rounded-xl border border-slate-300">
              ${appState.familyMembers.map((m) => `<option value="${m.id}" ${m.id === appState.activeUserId ? 'selected' : ''}>${m.avatar} ${m.name} (${m.role})</option>`).join('')}
            </select>
          </div>
          <div>
            <label class="block font-semibold text-slate-700 mb-1">Priority</label>
            <select id="chore-priority" class="w-full px-3 py-2 rounded-xl border border-slate-300">
              <option value="low">Low Priority</option>
              <option value="medium" selected>Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
          </div>
        </div>

        <div>
          <label class="block font-semibold text-slate-700 mb-1">Deadline Date</label>
          <input id="chore-deadline" type="date" required value="${preselectedDate || getRelDate(0)}" class="w-full px-3 py-2 rounded-xl border border-slate-300" />
        </div>

        <div>
          <label class="block font-semibold text-slate-700 mb-1">Instructions / Description</label>
          <textarea id="chore-desc" rows="2" placeholder="Optional directions..." class="w-full px-3 py-2 rounded-xl border border-slate-300"></textarea>
        </div>

        <div class="flex justify-end gap-2 pt-2">
          <button type="button" onclick="closeModal()" class="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 cursor-pointer">Cancel</button>
          <button type="submit" class="px-5 py-2 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 cursor-pointer">Create Task</button>
        </div>
      </form>
    </div>
  `);
};

window.handleSaveChore = function (e) {
  e.preventDefault();
  const activeUser = getActiveUser();
  const assigneeId = document.getElementById('chore-assignee').value;
  const assignedTo = appState.familyMembers.find((m) => m.id === assigneeId) || activeUser;
  const deadline = document.getElementById('chore-deadline').value;

  const newChore = {
    id: 'chore-' + Date.now(),
    title: document.getElementById('chore-title').value.trim(),
    description: document.getElementById('chore-desc').value.trim(),
    categoryId: document.getElementById('chore-cat').value,
    deadline,
    originalDeadline: deadline,
    assignedTo,
    createdBy: activeUser,
    status: 'pending',
    priority: document.getElementById('chore-priority').value,
    postponedCount: 0,
    postponedDaysTotal: 0,
  };

  appState.chores.unshift(newChore);
  saveState();
  closeModal();
  renderApp();
};

window.deleteChoreAction = function (choreId) {
  if (confirm('Delete this chore?')) {
    appState.chores = appState.chores.filter((c) => c.id !== choreId);
    saveState();
    renderApp();
  }
};

// Tree collapse / expand handlers
window.toggleGroceryCatExpand = function (id) {
  if (appState.expandedGroceryCats.has(id)) {
    appState.expandedGroceryCats.delete(id);
  } else {
    appState.expandedGroceryCats.add(id);
  }
  saveState();
  renderApp();
};

window.toggleExpandAllGroceryCats = function () {
  if (appState.expandedGroceryCats.size > 0) {
    appState.expandedGroceryCats.clear();
  } else {
    appState.expandedGroceryCats = new Set(appState.groceryCategories.map((c) => c.id));
  }
  saveState();
  renderApp();
};

window.selectGroceryCategory = function (catId) {
  appState.selectedGroceryCatId = catId;
  appState.mobileGroceryCatsOpen = false;
  saveState();
  renderApp();
};

window.toggleMobileGroceryDrawer = function () {
  appState.mobileGroceryCatsOpen = !appState.mobileGroceryCatsOpen;
  renderApp();
};

window.toggleChoreCatExpand = function (id) {
  if (appState.expandedChoreCats.has(id)) {
    appState.expandedChoreCats.delete(id);
  } else {
    appState.expandedChoreCats.add(id);
  }
  saveState();
  renderApp();
};

window.toggleExpandAllChoreCats = function () {
  if (appState.expandedChoreCats.size > 0) {
    appState.expandedChoreCats.clear();
  } else {
    appState.expandedChoreCats = new Set(appState.choreCategories.map((c) => c.id));
  }
  saveState();
  renderApp();
};

window.selectChoreCategory = function (catId) {
  appState.selectedChoreCatId = catId;
  appState.mobileChoreCatsOpen = false;
  saveState();
  renderApp();
};

window.toggleMobileChoreDrawer = function () {
  appState.mobileChoreCatsOpen = !appState.mobileChoreCatsOpen;
  renderApp();
};

window.searchGroceries = function (q) {
  appState.grocerySearch = q;
  renderApp();
};

window.setGroceryFilter = function (f) {
  appState.groceryFilterMode = f;
  renderApp();
};

window.searchChores = function (q) {
  appState.choreSearch = q;
  renderApp();
};

window.setChoreFilter = function (f) {
  appState.choreFilterMode = f;
  renderApp();
};

window.setChoreMemberFilter = function (m) {
  appState.choreMemberFilter = m;
  renderApp();
};

window.changeMonth = function (delta) {
  const d = new Date(appState.calendarMonth);
  d.setMonth(d.getMonth() + delta);
  appState.calendarMonth = d;
  renderApp();
};

window.jumpCalendarToday = function () {
  appState.calendarMonth = new Date();
  appState.calendarDate = new Date().toISOString().split('T')[0];
  renderApp();
};

window.selectCalendarDate = function (dateStr) {
  appState.calendarDate = dateStr;
  renderApp();
};

window.setCalendarFilter = function (f) {
  appState.calendarFilter = f;
  renderApp();
};

window.setCalendarMember = function (m) {
  appState.calendarMember = m;
  renderApp();
};

window.resetToDemoData = function () {
  if (confirm('Reset all groceries, chores, and analytics logs to starter sample data?')) {
    localStorage.removeItem(STORAGE_KEY);
    appState.familyMembers = INITIAL_MEMBERS;
    appState.activeUserId = INITIAL_MEMBERS[0].id;
    appState.groceryCategories = INITIAL_GROCERY_CATS;
    appState.groceryItems = INITIAL_GROCERY_ITEMS;
    appState.choreCategories = INITIAL_CHORE_CATS;
    appState.chores = INITIAL_CHORES;
    appState.selectedGroceryCatId = null;
    appState.selectedChoreCatId = null;
    appState.expandedGroceryCats = new Set(INITIAL_GROCERY_CATS.map((c) => c.id));
    appState.expandedChoreCats = new Set(INITIAL_CHORE_CATS.map((c) => c.id));
    saveState();
    renderApp();
  }
};

// ==========================================
// 10. INITIALIZATION ON DOM READY
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  loadSavedState();
  renderApp();
});
