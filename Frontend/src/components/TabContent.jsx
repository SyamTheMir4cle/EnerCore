import React from 'react';
import { useTabStore } from '../store/tabStore';

function TabContent() {
  const { tabs, activeTabId } = useTabStore();

  const activeTab = tabs.find(tab => tab.id === activeTabId);

  return (
    <main className="flex-1 overflow-y-auto bg-gray-50">
      {}
      {activeTab ? <activeTab.Component /> : null}
    </main>
  );
}

export default TabContent;