import React, { useState, useCallback } from 'react';
import { useTabStore } from '../../store/tabStore';
import JurnalUmumList from './JurnalUmumList';
import JurnalUmumForm from './JurnalUmumForm';
import { XMarkIcon } from '@heroicons/react/24/solid';

function JurnalUmumPage() {
  const [internalTabs, setInternalTabs] = useState([
    { id: 'list', title: 'Daftar Jurnal Umum' }
  ]);
  const [activeTabId, setActiveTabId] = useState('list');
  const [refreshKey, setRefreshKey] = useState(0); 

  const triggerCoaRefresh = useTabStore((state) => state.triggerCoaRefresh);

  const openInternalTab = (tab) => {
    if (!internalTabs.some(t => t.id === tab.id)) {
      setInternalTabs([...internalTabs, tab]);
    }
    setActiveTabId(tab.id);
  };

  const closeInternalTab = (tabIdToClose) => {
    const newTabs = internalTabs.filter(t => t.id !== tabIdToClose);
    setInternalTabs(newTabs);
    if (activeTabId === tabIdToClose) {
      setActiveTabId('list');
    }
  };
  
  const handleActionSuccess = useCallback((savedTabId) => {
    triggerCoaRefresh();
    setRefreshKey(prev => prev + 1);
    if (savedTabId) {
      closeInternalTab(savedTabId);
    }
  }, [triggerCoaRefresh]);


  const renderContent = () => {
    const activeTab = internalTabs.find(t => t.id === activeTabId);
    if (!activeTab) return null;

    switch (activeTab.id) {
      case 'list':
        return <JurnalUmumList onOpenTab={openInternalTab} refreshKey={refreshKey} onActionSuccess={handleActionSuccess} />;
      case 'new':
        return <JurnalUmumForm onSaveSuccess={() => handleActionSuccess('new')} />;
      default:
        if (activeTab.id.startsWith('edit-')) {
          const jurnalId = activeTab.id.split('-')[1];
          return <JurnalUmumForm jurnalId={jurnalId} onSaveSuccess={() => handleActionSuccess(activeTab.id)} />;
        }
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header Tab Internal */}
      <div className="flex border-b border-gray-200 bg-white">
        {internalTabs.map(tab => (
          <div
            key={tab.id}
            onClick={() => setActiveTabId(tab.id)}
            className={`cursor-pointer px-4 py-3 flex items-center gap-2 border-b-2 transition-colors duration-200 ${
              activeTabId === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            }`}
          >
            <span className="text-sm font-medium">{tab.title}</span>
            {tab.id !== 'list' && (
              <button
                onClick={(e) => { e.stopPropagation(); closeInternalTab(tab.id); }}
                className="p-1 rounded-full hover:bg-gray-200"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}
      </div>
      {/* Konten Tab Internal */}
      <div className="flex-grow overflow-y-auto">
        {renderContent()}
      </div>
    </div>
  );
}

export default JurnalUmumPage;

