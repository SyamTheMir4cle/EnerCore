import { create } from 'zustand';
import Dashboard from '../pages/Dashboard';

export const useTabStore = create((set, get) => ({
  tabs: [
    { id: 'dashboard', title: 'Dashboard', Component: Dashboard }
  ],
  activeTabId: 'dashboard',
  // --- TAMBAHKAN STATE & ACTION BARU ---
  coaLastUpdated: Date.now(), // State untuk melacak kapan CoA terakhir update
  triggerCoaRefresh: () => set({ coaLastUpdated: Date.now() }), // Action untuk memicu update

  setActiveTab: (tabId) => set({ activeTabId: tabId }),

  openTab: (newTab) => {
    // ... (logika openTab tetap sama) ...
    const { tabs } = get();
    const tabExists = tabs.some(tab => tab.id === newTab.id);
    if (tabExists) {
      set({ activeTabId: newTab.id });
    } else {
      set(state => ({
        tabs: [...state.tabs, newTab],
        activeTabId: newTab.id
      }));
    }
  },

  closeTab: (tabId) => {
    // ... (logika closeTab tetap sama) ...
    if (tabId === 'dashboard') return;
    const { tabs, activeTabId } = get();
    const newTabs = tabs.filter(tab => tab.id !== tabId);
    if (activeTabId === tabId) {
      const closingTabIndex = tabs.findIndex(tab => tab.id === tabId);
      const newActiveTab = tabs[closingTabIndex - 1] || newTabs[newTabs.length - 1];
      set({ tabs: newTabs, activeTabId: newActiveTab?.id });
    } else {
      set({ tabs: newTabs });
    }
  },
}));
