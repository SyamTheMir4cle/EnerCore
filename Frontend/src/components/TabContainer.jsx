import React from 'react';
import { useTabStore } from '../store/tabStore';
import { XMarkIcon } from '@heroicons/react/24/solid';

function TabContainer() {
  const { tabs, activeTabId, setActiveTab, closeTab } = useTabStore();

  const handleCloseTab = (e, tabId) => {
    e.stopPropagation(); 
    closeTab(tabId);
  };

  return (
    <div className="bg-white shadow-md">
      <div className="flex flex-wrap items-end gap-x-1 px-2 pt-1">
        {/* 3. Looping semua tab dari state untuk di-render */}
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 max-w-xs px-4 py-2 border-b-2
                transition-colors duration-200 ease-in-out
                transform -translate-y-px
                ${isActive
                  ? 'bg-gray-50 border-blue-500 text-blue-600 rounded-t-lg'
                  : 'bg-transparent border-transparent text-gray-500 hover:bg-gray-100'
                }
              `}
            >
              {/* Judul Tab */}
              <span className="truncate text-sm font-medium">{tab.title}</span>

              {/* 4. Tombol Close, hanya tampil jika tab aktif dan bukan Dashboard */}
              {isActive && tab.id !== 'dashboard' && (
                <span
                  onClick={(e) => handleCloseTab(e, tab.id)}
                  className="p-1 rounded-full hover:bg-gray-300"
                >
                  <XMarkIcon className="h-4 w-4" />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default TabContainer;