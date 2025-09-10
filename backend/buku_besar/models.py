from django.db import models
from decimal import Decimal
from django.utils import timezone # 1. Impor timezone

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
        """
        Menghitung total saldo dari akun ini (saldo berjalan) ditambah
        total saldo terakumulasi dari semua akun anaknya secara rekursif.
        """
        total = self.saldo
        for child in self.children.all():
            total += child.get_saldo_akumulasi
        return total


class JurnalUmum(models.Model):
    nomor_transaksi = models.CharField(max_length=25, unique=True, blank=True, editable=False)
    
    tanggal = models.DateField()
    deskripsi = models.CharField(max_length=512)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-tanggal', '-nomor_transaksi']

    def __str__(self):
        return self.nomor_transaksi

    def save(self, *args, **kwargs):
        if not self.nomor_transaksi:
            now = timezone.now()
            prefix = f"JU-{now.strftime('%Y%m')}-"
            
            last_jurnal = JurnalUmum.objects.filter(nomor_transaksi__startswith=prefix).order_by('-nomor_transaksi').first()
            
            if last_jurnal:
                last_seq = int(last_jurnal.nomor_transaksi[-4:])
                new_seq = last_seq + 1
            else:
                new_seq = 1
            
            self.nomor_transaksi = f"{prefix}{new_seq:04d}"
            
        super().save(*args, **kwargs)

class JurnalDetail(models.Model):
    jurnal = models.ForeignKey(JurnalUmum, on_delete=models.CASCADE, related_name='details')
    akun = models.ForeignKey(Akun, on_delete=models.PROTECT)
    debit = models.DecimalField(max_digits=15, decimal_places=2, default=0.00)
    kredit = models.DecimalField(max_digits=15, decimal_places=2, default=0.00)

    def __str__(self):
        return f"Detail Jurnal #{self.jurnal.id} - Akun {self.akun.kode_akun}"
