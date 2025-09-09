from django.db import models

class Akun(models.Model):
    class TipeAkun(models.TextChoices):
        ASET = 'Aset', 'Aset'
        LIABILITAS = 'Liabilitas', 'Liabilitas'
        EKUITAS = 'Ekuitas', 'Ekuitas'
        PENDAPATAN = 'Pendapatan', 'Pendapatan'
        BEBAN = 'Beban', 'Beban'
        AKUMULASI_PENYUSUTAN = 'Akumulasi Penyusutan', 'Akumulasi Penyusutan'
        HARGA_POKOK_PENJUALAN = 'Harga Pokok Penjualan', 'Harga Pokok Penjualan'


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

    class Meta:
        ordering = ['kode_akun']

    def __str__(self):
        return f"{self.kode_akun} - {self.nama_akun}"