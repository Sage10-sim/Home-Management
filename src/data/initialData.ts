import { FamilyMember, GroceryCategory, GroceryItem, ChoreCategory, Chore } from '../types';

export const INITIAL_FAMILY_MEMBERS: FamilyMember[] = [
  { id: 'user-1', name: 'Sarah', role: 'Mom', avatar: '👩', color: '#ec4899' },
  { id: 'user-2', name: 'David', role: 'Dad', avatar: '👨', color: '#3b82f6' },
  { id: 'user-3', name: 'Alex', role: 'Teen', avatar: '🧑', color: '#10b981' },
  { id: 'user-4', name: 'Maya', role: 'Kid', avatar: '👧', color: '#f59e0b' },
  { id: 'user-5', name: 'Joe', role: 'Grandpa', avatar: '👴', color: '#8b5cf6' },
];

export const INITIAL_GROCERY_CATEGORIES: GroceryCategory[] = [
  // Level 1
  { id: 'cat-food', name: 'Food & Groceries', parentId: null, icon: 'Utensils', color: '#f97316' },
  { id: 'cat-household', name: 'Household & Supplies', parentId: null, icon: 'Home', color: '#06b6d4' },

  // Level 2 under Food
  { id: 'cat-pantry', name: 'Pantry Staples', parentId: 'cat-food', icon: 'Package', color: '#eab308' },
  { id: 'cat-dairy', name: 'Dairy & Chilled', parentId: 'cat-food', icon: 'Milk', color: '#3b82f6' },
  { id: 'cat-produce', name: 'Fresh Produce', parentId: 'cat-food', icon: 'Apple', color: '#22c55e' },

  // Level 3 under Pantry
  { id: 'cat-grains', name: 'Grains & Pasta', parentId: 'cat-pantry', icon: 'Wheat', color: '#d97706' },
  { id: 'cat-oils', name: 'Oils & Condiments', parentId: 'cat-pantry', icon: 'Droplets', color: '#ca8a04' },

  // Level 3 under Dairy
  { id: 'cat-milk', name: 'Milk & Alternatives', parentId: 'cat-dairy', icon: 'Coffee', color: '#60a5fa' },
  { id: 'cat-cheese', name: 'Cheese & Spreads', parentId: 'cat-dairy', icon: 'Layers', color: '#fbbf24' },

  // Level 3 under Produce
  { id: 'cat-fruits', name: 'Fruits', parentId: 'cat-produce', icon: 'Citrus', color: '#f87171' },
  { id: 'cat-veg', name: 'Vegetables & Greens', parentId: 'cat-produce', icon: 'Salad', color: '#4ade80' },

  // Level 2 under Household
  { id: 'cat-cleaning', name: 'Cleaning Essentials', parentId: 'cat-household', icon: 'Sparkles', color: '#0ea5e9' },
  { id: 'cat-paper', name: 'Paper & Hygiene', parentId: 'cat-household', icon: 'Scroll', color: '#a855f7' },
];

// Helper to format ISO date relative to current time
const getRelDate = (dayOffset: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + dayOffset);
  return d.toISOString().split('T')[0];
};

