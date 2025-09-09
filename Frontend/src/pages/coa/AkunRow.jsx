// src/pages/coa/AkunRow.jsx
import React from 'react';
import { Menu } from '@headlessui/react';
import { ChevronDownIcon, EllipsisVerticalIcon } from '@heroicons/react/24/solid';

// Komponen sekarang menerima props onEdit dan onDelete
function AkunRow({ akun, level = 0, onEdit, onDelete }) {
  const hasChildren = akun.children && akun.children.length > 0;

  return (
    <>
      <tr className="hover:bg-gray-50">
        <td className="p-3 text-sm text-gray-700 whitespace-nowrap" style={{ paddingLeft: `${level * 24 + 12}px` }}>
          <div className="flex items-center gap-2">
            {hasChildren && <ChevronDownIcon className="h-4 w-4 text-gray-400" />}
            <span className="font-medium">{akun.nama_akun}</span>
          </div>
        </td>
        <td className="p-3 text-sm text-gray-700 whitespace-nowrap">{akun.kode_akun}</td>
        <td className="p-3 text-sm text-gray-700 whitespace-nowrap">{akun.tipe_akun}</td>
        <td className="p-3 text-sm text-gray-700 whitespace-nowrap text-right">
          {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(akun.saldo)}
        </td>
        {/* Kolom untuk Menu Aksi */}
        <td className="p-3 text-sm text-gray-700 text-center">
          <Menu as="div" className="relative inline-block text-left">
            <Menu.Button className="p-1 rounded-full hover:bg-gray-200">
              <EllipsisVerticalIcon className="h-5 w-5" />
            </Menu.Button>
            <Menu.Items className="absolute right-0 mt-2 w-32 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
              <div className="px-1 py-1">
                <Menu.Item>
                  {({ active }) => (
                    <button onClick={() => onEdit(akun)} className={`${active ? 'bg-blue-500 text-white' : 'text-gray-900'} group flex rounded-md items-center w-full px-2 py-2 text-sm`}>
                      Ubah
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button onClick={() => onDelete(akun)} className={`${active ? 'bg-red-500 text-white' : 'text-red-600'} group flex rounded-md items-center w-full px-2 py-2 text-sm`}>
                      Hapus
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Menu>
        </td>
      </tr>

      {hasChildren &&
        akun.children.map((childAkun) => (
          <AkunRow key={childAkun.kode_akun} akun={childAkun} level={level + 1} onEdit={onEdit} onDelete={onDelete} />
        ))
      }
    </>
  );
}

export default AkunRow;