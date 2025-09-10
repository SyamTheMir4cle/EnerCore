import React, { useState, useCallback } from 'react';
import { useTabStore } from '../../store/tabStore';
import JurnalUmumList from './JurnalUmumList';
import JurnalUmumForm from './JurnalUmumForm';
import { XMarkIcon } from '@heroicons/react/24/solid';

function JurnalUmumPage() {
  // State untuk mengelola tab internal
  const [internalTabs, setInternalTabs] = useState([
    { id: 'list', title: 'Daftar Jurnal Umum' }
  ]);
  const [activeTabId, setActiveTabId] = useState('list');
  // State untuk memicu refresh daftar jurnal
  const [refreshKey, setRefreshKey] = useState(0); 

  const triggerCoaRefresh = useTabStore((state) => state.triggerCoaRefresh);

  // Fungsi untuk membuka tab baru (dipanggil dari komponen anak)
  const openInternalTab = (tab) => {
    if (!internalTabs.some(t => t.id === tab.id)) {
      setInternalTabs([...internalTabs, tab]);
    }
    setActiveTabId(tab.id);
  };

  // Fungsi untuk menutup tab internal
  const closeInternalTab = (tabIdToClose) => {
    const newTabs = internalTabs.filter(t => t.id !== tabIdToClose);
    setInternalTabs(newTabs);
    // Jika tab yang ditutup adalah tab aktif, kembali ke daftar
    if (activeTabId === tabIdToClose) {
      setActiveTabId('list');
    }
  };
  
  // Fungsi yang dipanggil setelah form berhasil disimpan
  const handleSaveSuccess = useCallback((savedTabId) => {
    triggerCoaRefresh(); // Memicu refresh saldo di CoA
    setRefreshKey(prev => prev + 1); // Memicu refresh daftar jurnal di JurnalUmumList
    if (savedTabId) {
      closeInternalTab(savedTabId); // Tutup tab form (new atau edit)
    }
  }, [triggerCoaRefresh]); // useCallback untuk stabilitas

  // Fungsi untuk me-render konten tab yang aktif
  const renderContent = () => {
    const activeTab = internalTabs.find(t => t.id === activeTabId);
    if (!activeTab) return null;

    switch (activeTab.id) {
      case 'list':
        // Kirim 'refreshKey' agar JurnalUmumList tahu kapan harus memuat ulang data
        return <JurnalUmumList onOpenTab={openInternalTab} refreshKey={refreshKey} />;
      case 'new':
        return <JurnalUmumForm onSaveSuccess={() => handleSaveSuccess('new')} />;
      default:
        // Menangani tab 'Ubah Jurnal'
        if (activeTab.id.startsWith('edit-')) {
          const jurnalId = activeTab.id.split('-')[1];
          return <JurnalUmumForm jurnalId={jurnalId} onSaveSuccess={() => handleSaveSuccess(activeTab.id)} />;
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

