import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  FamilyMember,
  GroceryCategory,
  GroceryItem,
  ChoreCategory,
  Chore,
  ChoreMetrics,
  GroceryRollup,
  ConsumptionLog,
} from '../types';
import {
  INITIAL_FAMILY_MEMBERS,
  INITIAL_GROCERY_CATEGORIES,
  INITIAL_GROCERY_ITEMS,
  INITIAL_CHORE_CATEGORIES,
  INITIAL_CHORES,
} from '../data/initialData';
import { calculateGroceryRollup } from '../utils/groceryUtils';
import { calculateChoreMetrics } from '../utils/choreUtils';

interface HomeContextType {
  // Family & Active User
  familyMembers: FamilyMember[];
  activeUser: FamilyMember;
  setActiveUser: (user: FamilyMember) => void;
  addFamilyMember: (name: string, role: string, avatar: string, color: string) => void;
  updateFamilyMember: (id: string, updates: Partial<FamilyMember>) => void;
  deleteFamilyMember: (id: string) => void;

  // Grocery Categories
  groceryCategories: GroceryCategory[];
  addGroceryCategory: (name: string, parentId: string | null, icon?: string, color?: string) => string;
  updateGroceryCategory: (id: string, name: string, icon?: string, color?: string) => void;
  deleteGroceryCategory: (id: string) => void;

  // Grocery Items
  groceryItems: GroceryItem[];
  addGroceryItem: (item: Omit<GroceryItem, 'id' | 'updatedBy' | 'updatedAt' | 'logs'>) => void;
  updateGroceryItem: (id: string, updates: Partial<GroceryItem>) => void;
  deleteGroceryItem: (id: string) => void;
  topUpGroceryItem: (id: string, addedQty: number, newPricePerUnit: number, newExpiryDate?: string, notes?: string) => void;
  consumeGroceryItem: (id: string, consumedQty: number, notes?: string) => void;

  // Chore Categories
  choreCategories: ChoreCategory[];
  addChoreCategory: (name: string, parentId: string | null, icon?: string, color?: string) => string;
  updateChoreCategory: (id: string, name: string, icon?: string, color?: string) => void;
  deleteChoreCategory: (id: string) => void;

  // Chores
  chores: Chore[];
  addChore: (chore: Omit<Chore, 'id' | 'createdBy' | 'status' | 'postponedCount' | 'postponedDaysTotal' | 'rescheduleHistory'>) => void;
  updateChore: (id: string, updates: Partial<Chore>) => void;
  deleteChore: (id: string) => void;
  completeChore: (
    id: string,
    rescheduleOption: {
      shouldReschedule: boolean;
      newDeadline?: string;
      assignToMemberId?: string;
    }
  ) => void;
  postponeChore: (id: string, additionalDays: number, reason?: string) => void;

  // Analytics & Rollups
  choreMetrics: ChoreMetrics;
  globalGroceryRollup: GroceryRollup;

  // Persistence
  resetToDemoData: () => void;
}

const HomeContext = createContext<HomeContextType | undefined>(undefined);

const STORAGE_KEYS = {
  MEMBERS: 'kinpulse_family_members_v1',
  ACTIVE_USER: 'kinpulse_active_user_v1',
  GROCERY_CATS: 'kinpulse_grocery_categories_v1',
  GROCERY_ITEMS: 'kinpulse_grocery_items_v1',
  CHORE_CATS: 'kinpulse_chore_categories_v1',
  CHORES: 'kinpulse_chores_v1',
};

