from rest_framework import serializers
from .models import Akun
from decimal import Decimal

class AkunSerializer(serializers.ModelSerializer):
    children = serializers.SerializerMethodField()
    saldo = serializers.SerializerMethodField()

    class Meta:
        model = Akun
        fields = [
            'kode_akun', 'nama_akun', 'tipe_akun', 'parent', 
            'saldo', 'saldo_awal', 'tanggal_saldo_awal', 'children'
        ]

    def get_children(self, obj):
        return AkunSerializer(obj.children.all(), many=True).data

    def get_saldo(self, obj):
        return obj.get_saldo_akumulasi
