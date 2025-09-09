// src/pages/coa/AkunForm.jsx
import React, { useState, useEffect } from 'react';
import apiClient from '../../api/apiClient';
import toast from 'react-hot-toast';

// Helper function untuk mengubah data pohon menjadi daftar flat untuk <select>
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

// Form menerima prop 'initialData' untuk membedakan mode Buat Baru vs. Ubah
function AkunForm({ onClose, onSuccess, semuaAkun, initialData = null }) {
  const [formData, setFormData] = useState({
    kode_akun: '',
    nama_akun: '',
    tipe_akun: 'Aset',
    parent: null,
  });
  const [flatAkunList, setFlatAkunList] = useState([]);
  const isEditMode = initialData !== null;

  useEffect(() => {
    // Siapkan data untuk dropdown Akun Induk
    setFlatAkunList(flattenAkunForSelect(semuaAkun));
    
    // Jika ada initialData (mode edit), isi form dengan data tersebut
    if (isEditMode) {
      setFormData({
        kode_akun: initialData.kode_akun,
        nama_akun: initialData.nama_akun,
        tipe_akun: initialData.tipe_akun,
        parent: initialData.parent || null, // Pastikan nilai null ditangani dengan benar
      });
    }
  }, [semuaAkun, initialData, isEditMode]);

  // Handler untuk setiap perubahan pada input form
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Ubah nilai string "null" dari dropdown menjadi nilai null sebenarnya
    const finalValue = value === "null" ? null : value;
    setFormData(prev => ({ ...prev, [name]: finalValue }));
  };

  // Handler saat form disubmit
  const handleSubmit = (e) => {
    e.preventDefault();
    let promise;

    // Tentukan request API: PUT untuk ubah, POST untuk buat baru
    if (isEditMode) {
      promise = apiClient.put(`/buku-besar/akun/${initialData.kode_akun}/`, formData);
    } else {
      promise = apiClient.post('/buku-besar/akun/', formData);
    }

    toast.promise(promise, {
      loading: 'Menyimpan data...',
      success: () => {
        onSuccess(); // Panggil fungsi onSuccess dari parent (CoaPage)
        return `Akun berhasil ${isEditMode ? 'diperbarui' : 'dibuat'}!`;
      },
      error: (err) => {
        // Coba tampilkan pesan error dari backend jika ada, jika tidak tampilkan pesan umum
        const messages = err.response?.data ? Object.values(err.response.data).join('\n') : 'Terjadi kesalahan.';
        return `Gagal menyimpan: ${messages}`;
      },
    });
  };
  
  const tipeAkunOptions = ['Aset', 'Liabilitas', 'Ekuitas', 'Pendapatan', 'Beban', 'Akumulasi Penyusutan', 'Harga Pokok Penjualan'];

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        {/* Kode Akun */}
        <div>
          <label htmlFor="kode_akun" className="block text-sm font-medium text-gray-700">Kode Akun</label>
          {/* Kode Akun tidak bisa diubah saat mode edit */}
          <input 
            type="text" 
            name="kode_akun" 
            id="kode_akun" 
            value={formData.kode_akun} 
            onChange={handleChange} 
            required 
            readOnly={isEditMode} 
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm focus:border-blue-500 focus:ring-blue-500 ${isEditMode ? 'bg-gray-100' : ''}`}
          />
        </div>

        {/* Nama Akun */}
        <div>
          <label htmlFor="nama_akun" className="block text-sm font-medium text-gray-700">Nama Akun</label>
          <input 
            type="text" 
            name="nama_akun" 
            id="nama_akun" 
            value={formData.nama_akun} 
            onChange={handleChange} 
            required 
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        {/* Tipe Akun */}
        <div>
          <label htmlFor="tipe_akun" className="block text-sm font-medium text-gray-700">Tipe Akun</label>
          <select 
            id="tipe_akun" 
            name="tipe_akun" 
            value={formData.tipe_akun} 
            onChange={handleChange} 
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            {tipeAkunOptions.map(tipe => <option key={tipe} value={tipe}>{tipe}</option>)}
          </select>
        </div>

        {/* Akun Induk */}
        <div>
          <label htmlFor="parent" className="block text-sm font-medium text-gray-700">Akun Induk (Opsional)</label>
          <select 
            id="parent" 
            name="parent" 
            value={formData.parent || "null"} 
            onChange={handleChange} 
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="null">-- Tidak Ada (Akun Level Atas) --</option>
            {flatAkunList.map(akun => (
              <option 
                key={akun.kode_akun} 
                value={akun.kode_akun}
                // Nonaktifkan pilihan jika akunnya adalah akun yang sedang diedit
                disabled={isEditMode && initialData.kode_akun === akun.kode_akun}
              >
                {akun.nama_akun}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tombol Aksi */}
      <div className="mt-6 flex justify-end gap-x-4">
        <button 
          type="button" 
          onClick={onClose} 
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
        >
          Batal
        </button>
        <button 
          type="submit" 
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Simpan Akun
        </button>
      </div>
    </form>
  );
}

export default AkunForm;
