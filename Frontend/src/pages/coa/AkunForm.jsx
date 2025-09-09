import React, { useState, useEffect, useRef } from 'react';
import apiClient from '../../api/apiClient';
import toast from 'react-hot-toast';

const flattenAkunForSelect = (akuns, level = 0) => {
  let list = [];
  akuns.forEach(akun => {
    list.push({
      kode_akun: akun.kode_akun,
      nama_akun: `${'--'.repeat(level)} ${akun.nama_akun}`
    });
    if (akun.children && akun.children.length > 0) {
      list = list.concat(flattenAkunForSelect(akun.children, level + 1));
    }
  });
  return list;
};

const findAkunInTree = (akuns, kode) => {
  for (const akun of akuns) {
    if (akun.kode_akun === kode) {
      return akun;
    }
    if (akun.children && akun.children.length > 0) {
      const found = findAkunInTree(akun.children, kode);
      if (found) {
        return found;
      }
    }
  }
  return null;
};

function AkunForm({ onClose, onSuccess, semuaAkun, initialData = null }) {
  const [formData, setFormData] = useState({
    kode_akun: '',
    nama_akun: '',
    tipe_akun: 'Kas & Bank',
    parent: null,
    saldo_awal: 0,
    tanggal_saldo_awal: new Date().toISOString().split('T')[0],
  });
  const [flatAkunList, setFlatAkunList] = useState([]);
  const isEditMode = initialData !== null;
  const kodeAkunInputRef = useRef(null);

  useEffect(() => {
    setFlatAkunList(flattenAkunForSelect(semuaAkun));
    if (isEditMode) {
      setFormData({
        kode_akun: initialData.kode_akun,
        nama_akun: initialData.nama_akun,
        tipe_akun: initialData.tipe_akun,
        parent: initialData.parent || null,
        saldo_awal: initialData.saldo_awal,
        tanggal_saldo_awal: initialData.tanggal_saldo_awal || new Date().toISOString().split('T')[0],
      });
    } else {
      setFormData({
        kode_akun: '',
        nama_akun: '',
        tipe_akun: 'Kas & Bank',
        parent: null,
        saldo_awal: 0,
        tanggal_saldo_awal: new Date().toISOString().split('T')[0],
      });
    }
  }, [semuaAkun, initialData, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const finalValue = value === "null" ? null : value;

    setFormData(prev => {
      const newData = { ...prev, [name]: finalValue };

      if (name === 'parent') {
        if (finalValue) {
          const parentAkun = findAkunInTree(semuaAkun, finalValue);
          let nextKode = '';

          if (parentAkun && parentAkun.children && parentAkun.children.length > 0) {
            const lastChildCode = parentAkun.children.reduce((maxCode, child) => {
              return child.kode_akun > maxCode ? child.kode_akun : maxCode;
            }, '0');
            
            const nextNumber = parseInt(lastChildCode, 10) + 1;
            nextKode = String(nextNumber);
          } else {
            nextKode = `${finalValue}01`;
          }
          newData.kode_akun = nextKode;
        } else {
          newData.kode_akun = '';
        }
        
        setTimeout(() => {
          if (kodeAkunInputRef.current) {
            kodeAkunInputRef.current.focus();
            const val = kodeAkunInputRef.current.value;
            kodeAkunInputRef.current.setSelectionRange(val.length, val.length);
          }
        }, 0);
      }

      return newData;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let promise;
    if (isEditMode) {
      promise = apiClient.put(`/buku-besar/akun/${initialData.kode_akun}/`, formData);
    } else {
      promise = apiClient.post('/buku-besar/akun/', formData);
    }

    toast.promise(promise, {
      loading: 'Menyimpan data...',
      success: () => {
        onSuccess();
        return `Akun berhasil ${isEditMode ? 'diperbarui' : 'dibuat'}!`;
      },
      error: (err) => {
        const messages = Object.values(err.response.data).join('\n');
        return `Gagal: ${messages || err.message}`;
      },
    });
  };
  
  const tipeAkunOptions = [
    'Kas & Bank',
    'Piutang Usaha',
    'Persediaan',
    'Aset Lancar Lainnya',
    'Aset Tetap',
    'Akumulasi Penyusutan',
    'Utang Usaha',
    'Liabilitas Jangka Pendek',
    'Liabilitas Jangka Panjang',
    'Modal',
    'Pendapatan',
    'Harga Pokok Penjualan',
    'Beban',
    'Pendapatan lainnya',
    'Beban lainnya'
  ];

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <label htmlFor="kode_akun" className="block text-sm font-medium text-gray-700">Kode Akun</label>
          <input 
            ref={kodeAkunInputRef}
            type="text" 
            name="kode_akun" 
            id="kode_akun" 
            value={formData.kode_akun} 
            onChange={handleChange} 
            required 
            readOnly={isEditMode} 
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm ${isEditMode ? 'bg-gray-100' : ''}`}
          />
        </div>
        <div>
          <label htmlFor="nama_akun" className="block text-sm font-medium text-gray-700">Nama Akun</label>
          <input type="text" name="nama_akun" id="nama_akun" value={formData.nama_akun} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"/>
        </div>
        <div>
          <label htmlFor="tipe_akun" className="block text-sm font-medium text-gray-700">Tipe Akun</label>
          <select id="tipe_akun" name="tipe_akun" value={formData.tipe_akun} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
            {tipeAkunOptions.map(tipe => <option key={tipe} value={tipe}>{tipe}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="parent" className="block text-sm font-medium text-gray-700">Akun Induk (Opsional)</label>
          <select id="parent" name="parent" value={formData.parent || "null"} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
            <option value="null">-- Tidak Ada --</option>
            {flatAkunList.map(akun => (
              <option key={akun.kode_akun} value={akun.kode_akun}>{akun.nama_akun}</option>
            ))}
          </select>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="saldo_awal" className="block text-sm font-medium text-gray-700">Saldo Awal</label>
            <input type="number" step="0.01" name="saldo_awal" id="saldo_awal" value={formData.saldo_awal} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"/>
          </div>
          <div>
            <label htmlFor="tanggal_saldo_awal" className="block text-sm font-medium text-gray-700">Per Tanggal</label>
            <input type="date" name="tanggal_saldo_awal" id="tanggal_saldo_awal" value={formData.tanggal_saldo_awal} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"/>
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-x-4">
        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
          Batal
        </button>
        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
          Simpan Akun
        </button>
      </div>
    </form>
  );
}

export default AkunForm;

