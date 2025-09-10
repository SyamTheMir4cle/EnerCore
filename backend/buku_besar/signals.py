from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import JurnalDetail, Akun
from decimal import Decimal

@receiver(post_save, sender=JurnalDetail)
def update_saldo_on_save(sender, instance, created, **kwargs):
    """
    Sinyal ini berjalan setiap kali JurnalDetail disimpan.
    """
    if created:
        akun = instance.akun
        tipe = akun.tipe_akun
        nilai_transaksi = instance.debit - instance.kredit
        
        # --- PERBAIKAN: Gunakan daftar tipe akun yang baru dan spesifik ---
        # Tipe Akun yang saldo normalnya adalah DEBIT
        tipe_debit_normal = [
            Akun.TipeAkun.KAS_BANK,
            Akun.TipeAkun.PIUTANG_USAHA,
            Akun.TipeAkun.PERSEDIAAN,
            Akun.TipeAkun.ASET_LANCAR_LAINNYA,
            Akun.TipeAkun.ASET_TETAP,
            Akun.TipeAkun.HARGA_POKOK_PENJUALAN,
            Akun.TipeAkun.BEBAN,
            Akun.TipeAkun.BEBAN_LAINNYA
        ]
        
        if tipe in tipe_debit_normal:
            akun.saldo += nilai_transaksi
        # Tipe Akun yang saldo normalnya adalah KREDIT
        else:
            akun.saldo -= nilai_transaksi
            
        akun.save()

@receiver(post_delete, sender=JurnalDetail)
def update_saldo_on_delete(sender, instance, **kwargs):
    """
    Sinyal ini berjalan setiap kali JurnalDetail dihapus.
    """
    akun = instance.akun
    tipe = akun.tipe_akun
    nilai_transaksi = instance.debit - instance.kredit
    
    # --- PERBAIKAN: Gunakan juga daftar yang sama di sini ---
    tipe_debit_normal = [
        Akun.TipeAkun.KAS_BANK,
        Akun.TipeAkun.PIUTANG_USAHA,
        Akun.TipeAkun.PERSEDIAAN,
        Akun.TipeAkun.ASET_LANCAR_LAINNYA,
        Akun.TipeAkun.ASET_TETAP,
        Akun.TipeAkun.HARGA_POKOK_PENJUALAN,
        Akun.TipeAkun.BEBAN,
        Akun.TipeAkun.BEBAN_LAINNYA
    ]
    
    if tipe in tipe_debit_normal:
        akun.saldo -= nilai_transaksi # Dibalik dari += menjadi -=
    else:
        akun.saldo += nilai_transaksi # Dibalik dari -= menjadi +=
        
    akun.save()

