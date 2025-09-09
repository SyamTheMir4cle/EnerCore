# buku_besar/serializers.py
from rest_framework import serializers
from .models import Akun

class AkunSerializer(serializers.ModelSerializer):
    # 'children' adalah related_name yang kita definisikan di model Akun.
    # Serializer ini akan secara rekursif menyertakan semua anak dari sebuah akun.
    children = serializers.SerializerMethodField()

    class Meta:
        model = Akun
        # Tentukan field yang ingin ditampilkan di API
        fields = ['kode_akun', 'nama_akun', 'tipe_akun', 'parent', 'saldo', 'children']

    def get_children(self, obj):
        # Ambil semua anak dari objek akun saat ini
        children = obj.children.all()
        # Serialisasi setiap anak menggunakan serializer yang sama
        serializer = AkunSerializer(children, many=True)
        return serializer.data