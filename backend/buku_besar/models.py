from django.db import models
from decimal import Decimal

class Akun(models.Model):
    class TipeAkun(models.TextChoices):
        KAS_BANK = 'Kas & Bank', 'Kas & Bank'
        PIUTANG_USAHA = 'Piutang Usaha', 'Piutang Usaha'
        PERSEDIAAN = 'Persediaan', 'Persediaan'
        ASET_LANCAR_LAINNYA = 'Aset Lancar Lainnya', 'Aset Lancar Lainnya'
        ASET_TETAP = 'Aset Tetap', 'Aset Tetap'
        AKUMULASI_PENYUSUTAN = 'Akumulasi Penyusutan', 'Akumulasi Penyusutan'
        UTANG_USAHA = 'Utang Usaha', 'Utang Usaha'
        LIABILITAS_JANGKA_PENDEK = 'Liabilitas Jangka Pendek', 'Liabilitas Jangka Pendek'
        LIABILITAS_JANGKA_PANJANG = 'Liabilitas Jangka Panjang', 'Liabilitas Jangka Panjang'
        MODAL = 'Modal', 'Modal'
        PENDAPATAN = 'Pendapatan', 'Pendapatan'
        HARGA_POKOK_PENJUALAN = 'Harga Pokok Penjualan', 'Harga Pokok Penjualan'
        BEBAN = 'Beban', 'Beban'
        PENDAPATAN_LAINNYA = 'Pendapatan lainnya', 'Pendapatan lainnya'
        BEBAN_LAINNYA = 'Beban lainnya', 'Beban lainnya'

    kode_akun = models.CharField(max_length=20, unique=True, primary_key=True)
    nama_akun = models.CharField(max_length=255)
    tipe_akun = models.CharField(max_length=50, choices=TipeAkun.choices)
    parent = models.ForeignKey(
        'self', 
        on_delete=models.CASCADE, 
        null=True, 
        blank=True, 
        related_name='children'
    )
    saldo = models.DecimalField(max_digits=15, decimal_places=2, default=0.00)
    saldo_awal = models.DecimalField(max_digits=15, decimal_places=2, default=0.00)
    tanggal_saldo_awal = models.DateField(null=True, blank=True)

    class Meta:
        ordering = ['kode_akun']

    def __str__(self):
        return f"{self.kode_akun} - {self.nama_akun}"

    @property
    def get_saldo_akumulasi(self):
        total = self.saldo_awal
        for child in self.children.all():
            total += child.get_saldo_akumulasi
        return total

