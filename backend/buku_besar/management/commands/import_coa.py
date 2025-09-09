# buku_besar/management/commands/import_coa.py
import csv
from django.core.management.base import BaseCommand
from buku_besar.models import Akun
import os
from django.conf import settings

class Command(BaseCommand):
    help = 'Mengimpor Chart of Accounts dari file CSV'

    def handle(self, *args, **kwargs):
        csv_file_path = os.path.join(settings.BASE_DIR, 'data', 'akun-perkiraan.xlsx - Daftar Akun.csv')
        
        self.stdout.write(self.style.WARNING('Menghapus data Akun lama...'))
        Akun.objects.all().delete()

        akun_list = []
        
        self.stdout.write("Membaca file CSV...")
        
        with open(csv_file_path, mode='r', encoding='utf-8-sig') as file:
            # PERUBAHAN 1: Tambahkan delimiter=';'
            reader = csv.DictReader(file, delimiter=';')

            for row in reader:
                try:
                    # PERUBAHAN 2: Sesuaikan nama kunci agar cocok dengan header CSV
                    tipe_akun_raw = row['Tipe Akun'].strip()
                    kode_akun_raw = row['Kode Perkiraan'].strip() # Diubah dari 'Kode Akun'
                    nama_akun_raw = row['Nama'].strip()           # Diubah dari 'Nama Akun'
                    
                    tipe_akun_valid = tipe_akun_raw.replace('Harga Pokok  Penjualan', 'Harga Pokok Penjualan')

                    akun_list.append(
                        Akun(
                            kode_akun=kode_akun_raw,
                            nama_akun=nama_akun_raw,
                            tipe_akun=tipe_akun_valid
                        )
                    )
                except KeyError as e:
                    self.stdout.write(self.style.ERROR(f"KeyError: {e} tidak ditemukan di baris: {row}"))
                    self.stdout.write(self.style.ERROR("Pastikan nama kolom di file CSV Anda cocok dengan yang ada di skrip."))
                    return

        self.stdout.write("Membuat objek Akun di database...")
        Akun.objects.bulk_create(akun_list)

        self.stdout.write("Menentukan relasi induk-anak...")
        all_akuns = list(Akun.objects.all().order_by('kode_akun'))
        
        akun_map = {akun.kode_akun: akun for akun in all_akuns}

        for akun in all_akuns:
            # Logika untuk menentukan parent berdasarkan Kode Perkiraan dari Akun Induk
            # Untuk sekarang kita gunakan logika prefix lagi karena lebih simpel
            possible_parent_code = akun.kode_akun[:-1]
            while len(possible_parent_code) > 0:
                if possible_parent_code in akun_map:
                    akun.parent = akun_map[possible_parent_code]
                    break
                possible_parent_code = possible_parent_code[:-1]
        
        Akun.objects.bulk_update(all_akuns, ['parent'])

        self.stdout.write(self.style.SUCCESS('Impor Chart of Accounts berhasil!'))