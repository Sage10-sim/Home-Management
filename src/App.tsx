/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { HomeProvider, useHome } from './context/HomeContext';
import { Navbar } from './components/Navbar';
import { ChoreMetricsDashboard } from './components/dashboard/ChoreMetricsDashboard';
import { GroceryManager } from './components/groceries/GroceryManager';
import { ChoreManager } from './components/chores/ChoreManager';
import { FamilyCalendar } from './components/calendar/FamilyCalendar';
import { RescheduleModal } from './components/chores/RescheduleModal';
import { Chore } from './types';

function MainApp() {
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'groceries' | 'chores' | 'calendar'>('dashboard');

  // Shared Reschedule Modal State
  const [activeRescheduleChore, setActiveRescheduleChore] = useState<Chore | null>(null);

  // Shortcut hooks
  const [groceryPreselectItemId, setGroceryPreselectItemId] = useState<string | null>(null);

  const handleOpenRescheduleModal = (chore: Chore) => {
    setActiveRescheduleChore(chore);
  };

  const handleOpenTopUpModalFromDashboard = (itemId: string) => {
    setGroceryPreselectItemId(itemId);
    setCurrentTab('groceries');
  };

  const handleOpenChoreCreateForDate = (dateStr: string) => {
    setCurrentTab('chores');
  };

  return (
    <div className="min-h-screen bg-slate-100/60 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans antialiased selection:bg-indigo-500 selection:text-white">
      {/* Header & Navbar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenNewChoreModal={() => setCurrentTab('chores')}
        onOpenNewItemModal={() => setCurrentTab('groceries')}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 pb-24 md:pb-8">
        {currentTab === 'dashboard' && (
          <ChoreMetricsDashboard
            onNavigateToChores={() => setCurrentTab('chores')}
            onNavigateToGroceries={() => setCurrentTab('groceries')}
            onOpenRescheduleModal={handleOpenRescheduleModal}
            onOpenTopUpModal={handleOpenTopUpModalFromDashboard}
          />
        )}

        {currentTab === 'groceries' && (
          <GroceryManager initialSelectedItemId={groceryPreselectItemId} />
        )}

        {currentTab === 'chores' && (
          <ChoreManager onOpenRescheduleModal={handleOpenRescheduleModal} />
        )}

        {currentTab === 'calendar' && (
          <FamilyCalendar
            onOpenRescheduleModal={handleOpenRescheduleModal}
            onOpenChoreCreateForDate={handleOpenChoreCreateForDate}
          />
        )}
      </main>

      {/* Global Reschedule Dialog when chore is completed */}
      {activeRescheduleChore && (
        <RescheduleModal
          chore={activeRescheduleChore}
          onClose={() => setActiveRescheduleChore(null)}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 dark:text-slate-200">KinPulse</span>
            <span>•</span>
            <span>Home Management, Nested Pantry Tracking &amp; Chore Intelligence</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>30-Day Proactive Analytics powered by Recharts</span>
            <span>•</span>
            <span>Multi-User Collaborative State</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <HomeProvider>
      <MainApp />
    </HomeProvider>
  );
}
