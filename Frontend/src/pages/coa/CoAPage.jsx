import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import apiClient from '../../api/apiClient';
import AkunRow from './AkunRow';
import AkunForm from './AkunForm';
import toast from 'react-hot-toast';

function CoaPage() {
  const [akunList, setAkunList] = useState([]);
  const [groupedAkun, setGroupedAkun] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAkun, setEditingAkun] = useState(null);

  const fetchAkun = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/buku-besar/akun/');
      const topLevelAkun = response.data;
      setAkunList(topLevelAkun);

      const groups = topLevelAkun.reduce((acc, akun) => {
        const tipe = akun.tipe_akun;
        if (!acc[tipe]) {
          acc[tipe] = [];
        }
        acc[tipe].push(akun);
        return acc;
      }, {});
      setGroupedAkun(groups);
      setError(null);
    } catch (err) {
      setError("Gagal memuat data Chart of Accounts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAkun();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingAkun(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (akun) => {
    setEditingAkun(akun);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAkun(null);
  };

  const handleSuccess = () => {
    handleCloseModal();
    fetchAkun();
  };

  const handleDelete = (akun) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus akun "${akun.nama_akun}"?`)) {
      const promise = apiClient.delete(`/buku-besar/akun/${akun.kode_akun}/`);
      toast.promise(promise, {
        loading: 'Menghapus akun...',
        success: () => {
          fetchAkun();
          return 'Akun berhasil dihapus!';
        },
        error: 'Gagal menghapus akun.',
      });
    }
  };

  if (loading) return <div className="p-8">Memuat data...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  const tipeOrder = [
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
    <>
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Chart of Accounts</h1>
          <button onClick={handleOpenCreateModal} className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition">
            Buat Akun Baru
          </button>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-3 text-sm font-semibold tracking-wide text-left">Nama Akun</th>
                <th className="p-3 text-sm font-semibold tracking-wide text-left">Kode Akun</th>
                <th className="p-3 text-sm font-semibold tracking-wide text-right">Saldo Terkini</th>
                <th className="w-20 p-3"></th>
              </tr>
            </thead>
            <tbody>
              {tipeOrder.map(tipe => 
                groupedAkun[tipe] && (
                  <React.Fragment key={tipe}>
                    <tr className="bg-gray-50">
                      <td colSpan="4" className="p-3 text-sm font-bold text-gray-600">
                        {tipe}
                      </td>
                    </tr>
                    {groupedAkun[tipe].map((akun) => (
                      <AkunRow key={akun.kode_akun} akun={akun} onEdit={handleOpenEditModal} onDelete={handleDelete} />
                    ))}
                  </React.Fragment>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={isModalOpen} onClose={handleCloseModal} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
            <Dialog.Title className="text-xl font-bold mb-4">
              {editingAkun ? 'Ubah Akun' : 'Buat Akun Baru'}
            </Dialog.Title>
            <AkunForm 
              onClose={handleCloseModal} 
              onSuccess={handleSuccess}
              semuaAkun={akunList}
              initialData={editingAkun} 
            />
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
}

export default CoaPage;

