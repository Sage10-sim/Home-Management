import { Chore, ChoreCategory, ChoreMetrics, FamilyMember } from '../types';

/**
 * Recursively retrieves all descendant category IDs for chores
 */
export function getAllDescendantChoreCategoryIds(
  categories: ChoreCategory[],
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

export function getChoreCategoryBreadcrumbs(
  categories: ChoreCategory[],
  categoryId: string
): ChoreCategory[] {
  const crumbs: ChoreCategory[] = [];
  let current: ChoreCategory | undefined = categories.find((c) => c.id === categoryId);

  while (current) {
    crumbs.unshift(current);
    if (!current.parentId) break;
    current = categories.find((c) => c.id === current!.parentId);
  }

  return crumbs;
}

/**
 * Calculate Proactive Rate and Postpone Rate metrics for the past 30 days
 */
export function calculateChoreMetrics(
  chores: Chore[],
  familyMembers: FamilyMember[]
): ChoreMetrics {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(today.getDate() - 30);

  // Filter chores active or completed in the last 30 days
  const past30DaysChores = chores.filter((c) => {
    const origDate = new Date(c.originalDeadline);
    origDate.setHours(0, 0, 0, 0);
    const deadlineDate = new Date(c.deadline);
    deadlineDate.setHours(0, 0, 0, 0);

    const compDate = c.completedAt ? new Date(c.completedAt) : null;
    if (compDate) compDate.setHours(0, 0, 0, 0);

    // If completed in last 30 days OR scheduled in last 30 days
    const isCompletedInRange = compDate && compDate >= thirtyDaysAgo && compDate <= today;
    const isDeadlineInRange = origDate >= thirtyDaysAgo && origDate <= today;

    return isCompletedInRange || isDeadlineInRange;
  });

  let completedCount = 0;
  let proactiveCount = 0;
  let postponedOrDelayedCount = 0;
  let pendingCount = 0;
  let overdueCount = 0;
  let totalDelayDays = 0;

  // Track member stats
  const memberStatsMap: Record<string, { proactive: number; delayed: number; total: number }> = {};
  for (const m of familyMembers) {
    memberStatsMap[m.id] = { proactive: 0, delayed: 0, total: 0 };
  }

  // Pre-seed daily series for the 30 days
  const dailySeriesMap: Record<string, { date: string; label: string; proactive: number; postponed: number; totalCompleted: number }> = {};
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    dailySeriesMap[dateStr] = {
      date: dateStr,
      label,
      proactive: 0,
      postponed: 0,
      totalCompleted: 0,
    };
  }

  for (const chore of past30DaysChores) {
    const assignedMemberId = chore.assignedTo.id;
    if (!memberStatsMap[assignedMemberId]) {
      memberStatsMap[assignedMemberId] = { proactive: 0, delayed: 0, total: 0 };
    }

    if (chore.status === 'completed' && chore.completedAt) {
      completedCount++;
      const compDate = new Date(chore.completedAt);
      compDate.setHours(0, 0, 0, 0);
      const compDateStr = compDate.toISOString().split('T')[0];

      const origDeadline = new Date(chore.originalDeadline);
      origDeadline.setHours(0, 0, 0, 0);

      // Check if proactive or postponed
      const isProactive = compDate <= origDeadline && (chore.postponedCount || 0) === 0;

      if (isProactive) {
        proactiveCount++;
        memberStatsMap[assignedMemberId].proactive++;
        memberStatsMap[assignedMemberId].total++;
        if (dailySeriesMap[compDateStr]) {
          dailySeriesMap[compDateStr].proactive++;
          dailySeriesMap[compDateStr].totalCompleted++;
        }
      } else {
        postponedOrDelayedCount++;
        memberStatsMap[assignedMemberId].delayed++;
        memberStatsMap[assignedMemberId].total++;

        // Calculate delay in days
        const delay = Math.max(1, Math.round((compDate.getTime() - origDeadline.getTime()) / (1000 * 60 * 60 * 24)));
        totalDelayDays += delay;

        if (dailySeriesMap[compDateStr]) {
          dailySeriesMap[compDateStr].postponed++;
          dailySeriesMap[compDateStr].totalCompleted++;
        }
      }
    } else if (chore.status === 'pending') {
      pendingCount++;
      const deadlineDate = new Date(chore.deadline);
      deadlineDate.setHours(0, 0, 0, 0);

      if (deadlineDate < today) {
        overdueCount++;
        // Overdue tasks in past 30 days count towards postpone/delay metric
        postponedOrDelayedCount++;
        memberStatsMap[assignedMemberId].delayed++;
        memberStatsMap[assignedMemberId].total++;

        const delay = Math.round((today.getTime() - deadlineDate.getTime()) / (1000 * 60 * 60 * 24));
        totalDelayDays += delay;
      }
    }
  }

  const totalLoggedLast30Days = Math.max(1, proactiveCount + postponedOrDelayedCount);
  const proactiveRate = Number(((proactiveCount / totalLoggedLast30Days) * 100).toFixed(1));
  const postponeRate = Number(((postponedOrDelayedCount / totalLoggedLast30Days) * 100).toFixed(1));
  const avgDelayDays = postponedOrDelayedCount > 0 ? Number((totalDelayDays / postponedOrDelayedCount).toFixed(1)) : 0;

  // Build daily trend with cumulative / rolling rates
  let runningProactive = 0;
  let runningPostponed = 0;
  const dailyTrend = Object.values(dailySeriesMap).map((entry) => {
    runningProactive += entry.proactive;
    runningPostponed += entry.postponed;
    const runningTotal = runningProactive + runningPostponed;
    const cumulativeProactiveRate = runningTotal > 0 ? Number(((runningProactive / runningTotal) * 100).toFixed(1)) : 100;
    const cumulativePostponeRate = runningTotal > 0 ? Number(((runningPostponed / runningTotal) * 100).toFixed(1)) : 0;

    return {
      ...entry,
      cumulativeProactiveRate,
      cumulativePostponeRate,
    };
  });

  // Build member breakdown
  const memberBreakdown = familyMembers.map((member) => {
    const stats = memberStatsMap[member.id] || { proactive: 0, delayed: 0, total: 0 };
    const memberTotal = stats.proactive + stats.delayed;
    const memberRate = memberTotal > 0 ? Number(((stats.proactive / memberTotal) * 100).toFixed(1)) : 100;

    return {
      name: member.name,
      avatar: member.avatar,
      color: member.color,
      proactive: stats.proactive,
      delayed: stats.delayed,
      total: memberTotal,
      proactiveRate: memberRate,
    };
  });

  return {
    totalLoggedLast30Days: proactiveCount + postponedOrDelayedCount,
    completedCount,
    proactiveCount,
    postponedOrDelayedCount,
    proactiveRate,
    postponeRate,
    avgDelayDays,
    pendingCount,
    overdueCount,
    dailyTrend,
    memberBreakdown,
  };
}
