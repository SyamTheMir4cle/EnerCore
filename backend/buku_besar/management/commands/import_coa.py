import csv
from django.core.management.base import BaseCommand
from buku_besar.models import Akun
import os
from django.conf import settings

class Command(BaseCommand):
    help = 'Mengimpor Chart of Accounts dari file CSV final'

    def handle(self, *args, **kwargs):
        csv_file_path = os.path.join(settings.BASE_DIR, 'data', 'akun-perkiraan.csv')
        
        self.stdout.write(self.style.WARNING('Menghapus data Akun lama...'))
        Akun.objects.all().delete()

        akun_list = []
        
        self.stdout.write("Membaca file CSV...")
        
        with open(csv_file_path, mode='r', encoding='utf-8-sig') as file:
            reader = csv.DictReader(file, delimiter=';')

            for row in reader:
                try:
                    akun_list.append(
                        Akun(
                            kode_akun=row['Kode Perkiraan'].strip(),
                            nama_akun=row['Nama'].strip(),
                            tipe_akun=row['Tipe Akun'].strip()
                        )
                    )
                except KeyError as e:
                    self.stdout.write(self.style.ERROR(f"KeyError: {e} tidak ditemukan di baris: {row}"))
                    self.stdout.write(self.style.ERROR("Pastikan nama kolom di file CSV sama dengan di skrip."))
                    return

        self.stdout.write("Membuat objek Akun di database...")
        Akun.objects.bulk_create(akun_list)

        self.stdout.write("Menentukan relasi induk-anak...")
        all_akuns = list(Akun.objects.all().order_by('kode_akun'))
        
        akun_map = {akun.kode_akun: akun for akun in all_akuns}

        for akun in all_akuns:
            possible_parent_code = akun.kode_akun[:-1]
            while len(possible_parent_code) > 0:
                if possible_parent_code in akun_map:
                    akun.parent = akun_map[possible_parent_code]
                    break
                possible_parent_code = possible_parent_code[:-1]
        
        Akun.objects.bulk_update(all_akuns, ['parent'])

        self.stdout.write(self.style.SUCCESS('Impor Chart of Accounts baru berhasil!'))