export const INITIAL_GROCERY_ITEMS: GroceryItem[] = [
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
    updatedBy: INITIAL_FAMILY_MEMBERS[0],
    updatedAt: new Date(Date.now() - 14 * 86400000).toISOString(),
    notes: 'Preferred brand is Royal Himalayan',
    logs: [
      { id: 'log-1-1', date: getRelDate(-35), deltaQuantity: 10, action: 'topup', pricePerUnit: 3.2, userId: 'user-1', userName: 'Sarah' },
      { id: 'log-1-2', date: getRelDate(-25), deltaQuantity: -2.5, action: 'consume', userId: 'user-2', userName: 'David' },
      { id: 'log-1-3', date: getRelDate(-14), deltaQuantity: 5, action: 'topup', pricePerUnit: 3.4, userId: 'user-1', userName: 'Sarah' },
      { id: 'log-1-4', date: getRelDate(-5), deltaQuantity: -3.0, action: 'consume', userId: 'user-3', userName: 'Alex' },
    ],
  },
  {
    id: 'item-2',
    name: 'Organic Penne Rigate',
    categoryId: 'cat-grains',
    quantity: 1.2,
    unit: 'kg',
    minThreshold: 1.5, // Low stock warning!
    lastPricePerUnit: 2.8,
    topUpDate: getRelDate(-20),
    expiryDate: getRelDate(240),
    updatedBy: INITIAL_FAMILY_MEMBERS[1],
    updatedAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    logs: [
      { id: 'log-2-1', date: getRelDate(-40), deltaQuantity: 4, action: 'topup', pricePerUnit: 2.7, userId: 'user-2', userName: 'David' },
      { id: 'log-2-2', date: getRelDate(-18), deltaQuantity: -1.8, action: 'consume', userId: 'user-1', userName: 'Sarah' },
      { id: 'log-2-3', date: getRelDate(-4), deltaQuantity: -1.0, action: 'consume', userId: 'user-4', userName: 'Maya' },
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
    updatedBy: INITIAL_FAMILY_MEMBERS[0],
    updatedAt: new Date(Date.now() - 12 * 86400000).toISOString(),
    logs: [
      { id: 'log-3-1', date: getRelDate(-12), deltaQuantity: 2.5, action: 'topup', pricePerUnit: 14.5, userId: 'user-1', userName: 'Sarah' },
      { id: 'log-3-2', date: getRelDate(-3), deltaQuantity: -0.7, action: 'consume', userId: 'user-2', userName: 'David' },
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
    expiryDate: getRelDate(2), // Expiring in 2 days!
    updatedBy: INITIAL_FAMILY_MEMBERS[1],
    updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    notes: 'Check bottle seal',
    logs: [
      { id: 'log-4-1', date: getRelDate(-11), deltaQuantity: 4, action: 'topup', pricePerUnit: 2.1, userId: 'user-2', userName: 'David' },
      { id: 'log-4-2', date: getRelDate(-7), deltaQuantity: -2.5, action: 'consume', userId: 'user-3', userName: 'Alex' },
      { id: 'log-4-3', date: getRelDate(-4), deltaQuantity: 3, action: 'topup', pricePerUnit: 2.1, userId: 'user-1', userName: 'Sarah' },
      { id: 'log-4-4', date: getRelDate(-1), deltaQuantity: -1.5, action: 'consume', userId: 'user-4', userName: 'Maya' },
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
    updatedBy: INITIAL_FAMILY_MEMBERS[2],
    updatedAt: new Date(Date.now() - 6 * 86400000).toISOString(),
    logs: [
      { id: 'log-5-1', date: getRelDate(-20), deltaQuantity: 6, action: 'topup', pricePerUnit: 3.7, userId: 'user-2', userName: 'David' },
      { id: 'log-5-2', date: getRelDate(-12), deltaQuantity: -3, action: 'consume', userId: 'user-2', userName: 'David' },
      { id: 'log-5-3', date: getRelDate(-6), deltaQuantity: 4, action: 'topup', pricePerUnit: 3.75, userId: 'user-3', userName: 'Alex' },
      { id: 'log-5-4', date: getRelDate(-2), deltaQuantity: -1, action: 'consume', userId: 'user-1', userName: 'Sarah' },
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
    updatedBy: INITIAL_FAMILY_MEMBERS[0],
    updatedAt: new Date(Date.now() - 9 * 86400000).toISOString(),
    logs: [
      { id: 'log-6-1', date: getRelDate(-9), deltaQuantity: 1.2, action: 'topup', pricePerUnit: 12.0, userId: 'user-1', userName: 'Sarah' },
      { id: 'log-6-2', date: getRelDate(-3), deltaQuantity: -0.4, action: 'consume', userId: 'user-4', userName: 'Maya' },
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
    expiryDate: getRelDate(3), // Expiring in 3 days!
    updatedBy: INITIAL_FAMILY_MEMBERS[1],
    updatedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    logs: [
      { id: 'log-7-1', date: getRelDate(-8), deltaQuantity: 3.0, action: 'topup', pricePerUnit: 1.85, userId: 'user-1', userName: 'Sarah' },
      { id: 'log-7-2', date: getRelDate(-4), deltaQuantity: -2.2, action: 'consume', userId: 'user-3', userName: 'Alex' },
      { id: 'log-7-3', date: getRelDate(-3), deltaQuantity: 2.0, action: 'topup', pricePerUnit: 1.95, userId: 'user-2', userName: 'David' },
      { id: 'log-7-4', date: getRelDate(-1), deltaQuantity: -0.8, action: 'consume', userId: 'user-4', userName: 'Maya' },
    ],
  },
  {
    id: 'item-8',
    name: 'Fresh Baby Spinach',
    categoryId: 'cat-veg',
    quantity: 0.3,
    unit: 'kg',
    minThreshold: 0.6, // Low stock & expiring soon!
    lastPricePerUnit: 9.5,
    topUpDate: getRelDate(-4),
    expiryDate: getRelDate(1),
    updatedBy: INITIAL_FAMILY_MEMBERS[0],
    updatedAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    logs: [
      { id: 'log-8-1', date: getRelDate(-10), deltaQuantity: 1.0, action: 'topup', pricePerUnit: 9.5, userId: 'user-1', userName: 'Sarah' },
      { id: 'log-8-2', date: getRelDate(-4), deltaQuantity: -0.7, action: 'consume', userId: 'user-1', userName: 'Sarah' },
    ],
  },
  {
    id: 'item-9',
    name: 'Eco Dishwasher Pods (60pk)',
    categoryId: 'cat-cleaning',
    quantity: 38,
    unit: 'pcs',
    minThreshold: 20,
    lastPricePerUnit: 0.32,
    topUpDate: getRelDate(-18),
    expiryDate: getRelDate(360),
    updatedBy: INITIAL_FAMILY_MEMBERS[1],
    updatedAt: new Date(Date.now() - 18 * 86400000).toISOString(),
    logs: [
      { id: 'log-9-1', date: getRelDate(-35), deltaQuantity: 60, action: 'topup', pricePerUnit: 0.32, userId: 'user-2', userName: 'David' },
      { id: 'log-9-2', date: getRelDate(-18), deltaQuantity: -22, action: 'consume', userId: 'user-3', userName: 'Alex' },
    ],
  },
  {
    id: 'item-10',
    name: 'Bamboo Paper Towels (8pk)',
    categoryId: 'cat-paper',
    quantity: 3,
    unit: 'packs',
    minThreshold: 2,
    lastPricePerUnit: 2.1,
    topUpDate: getRelDate(-15),
    expiryDate: getRelDate(500),
    updatedBy: INITIAL_FAMILY_MEMBERS[2],
    updatedAt: new Date(Date.now() - 15 * 86400000).toISOString(),
    logs: [
      { id: 'log-10-1', date: getRelDate(-30), deltaQuantity: 8, action: 'topup', pricePerUnit: 2.1, userId: 'user-1', userName: 'Sarah' },
      { id: 'log-10-2', date: getRelDate(-15), deltaQuantity: -5, action: 'consume', userId: 'user-2', userName: 'David' },
    ],
  },
];

export const INITIAL_CHORE_CATEGORIES: ChoreCategory[] = [
  // Level 1
  { id: 'chore-indoor', name: 'Indoor Chores', parentId: null, icon: 'Home', color: '#6366f1' },
  { id: 'chore-outdoor', name: 'Outdoor & Yard', parentId: null, icon: 'Trees', color: '#10b981' },
  { id: 'chore-pets', name: 'Pet Care', parentId: null, icon: 'HeartHandshake', color: '#ec4899' },

  // Level 2 under Indoor
  { id: 'chore-kitchen', name: 'Kitchen & Dining', parentId: 'chore-indoor', icon: 'Utensils', color: '#f59e0b' },
  { id: 'chore-living', name: 'Living & Bedrooms', parentId: 'chore-indoor', icon: 'Sofa', color: '#8b5cf6' },
  { id: 'chore-bath', name: 'Bathrooms', parentId: 'chore-indoor', icon: 'Bath', color: '#06b6d4' },

  // Level 3 under Kitchen
  { id: 'chore-kitchen-daily', name: 'Daily Cleanup', parentId: 'chore-kitchen', icon: 'Sparkles', color: '#eab308' },
  { id: 'chore-kitchen-deep', name: 'Deep Appliance Clean', parentId: 'chore-kitchen', icon: 'Flame', color: '#ef4444' },

  // Level 2 under Outdoor
  { id: 'chore-lawn', name: 'Lawn & Garden', parentId: 'chore-outdoor', icon: 'Scissors', color: '#16a34a' },
  { id: 'chore-waste', name: 'Trash & Recycling', parentId: 'chore-outdoor', icon: 'Trash2', color: '#64748b' },

  // Level 2 under Pets
  { id: 'chore-dog', name: 'Cooper (Golden Retriever)', parentId: 'chore-pets', icon: 'Smile', color: '#d946ef' },
];

export const INITIAL_CHORES: Chore[] = [
  // --- OVERDUE CHORES ---
  {
    id: 'chore-act-1',
    title: 'Clean Oven and Stovetop Grates',
    description: 'Use degreaser and scrub baking racks in warm soapy water',
    categoryId: 'chore-kitchen-deep',
    deadline: getRelDate(-2), // 2 days overdue!
    originalDeadline: getRelDate(-2),
    assignedTo: INITIAL_FAMILY_MEMBERS[1], // David
    createdBy: INITIAL_FAMILY_MEMBERS[0], // Sarah
    status: 'pending',
    priority: 'high',
    postponedCount: 1,
    postponedDaysTotal: 3,
    rescheduleHistory: [
      {
        date: getRelDate(-5),
        action: 'created',
        userId: 'user-1',
        userName: 'Sarah',
        newDeadline: getRelDate(-5),
      },
      {
        date: getRelDate(-5),
        action: 'postponed',
        userId: 'user-2',
        userName: 'David',
        previousDeadline: getRelDate(-5),
        newDeadline: getRelDate(-2),
        note: 'Delayed due to late office meeting',
      },
    ],
  },
  {
    id: 'chore-act-2',
    title: 'Deep Scrub Shower Tile & Grout',
    description: 'Spray anti-mildew solution, let sit for 15 mins then brush',
    categoryId: 'chore-bath',
    deadline: getRelDate(-1), // 1 day overdue!
    originalDeadline: getRelDate(-1),
    assignedTo: INITIAL_FAMILY_MEMBERS[2], // Alex
    createdBy: INITIAL_FAMILY_MEMBERS[0], // Sarah
    status: 'pending',
    priority: 'medium',
    postponedCount: 0,
    postponedDaysTotal: 0,
  },

  // --- UPCOMING TODAY & NEXT DAYS ---
  {
    id: 'chore-act-3',
    title: 'Unload & Sanitize Dishwasher',
    description: 'Empty clean plates and restock morning mugs',
    categoryId: 'chore-kitchen-daily',
    deadline: getRelDate(0), // Today!
    originalDeadline: getRelDate(0),
    assignedTo: INITIAL_FAMILY_MEMBERS[3], // Maya
    createdBy: INITIAL_FAMILY_MEMBERS[1], // David
    status: 'pending',
    priority: 'high',
    postponedCount: 0,
    postponedDaysTotal: 0,
  },
  {
    id: 'chore-act-4',
    title: 'Take Wheelie Bins to Curb (Trash & Recycling)',
    description: 'Wednesday morning collection, curbside before 7 AM',
    categoryId: 'chore-waste',
    deadline: getRelDate(1), // Tomorrow
    originalDeadline: getRelDate(1),
    assignedTo: INITIAL_FAMILY_MEMBERS[2], // Alex
    createdBy: INITIAL_FAMILY_MEMBERS[0], // Sarah
    status: 'pending',
    priority: 'high',
    postponedCount: 0,
    postponedDaysTotal: 0,
  },
  {
    id: 'chore-act-5',
    title: 'Mow Front & Back Lawn',
    description: 'Set mower blade to 2.5 inches and sweep clippings off driveway',
    categoryId: 'chore-lawn',
    deadline: getRelDate(3),
    originalDeadline: getRelDate(3),
    assignedTo: INITIAL_FAMILY_MEMBERS[1], // David
    createdBy: INITIAL_FAMILY_MEMBERS[0], // Sarah
    status: 'pending',
    priority: 'medium',
    postponedCount: 0,
    postponedDaysTotal: 0,
  },
  {
    id: 'chore-act-6',
    title: 'Brush Cooper & Check Paws',
    description: 'Golden retriever undercoat deshedding session (20 mins)',
    categoryId: 'chore-dog',
    deadline: getRelDate(2),
    originalDeadline: getRelDate(2),
    assignedTo: INITIAL_FAMILY_MEMBERS[4], // Joe
    createdBy: INITIAL_FAMILY_MEMBERS[0], // Sarah
    status: 'pending',
    priority: 'low',
    postponedCount: 0,
    postponedDaysTotal: 0,
  },
  {
    id: 'chore-act-7',
    title: 'Vacuum Living Room Rug & Hallway',
    description: 'Move coffee table and get underneath cushions',
    categoryId: 'chore-living',
    deadline: getRelDate(4),
    originalDeadline: getRelDate(4),
    assignedTo: INITIAL_FAMILY_MEMBERS[3], // Maya
    createdBy: INITIAL_FAMILY_MEMBERS[1], // David
    status: 'pending',
    priority: 'medium',
    postponedCount: 0,
    postponedDaysTotal: 0,
  },

  // --- PAST 30 DAYS COMPLETED CHORES (Rich history for Proactive vs Postpone Metrics) ---
  // PROACTIVE: Completed on or before original deadline
  // POSTPONED: Completed after original deadline or postponed
  {
    id: 'chore-hist-1',
    title: 'Disinfect Kitchen Countertops',
    categoryId: 'chore-kitchen-daily',
    deadline: getRelDate(-1),
    originalDeadline: getRelDate(-1),
    assignedTo: INITIAL_FAMILY_MEMBERS[0], // Sarah
    createdBy: INITIAL_FAMILY_MEMBERS[0],
    doneBy: INITIAL_FAMILY_MEMBERS[0],
    completedAt: getRelDate(-1), // Completed ON TIME -> Proactive
    status: 'completed',
    priority: 'medium',
    postponedCount: 0,
    postponedDaysTotal: 0,
  },
  {
    id: 'chore-hist-2',
    title: 'Walk Cooper in Sunset Park',
    categoryId: 'chore-dog',
    deadline: getRelDate(-2),
    originalDeadline: getRelDate(-2),
    assignedTo: INITIAL_FAMILY_MEMBERS[2], // Alex
    createdBy: INITIAL_FAMILY_MEMBERS[0],
    doneBy: INITIAL_FAMILY_MEMBERS[2],
    completedAt: getRelDate(-3), // Completed 1 DAY EARLY -> Proactive!
    status: 'completed',
    priority: 'medium',
    postponedCount: 0,
    postponedDaysTotal: 0,
  },
  {
    id: 'chore-hist-3',
    title: 'Clean Refrigerator Vegetable Crisper',
    categoryId: 'chore-kitchen-deep',
    deadline: getRelDate(-4),
    originalDeadline: getRelDate(-7), // Original was -7, completed at -4 -> DELAYED 3 days
    assignedTo: INITIAL_FAMILY_MEMBERS[1], // David
    createdBy: INITIAL_FAMILY_MEMBERS[0],
    doneBy: INITIAL_FAMILY_MEMBERS[1],
    completedAt: getRelDate(-4),
    status: 'completed',
    priority: 'medium',
    postponedCount: 1,
    postponedDaysTotal: 3,
  },
  {
    id: 'chore-hist-4',
    title: 'Sort and Take Out Cardboard Recycling',
    categoryId: 'chore-waste',
    deadline: getRelDate(-5),
    originalDeadline: getRelDate(-5),
    assignedTo: INITIAL_FAMILY_MEMBERS[2], // Alex
    createdBy: INITIAL_FAMILY_MEMBERS[1],
    doneBy: INITIAL_FAMILY_MEMBERS[2],
    completedAt: getRelDate(-5), // On time -> Proactive
    status: 'completed',
    priority: 'high',
    postponedCount: 0,
    postponedDaysTotal: 0,
  },
  {
    id: 'chore-hist-5',
    title: 'Wash Dog Bedding & Towels',
    categoryId: 'chore-dog',
    deadline: getRelDate(-6),
    originalDeadline: getRelDate(-8), // Delayed by 2 days -> Postponed
    assignedTo: INITIAL_FAMILY_MEMBERS[4], // Joe
    createdBy: INITIAL_FAMILY_MEMBERS[0],
    doneBy: INITIAL_FAMILY_MEMBERS[4],
    completedAt: getRelDate(-6),
    status: 'completed',
    priority: 'low',
    postponedCount: 1,
    postponedDaysTotal: 2,
  },
  {
    id: 'chore-hist-6',
    title: 'Dust Living Room Ceiling Fan',
    categoryId: 'chore-living',
    deadline: getRelDate(-9),
    originalDeadline: getRelDate(-9),
    assignedTo: INITIAL_FAMILY_MEMBERS[1], // David
    createdBy: INITIAL_FAMILY_MEMBERS[0],
    doneBy: INITIAL_FAMILY_MEMBERS[1],
    completedAt: getRelDate(-9), // On time -> Proactive
    status: 'completed',
    priority: 'low',
    postponedCount: 0,
    postponedDaysTotal: 0,
  },
  {
    id: 'chore-hist-7',
    title: 'Fold Family Laundry & Organize Hampers',
    categoryId: 'chore-living',
    deadline: getRelDate(-11),
    originalDeadline: getRelDate(-11),
    assignedTo: INITIAL_FAMILY_MEMBERS[0], // Sarah
    createdBy: INITIAL_FAMILY_MEMBERS[0],
    doneBy: INITIAL_FAMILY_MEMBERS[0],
    completedAt: getRelDate(-11), // On time -> Proactive
    status: 'completed',
    priority: 'high',
    postponedCount: 0,
    postponedDaysTotal: 0,
  },
  {
    id: 'chore-hist-8',
    title: 'Edge Lawn Borders & Sweep Patio',
    categoryId: 'chore-lawn',
    deadline: getRelDate(-13),
    originalDeadline: getRelDate(-16), // Delayed 3 days -> Postponed
    assignedTo: INITIAL_FAMILY_MEMBERS[1], // David
    createdBy: INITIAL_FAMILY_MEMBERS[0],
    doneBy: INITIAL_FAMILY_MEMBERS[1],
    completedAt: getRelDate(-13),
    status: 'completed',
    priority: 'medium',
    postponedCount: 1,
    postponedDaysTotal: 3,
  },
  {
    id: 'chore-hist-9',
    title: 'Wash Bathroom Mirrors & Restock Soap',
    categoryId: 'chore-bath',
    deadline: getRelDate(-14),
    originalDeadline: getRelDate(-14),
    assignedTo: INITIAL_FAMILY_MEMBERS[3], // Maya
    createdBy: INITIAL_FAMILY_MEMBERS[0],
    doneBy: INITIAL_FAMILY_MEMBERS[3],
    completedAt: getRelDate(-15), // Early! -> Proactive
    status: 'completed',
    priority: 'medium',
    postponedCount: 0,
    postponedDaysTotal: 0,
  },
  {
    id: 'chore-hist-10',
    title: 'Run Dishwasher Vinegar Self-Clean Cycle',
    categoryId: 'chore-kitchen-deep',
    deadline: getRelDate(-18),
    originalDeadline: getRelDate(-18),
    assignedTo: INITIAL_FAMILY_MEMBERS[0], // Sarah
    createdBy: INITIAL_FAMILY_MEMBERS[1],
    doneBy: INITIAL_FAMILY_MEMBERS[0],
    completedAt: getRelDate(-18), // On time -> Proactive
    status: 'completed',
    priority: 'medium',
    postponedCount: 0,
    postponedDaysTotal: 0,
  },
  {
    id: 'chore-hist-11',
    title: 'Mow Back Garden & Compost Clippings',
    categoryId: 'chore-lawn',
    deadline: getRelDate(-20),
    originalDeadline: getRelDate(-22), // Delayed 2 days -> Postponed
    assignedTo: INITIAL_FAMILY_MEMBERS[2], // Alex
    createdBy: INITIAL_FAMILY_MEMBERS[1],
    doneBy: INITIAL_FAMILY_MEMBERS[2],
    completedAt: getRelDate(-20),
    status: 'completed',
    priority: 'medium',
    postponedCount: 1,
    postponedDaysTotal: 2,
  },
  {
    id: 'chore-hist-12',
    title: 'Scrub Entryway Doormat & Sweep Porch',
    categoryId: 'chore-outdoor',
    deadline: getRelDate(-23),
    originalDeadline: getRelDate(-23),
    assignedTo: INITIAL_FAMILY_MEMBERS[4], // Joe
    createdBy: INITIAL_FAMILY_MEMBERS[0],
    doneBy: INITIAL_FAMILY_MEMBERS[4],
    completedAt: getRelDate(-23), // On time -> Proactive
    status: 'completed',
    priority: 'low',
    postponedCount: 0,
    postponedDaysTotal: 0,
  },
  {
    id: 'chore-hist-13',
    title: 'Empty & Sanitize Trash Cans',
    categoryId: 'chore-waste',
    deadline: getRelDate(-25),
    originalDeadline: getRelDate(-25),
    assignedTo: INITIAL_FAMILY_MEMBERS[2], // Alex
    createdBy: INITIAL_FAMILY_MEMBERS[0],
    doneBy: INITIAL_FAMILY_MEMBERS[2],
    completedAt: getRelDate(-25), // On time -> Proactive
    status: 'completed',
    priority: 'medium',
    postponedCount: 0,
    postponedDaysTotal: 0,
  },
  {
    id: 'chore-hist-14',
    title: 'Descale Espresso Machine & Clean Steam Wand',
    categoryId: 'chore-kitchen-deep',
    deadline: getRelDate(-27),
    originalDeadline: getRelDate(-29), // Delayed 2 days -> Postponed
    assignedTo: INITIAL_FAMILY_MEMBERS[1], // David
    createdBy: INITIAL_FAMILY_MEMBERS[0],
    doneBy: INITIAL_FAMILY_MEMBERS[1],
    completedAt: getRelDate(-27),
    status: 'completed',
    priority: 'medium',
    postponedCount: 1,
    postponedDaysTotal: 2,
  },
  {
    id: 'chore-hist-15',
    title: 'Wash Cooper with Oatmeal Shampoo',
    categoryId: 'chore-dog',
    deadline: getRelDate(-28),
    originalDeadline: getRelDate(-28),
    assignedTo: INITIAL_FAMILY_MEMBERS[0], // Sarah
    createdBy: INITIAL_FAMILY_MEMBERS[0],
    doneBy: INITIAL_FAMILY_MEMBERS[0],
    completedAt: getRelDate(-28), // On time -> Proactive
    status: 'completed',
    priority: 'high',
    postponedCount: 0,
    postponedDaysTotal: 0,
  },
];
