// src/components/Sidebar.jsx
import React, { useState } from 'react';
import { useTabStore } from '../store/tabStore';
import { menuData } from '../data/menuData.jsx';
import { UserCircleIcon } from '@heroicons/react/24/outline';

function Sidebar() {
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [isUserMenuOpen, setUserMenuOpen] = useState(false);
  const [flyOutStyle, setFlyOutStyle] = useState({});
  const openTab = useTabStore((state) => state.openTab);

  const handleMainMenuClick = (menu, event) => {
    if (!menu.subMenus || menu.subMenus.length === 0) {
      openTab({ id: menu.id, title: menu.title, Component: menu.Component });
      setActiveMenuId(null);
      return;
    }
    if (activeMenuId === menu.id) {
      setActiveMenuId(null);
    } else {
      const rect = event.currentTarget.getBoundingClientRect();
      const topPosition = rect.top + (rect.height / 2) - 40; // Penyesuaian
      setFlyOutStyle({ top: `${topPosition}px` });
      setActiveMenuId(menu.id);
    }
  };

  const handleSubMenuClick = (subMenu) => {
    openTab({ id: subMenu.id, title: subMenu.title, Component: subMenu.Component });
    setActiveMenuId(null);
  };
  
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.location.href = '/login';
  };

  const activeMenu = menuData.find(menu => menu.id === activeMenuId);

  return (
    <>
      {}
      <div className="absolute top-1/2 left-4 -translate-y-1/2 z-50 flex flex-col items-center gap-y-4">
        <nav className="bg-white rounded-xl shadow-lg p-2 flex flex-col gap-y-2">
          {menuData.map((menu) => (
            <div key={menu.id} className="relative group flex justify-center">
              <button
                onClick={(e) => handleMainMenuClick(menu, e)}
                className={`w-12 h-12 flex items-center justify-center text-gray-500 rounded-lg transition-all duration-300 ease-in-out hover:bg-blue-500 hover:text-white ${activeMenuId === menu.id ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}
              >
                {menu.icon}
              </button>
              <div className="absolute left-full ml-4 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-md shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
                {menu.title}
                <div className="absolute top-1/2 -left-1 w-2 h-2 bg-gray-900 transform rotate-45 -translate-y-1/2" />
              </div>
            </div>
          ))}
        </nav>

        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!isUserMenuOpen)}
            className="w-12 h-12 flex items-center justify-center text-gray-500 rounded-full bg-white shadow-lg hover:bg-gray-200"
          >
            <UserCircleIcon className="h-7 w-7" />
          </button>
          {isUserMenuOpen && (
            <div className="absolute bottom-0 left-16 mb-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1">
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Preferensi</button>
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Atur Kop Surat</button>
              <div className="my-1 border-t border-gray-100" />
              <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">Log Out</button>
            </div>
          )}
        </div>
      </div>

      {}
      {activeMenu && (
        <div 
          style={flyOutStyle}
          className="absolute left-20 z-50 bg-white rounded-lg shadow-2xl p-2 w-64 border border-gray-200"
        >
          <h3 className="text-base font-bold text-gray-800 mb-2 px-3 pt-2">{activeMenu.title}</h3>
          <ul className="space-y-1">
            {activeMenu.subMenus.map((subMenu) => (
              <li key={subMenu.id}>
                <button
                  onClick={() => handleSubMenuClick(subMenu)}
                  className="w-full text-left px-3 py-2 text-gray-700 rounded-md hover:bg-gray-100 transition-colors duration-200"
                >
                  {subMenu.title}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

export default Sidebar;