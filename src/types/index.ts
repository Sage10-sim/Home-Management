export interface FamilyMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  color: string;
}

export interface ConsumptionLog {
  id: string;
  date: string; // ISO date string
  deltaQuantity: number; // positive for top-up, negative for consumption
  action: 'topup' | 'consume' | 'adjust';
  pricePerUnit?: number;
  userId: string;
  userName: string;
  notes?: string;
}

export interface GroceryItem {
  id: string;
  name: string;
  categoryId: string; // references GroceryCategory id
  quantity: number;
  unit: string; // 'kg', 'g', 'L', 'ml', 'pcs', 'packs', 'cans', 'boxes', 'bottles'
  minThreshold: number;
  lastPricePerUnit: number;
  topUpDate: string; // ISO date string
  expiryDate: string; // ISO date string
  updatedBy: FamilyMember;
  updatedAt: string; // ISO date string
  notes?: string;
  logs: ConsumptionLog[];
}

export interface GroceryCategory {
  id: string;
  name: string;
  parentId: string | null; // null for top-level, infinite nesting
  icon?: string;
  color?: string;
}

export interface ChoreCategory {
  id: string;
  name: string;
  parentId: string | null; // null for top-level, infinite nesting
  icon?: string;
  color?: string;
}

export type ChoreStatus = 'pending' | 'completed' | 'postponed';
export type ChorePriority = 'low' | 'medium' | 'high';

export interface Chore {
  id: string;
  title: string;
  description?: string;
  categoryId: string;
  deadline: string; // ISO date string (YYYY-MM-DD)
  originalDeadline: string; // ISO date string (used for calculating delay/postpone rate)
  assignedTo: FamilyMember;
  createdBy: FamilyMember;
  doneBy?: FamilyMember | null;
  completedAt?: string | null; // ISO date string
  status: ChoreStatus;
  priority: ChorePriority;
  postponedCount: number;
  postponedDaysTotal: number;
  rescheduleHistory?: {
    date: string;
    action: 'created' | 'postponed' | 'completed' | 'reopened';
    userId: string;
    userName: string;
    previousDeadline?: string;
    newDeadline?: string;
    note?: string;
  }[];
}

export interface ChoreMetrics {
  totalLoggedLast30Days: number;
  completedCount: number;
  proactiveCount: number;
  postponedOrDelayedCount: number;
  proactiveRate: number; // percentage 0-100
  postponeRate: number; // percentage 0-100
  avgDelayDays: number;
  pendingCount: number;
  overdueCount: number;
  dailyTrend: {
    date: string;
    label: string;
    proactive: number;
    postponed: number;
    totalCompleted: number;
    cumulativeProactiveRate: number;
    cumulativePostponeRate: number;
  }[];
  memberBreakdown: {
    name: string;
    avatar: string;
    color: string;
    proactive: number;
    delayed: number;
    total: number;
    proactiveRate: number;
  }[];
}

export interface GroceryRollup {
  totalItemCount: number;
  totalInventoryValue: number;
  lowStockItemsCount: number;
  expiringSoonCount: number; // within 5 days
  expiredCount: number;
  avgWeeklyConsumption: number;
  items: GroceryItem[];
}
