import React, { useState, useEffect } from 'react';
import apiClient from '../../api/apiClient';
import toast from 'react-hot-toast';
import { useTabStore } from '../../store/tabStore';

function JurnalUmumList({ onOpenTab, refreshKey, onActionSuccess }) {
  const [jurnals, setJurnals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJurnals = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/buku-besar/jurnal/');
        setJurnals(response.data);
      } catch (error) {
        toast.error("Gagal memuat daftar jurnal.");
      } finally {
        setLoading(false);
      }
    };
    fetchJurnals();
  }, [refreshKey]);

  const handleDelete = (jurnal) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus jurnal "${jurnal.nomor_transaksi}"? Aksi ini akan mengembalikan saldo akun terkait.`)) {
      const promise = apiClient.delete(`/buku-besar/jurnal/${jurnal.id}/`);

      toast.promise(promise, {
        loading: 'Menghapus jurnal...',
        success: () => {
          onActionSuccess();
          return 'Jurnal berhasil dihapus!';
        },
        error: 'Gagal menghapus jurnal.',
      });
    }
  };

  if (loading) return <div className="p-8 text-center">Memuat daftar jurnal...</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Daftar Jurnal Tercatat</h2>
        <button
          onClick={() => onOpenTab({ id: 'new', title: 'Jurnal Baru' })}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition"
        >
          Buat Jurnal Baru
        </button>
      </div>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left text-sm font-semibold text-gray-600">Tanggal</th>
              <th className="p-3 text-left text-sm font-semibold text-gray-600">No. Transaksi</th>
              <th className="p-3 text-left text-sm font-semibold text-gray-600">Deskripsi</th>
              <th className="p-3 text-right text-sm font-semibold text-gray-600">Total</th>
              <th className="p-3 text-center text-sm font-semibold text-gray-600">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {jurnals.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center p-8 text-gray-500">
                  Belum ada jurnal yang tercatat.
                </td>
              </tr>
            ) : (
              jurnals.map(jurnal => (
                <tr key={jurnal.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 text-sm text-gray-700">{jurnal.tanggal}</td>
                  <td className="p-3 text-sm text-gray-500 font-mono">{jurnal.nomor_transaksi}</td>
                  <td className="p-3 text-sm text-gray-700">{jurnal.deskripsi}</td>
                  <td className="p-3 text-sm text-gray-800 text-right font-medium">
                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(
                      jurnal.details.reduce((sum, d) => sum + parseFloat(d.debit), 0)
                    )}
                  </td>
                  {/* 4. Tambahkan tombol Ubah dan Hapus */}
                  <td className="p-3 text-sm text-center">
                    <div className="flex justify-center gap-4">
                      <button
                        onClick={() => onOpenTab({ id: `edit-${jurnal.id}`, title: `Ubah ${jurnal.nomor_transaksi}` })}
                        className="text-blue-600 hover:underline"
                      >
                        Ubah
                      </button>
                      <button
                        onClick={() => handleDelete(jurnal)}
                        className="text-red-600 hover:underline"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default JurnalUmumList;

