import { GroceryCategory, GroceryItem, GroceryRollup } from '../types';

/**
 * Recursively retrieves all descendant category IDs for a given category ID
 * enabling infinite nesting rollup calculations.
 */
export function getAllDescendantCategoryIds(
  categories: GroceryCategory[],
  targetCategoryId: string | null
): string[] {
  if (!targetCategoryId) {
    return categories.map((c) => c.id);
  }

  const result: string[] = [targetCategoryId];
  const findChildren = (parentId: string) => {
    const children = categories.filter((c) => c.parentId === parentId);
    for (const child of children) {
      result.push(child.id);
      findChildren(child.id);
    }
  };

  findChildren(targetCategoryId);
  return result;
}

/**
 * Returns breadcrumb path for a category node up to root
 */
export function getCategoryBreadcrumbs(
  categories: GroceryCategory[],
  categoryId: string
): GroceryCategory[] {
  const crumbs: GroceryCategory[] = [];
  let current: GroceryCategory | undefined = categories.find((c) => c.id === categoryId);

  while (current) {
    crumbs.unshift(current);
    if (!current.parentId) break;
    current = categories.find((c) => c.id === current!.parentId);
  }

  return crumbs;
}

/**
 * Calculates consumption rate (daily and weekly) for a grocery item
 */
export function calculateConsumptionRate(item: GroceryItem): {
  dailyRate: number;
  weeklyRate: number;
  formattedRate: string;
  daysUntilStockout: number | null;
} {
  // Check consumption logs
  const consumeLogs = item.logs.filter((l) => l.action === 'consume' || l.deltaQuantity < 0);

  if (consumeLogs.length >= 1) {
    // Calculate total consumed and timespan
    const totalConsumed = consumeLogs.reduce((acc, log) => acc + Math.abs(log.deltaQuantity), 0);
    
    // Sort logs by date
    const dates = consumeLogs.map((l) => new Date(l.date).getTime()).sort();
    const earliestDate = dates[0];
    const latestDate = Math.max(dates[dates.length - 1], Date.now());
    const daysElapsed = Math.max(1, Math.round((latestDate - earliestDate) / (1000 * 60 * 60 * 24)));

    const dailyRate = totalConsumed / daysElapsed;
    const weeklyRate = dailyRate * 7;
    const daysUntilStockout = dailyRate > 0 ? Math.round(item.quantity / dailyRate) : null;

    return {
      dailyRate: Number(dailyRate.toFixed(2)),
      weeklyRate: Number(weeklyRate.toFixed(2)),
      formattedRate: `${weeklyRate.toFixed(2)} ${item.unit}/wk`,
      daysUntilStockout,
    };
  }

  // Fallback: estimate from top-up date
  const topUpTime = new Date(item.topUpDate).getTime();
  const daysSinceTopUp = Math.max(1, Math.round((Date.now() - topUpTime) / (1000 * 60 * 60 * 24)));
  
  // Minimal estimated usage
  const estimatedDaily = item.quantity > 0 ? (item.quantity * 0.05) : 0;
  const estimatedWeekly = estimatedDaily * 7;
  const daysUntilStockout = estimatedDaily > 0 ? Math.round(item.quantity / estimatedDaily) : null;

  return {
    dailyRate: Number(estimatedDaily.toFixed(2)),
    weeklyRate: Number(estimatedWeekly.toFixed(2)),
    formattedRate: `${estimatedWeekly.toFixed(2)} ${item.unit}/wk (est.)`,
    daysUntilStockout,
  };
}

/**
 * Computes roll-up metrics for a specific category or the entire grocery tree
 */
export function calculateGroceryRollup(
  categories: GroceryCategory[],
  items: GroceryItem[],
  categoryId: string | null = null
): GroceryRollup {
  const matchingCategoryIds = getAllDescendantCategoryIds(categories, categoryId);
  const matchedItems = items.filter((item) => matchingCategoryIds.includes(item.categoryId));

  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const fiveDaysFromNow = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000);

  let totalInventoryValue = 0;
  let lowStockCount = 0;
  let expiringSoonCount = 0;
  let expiredCount = 0;
  let totalWeeklyConsumption = 0;

  for (const item of matchedItems) {
    const itemValue = item.quantity * (item.lastPricePerUnit || 0);
    totalInventoryValue += itemValue;

    if (item.quantity <= item.minThreshold) {
      lowStockCount++;
    }

    const expDate = new Date(item.expiryDate);
    expDate.setHours(0, 0, 0, 0);

    if (expDate < now) {
      expiredCount++;
    } else if (expDate <= fiveDaysFromNow) {
      expiringSoonCount++;
    }

    const rate = calculateConsumptionRate(item);
    totalWeeklyConsumption += rate.weeklyRate;
  }

  return {
    totalItemCount: matchedItems.length,
    totalInventoryValue: Number(totalInventoryValue.toFixed(2)),
    lowStockItemsCount: lowStockCount,
    expiringSoonCount,
    expiredCount,
    avgWeeklyConsumption: Number(totalWeeklyConsumption.toFixed(2)),
    items: matchedItems,
  };
}

/**
 * Gets expiry status badge config
 */
export function getExpiryStatus(expiryDateStr: string): {
  label: string;
  colorClass: string;
  daysRemaining: number;
  isUrgent: boolean;
} {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(expiryDateStr);
  target.setHours(0, 0, 0, 0);

  const diffTime = target.getTime() - today.getTime();
  const days = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (days < 0) {
    return {
      label: `Expired ${Math.abs(days)}d ago`,
      colorClass: 'bg-rose-100 text-rose-700 border-rose-300 dark:bg-rose-950/60 dark:text-rose-400 dark:border-rose-800',
      daysRemaining: days,
      isUrgent: true,
    };
  }
  if (days === 0) {
    return {
      label: 'Expires today!',
      colorClass: 'bg-rose-100 text-rose-700 border-rose-300 font-semibold animate-pulse dark:bg-rose-950/60 dark:text-rose-400 dark:border-rose-800',
      daysRemaining: 0,
      isUrgent: true,
    };
  }
  if (days <= 3) {
    return {
      label: `Expires in ${days}d`,
      colorClass: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-400 dark:border-amber-800',
      daysRemaining: days,
      isUrgent: true,
    };
  }
  if (days <= 7) {
    return {
      label: `Expires in ${days}d`,
      colorClass: 'bg-yellow-50 text-yellow-800 border-yellow-200 dark:bg-yellow-950/40 dark:text-yellow-400 dark:border-yellow-800',
      daysRemaining: days,
      isUrgent: false,
    };
  }
  return {
    label: `${days}d left`,
    colorClass: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800',
    daysRemaining: days,
    isUrgent: false,
  };
}