export const HomeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Family Members
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MEMBERS);
      return saved ? JSON.parse(saved) : INITIAL_FAMILY_MEMBERS;
    } catch {
      return INITIAL_FAMILY_MEMBERS;
    }
  });

  // Active User
  const [activeUser, setActiveUser] = useState<FamilyMember>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_USER);
      if (saved) {
        const parsed = JSON.parse(saved);
        const exists = familyMembers.find((m) => m.id === parsed.id);
        if (exists) return exists;
      }
      return familyMembers[0] || INITIAL_FAMILY_MEMBERS[0];
    } catch {
      return familyMembers[0] || INITIAL_FAMILY_MEMBERS[0];
    }
  });

  // Grocery Categories
  const [groceryCategories, setGroceryCategories] = useState<GroceryCategory[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.GROCERY_CATS);
      return saved ? JSON.parse(saved) : INITIAL_GROCERY_CATEGORIES;
    } catch {
      return INITIAL_GROCERY_CATEGORIES;
    }
  });

  // Grocery Items
  const [groceryItems, setGroceryItems] = useState<GroceryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.GROCERY_ITEMS);
      return saved ? JSON.parse(saved) : INITIAL_GROCERY_ITEMS;
    } catch {
      return INITIAL_GROCERY_ITEMS;
    }
  });

  // Chore Categories
  const [choreCategories, setChoreCategories] = useState<ChoreCategory[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CHORE_CATS);
      return saved ? JSON.parse(saved) : INITIAL_CHORE_CATEGORIES;
    } catch {
      return INITIAL_CHORE_CATEGORIES;
    }
  });

  // Chores
  const [chores, setChores] = useState<Chore[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CHORES);
      return saved ? JSON.parse(saved) : INITIAL_CHORES;
    } catch {
      return INITIAL_CHORES;
    }
  });

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(familyMembers));
    } catch (e) {
      console.warn('LocalStorage error', e);
    }
  }, [familyMembers]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_USER, JSON.stringify(activeUser));
    } catch (e) {
      console.warn('LocalStorage error', e);
    }
  }, [activeUser]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.GROCERY_CATS, JSON.stringify(groceryCategories));
    } catch (e) {
      console.warn('LocalStorage error', e);
    }
  }, [groceryCategories]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.GROCERY_ITEMS, JSON.stringify(groceryItems));
    } catch (e) {
      console.warn('LocalStorage error', e);
    }
  }, [groceryItems]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CHORE_CATS, JSON.stringify(choreCategories));
    } catch (e) {
      console.warn('LocalStorage error', e);
    }
  }, [choreCategories]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CHORES, JSON.stringify(chores));
    } catch (e) {
      console.warn('LocalStorage error', e);
    }
  }, [chores]);

  // Derived Analytics
  const choreMetrics = useMemo(() => {
    return calculateChoreMetrics(chores, familyMembers);
  }, [chores, familyMembers]);

  const globalGroceryRollup = useMemo(() => {
    return calculateGroceryRollup(groceryCategories, groceryItems, null);
  }, [groceryCategories, groceryItems]);

  // Family Member methods
  const addFamilyMember = (name: string, role: string, avatar: string, color: string) => {
    const newMember: FamilyMember = {
      id: `user-${Date.now()}`,
      name,
      role,
      avatar,
      color,
    };
    setFamilyMembers((prev) => [...prev, newMember]);
  };

  const updateFamilyMember = (id: string, updates: Partial<FamilyMember>) => {
    setFamilyMembers((prev) =>
      prev.map((m) => {
        if (m.id !== id) return m;
        const updated = { ...m, ...updates };
        if (activeUser.id === id) {
          setActiveUser(updated);
        }
        return updated;
      })
    );

    // Sync member references across chores
    setChores((prev) =>
      prev.map((chore) => ({
        ...chore,
        assignedTo: chore.assignedTo.id === id ? { ...chore.assignedTo, ...updates } : chore.assignedTo,
        createdBy: chore.createdBy.id === id ? { ...chore.createdBy, ...updates } : chore.createdBy,
        doneBy: chore.doneBy && chore.doneBy.id === id ? { ...chore.doneBy, ...updates } : chore.doneBy,
      }))
    );

    // Sync member references across grocery items
    setGroceryItems((prev) =>
      prev.map((item) => ({
        ...item,
        updatedBy: item.updatedBy.id === id ? { ...item.updatedBy, ...updates } : item.updatedBy,
      }))
    );
  };

  const deleteFamilyMember = (id: string) => {
    if (familyMembers.length <= 1) return; // Keep at least one family member
    const remaining = familyMembers.filter((m) => m.id !== id);
    setFamilyMembers(remaining);
    if (activeUser.id === id) {
      setActiveUser(remaining[0]);
    }
  };

  // Grocery Category methods
  const addGroceryCategory = (name: string, parentId: string | null, icon?: string, color?: string): string => {
    const id = `cat-${Date.now()}`;
    const newCategory: GroceryCategory = {
      id,
      name,
      parentId,
      icon: icon || 'Folder',
      color: color || '#3b82f6',
    };
    setGroceryCategories((prev) => [...prev, newCategory]);
    return id;
  };

  const updateGroceryCategory = (id: string, name: string, icon?: string, color?: string) => {
    setGroceryCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, name, icon: icon || c.icon, color: color || c.color } : c))
    );
  };

  const deleteGroceryCategory = (id: string) => {
    // Delete this category and all subcategories
    const toDelete = new Set<string>();
    const collectIds = (parentId: string) => {
      toDelete.add(parentId);
      groceryCategories.filter((c) => c.parentId === parentId).forEach((c) => collectIds(c.id));
    };
    collectIds(id);

    setGroceryCategories((prev) => prev.filter((c) => !toDelete.has(c.id)));
    // Delete items in deleted categories
    setGroceryItems((prev) => prev.filter((item) => !toDelete.has(item.categoryId)));
  };

  // Grocery Item methods
  const addGroceryItem = (itemData: Omit<GroceryItem, 'id' | 'updatedBy' | 'updatedAt' | 'logs'>) => {
    const newItem: GroceryItem = {
      ...itemData,
      id: `item-${Date.now()}`,
      updatedBy: activeUser,
      updatedAt: new Date().toISOString(),
      logs: [
        {
          id: `log-${Date.now()}`,
          date: itemData.topUpDate,
          deltaQuantity: itemData.quantity,
          action: 'topup',
          pricePerUnit: itemData.lastPricePerUnit,
          userId: activeUser.id,
          userName: activeUser.name,
          notes: 'Initial inventory creation',
        },
      ],
    };
    setGroceryItems((prev) => [newItem, ...prev]);
  };

  const updateGroceryItem = (id: string, updates: Partial<GroceryItem>) => {
    setGroceryItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        return {
          ...item,
          ...updates,
          updatedBy: activeUser,
          updatedAt: new Date().toISOString(),
        };
      })
    );
  };

  const deleteGroceryItem = (id: string) => {
    setGroceryItems((prev) => prev.filter((item) => item.id !== id));
  };

  const topUpGroceryItem = (
    id: string,
    addedQty: number,
    newPricePerUnit: number,
    newExpiryDate?: string,
    notes?: string
  ) => {
    const nowIso = new Date().toISOString();
    const todayDate = nowIso.split('T')[0];

    setGroceryItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const newTotalQty = Number((item.quantity + addedQty).toFixed(2));
        const newLog: ConsumptionLog = {
          id: `log-${Date.now()}`,
          date: todayDate,
          deltaQuantity: addedQty,
          action: 'topup',
          pricePerUnit: newPricePerUnit,
          userId: activeUser.id,
          userName: activeUser.name,
          notes: notes || `Restocked +${addedQty} ${item.unit}`,
        };

        return {
          ...item,
          quantity: newTotalQty,
          lastPricePerUnit: newPricePerUnit,
          topUpDate: todayDate,
          expiryDate: newExpiryDate || item.expiryDate,
          updatedBy: activeUser,
          updatedAt: nowIso,
          logs: [newLog, ...item.logs],
        };
      })
    );
  };

  const consumeGroceryItem = (id: string, consumedQty: number, notes?: string) => {
    const nowIso = new Date().toISOString();
    const todayDate = nowIso.split('T')[0];

    setGroceryItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const newQty = Math.max(0, Number((item.quantity - consumedQty).toFixed(2)));
        const newLog: ConsumptionLog = {
          id: `log-${Date.now()}`,
          date: todayDate,
          deltaQuantity: -consumedQty,
          action: 'consume',
          userId: activeUser.id,
          userName: activeUser.name,
          notes: notes || `Consumed -${consumedQty} ${item.unit}`,
        };

        return {
          ...item,
          quantity: newQty,
          updatedBy: activeUser,
          updatedAt: nowIso,
          logs: [newLog, ...item.logs],
        };
      })
    );
  };

  // Chore Category methods
  const addChoreCategory = (name: string, parentId: string | null, icon?: string, color?: string): string => {
    const id = `chore-cat-${Date.now()}`;
    const newCategory: ChoreCategory = {
      id,
      name,
      parentId,
      icon: icon || 'CheckSquare',
      color: color || '#6366f1',
    };
    setChoreCategories((prev) => [...prev, newCategory]);
    return id;
  };

  const updateChoreCategory = (id: string, name: string, icon?: string, color?: string) => {
    setChoreCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, name, icon: icon || c.icon, color: color || c.color } : c))
    );
  };

  const deleteChoreCategory = (id: string) => {
    const toDelete = new Set<string>();
    const collectIds = (parentId: string) => {
      toDelete.add(parentId);
      choreCategories.filter((c) => c.parentId === parentId).forEach((c) => collectIds(c.id));
    };
    collectIds(id);

    setChoreCategories((prev) => prev.filter((c) => !toDelete.has(c.id)));
    setChores((prev) => prev.filter((chore) => !toDelete.has(chore.categoryId)));
  };

  // Chore methods
  const addChore = (choreData: Omit<Chore, 'id' | 'createdBy' | 'status' | 'postponedCount' | 'postponedDaysTotal' | 'rescheduleHistory'>) => {
    const newChore: Chore = {
      ...choreData,
      id: `chore-${Date.now()}`,
      createdBy: activeUser,
      originalDeadline: choreData.deadline,
      status: 'pending',
      postponedCount: 0,
      postponedDaysTotal: 0,
      rescheduleHistory: [
        {
          date: new Date().toISOString().split('T')[0],
          action: 'created',
          userId: activeUser.id,
          userName: activeUser.name,
          newDeadline: choreData.deadline,
        },
      ],
    };
    setChores((prev) => [newChore, ...prev]);
  };

  const updateChore = (id: string, updates: Partial<Chore>) => {
    setChores((prev) => prev.map((chore) => (chore.id === id ? { ...chore, ...updates } : chore)));
  };

  const deleteChore = (id: string) => {
    setChores((prev) => prev.filter((chore) => chore.id !== id));
  };

  const postponeChore = (id: string, additionalDays: number, reason?: string) => {
    const todayStr = new Date().toISOString().split('T')[0];

    setChores((prev) =>
      prev.map((chore) => {
        if (chore.id !== id) return chore;

        const currentDead = new Date(chore.deadline);
        currentDead.setDate(currentDead.getDate() + additionalDays);
        const newDeadStr = currentDead.toISOString().split('T')[0];

        const historyItem = {
          date: todayStr,
          action: 'postponed' as const,
          userId: activeUser.id,
          userName: activeUser.name,
          previousDeadline: chore.deadline,
          newDeadline: newDeadStr,
          note: reason || `Delayed by +${additionalDays} days`,
        };

        return {
          ...chore,
          deadline: newDeadStr,
          status: 'pending',
          postponedCount: (chore.postponedCount || 0) + 1,
          postponedDaysTotal: (chore.postponedDaysTotal || 0) + additionalDays,
          rescheduleHistory: [...(chore.rescheduleHistory || []), historyItem],
        };
      })
    );
  };

  const completeChore = (
    id: string,
    rescheduleOption: {
      shouldReschedule: boolean;
      newDeadline?: string;
      assignToMemberId?: string;
    }
  ) => {
    const todayStr = new Date().toISOString().split('T')[0];
    let choreToRepeat: Chore | undefined;

    setChores((prev) => {
      const updated = prev.map((chore) => {
        if (chore.id !== id) return chore;
        choreToRepeat = chore;

        const historyItem = {
          date: todayStr,
          action: 'completed' as const,
          userId: activeUser.id,
          userName: activeUser.name,
          note: 'Completed task',
        };

        return {
          ...chore,
          status: 'completed' as const,
          doneBy: activeUser,
          completedAt: todayStr,
          rescheduleHistory: [...(chore.rescheduleHistory || []), historyItem],
        };
      });

      // If user chose to reschedule for a future date, create next cycle chore
      if (rescheduleOption.shouldReschedule && choreToRepeat && rescheduleOption.newDeadline) {
        const assignedMember =
          familyMembers.find((m) => m.id === rescheduleOption.assignToMemberId) || choreToRepeat.assignedTo;

        const nextCycleChore: Chore = {
          id: `chore-${Date.now()}`,
          title: choreToRepeat.title,
          description: choreToRepeat.description,
          categoryId: choreToRepeat.categoryId,
          deadline: rescheduleOption.newDeadline,
          originalDeadline: rescheduleOption.newDeadline,
          assignedTo: assignedMember,
          createdBy: activeUser,
          status: 'pending',
          priority: choreToRepeat.priority,
          postponedCount: 0,
          postponedDaysTotal: 0,
          rescheduleHistory: [
            {
              date: todayStr,
              action: 'created',
              userId: activeUser.id,
              userName: activeUser.name,
              newDeadline: rescheduleOption.newDeadline,
              note: `Repeated after completing previous cycle by ${activeUser.name}`,
            },
          ],
        };
        return [nextCycleChore, ...updated];
      }

      return updated;
    });
  };

  const resetToDemoData = () => {
    setFamilyMembers(INITIAL_FAMILY_MEMBERS);
    setActiveUser(INITIAL_FAMILY_MEMBERS[0]);
    setGroceryCategories(INITIAL_GROCERY_CATEGORIES);
    setGroceryItems(INITIAL_GROCERY_ITEMS);
    setChoreCategories(INITIAL_CHORE_CATEGORIES);
    setChores(INITIAL_CHORES);

    localStorage.removeItem(STORAGE_KEYS.MEMBERS);
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_USER);
    localStorage.removeItem(STORAGE_KEYS.GROCERY_CATS);
    localStorage.removeItem(STORAGE_KEYS.GROCERY_ITEMS);
    localStorage.removeItem(STORAGE_KEYS.CHORE_CATS);
    localStorage.removeItem(STORAGE_KEYS.CHORES);
  };

  return (
    <HomeContext.Provider
      value={{
        familyMembers,
        activeUser,
        setActiveUser,
        addFamilyMember,
        updateFamilyMember,
        deleteFamilyMember,
        groceryCategories,
        addGroceryCategory,
        updateGroceryCategory,
        deleteGroceryCategory,
        groceryItems,
        addGroceryItem,
        updateGroceryItem,
        deleteGroceryItem,
        topUpGroceryItem,
        consumeGroceryItem,
        choreCategories,
        addChoreCategory,
        updateChoreCategory,
        deleteChoreCategory,
        chores,
        addChore,
        updateChore,
        deleteChore,
        completeChore,
        postponeChore,
        choreMetrics,
        globalGroceryRollup,
        resetToDemoData,
      }}
    >
      {children}
    </HomeContext.Provider>
  );
};

export const useHome = () => {
  const context = useContext(HomeContext);
  if (!context) {
    throw new Error('useHome must be used within a HomeProvider');
  }
  return context;
};
