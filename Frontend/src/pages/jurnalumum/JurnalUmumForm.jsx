import React, { useState, useEffect, useMemo, useCallback } from 'react';
import apiClient from '../../api/apiClient';
import toast from 'react-hot-toast';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

function JurnalUmumForm({ jurnalId = null, onSaveSuccess }) {
  const [akunList, setAkunList] = useState([]);
  const [jurnal, setJurnal] = useState({
    tanggal: new Date().toISOString().split('T')[0],
    deskripsi: '',
  });
  const [details, setDetails] = useState([
    { akun: '', debit: 0, kredit: 0 },
    { akun: '', debit: 0, kredit: 0 },
  ]);
  const [loading, setLoading] = useState(false);
  const isEditMode = jurnalId !== null;

  // Mengambil daftar semua akun untuk dropdown
  useEffect(() => {
    const fetchAkunList = async () => {
      try {
        const response = await apiClient.get('/buku-besar/akun/list_all/');
        setAkunList(response.data);
      } catch (error) {
        toast.error('Gagal memuat daftar akun.');
      }
    };
    fetchAkunList();
  }, []);

  // Mengambil data jurnal jika dalam mode ubah
  useEffect(() => {
    if (isEditMode) {
      setLoading(true);
      const fetchJurnal = async () => {
        try {
          const response = await apiClient.get(`/buku-besar/jurnal/${jurnalId}/`);
          const { tanggal, deskripsi, details: fetchedDetails } = response.data;
          setJurnal({ tanggal, deskripsi });
          // Pastikan detail dari server diformat dengan benar
          setDetails(fetchedDetails.map(d => ({
            akun: d.akun,
            debit: parseFloat(d.debit),
            kredit: parseFloat(d.kredit)
          })));
        } catch (error) {
          toast.error('Gagal memuat data jurnal.');
        } finally {
          setLoading(false);
        }
      };
      fetchJurnal();
    }
  }, [jurnalId, isEditMode]);

  // Fungsi-fungsi untuk memanipulasi form
  const handleJurnalChange = (e) => setJurnal({ ...jurnal, [e.target.name]: e.target.value });

  const handleDetailChange = (index, e) => {
    const { name, value } = e.target;
    const newDetails = [...details];
    newDetails[index][name] = value;

    if (details.length === 2) {
      const otherIndex = index === 0 ? 1 : 0;
      if (name === 'debit' && parseFloat(value) > 0) {
        newDetails[index]['kredit'] = 0;
        newDetails[otherIndex]['kredit'] = value;
        newDetails[otherIndex]['debit'] = 0;
      } else if (name === 'kredit' && parseFloat(value) > 0) {
        newDetails[index]['debit'] = 0;
        newDetails[otherIndex]['debit'] = value;
        newDetails[otherIndex]['kredit'] = 0;
      }
    } else {
        if (name === 'debit' && parseFloat(value) > 0) newDetails[index]['kredit'] = 0;
        else if (name === 'kredit' && parseFloat(value) > 0) newDetails[index]['debit'] = 0;
    }
    setDetails(newDetails);
  };

  const addRow = () => setDetails([...details, { akun: '', debit: 0, kredit: 0 }]);
  const removeRow = (index) => setDetails(details.filter((_, i) => i !== index));

  // Kalkulasi total
  const { totalDebit, totalKredit } = useMemo(() => {
    return details.reduce((totals, row) => {
        totals.totalDebit += parseFloat(row.debit) || 0;
        totals.totalKredit += parseFloat(row.kredit) || 0;
        return totals;
      }, { totalDebit: 0, totalKredit: 0 });
  }, [details]);

  // Handler untuk submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (totalDebit !== totalKredit || totalDebit === 0) {
      toast.error('Total Debit dan Kredit harus seimbang dan tidak boleh nol.');
      return;
    }

    const payload = {
      ...jurnal,
      details: details.filter(d => d.akun).map(d => ({
        ...d,
        debit: parseFloat(d.debit) || 0,
        kredit: parseFloat(d.kredit) || 0,
      })),
    };

    const promise = isEditMode
      ? apiClient.put(`/buku-besar/jurnal/${jurnalId}/`, payload)
      : apiClient.post('/buku-besar/jurnal/', payload);
      
    toast.promise(promise, {
      loading: 'Menyimpan jurnal...',
      success: () => {
        onSaveSuccess(); // Panggil fungsi sukses dari parent
        return `Jurnal berhasil ${isEditMode ? 'diperbarui' : 'disimpan'}!`;
      },
      error: (err) => `Gagal menyimpan: ${err.response?.data?.non_field_errors?.[0] || Object.values(err.response?.data)[0] || err.message}`,
    });
  };

  if (loading) return <div className="p-8 text-center">Memuat data jurnal...</div>;

  return (
    <div className="p-8">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        {/* Konten Form (sama seperti sebelumnya, tapi sekarang di komponen sendiri) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Tanggal</label>
            <input type="date" name="tanggal" value={jurnal.tanggal} onChange={handleJurnalChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"/>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Deskripsi</label>
            <input type="text" name="deskripsi" placeholder="Contoh: Pembayaran tagihan listrik" value={jurnal.deskripsi} onChange={handleJurnalChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"/>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-left text-sm font-semibold text-gray-600">Akun</th>
                <th className="p-3 w-48">Debit</th>
                <th className="p-3 w-48">Kredit</th>
                <th className="p-3 w-12"></th>
              </tr>
            </thead>
            <tbody>
              {details.map((row, index) => (
                <tr key={index} className="border-b">
                  <td>
                    <select name="akun" value={row.akun} onChange={(e) => handleDetailChange(index, e)} required className="w-full border-0 focus:ring-0">
                      <option value="">Pilih Akun...</option>
                      {akunList.map(akun => (
                        <option key={akun.kode_akun} value={akun.kode_akun}>
                          {akun.kode_akun} - {akun.nama_akun}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td><input type="number" name="debit" value={row.debit} onChange={(e) => handleDetailChange(index, e)} className="w-full border-0 focus:ring-0 text-right" step="0.01"/></td>
                  <td><input type="number" name="kredit" value={row.kredit} onChange={(e) => handleDetailChange(index, e)} className="w-full border-0 focus:ring-0 text-right" step="0.01"/></td>
                  <td>
                    {details.length > 1 && (
                      <button type="button" onClick={() => removeRow(index)} className="text-gray-400 hover:text-red-500"><TrashIcon className="h-5 w-5"/></button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <button type="button" onClick={addRow} className="flex items-center gap-2 px-3 py-2 text-sm text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100">
            <PlusIcon className="h-4 w-4"/> Tambah Baris
          </button>
          <div className="flex gap-6 text-right items-center">
            <div>
              <p className="text-sm text-gray-500">Total Debit</p>
              <p className="font-semibold text-lg">{new Intl.NumberFormat('id-ID').format(totalDebit)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Kredit</p>
              <p className="font-semibold text-lg">{new Intl.NumberFormat('id-ID').format(totalKredit)}</p>
            </div>
            <div className={`pt-4 font-bold ${totalDebit !== totalKredit || totalDebit === 0 ? 'text-red-500' : 'text-green-500'}`}>
              {totalDebit !== totalKredit || totalDebit === 0 ? 'Tidak Seimbang' : 'Seimbang'}
            </div>
          </div>
        </div>

        <div className="mt-8 border-t pt-6 flex justify-end">
          <button type="submit" className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700">
            Simpan Jurnal
          </button>
        </div>
      </form>
    </div>
  );
}

export default JurnalUmumForm;
