// src/layouts/MainLayout.jsx
import React from 'react';
import Sidebar from '../components/Sidebar';
import TabContainer from '../components/TabContainer';
import TabContent from '../components/TabContent';

function MainLayout() {
  return (
    <div className="flex h-screen bg-gray-100"> 
      
      {/* Sidebar sekarang melayang di atas layout ini */}
      <Sidebar />
      
      {/* Konten utama sekarang mengambil seluruh lebar */}
      <div className="flex-1 flex flex-col overflow-hidden pl-28">
        <TabContainer />
        <TabContent />
      </div>
    </div>
  );
}

export default MainLayout;