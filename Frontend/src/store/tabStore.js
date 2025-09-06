// src/store/tabStore.js
import { create } from 'zustand';
import Dashboard from '../pages/Dashboard'; // Impor komponen Dashboard

// create a store
export const useTabStore = create((set, get) => ({
  // STATE:
  // Daftar semua tab yang sedang terbuka.
  // Defaultnya adalah tab Dashboard.
  tabs: [
    { id: 'dashboard', title: 'Dashboard', Component: Dashboard }
  ],
  // ID dari tab yang sedang aktif.
  activeTabId: 'dashboard',

  // ACTIONS:
  // Fungsi untuk mengatur tab mana yang aktif.
  setActiveTab: (tabId) => set({ activeTabId: tabId }),

  // Fungsi untuk membuka tab baru.
  openTab: (newTab) => {
    const { tabs } = get();
    // Cek apakah tab dengan ID yang sama sudah ada.
    const tabExists = tabs.some(tab => tab.id === newTab.id);

    if (tabExists) {
      // Jika sudah ada, cukup jadikan tab itu aktif.
      set({ activeTabId: newTab.id });
    } else {
      // Jika belum ada, tambahkan tab baru ke dalam daftar dan jadikan aktif.
      set(state => ({
        tabs: [...state.tabs, newTab],
        activeTabId: newTab.id
      }));
    }
  },

  // Fungsi untuk menutup tab.
  closeTab: (tabId) => {
    // Tab Dashboard tidak bisa ditutup.
    if (tabId === 'dashboard') return;

    const { tabs, activeTabId } = get();
    const newTabs = tabs.filter(tab => tab.id !== tabId);

    // Jika tab yang ditutup adalah tab yang sedang aktif,
    // kita perlu menentukan tab mana yang akan menjadi aktif selanjutnya.
    if (activeTabId === tabId) {
      const closingTabIndex = tabs.findIndex(tab => tab.id === tabId);
      // Aktifkan tab di sebelah kirinya, atau tab terakhir jika tidak ada.
      const newActiveTab = tabs[closingTabIndex - 1] || newTabs[newTabs.length - 1];
      set({ tabs: newTabs, activeTabId: newActiveTab?.id });
    } else {
      // Jika yang ditutup bukan tab aktif, cukup hapus tabnya.
      set({ tabs: newTabs });
    }
  },
}));