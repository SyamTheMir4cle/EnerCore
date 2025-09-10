import {
  BuildingOffice2Icon, BookOpenIcon, BanknotesIcon, ShoppingCartIcon,
  ArchiveBoxIcon, ChartBarIcon, HomeIcon
} from '@heroicons/react/24/outline';
import PlaceholderPage from '../pages/PlaceholderPage';
import Dashboard from '../pages/Dashboard';
import CoaPage from '../pages/coa/CoAPage';
import JurnalUmumPage from '../pages/jurnalumum/JurnalUmumPage';

const createSubMenu = (id, title, Component = null) => ({
  id,
  title,
  Component: Component ? () => <Component /> : () => <PlaceholderPage title={title} />,
});

export const menuData = [
  { id: 'dashboard', title: 'Dashboard', icon: <HomeIcon className="h-6 w-6" />, Component: Dashboard, subMenus: [] },
  {
    id: 'perusahaan', title: 'Perusahaan', icon: <BuildingOffice2Icon className="h-6 w-6" />,
    subMenus: [createSubMenu('gaji', 'Gaji'), createSubMenu('karyawan', 'Karyawan')],
  },
  {
    id: 'buku-besar', title: 'Buku Besar', icon: <BookOpenIcon className="h-6 w-6" />,
    subMenus: [
      // 2. Ganti definisi submenu CoA
      createSubMenu('coa', 'CoA', CoaPage), 
      createSubMenu('pencatatan-gaji', 'Pencatatan Gaji'),
      createSubMenu('jurnal-umum', 'Jurnal Umum', JurnalUmumPage),
      createSubMenu('log-aktifitas-jurnal', 'Log Aktifitas Jurnal'),
    ],
  },
  {
    id: 'kas-bank', title: 'Kas & Bank', icon: <BanknotesIcon className="h-6 w-6" />,
    subMenus: [createSubMenu('pembayaran', 'Pembayaran'), createSubMenu('penerimaan', 'Penerimaan')],
  },
  {
    id: 'pembelian', title: 'Pembelian', icon: <ShoppingCartIcon className="h-6 w-6" />,
    subMenus: [createSubMenu('faktur-pembelian', 'Faktur Pembelian'), createSubMenu('pembayaran-pembelian', 'Pembayaran Pembelian')],
  },
  {
    id: 'aset-tetap', title: 'Aset Tetap', icon: <ArchiveBoxIcon className="h-6 w-6" />,
    subMenus: [createSubMenu('kategori-aset', 'Kategori Aset')],
  },
  {
    id: 'daftar-laporan', title: 'Daftar Laporan', icon: <ChartBarIcon className="h-6 w-6" />,
    subMenus: [
      createSubMenu('laba-rugi', 'Laba/Rugi'), createSubMenu('neraca', 'Neraca'), createSubMenu('arus-kas', 'Arus Kas'),
      createSubMenu('laporan-buku-besar', 'Laporan Buku Besar'), createSubMenu('laporan-jurnal-umum', 'Laporan Jurnal Umum'),
    ],
  },
];